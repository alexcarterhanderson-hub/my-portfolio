import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { X, Undo2, Redo2, Download, Upload, Search, LayoutDashboard, Sparkles, RotateCcw } from 'lucide-react';
import { useSite } from '@/hooks/useSite';
import { usePerformance } from '@/hooks/usePerformance';
import { supabase } from '@/integrations/supabase/client';
import { uploadMedia, youtubeId } from '@/lib/media';
import { BACKGROUND_PRESETS, DEFAULT_SETTINGS, FONT_PAIRS, ProjectRow, SYSTEM_ORIGINAL_BACKGROUND, THEMES, ThemeTokens } from '@/lib/siteContent';
import { setSoundEnabled, setSoundVolume } from '@/lib/sounds';

const TABS = ['DASHBOARD', 'CARDS', 'TIMELINE', 'REVIEWS', 'CONTENT', 'THEME', 'BACKGROUND', 'SYSTEM'] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  DASHBOARD: 'Overview',
  CARDS: 'Project cards',
  TIMELINE: 'Timeline',
  REVIEWS: 'Reviews',
  CONTENT: 'Site content',
  THEME: 'Theme',
  BACKGROUND: 'Background',
  SYSTEM: 'System',
};

const TAB_INTROS: Record<Tab, string> = {
  DASHBOARD: 'A quick snapshot of your site: how many cards, timeline entries and reviews you have, plus a search box and recent activity log.',
  CARDS: 'Pick a project card below to edit its title, images, video, tags and styling. Changes save automatically as you type.',
  TIMELINE: 'Manage the milestones that appear on your timeline section — add new entries, edit their text, or delete ones you no longer need.',
  REVIEWS: 'Manage testimonials shown on your site. Add new reviews, edit their content and rating, or approve/hide and delete them.',
  CONTENT: 'Edit the words that appear across your site: hero text, about bio, stats, skills, navigation, footer, section headings, SEO text and the announcement ticker.',
  THEME: 'Pick a colour preset or fine-tune individual colours, fonts, background effects and glow strength for the whole site.',
  BACKGROUND: 'Choose what the page background looks like: a pattern, animated colour clouds, or your own image/GIF — then tune its colours, strength and speed.',
  SYSTEM: 'Tune performance and behaviour, back up or restore your content as a file, and lock the console when you are done.',
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block mb-4">
      <span className="text-xs font-semibold text-foreground">{label}</span>
      {hint && <span className="block text-xs text-muted-foreground mt-0.5">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="hud-panel p-4 mb-4">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && <p className="text-xs text-muted-foreground mt-0.5 mb-3">{description}</p>}
      {!description && <div className="mb-3" />}
      {children}
    </div>
  );
}

const inputCls =
  'w-full bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none transition-colors focus:border-primary';

/**
 * Text field that keeps its own local value so typing is instant and the
 * caret never jumps. The value is written to the database ~400ms after you
 * stop typing (and immediately on blur).
 */
function TextInput({
  value,
  onSave,
  textarea,
  rows = 3,
  className,
  ...rest
}: {
  value: string;
  onSave: (v: string) => void | Promise<void>;
  textarea?: boolean;
  rows?: number;
  className?: string;
  placeholder?: string;
  type?: string;
}) {
  const [local, setLocal] = useState(value);
  const focused = useRef(false);
  const timer = useRef<number>();
  const saveRef = useRef(onSave);
  saveRef.current = onSave;

  // Adopt external changes only while the user is not editing this field.
  useEffect(() => {
    if (!focused.current) setLocal(value);
  }, [value]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const push = (v: string) => {
    setLocal(v);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => saveRef.current(v), 400);
  };

  const flush = () => {
    focused.current = false;
    window.clearTimeout(timer.current);
    if (local !== value) saveRef.current(local);
  };

  const props = {
    className: className ?? inputCls,
    value: local,
    onFocus: () => { focused.current = true; },
    onBlur: flush,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => push(e.target.value),
    ...rest,
  };

  return textarea ? <textarea rows={rows} {...props} /> : <input {...props} />;
}


