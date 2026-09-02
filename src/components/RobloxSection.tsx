import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Users, UserPlus, Heart, ExternalLink, LogIn, BadgeCheck, Plus, Trash2, EyeOff, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useSite } from '@/hooks/useSite';
import { useRoblox, startRobloxSignIn, completeRobloxSignIn, ROBLOX_REDIRECT_URI, RobloxStats } from '@/hooks/useRoblox';
import { RobloxGroupItem } from '@/lib/siteContent';

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function StatTile({ label, value, hint, icon: Icon, delay }: { label: string; value: number; hint: string; icon: typeof Users; delay: number }) {
  const shown = useCountUp(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="sketch-card p-6 text-center"
    >
      <Icon className="w-5 h-5 mx-auto mb-3 text-primary" />
      <p className="text-3xl md:text-4xl font-heading font-extrabold tabular-nums">{shown.toLocaleString()}</p>
      <p className="mt-1 text-sm font-bold text-foreground/80">{label}</p>
      <p className="text-xs font-doodle text-muted-foreground">{hint}</p>
    </motion.div>
  );
}

function GroupField({ value, onSave, className, type = 'text' }: { value: string | number; onSave: (value: string) => void; className: string; type?: string }) {
  const [local, setLocal] = useState(String(value));
  useEffect(() => setLocal(String(value)), [value]);
  return (
    <input
      type={type}
      className={className}
      value={local}
      onChange={(event) => setLocal(event.target.value)}
      onBlur={() => onSave(local)}
      onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur(); }}
    />
  );
}

