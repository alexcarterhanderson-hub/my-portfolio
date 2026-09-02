import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const ROBLOX_REDIRECT_URI = 'https://portfolio.edward-dev.workers.dev/';

export interface RobloxStats {
  userId: number;
  username: string;
  displayName: string;
  description: string;
  created: string;
  avatarUrl: string;
  followers: number;
  following: number;
  friends: number;
  groups: { name: string; role: string; memberCount: number }[];
  fetchedAt: string;
}

export function useRoblox(userId: string, enabled = true) {
  const [data, setData] = useState<RobloxStats | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!enabled || !userId) return;
    setLoading(true);
    const { data: res, error: err } = await supabase.functions.invoke('roblox', {
      body: { action: 'stats', userId },
    });
    if (err) setError(err.message);
    else {
      setData(res as RobloxStats);
      setError(null);
    }
    setLoading(false);
  }, [userId, enabled]);

  useEffect(() => {
    load();
    if (!enabled) return;
    const id = window.setInterval(load, 120_000);
    return () => window.clearInterval(id);
  }, [load, enabled]);

  return { data, loading, error, refresh: load };
}

/** Kicks off the official Roblox OAuth 2.0 sign-in flow. */
export async function startRobloxSignIn() {
  const { data, error } = await supabase.functions.invoke('roblox', {
    body: { action: 'authorize-url', redirectUri: ROBLOX_REDIRECT_URI },
  });
  if (error) throw new Error(error.message);
  const url = (data as { authorizeUrl?: string })?.authorizeUrl;
  if (!url) throw new Error('Roblox sign-in is not configured yet.');
  window.location.href = url;
}

/** Handles ?code= returned by Roblox and resolves the signed-in profile. */
export async function completeRobloxSignIn(code: string, returnedState: string) {
  if (!returnedState) {
    throw new Error('Roblox sign-in could not be verified. Please start the connection again.');
  }
  const { data, error } = await supabase.functions.invoke('roblox', {
    body: { action: 'exchange', code, state: returnedState, redirectUri: ROBLOX_REDIRECT_URI },
  });
  if (error) throw new Error(error.message);
  return (data as { profile: RobloxStats }).profile;
}