export default function AdminConsole() {
  const site = useSite();
  const perf = usePerformance();
  const { settings, projects, timeline, reviews, activity, isAdmin, adminOpen, setAdminOpen } = site;
  const [tab, setTab] = useState<Tab>('DASHBOARD');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [themePrompt, setThemePrompt] = useState('');

  useEffect(() => {
    const handler = (e: Event) => {
      setEditingId((e as CustomEvent<string>).detail);
      setTab('CARDS');
    };
    window.addEventListener('admin:edit-project', handler);
    return () => window.removeEventListener('admin:edit-project', handler);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isAdmin) return;
      if (e.key === 'Escape') setAdminOpen(false);
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); site.undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); site.redo(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isAdmin, setAdminOpen, site]);

  const editing = useMemo(() => projects.find((p) => p.id === editingId) ?? null, [projects, editingId]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return [
      ...projects.filter((p) => p.title.toLowerCase().includes(q)).map((p) => ({ kind: 'Card', label: p.title })),
      ...timeline.filter((t) => t.codename.toLowerCase().includes(q)).map((t) => ({ kind: 'Timeline', label: t.codename })),
      ...reviews.filter((r) => r.name.toLowerCase().includes(q)).map((r) => ({ kind: 'Review', label: r.name })),
    ];
  }, [search, projects, timeline, reviews]);

  const patchProject = async (id: string, values: Partial<ProjectRow>) => {
    site.pushHistory();
    await site.patchProject(id, values);
  };

  const setTheme = (name: string, tokens: ThemeTokens) => {
    site.saveSettings({ theme: { ...settings.theme, name, tokens } });
    site.log('THEME', `Applied ${name}`);
  };

  const aiTheme = async () => {
    toast.info('Tuning theme…');
    try {
      const { data, error } = await supabase.functions.invoke('theme-ai', {
        body: { prompt: themePrompt, current: settings.theme.tokens },
      });
      if (error) throw error;
      setTheme(`${settings.theme.name} (tuned)`, data.tokens as ThemeTokens);
      toast.success('Theme updated');
    } catch {
      toast.error('Could not tune the theme, try again');
    }
  };

  if (!isAdmin) return null;

  return (
    <AnimatePresence>
      {adminOpen && (
        <motion.aside
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 240 }}
          className="fixed right-0 top-0 bottom-0 z-[80] w-full sm:w-[460px] bg-card/95 backdrop-blur-xl border-l border-border flex flex-col shadow-xl"
        >
          <header className="p-4 border-b border-border flex items-center gap-3">
            <LayoutDashboard className="w-4 h-4 text-primary" />
            <div>
              <span className="text-sm font-semibold text-foreground">Admin console</span>
              <p className="text-xs text-muted-foreground">Edit your site's content and look, live</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={site.undo} disabled={!site.canUndo} className="admin-chip" title="Undo last change" aria-label="Undo"><Undo2 className="w-3 h-3" /></button>
              <button onClick={site.redo} disabled={!site.canRedo} className="admin-chip" title="Redo last undone change" aria-label="Redo"><Redo2 className="w-3 h-3" /></button>
              <button onClick={() => setAdminOpen(false)} className="admin-chip" title="Close the admin console" aria-label="Close console"><X className="w-3 h-3" /></button>
            </div>
          </header>

          <nav className="flex flex-wrap gap-1.5 p-3 border-b border-border">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                title={TAB_INTROS[t]}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${tab === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
              >
                {TAB_LABELS[t]}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-auto p-4">
            <p className="text-xs text-muted-foreground mb-4">{TAB_INTROS[tab]}</p>

            {tab === 'DASHBOARD' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['Cards', projects.length, 'Total project cards on your site'],
                    ['Visible', projects.filter((p) => p.visible).length, 'Cards currently shown to visitors'],
                    ['Total views', projects.reduce((s, p) => s + p.views, 0), 'Combined views across all cards'],
                    ['Total likes', projects.reduce((s, p) => s + p.likes, 0), 'Combined likes across all cards'],
                    ['Timeline entries', timeline.length, 'Milestones in your timeline'],
                    ['Reviews', reviews.length, 'Testimonials collected'],
                  ].map(([label, value, hint]) => (
                    <div key={String(label)} className="hud-panel p-3">
                      <div className="text-xl font-bold text-primary">{value as number}</div>
                      <div className="text-xs font-medium text-foreground">{label}</div>
                      <div className="text-[11px] text-muted-foreground">{hint}</div>
                    </div>
                  ))}
                </div>

                <SectionCard title="Search everything" description="Find any card, timeline entry or review by name.">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <TextInput  value={search} onSave={(v) => setSearch(v)} placeholder="Search all content…" className={`${inputCls} pl-9`} />
                  </div>
                  {searchResults.map((r, i) => (
                    <div key={i} className="text-xs text-muted-foreground mt-2">
                      <span className="admin-chip inline-block px-2 py-0.5 mr-2">{r.kind}</span>{r.label}
                    </div>
                  ))}
                </SectionCard>

                <button
                  className="cyber-btn w-full text-sm"
                  onClick={() => { site.setPreviewMode(true); setAdminOpen(false); toast.info('Visitor preview — reload to exit'); }}
                >
                  Preview as a visitor
                </button>

                <SectionCard title="Recent activity" description="A log of the latest changes made in this console.">
                  {activity.slice(0, 12).map((a) => (
                    <div key={a.id} className="text-xs text-foreground/80 mb-1">
                      <span className="text-primary font-medium">{a.action}</span> — {a.detail}
                    </div>
                  ))}
                </SectionCard>
              </div>
            )}

            {tab === 'CARDS' && (
              <div className="space-y-4">
                <Field label="Choose a card to edit" hint="Select any project card from your site to change its content below.">
                  <select className={inputCls} value={editingId ?? ''} onChange={(e) => setEditingId(e.target.value || null)}>
                    <option value="">— select a card —</option>
                    {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </Field>

                {editing && (
                  <div>
                    <SectionCard title="Basic info" description="The main text visitors see on this card.">
                      <Field label="Title"><TextInput className={inputCls} value={editing.title} onSave={(v) => patchProject(editing.id, { title: v })} /></Field>
                      <Field label="Subtitle"><TextInput className={inputCls} value={editing.subtitle ?? ''} onSave={(v) => patchProject(editing.id, { subtitle: v })} /></Field>
                      <Field label="Description"><TextInput textarea rows={4} className={inputCls} value={editing.description} onSave={(v) => patchProject(editing.id, { description: v })} /></Field>
                    </SectionCard>

                    <SectionCard title="Media" description="Images and video shown on the card.">
                      <Field label="Cover image URL"><TextInput className={inputCls} value={editing.image_url ?? ''} onSave={(v) => patchProject(editing.id, { image_url: v })} /></Field>
                      <Field label="Upload cover" hint="Choose an image file to use as the cover instead.">
                        <input type="file" accept="image/*" className="text-xs" onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          toast.info('Uploading…');
                          const url = await uploadMedia(f);
                          await patchProject(editing.id, { image_url: url });
                          toast.success('Cover updated');
                        }} />
                      </Field>
                      <Field label="YouTube link or ID" hint="Paste a full YouTube URL or just the video ID."><TextInput className={inputCls} value={editing.video_id ?? ''} onSave={(v) => patchProject(editing.id, { video_id: youtubeId(v) })} /></Field>
                      <Field label="Upload video file" hint="Attach a video file hosted directly with your project.">
                        <input type="file" accept="video/*" className="text-xs" onChange={async (e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          toast.info('Uploading video…');
                          const url = await uploadMedia(f, 'videos');
                          await patchProject(editing.id, { video_url: url });
                          toast.success('Video attached');
                        }} />
                      </Field>
                    </SectionCard>

                    <SectionCard title="Tags & appearance" description="How the card looks and behaves.">
                      <Field label="Tech tags" hint="Comma separated list, e.g. React, Node, Postgres.">
                        <input className={inputCls} defaultValue={editing.tech.join(', ')} onBlur={(e) => patchProject(editing.id, { tech: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) })} />
                      </Field>
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Accent colour" hint="The theme colour used on this card.">
                          <select className={inputCls} value={editing.color} onChange={(e) => patchProject(editing.id, { color: e.target.value })}>
                            {['cyan', 'magenta', 'purple', 'green'].map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </Field>
                        <Field label="Status" hint="Badge shown on the card.">
                          <select className={inputCls} value={editing.status} onChange={(e) => patchProject(editing.id, { status: e.target.value })}>
                            {['live', 'beta', 'wip', 'archived'].map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </Field>
                        <Field label="Layout" hint="Card width in the grid.">
                          <select className={inputCls} value={editing.layout} onChange={(e) => patchProject(editing.id, { layout: e.target.value })}>
                            {['standard', 'wide'].map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </Field>
                        <Field label="Hover effect" hint="Animation when a visitor hovers the card.">
                          <select className={inputCls} value={editing.hover_effect} onChange={(e) => patchProject(editing.id, { hover_effect: e.target.value })}>
                            {['tilt', 'lift', 'zoom', 'none'].map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </Field>
                      </div>
                      <Field label={`Glow strength — ${editing.glow}%`} hint="How strong the coloured halo around this card looks.">
                        <input type="range" min={0} max={100} value={editing.glow} className="w-full" onChange={(e) => patchProject(editing.id, { glow: Number(e.target.value) })} />
                      </Field>
                    </SectionCard>

                    <SectionCard title="Call to action & stats" description="The button visitors click, and the counters shown on the card.">
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="CTA label"><TextInput className={inputCls} value={editing.cta_label ?? ''} onSave={(v) => patchProject(editing.id, { cta_label: v })} /></Field>
                        <Field label="CTA link"><TextInput className={inputCls} value={editing.cta_url ?? ''} onSave={(v) => patchProject(editing.id, { cta_url: v })} /></Field>
                        <Field label="Likes"><input type="number" className={inputCls} value={editing.likes} onChange={(e) => patchProject(editing.id, { likes: Number(e.target.value) })} /></Field>
                        <Field label="Views"><input type="number" className={inputCls} value={editing.views} onChange={(e) => patchProject(editing.id, { views: Number(e.target.value) })} /></Field>
                      </div>
                    </SectionCard>
                  </div>
                )}
              </div>
            )}

            {tab === 'TIMELINE' && (
              <div className="space-y-4">
                <button className="cyber-btn w-full text-sm" onClick={async () => {
                  site.pushHistory();
                  await supabase.from('timeline_entries').insert({ year: '2026', codename: 'New entry', sort_order: timeline.length + 1 });
                  site.refreshAll();
                }}>+ Add timeline entry</button>
                {timeline.map((t) => (
                  <div key={t.id} className="hud-panel p-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Year"><TextInput className={inputCls} value={t.year} onSave={async (v) => { await supabase.from('timeline_entries').update({ year: v }).eq('id', t.id); site.refreshAll(); }} /></Field>
                      <Field label="Status"><TextInput className={inputCls} value={t.status} onSave={async (v) => { await supabase.from('timeline_entries').update({ status: v }).eq('id', t.id); site.refreshAll(); }} /></Field>
                    </div>
                    <Field label="Title"><TextInput className={inputCls} value={t.codename} onSave={async (v) => { await supabase.from('timeline_entries').update({ codename: v }).eq('id', t.id); site.refreshAll(); }} /></Field>
                    <Field label="Description"><TextInput textarea rows={3} className={inputCls} value={t.description} onSave={async (v) => { await supabase.from('timeline_entries').update({ description: v }).eq('id', t.id); site.refreshAll(); }} /></Field>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Colour"><select className={inputCls} value={t.color} onChange={async (e) => { await supabase.from('timeline_entries').update({ color: e.target.value }).eq('id', t.id); site.refreshAll(); }}>
                        {['cyan', 'magenta', 'purple', 'green'].map((c) => <option key={c}>{c}</option>)}
                      </select></Field>
                      <Field label="Progress %"><input type="number" className={inputCls} value={t.progress} onChange={async (e) => { await supabase.from('timeline_entries').update({ progress: Number(e.target.value) }).eq('id', t.id); site.refreshAll(); }} /></Field>
                    </div>
                    <button className="admin-chip mt-1 text-destructive border-destructive/50" onClick={async () => { site.pushHistory(); await supabase.from('timeline_entries').delete().eq('id', t.id); site.refreshAll(); }}>Delete entry</button>
                  </div>
                ))}
              </div>
            )}

            {tab === 'REVIEWS' && (
              <div className="space-y-4">
                <button className="cyber-btn w-full text-sm" onClick={async () => {
                  site.pushHistory();
                  await supabase.from('reviews').insert({ name: 'New client', role: 'Developer', approved: true, sort_order: reviews.length + 1 });
                  site.refreshAll();
                }}>+ Add review</button>
                {reviews.map((r) => (
                  <div key={r.id} className="hud-panel p-3">
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Name"><TextInput className={inputCls} value={r.name} onSave={async (v) => { await supabase.from('reviews').update({ name: v }).eq('id', r.id); site.refreshAll(); }} /></Field>
                      <Field label="Role"><TextInput className={inputCls} value={r.role} onSave={async (v) => { await supabase.from('reviews').update({ role: v }).eq('id', r.id); site.refreshAll(); }} /></Field>
                    </div>
                    <Field label="Avatar URL"><TextInput className={inputCls} placeholder="Avatar URL" value={r.avatar_url ?? ''} onSave={async (v) => { await supabase.from('reviews').update({ avatar_url: v }).eq('id', r.id); site.refreshAll(); }} /></Field>
                    <Field label="Review text"><TextInput textarea rows={3} className={inputCls} value={r.content} onSave={async (v) => { await supabase.from('reviews').update({ content: v }).eq('id', r.id); site.refreshAll(); }} /></Field>
                    <div className="flex items-end gap-2">
                      <Field label="Rating (1-5)"><input type="number" min={1} max={5} className={inputCls} value={r.rating} onChange={async (e) => { await supabase.from('reviews').update({ rating: Number(e.target.value) }).eq('id', r.id); site.refreshAll(); }} /></Field>
                      <button className="admin-chip" title="Toggle whether this review is public" onClick={async () => { await supabase.from('reviews').update({ approved: !r.approved }).eq('id', r.id); site.refreshAll(); }}>
                        {r.approved ? 'Approved' : 'Pending'}
                      </button>
                      <button className="admin-chip text-destructive border-destructive/50" title="Delete this review" onClick={async () => { site.pushHistory(); await supabase.from('reviews').delete().eq('id', r.id); site.refreshAll(); }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'CONTENT' && (
              <div>
                <SectionCard title="Hero section" description="The big introduction at the top of your site.">
                  <Field label="Kicker" hint="Small label above the main title."><TextInput className={inputCls} value={settings.hero.kicker} onSave={(v) => site.saveSettings({ hero: { ...settings.hero, kicker: v } })} /></Field>
                  <Field label="Title"><TextInput className={inputCls} value={settings.hero.title} onSave={(v) => site.saveSettings({ hero: { ...settings.hero, title: v } })} /></Field>
                  <Field label="Title accent" hint="The highlighted part of the title."><TextInput className={inputCls} value={settings.hero.titleAccent} onSave={(v) => site.saveSettings({ hero: { ...settings.hero, titleAccent: v } })} /></Field>
                  <Field label="Tagline"><TextInput className={inputCls} value={settings.hero.subtitle} onSave={(v) => site.saveSettings({ hero: { ...settings.hero, subtitle: v } })} /></Field>
                </SectionCard>

                <SectionCard title="About section" description="Your bio and profile photo.">
                  <Field label="Bio"><TextInput textarea rows={5} className={inputCls} value={settings.about.bio} onSave={(v) => site.saveSettings({ about: { ...settings.about, bio: v } })} /></Field>
                  <Field label="Avatar URL"><TextInput className={inputCls} value={settings.about.avatarUrl} onSave={(v) => site.saveSettings({ about: { ...settings.about, avatarUrl: v } })} /></Field>
                </SectionCard>

                <SectionCard title="Stats" description="The number counters shown in your about section (value, suffix, label).">
                  {settings.about.stats.map((s, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                      <TextInput className={inputCls} placeholder="Value" value={s.value} onSave={(v) => {
                        const stats = [...settings.about.stats];
                        stats[i] = { ...s, value: v };
                        site.saveSettings({ about: { ...settings.about, stats } });
                      }} />
                      <TextInput className={inputCls} placeholder="Suffix" value={s.suffix} onSave={(v) => {
                        const stats = [...settings.about.stats];
                        stats[i] = { ...s, suffix: v };
                        site.saveSettings({ about: { ...settings.about, stats } });
                      }} />
                      <TextInput className={inputCls} placeholder="Label" value={s.label} onSave={(v) => {
                        const stats = [...settings.about.stats];
                        stats[i] = { ...s, label: v };
                        site.saveSettings({ about: { ...settings.about, stats } });
                      }} />
                    </div>
                  ))}
                </SectionCard>

                <SectionCard title="Skill matrix" description="Your skills, each with a proficiency level (0-100) and colour.">
                  {settings.about.skills.map((s, i) => (
                    <div key={i} className="grid grid-cols-3 gap-2 mb-2">
                      <TextInput className={inputCls} placeholder="Skill name" value={s.name} onSave={(v) => {
                        const skills = [...settings.about.skills];
                        skills[i] = { ...s, name: v };
                        site.saveSettings({ about: { ...settings.about, skills } });
                      }} />
                      <input type="number" className={inputCls} placeholder="Level" value={s.level} onChange={(e) => {
                        const skills = [...settings.about.skills];
                        skills[i] = { ...s, level: Number(e.target.value) };
                        site.saveSettings({ about: { ...settings.about, skills } });
                      }} />
                      <select className={inputCls} value={s.color} onChange={(e) => {
                        const skills = [...settings.about.skills];
                        skills[i] = { ...s, color: e.target.value as typeof s.color };
                        site.saveSettings({ about: { ...settings.about, skills } });
                      }}>
                        {['cyan', 'magenta', 'purple', 'green'].map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  ))}
                </SectionCard>

                <SectionCard title="Navigation & footer" description="Menu links, logo text and the links at the bottom of your site.">
                  <Field label="Logo"><TextInput className={inputCls} value={settings.nav.logo} onSave={(v) => site.saveSettings({ nav: { ...settings.nav, logo: v } })} /></Field>
                  <Field label="Logo accent"><TextInput className={inputCls} value={settings.nav.logoAccent} onSave={(v) => site.saveSettings({ nav: { ...settings.nav, logoAccent: v } })} /></Field>
                  <Field label="Status text" hint="Small status label next to the logo."><TextInput className={inputCls} value={settings.nav.statusText} onSave={(v) => site.saveSettings({ nav: { ...settings.nav, statusText: v } })} /></Field>
                  <p className="text-xs font-semibold text-foreground mb-1">Menu items (name / link)</p>
                  {settings.nav.items.map((n, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                      <TextInput className={inputCls} value={n.name} onSave={(v) => {
                        const items = [...settings.nav.items];
                        items[i] = { ...n, name: v };
                        site.saveSettings({ nav: { ...settings.nav, items } });
                      }} />
                      <TextInput className={inputCls} value={n.href} onSave={(v) => {
                        const items = [...settings.nav.items];
                        items[i] = { ...n, href: v };
                        site.saveSettings({ nav: { ...settings.nav, items } });
                      }} />
                    </div>
                  ))}
                  <Field label="Footer note"><TextInput className={inputCls} value={settings.footer.note} onSave={(v) => site.saveSettings({ footer: { ...settings.footer, note: v } })} /></Field>
                  <p className="text-xs font-semibold text-foreground mb-1">Footer links (label / URL)</p>
                  {settings.footer.links.map((l, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2 mb-2">
                      <TextInput className={inputCls} value={l.label} onSave={(v) => {
                        const links = [...settings.footer.links];
                        links[i] = { ...l, label: v };
                        site.saveSettings({ footer: { ...settings.footer, links } });
                      }} />
                      <TextInput className={inputCls} value={l.url} onSave={(v) => {
                        const links = [...settings.footer.links];
                        links[i] = { ...l, url: v };
                        site.saveSettings({ footer: { ...settings.footer, links } });
                      }} />
                    </div>
                  ))}
                </SectionCard>

                <SectionCard title="Section headings & SEO" description="Headings shown above each section, plus the browser tab title and search-engine description.">
                  {(Object.keys(settings.sections) as (keyof typeof settings.sections)[]).map((k) => (
                    <Field key={k} label={k}>
                      <TextInput className={inputCls} value={settings.sections[k]} onSave={(v) => site.saveSettings({ sections: { ...settings.sections, [k]: v } })} />
                    </Field>
                  ))}
                  <Field label="Page title" hint="Shown in the browser tab."><TextInput className={inputCls} value={settings.meta.title} onSave={(v) => site.saveSettings({ meta: { ...settings.meta, title: v } })} /></Field>
                  <Field label="Meta description" hint="Used by search engines and link previews."><TextInput className={inputCls} value={settings.meta.description} onSave={(v) => site.saveSettings({ meta: { ...settings.meta, description: v } })} /></Field>
                </SectionCard>

                <SectionCard title="Announcement ticker" description="An optional scrolling banner message shown to visitors.">
                  <button className="admin-chip mb-2" onClick={() => site.saveSettings({ ticker: { ...settings.ticker, enabled: !settings.ticker.enabled } })}>
                    {settings.ticker.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                  <Field label="Ticker text"><TextInput className={inputCls} value={settings.ticker.text} onSave={(v) => site.saveSettings({ ticker: { ...settings.ticker, text: v } })} /></Field>
                </SectionCard>
              </div>
            )}

            {tab === 'THEME' && (
              <div>
                <SectionCard title="Colour presets" description={`Choose from ${THEMES.length} ready-made palettes. Current: ${settings.theme.name}.`}>
                  <div className="grid grid-cols-2 gap-2">
                    {THEMES.map((t) => (
                      <button key={t.name} onClick={() => setTheme(t.name, t.tokens)} className="hud-panel p-2 text-left" title={`Apply the ${t.name} preset`}>
                        <div className="flex gap-1 mb-1">
                          {[t.tokens.cyan, t.tokens.magenta, t.tokens.purple, t.tokens.green].map((c, i) => (
                            <span key={i} className="w-4 h-4 rounded-full" style={{ background: `hsl(${c})` }} />
                          ))}
                        </div>
                        <span className="text-xs text-foreground">{t.name}</span>
                      </button>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard title="AI theme tuning" description="Describe a mood or style and let AI adjust your current theme's colours to match.">
                  <Field label="Prompt">
                    <TextInput className={inputCls} placeholder="Make it more cyberpunk" value={themePrompt} onSave={(v) => setThemePrompt(v)} />
                  </Field>
                  <button className="cyber-btn w-full text-sm flex items-center justify-center gap-2" onClick={aiTheme}><Sparkles className="w-4 h-4" /> Apply prompt</button>
                </SectionCard>

                <SectionCard title="Manual colours" description="Fine-tune each theme colour directly, in HSL format.">
                  {(Object.keys(settings.theme.tokens) as (keyof ThemeTokens)[]).map((k) => (
                    <Field key={k} label={`${k} (HSL)`}>
                      <TextInput className={inputCls} value={settings.theme.tokens[k]} onSave={(v) => site.saveSettings({ theme: { ...settings.theme, tokens: { ...settings.theme.tokens, [k]: v } } })} />
                    </Field>
                  ))}
                </SectionCard>

                <SectionCard title="Look & feel" description="Fonts, background style and the overall glow effect across the site.">
                  <Field label="Font pair">
                    <select className={inputCls} value={settings.theme.fontPair} onChange={(e) => site.saveSettings({ theme: { ...settings.theme, fontPair: e.target.value } })}>
                      {Object.entries(FONT_PAIRS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </Field>
                  <Field label="Background effect" hint="The animated backdrop behind your content.">
                    <select className={inputCls} value={settings.theme.backgroundEffect} onChange={(e) => site.saveSettings({ theme: { ...settings.theme, backgroundEffect: e.target.value as 'grid' } })}>
                      {['scene3d', 'particles', 'grid', 'none'].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label={`Global glow — ${settings.theme.glow}%`} hint="How strong the coloured halo around cards and elements looks site-wide.">
                    <input type="range" min={0} max={150} value={settings.theme.glow} className="w-full" onChange={(e) => site.saveSettings({ theme: { ...settings.theme, glow: Number(e.target.value) } })} />
                  </Field>
                </SectionCard>
              </div>
            )}

            {tab === 'BACKGROUND' && (() => {
              const bg = settings.background ?? DEFAULT_SETTINGS.background;
              const setBg = (patch: Partial<typeof bg>) => site.saveSettings({ background: { ...bg, ...patch } });
              return (
                <div>
                  <SectionCard title="System original" description="Restore the pastel confetti, paper texture and soft colour clouds designed for this portfolio.">
                    <button
                      className="cyber-btn-ghost w-full justify-center text-sm"
                      onClick={() => {
                        site.pushHistory();
                        site.saveSettings({ background: { ...SYSTEM_ORIGINAL_BACKGROUND } });
                        toast.success('Original background restored');
                      }}
                    >
                      <RotateCcw className="w-4 h-4" /> Revert to system original
                    </button>
                  </SectionCard>
                  <SectionCard title="Background style" description="Pick the look of the page backdrop. Every option is animated unless you turn animation off below.">
                    <div className="grid grid-cols-2 gap-2">
                      {BACKGROUND_PRESETS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setBg({ preset: p.id })}
                          title={p.hint}
                          className={`hud-panel p-2 text-left transition-colors ${bg.preset === p.id ? 'border-primary' : ''}`}
                        >
                          <span className="text-xs font-semibold text-foreground block">{p.label}</span>
                          <span className="text-[10px] text-muted-foreground leading-tight block mt-0.5">{p.hint}</span>
                        </button>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard title="Background colours" description="Three colours used by the pattern and the floating colour clouds. HSL format, e.g. 38 90% 62%.">
                    {(['colorA', 'colorB', 'colorC'] as const).map((k, i) => (
                      <Field key={k} label={`Colour ${i + 1} (HSL)`}>
                        <div className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-lg border border-border shrink-0" style={{ background: `hsl(${bg[k]})` }} />
                          <TextInput value={bg[k]} onSave={(v) => setBg({ [k]: v } as never)} />
                        </div>
                      </Field>
                    ))}
                  </SectionCard>

                  <SectionCard title="Strength & motion" description="How visible the background is and how fast it moves.">
                    <Field label={`Visibility — ${bg.opacity}%`} hint="Lower this if the background makes text harder to read.">
                      <input type="range" min={0} max={100} value={bg.opacity} className="w-full" onChange={(e) => setBg({ opacity: Number(e.target.value) })} />
                    </Field>
                    <Field label={`Animation speed — ${bg.speed}%`} hint="100% is the normal drift speed.">
                      <input type="range" min={20} max={300} value={bg.speed} className="w-full" onChange={(e) => setBg({ speed: Number(e.target.value) })} />
                    </Field>
                    <div className="flex flex-wrap gap-2">
                      <button className="admin-chip" onClick={() => setBg({ animated: !bg.animated })}>Animation: {bg.animated ? 'On' : 'Off'}</button>
                      <button className="admin-chip" onClick={() => setBg({ blobs: !bg.blobs })}>Colour clouds: {bg.blobs ? 'On' : 'Off'}</button>
                      <button className="admin-chip" onClick={() => setBg({ grain: !bg.grain })}>Paper grain: {bg.grain ? 'On' : 'Off'}</button>
                    </div>
                  </SectionCard>

                  <SectionCard title="Custom image or GIF" description="Upload or paste any image to use as the backdrop. Select the 'Custom image' style above to show it.">
                    <Field label="Image URL">
                      <TextInput value={bg.imageUrl} placeholder="https://…" onSave={(v) => setBg({ imageUrl: v, preset: v ? 'image' : bg.preset })} />
                    </Field>
                    <label className="cyber-btn w-full text-sm block text-center cursor-pointer mb-3">
                      <Upload className="w-3 h-3 inline mr-2" /> Upload image
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const url = await uploadMedia(file);
                          setBg({ imageUrl: url, preset: 'image' });
                          toast.success('Background image updated');
                        } catch { toast.error('Upload failed'); }
                      }} />
                    </label>
                    <Field label={`Blur — ${bg.imageBlur}px`} hint="Softens the image so your content stays readable.">
                      <input type="range" min={0} max={40} value={bg.imageBlur} className="w-full" onChange={(e) => setBg({ imageBlur: Number(e.target.value) })} />
                    </Field>
                    <Field label={`Fade — ${bg.imageDim}%`} hint="Mixes the page colour over the image to tone it down.">
                      <input type="range" min={0} max={90} value={bg.imageDim} className="w-full" onChange={(e) => setBg({ imageDim: Number(e.target.value) })} />
                    </Field>
                    {bg.imageUrl && (
                      <button className="admin-chip mt-2" onClick={() => setBg({ imageUrl: '', preset: 'doodle' })}>Remove image</button>
                    )}
                  </SectionCard>
                </div>
              );
            })()}



            {tab === 'SYSTEM' && (
              <div className="space-y-4">
                <SectionCard title="Browsing experience" description="Controls how projects are paginated and whether the intro animation plays.">
                  <Field label="Cards shown before 'Show more'">
                    <input type="number" min={1} className={inputCls} value={settings.fx.pageSize} onChange={(e) => site.saveSettings({ fx: { ...settings.fx, pageSize: Number(e.target.value) } })} />
                  </Field>
                  <button className="admin-chip" onClick={() => site.saveSettings({ fx: { ...settings.fx, intro: !settings.fx.intro } })}>
                    Intro animation: {settings.fx.intro ? 'On' : 'Off'}
                  </button>
                </SectionCard>

                <SectionCard title="Sound" description="Toggle interface sound effects and set their volume.">
                  <button className="admin-chip mb-3" onClick={() => { const next = !settings.fx.sound; setSoundEnabled(next); site.saveSettings({ fx: { ...settings.fx, sound: next } }); }}>
                    Sound: {settings.fx.sound ? 'On' : 'Off'}
                  </button>
                  <Field label={`Sound volume — ${Math.round(settings.fx.volume * 100)}%`}>
                    <input type="range" min={0} max={100} value={settings.fx.volume * 100} className="w-full"
                      onChange={(e) => { const v = Number(e.target.value) / 100; setSoundVolume(v); site.saveSettings({ fx: { ...settings.fx, volume: v } }); }} />
                  </Field>
                </SectionCard>

                <SectionCard title="Performance" description="Lower this if the site feels slow on your device; it reduces visual effects.">
                  <Field label="Performance mode">
                    <select className={inputCls} value={perf.mode} onChange={(e) => perf.setMode(e.target.value as 'lite')}>
                      {['ultra', 'balanced', 'lite'].map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </Field>
                </SectionCard>

                <SectionCard title="Backup & restore" description="Save all your site content to a file, or load it back in later.">
                  <button className="cyber-btn w-full text-sm mb-2" onClick={() => {
                    const blob = new Blob([site.exportJson()], { type: 'application/json' });
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(blob);
                    a.download = 'portfolio-backup.json';
                    a.click();
                  }}>
                    <Download className="w-3 h-3 inline mr-2" /> Export JSON
                  </button>
                  <label className="cyber-btn w-full text-sm block text-center cursor-pointer">
                    <Upload className="w-3 h-3 inline mr-2" /> Import JSON
                    <input type="file" accept="application/json" className="hidden" onChange={async (e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      await site.importJson(await f.text());
                      toast.success('Content restored');
                    }} />
                  </label>
                </SectionCard>

                <button className="admin-chip text-destructive border-destructive/50" title="Log out of admin mode" onClick={() => { site.setIsAdmin(false); setAdminOpen(false); }}>
                  Lock console
                </button>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