export default function RobloxSection() {
  const { settings, isAdmin, saveSettings } = useSite();
  const { data, loading, refresh } = useRoblox(settings.roblox.userId, settings.roblox.enabled);
  const [signedIn, setSignedIn] = useState<RobloxStats | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    if (!code) return;
    completeRobloxSignIn(code, state ?? '')
      .then((profile) => {
        setSignedIn(profile);
        toast.success(`Signed in as ${profile.displayName}`);
        window.history.replaceState({}, '', '/#roblox');
      })
      .catch((e) => toast.error(e.message));
  }, []);

  if (!settings.roblox.enabled) return null;
  const profile = signedIn ?? data;

  const manual = settings.roblox.groups ?? [];
  const liveGroups: RobloxGroupItem[] = (profile?.groups ?? []).map((g) => ({
    name: g.name,
    role: g.role,
    members: g.memberCount,
    hidden: false,
  }));
  const groups = settings.roblox.useLiveGroups ? liveGroups : manual;
  const shown = groups.filter((g) => isAdmin || !g.hidden);

  const saveGroups = (next: RobloxGroupItem[]) =>
    saveSettings({ roblox: { ...settings.roblox, groups: next, useLiveGroups: false } });

  return (
     <section id="roblox" className="relative py-20 md:py-24 overflow-hidden">
       <div className="container mx-auto px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="kicker">Live from Roblox</span>
          <h2 className="mt-6 text-4xl md:text-6xl sketch-title">My Roblox profile</h2>
          <p className="mt-5 font-doodle text-muted-foreground max-w-xl mx-auto">
            These numbers update straight from Roblox — followers, friends and the groups I build with.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_1.2fr] gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="sketch-card p-8 text-center"
          >
            <span className="tape -top-3 left-1/2 -translate-x-1/2" />
            <div className="relative w-32 h-32 mx-auto">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={`${profile.displayName} Roblox avatar`}
                  className="relative w-32 h-32 rounded-full object-cover bg-secondary border-[2.5px] border-border"
                  loading="lazy"
                />
              ) : (
                <div className="relative w-32 h-32 rounded-full bg-secondary animate-pulse border-[2.5px] border-border" />
              )}
            </div>

            <h3 className="mt-5 text-2xl font-heading font-extrabold flex items-center justify-center gap-2">
              {profile?.displayName ?? 'Loading…'}
              {signedIn && <BadgeCheck className="w-5 h-5 text-primary" />}
            </h3>
            <p className="text-sm font-doodle text-muted-foreground">@{profile?.username ?? '—'}</p>
            {profile?.description && (
              <p className="mt-4 text-sm text-muted-foreground whitespace-pre-line line-clamp-3">{profile.description}</p>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <a href={settings.roblox.profileUrl} target="_blank" rel="noreferrer" className="cyber-btn text-sm">
                <ExternalLink className="w-4 h-4" /> Open profile
              </a>
              <button onClick={() => refresh()} className="cyber-btn-ghost text-sm">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>

            {/* Owner-only: connect the real account */}
            {isAdmin && !signedIn && (
              <div className="mt-5 rounded-2xl border-2 border-border bg-secondary/70 p-4 text-left">
                <button
                  onClick={() => startRobloxSignIn().catch((e) => toast.error(e.message))}
                  className="admin-chip w-full justify-center"
                >
                  <LogIn className="w-3.5 h-3.5" /> Connect my Roblox account
                </button>
                <p className="mt-3 break-words text-[11px] font-doodle text-muted-foreground">
                  Roblox must list this exact redirect URL: <strong className="text-foreground">{ROBLOX_REDIRECT_URI}</strong>
                </p>
                <button
                  className="mt-2 text-xs font-bold text-primary hover:underline"
                  onClick={() => navigator.clipboard.writeText(ROBLOX_REDIRECT_URI).then(() => toast.success('Redirect URL copied'))}
                >
                  Copy redirect URL
                </button>
              </div>
            )}
          </motion.div>

          <div className="space-y-8">
            <div className="grid sm:grid-cols-3 gap-5">
              <StatTile label="Followers" hint="people following me" value={profile?.followers ?? 0} icon={Heart} delay={0} />
              <StatTile label="Friends" hint="on my friends list" value={profile?.friends ?? 0} icon={Users} delay={0.08} />
              <StatTile label="Following" hint="creators I follow" value={profile?.following ?? 0} icon={UserPlus} delay={0.16} />
            </div>

            {(shown.length > 0 || isAdmin) && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="sketch-card p-7"
              >
                <h4 className="text-lg font-heading font-extrabold">Groups I'm part of</h4>
                <p className="text-xs font-doodle text-muted-foreground mb-5">
                  {settings.roblox.useLiveGroups ? 'Pulled live from my Roblox account.' : 'Curated list, edited by the owner.'}
                </p>

                {isAdmin && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    <button
                      className="admin-chip"
                      onClick={() =>
                        saveSettings({ roblox: { ...settings.roblox, useLiveGroups: !settings.roblox.useLiveGroups } })
                      }
                    >
                      {settings.roblox.useLiveGroups ? 'Using live groups — switch to manual' : 'Manual list — switch to live'}
                    </button>
                    <button className="admin-chip" onClick={() => saveGroups(liveGroups)}>
                      Copy live groups into my editable list
                    </button>
                    <button
                      className="admin-chip"
                      onClick={() => saveGroups([...manual, { name: 'New group', role: 'Member', members: 0, hidden: false }])}
                    >
                      <Plus className="w-3 h-3" /> Add group
                    </button>
                  </div>
                )}

                <ul className="grid sm:grid-cols-2 gap-3">
                  {shown.map((g, i) => (
                    <li key={`${g.name}-${i}`} className="rounded-2xl bg-secondary border-[2px] border-border px-4 py-3">
                      {isAdmin && !settings.roblox.useLiveGroups ? (
                        <div className="space-y-2">
                          <GroupField
                            className="w-full bg-card border-[2px] border-border rounded-lg px-2 py-1 text-sm"
                            value={g.name}
                            onSave={(value) => {
                              const next = [...manual];
                              next[i] = { ...g, name: value };
                              saveGroups(next);
                            }}
                          />
                          <div className="flex gap-2">
                            <GroupField
                              className="flex-1 bg-card border-[2px] border-border rounded-lg px-2 py-1 text-xs"
                              value={g.role}
                              onSave={(value) => {
                                const next = [...manual];
                                next[i] = { ...g, role: value };
                                saveGroups(next);
                              }}
                            />
                            <GroupField
                              type="number"
                              className="w-24 bg-card border-[2px] border-border rounded-lg px-2 py-1 text-xs"
                              value={g.members}
                              onSave={(value) => {
                                const next = [...manual];
                                next[i] = { ...g, members: Number(value) };
                                saveGroups(next);
                              }}
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="admin-chip"
                              onClick={() => {
                                const next = [...manual];
                                next[i] = { ...g, hidden: !g.hidden };
                                saveGroups(next);
                              }}
                            >
                              {g.hidden ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />} {g.hidden ? 'Show' : 'Hide'}
                            </button>
                            <button className="admin-chip text-destructive" onClick={() => saveGroups(manual.filter((_, x) => x !== i))}>
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate">{g.name}</p>
                            <p className="text-xs font-doodle text-muted-foreground truncate">{g.role}</p>
                          </div>
                          <span className="text-xs font-doodle text-muted-foreground shrink-0">
                            {g.members.toLocaleString()} members
                          </span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
