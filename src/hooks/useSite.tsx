import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  ActivityRow,
  DARK_THEME,
  DEFAULT_SETTINGS,
  FONT_PAIRS,
  ProjectRow,
  ReviewRow,
  SiteSettings,
  TimelineRow,
  mergeSettings,
} from '@/lib/siteContent';


interface Snapshot {
  settings: SiteSettings;
  projects: ProjectRow[];
  timeline: TimelineRow[];
  reviews: ReviewRow[];
}

interface SiteValue {
  settings: SiteSettings;
  projects: ProjectRow[];
  timeline: TimelineRow[];
  reviews: ReviewRow[];
  activity: ActivityRow[];
  loading: boolean;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
  adminOpen: boolean;
  setAdminOpen: (v: boolean) => void;
  previewMode: boolean;
  setPreviewMode: (v: boolean) => void;
  dark: boolean;
  setDark: (v: boolean) => void;

  saveSettings: (patch: Partial<SiteSettings>) => Promise<void>;
  patchProject: (id: string, values: Partial<ProjectRow>) => Promise<void>;
  patchTimeline: (id: string, values: Partial<TimelineRow>) => Promise<void>;
  patchReview: (id: string, values: Partial<ReviewRow>) => Promise<void>;
  log: (action: string, detail: string) => Promise<void>;
  refreshAll: () => Promise<void>;
  pushHistory: () => void;
  undo: () => Promise<void>;
  redo: () => Promise<void>;
  canUndo: boolean;
  canRedo: boolean;
  exportJson: () => string;
  importJson: (raw: string) => Promise<void>;
}

const SiteContext = createContext<SiteValue | null>(null);

