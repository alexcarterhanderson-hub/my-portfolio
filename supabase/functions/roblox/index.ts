import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'

const CLIENT_ID = Deno.env.get('ROBLOX_CLIENT_ID') ?? ''
const CLIENT_SECRET = Deno.env.get('ROBLOX_CLIENT_SECRET') ?? ''
const REDIRECT_URI = 'https://edwardthedev.lovable.app/'

const encoder = new TextEncoder()

function base64Url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes)).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '')
}

async function signState(payload: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(CLIENT_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  return base64Url(new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(payload))))
}

async function createState() {
  const payload = `${crypto.randomUUID()}.${Date.now()}`
  return `${payload}.${await signState(payload)}`
}

async function validState(value: string) {
  const parts = value.split('.')
  if (parts.length !== 3) return false
  const payload = `${parts[0]}.${parts[1]}`
  const timestamp = Number(parts[1])
  if (!Number.isFinite(timestamp) || Date.now() - timestamp > 10 * 60 * 1000) return false
  const expected = await signState(payload)
  if (expected.length !== parts[2].length) return false
  let mismatch = 0
  for (let i = 0; i < expected.length; i += 1) mismatch |= expected.charCodeAt(i) ^ parts[2].charCodeAt(i)
  return mismatch === 0
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

async function getJson(url: string) {
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`${url} -> ${res.status}`)
  return res.json()
}

async function fetchStats(userId: string) {
  const [user, followers, following, friends, avatar, groups] = await Promise.all([
    getJson(`https://users.roblox.com/v1/users/${userId}`).catch(() => null),
    getJson(`https://friends.roblox.com/v1/users/${userId}/followers/count`).catch(() => ({ count: 0 })),
    getJson(`https://friends.roblox.com/v1/users/${userId}/followings/count`).catch(() => ({ count: 0 })),
    getJson(`https://friends.roblox.com/v1/users/${userId}/friends/count`).catch(() => ({ count: 0 })),
    getJson(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`,
    ).catch(() => null),
    getJson(`https://groups.roblox.com/v1/users/${userId}/groups/roles`).catch(() => ({ data: [] })),
  ])

  return {
    userId: Number(userId),
    username: user?.name ?? '',
    displayName: user?.displayName ?? user?.name ?? '',
    description: user?.description ?? '',
    created: user?.created ?? '',
    isBanned: Boolean(user?.isBanned),
    avatarUrl: avatar?.data?.[0]?.imageUrl ?? '',
    followers: followers?.count ?? 0,
    following: following?.count ?? 0,
    friends: friends?.count ?? 0,
    groups: (groups?.data ?? [])
      .slice(0, 8)
      .map((g: { group: { name: string; memberCount: number }; role: { name: string } }) => ({
        name: g.group?.name ?? '',
        role: g.role?.name ?? '',
        memberCount: g.group?.memberCount ?? 0,
      })),
    fetchedAt: new Date().toISOString(),
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const url = new URL(req.url)
    const body = req.method === 'POST' ? await req.json().catch(() => ({})) : {}
    const action = (body.action ?? url.searchParams.get('action') ?? 'stats') as string

    if (action === 'stats') {
      const userId = String(body.userId ?? url.searchParams.get('userId') ?? '5811359021')
      if (!/^\d{1,20}$/.test(userId)) return json({ error: 'Invalid userId' }, 400)
      return json(await fetchStats(userId))
    }

    if (action === 'authorize-url') {
      if (!CLIENT_ID || !CLIENT_SECRET) return json({ error: 'Roblox OAuth not configured' }, 400)
      const redirectUri = String(body.redirectUri ?? '')
      if (redirectUri !== REDIRECT_URI) return json({ error: 'Invalid redirectUri' }, 400)
      const state = await createState()
      const authorizeUrl =
        `https://apis.roblox.com/oauth/v1/authorize?client_id=${encodeURIComponent(CLIENT_ID)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&scope=${encodeURIComponent('openid profile')}` +
        `&response_type=code&state=${state}`
      return json({ authorizeUrl, state })
    }

    if (action === 'exchange') {
      if (!CLIENT_ID || !CLIENT_SECRET) return json({ error: 'Roblox OAuth not configured' }, 400)
      const code = String(body.code ?? '')
      const state = String(body.state ?? '')
      const redirectUri = String(body.redirectUri ?? '')
      if (!code || redirectUri !== REDIRECT_URI) return json({ error: 'Missing code or invalid redirectUri' }, 400)
      if (!(await validState(state))) return json({ error: 'Invalid or expired OAuth state' }, 400)

      const tokenRes = await fetch('https://apis.roblox.com/oauth/v1/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          grant_type: 'authorization_code',
          code,
          redirect_uri: redirectUri,
        }),
      })
      if (!tokenRes.ok) return json({ error: 'Token exchange failed', detail: await tokenRes.text() }, 400)
      const token = await tokenRes.json()

      const infoRes = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
        headers: { Authorization: `Bearer ${token.access_token}` },
      })
      if (!infoRes.ok) return json({ error: 'Userinfo failed' }, 400)
      const info = await infoRes.json()

      const stats = await fetchStats(String(info.sub))
      return json({ connected: true, profile: stats })
    }

    return json({ error: 'Unknown action' }, 400)
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Unexpected error' }, 500)
  }
})