async function fetchProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase.from('projects').select('*').order('sort_order');
  if (error) throw error;
  return (data ?? []) as ProjectRow[];
}
async function fetchTimeline(): Promise<TimelineRow[]> {
  const { data, error } = await supabase.from('timeline_entries').select('*').order('sort_order');
  if (error) throw error;
  return (data ?? []) as TimelineRow[];
}
async function fetchReviews(): Promise<ReviewRow[]> {
  const { data, error } = await supabase.from('reviews').select('*').order('sort_order');
  if (error) throw error;
  return (data ?? []) as ReviewRow[];
}
async function fetchActivity(): Promise<ActivityRow[]> {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as ActivityRow[];
}
async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase.from('site_settings').select('value').eq('key', 'site').maybeSingle();
  if (error) throw error;
  return mergeSettings(data?.value ?? null);
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [dark, setDarkState] = useState<boolean>(() => localStorage.getItem('sketch-dark') === '1');
  const setDark = useCallback((v: boolean) => {
    setDarkState(v);
    localStorage.setItem('sketch-dark', v ? '1' : '0');
  }, []);


  const projectsQ = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });
  const timelineQ = useQuery({ queryKey: ['timeline'], queryFn: fetchTimeline });
  const reviewsQ = useQuery({ queryKey: ['reviews'], queryFn: fetchReviews });
  const activityQ = useQuery({ queryKey: ['activity'], queryFn: fetchActivity });
  const settingsQ = useQuery({ queryKey: ['settings'], queryFn: fetchSettings });

  const settings = settingsQ.data ?? DEFAULT_SETTINGS;
  const projects = useMemo(() => projectsQ.data ?? [], [projectsQ.data]);
  const timeline = useMemo(() => timelineQ.data ?? [], [timelineQ.data]);
  const reviews = useMemo(() => reviewsQ.data ?? [], [reviewsQ.data]);

  const past = useRef<Snapshot[]>([]);
  const future = useRef<Snapshot[]>([]);
  const [historyTick, setHistoryTick] = useState(0);

  const refreshAll = useCallback(async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: ['projects'] }),
      qc.invalidateQueries({ queryKey: ['timeline'] }),
      qc.invalidateQueries({ queryKey: ['reviews'] }),
      qc.invalidateQueries({ queryKey: ['settings'] }),
      qc.invalidateQueries({ queryKey: ['activity'] }),
    ]);
  }, [qc]);

  const snapshot = useCallback(
    (): Snapshot => ({
      settings: JSON.parse(JSON.stringify(settings)),
      projects: JSON.parse(JSON.stringify(projects)),
      timeline: JSON.parse(JSON.stringify(timeline)),
      reviews: JSON.parse(JSON.stringify(reviews)),
    }),
    [settings, projects, timeline, reviews],
  );

  const pushHistory = useCallback(() => {
    past.current = [...past.current.slice(-19), snapshot()];
    future.current = [];
    setHistoryTick((t) => t + 1);
  }, [snapshot]);

  const log = useCallback(
    async (action: string, detail: string) => {
      await supabase.from('activity_log').insert({ action, detail });
      qc.invalidateQueries({ queryKey: ['activity'] });
    },
    [qc],
  );

  const saveSettings = useCallback(
    async (patch: Partial<SiteSettings>) => {
      const current = (qc.getQueryData(['settings']) as SiteSettings) ?? settings;
      const next = { ...current, ...patch };
      qc.setQueryData(['settings'], next);
      await supabase.from('site_settings').upsert({ key: 'site', value: next as never });
    },
    [settings, qc],
  );

  /** Optimistic row patch — updates the cache instantly, writes in the background. */
  const patchRow = useCallback(
    async <T extends { id: string }>(table: 'projects' | 'timeline_entries' | 'reviews', key: string, id: string, values: Partial<T>) => {
      qc.setQueryData([key], (old: T[] | undefined) =>
        (old ?? []).map((row) => (row.id === id ? { ...row, ...values } : row)),
      );
      const { error } = await supabase.from(table).update(values as never).eq('id', id);
      if (error) qc.invalidateQueries({ queryKey: [key] });
    },
    [qc],
  );

  const patchProject = useCallback(
    (id: string, values: Partial<ProjectRow>) => patchRow<ProjectRow>('projects', 'projects', id, values),
    [patchRow],
  );
  const patchTimeline = useCallback(
    (id: string, values: Partial<TimelineRow>) => patchRow<TimelineRow>('timeline_entries', 'timeline', id, values),
    [patchRow],
  );
  const patchReview = useCallback(
    (id: string, values: Partial<ReviewRow>) => patchRow<ReviewRow>('reviews', 'reviews', id, values),
    [patchRow],
  );


  const restore = useCallback(
    async (snap: Snapshot) => {
      await supabase.from('site_settings').upsert({ key: 'site', value: snap.settings as never });
      if (snap.projects.length) await supabase.from('projects').upsert(snap.projects as never);
      if (snap.timeline.length) await supabase.from('timeline_entries').upsert(snap.timeline as never);
      if (snap.reviews.length) await supabase.from('reviews').upsert(snap.reviews as never);
      await refreshAll();
    },
    [refreshAll],
  );

  const undo = useCallback(async () => {
    const prev = past.current.pop();
    if (!prev) return;
    future.current.push(snapshot());
    setHistoryTick((t) => t + 1);
    await restore(prev);
  }, [restore, snapshot]);

  const redo = useCallback(async () => {
    const next = future.current.pop();
    if (!next) return;
    past.current.push(snapshot());
    setHistoryTick((t) => t + 1);
    await restore(next);
  }, [restore, snapshot]);

  const exportJson = useCallback(
    () => JSON.stringify({ settings, projects, timeline, reviews }, null, 2),
    [settings, projects, timeline, reviews],
  );

  const importJson = useCallback(
    async (raw: string) => {
      const parsed = JSON.parse(raw) as Partial<Snapshot>;
      pushHistory();
      await restore({
        settings: mergeSettings(parsed.settings),
        projects: parsed.projects ?? [],
        timeline: parsed.timeline ?? [],
        reviews: parsed.reviews ?? [],
      });
      await log('IMPORT', 'Restored content from JSON backup');
    },
    [restore, pushHistory, log],
  );

  // First visit: follow the owner's saved default mode.
  useEffect(() => {
    if (localStorage.getItem('sketch-dark') === null && settingsQ.data) {
      setDarkState(settingsQ.data.theme.mode === 'dark');
    }
  }, [settingsQ.data]);


  // Apply theme tokens + fonts globally (light = saved tokens, dark = night sketchbook)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', dark);
    const t = dark ? DARK_THEME : settings.theme.tokens;
    root.style.setProperty('--background', t.background);
    root.style.setProperty('--foreground', t.foreground);
    root.style.setProperty('--card', t.card);
    root.style.setProperty('--border', t.border);
    root.style.setProperty('--ink', dark ? t.border : t.foreground);
    root.style.setProperty('--neon-cyan', t.cyan);
    root.style.setProperty('--neon-magenta', t.magenta);
    root.style.setProperty('--neon-purple', t.purple);
    root.style.setProperty('--neon-green', t.green);
    root.style.setProperty('--primary', t.cyan);
    root.style.setProperty('--ring', t.cyan);
    root.style.setProperty('--glow-scale', String(settings.theme.glow / 100));
    const pair = FONT_PAIRS[settings.theme.fontPair] ?? FONT_PAIRS.orbitron;
    root.style.setProperty('--font-heading', pair.heading);
    root.style.setProperty('--font-body', pair.body);
  }, [settings.theme, dark]);


  // Meta tags
  useEffect(() => {
    document.title = settings.meta.title;
    let desc = document.querySelector('meta[name="description"]');
    if (!desc) {
      desc = document.createElement('meta');
      desc.setAttribute('name', 'description');
      document.head.appendChild(desc);
    }
    desc.setAttribute('content', settings.meta.description);
  }, [settings.meta]);

  const value: SiteValue = {
    settings,
    projects,
    timeline,
    reviews,
    activity: activityQ.data ?? [],
    loading: projectsQ.isLoading || settingsQ.isLoading,
    isAdmin: isAdmin && !previewMode,
    setIsAdmin,
    adminOpen,
    setAdminOpen,
    previewMode,
    setPreviewMode,
    dark,
    setDark,

    saveSettings,
    patchProject,
    patchTimeline,
    patchReview,
    log,
    refreshAll,
    pushHistory,
    undo,
    redo,
    canUndo: past.current.length > 0 && historyTick >= 0,
    canRedo: future.current.length > 0 && historyTick >= 0,
    exportJson,
    importJson,
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSite(): SiteValue {
  const ctx = useContext(SiteContext);
  if (!ctx) throw new Error('useSite must be used inside SiteProvider');
  return ctx;
}
