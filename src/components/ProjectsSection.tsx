import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutGrid, List as ListIcon, Plus } from 'lucide-react';
import { toast } from 'sonner';
import ProjectCard from './ProjectCard';
import VideoLightbox from './VideoLightbox';
import { useSite } from '@/hooks/useSite';
import { supabase } from '@/integrations/supabase/client';
import { ProjectRow, STATUS_LABELS, accentColor } from '@/lib/siteContent';
import { playClickSound } from '@/lib/sounds';

type SortKey = 'featured' | 'newest' | 'az' | 'liked';

function useLikedSet() {
  const [liked, setLiked] = useState<string[]>(() => JSON.parse(localStorage.getItem('liked-projects') ?? '[]'));
  const toggle = (id: string) => {
    setLiked((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('liked-projects', JSON.stringify(next));
      return next;
    });
  };
  return { liked, toggle };
}

export default function ProjectsSection() {
  const { projects, settings, isAdmin, refreshAll, pushHistory, log, setAdminOpen } = useSite();
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>('featured');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [expanded, setExpanded] = useState(false);
  const [video, setVideo] = useState<ProjectRow | null>(null);
  const [detail, setDetail] = useState<ProjectRow | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const { liked, toggle } = useLikedSet();

  const pageSize = settings.fx.pageSize || 4;

  const allTags = useMemo(
    () => Array.from(new Set(projects.flatMap((p) => p.tech))).sort(),
    [projects],
  );

  const filtered = useMemo(() => {
    let list = projects.filter((p) => (isAdmin ? true : p.visible));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tech.join(' ').toLowerCase().includes(q),
      );
    }
    if (tag) list = list.filter((p) => p.tech.includes(tag));
    if (status) list = list.filter((p) => p.status === status);
    const sorted = [...list];
    if (sort === 'featured') sorted.sort((a, b) => Number(b.featured) - Number(a.featured) || a.sort_order - b.sort_order);
    if (sort === 'newest') sorted.sort((a, b) => b.created_at.localeCompare(a.created_at));
    if (sort === 'az') sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === 'liked') sorted.sort((a, b) => b.likes - a.likes);
    return sorted;
  }, [projects, query, tag, status, sort, isAdmin]);

  const visible = expanded ? filtered : filtered.slice(0, pageSize);

  // Deep link: /#project-<id>
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#project-')) {
      const found = projects.find((p) => p.id === hash.replace('#project-', ''));
      if (found) setDetail(found);
    }
  }, [projects]);

  const openVideo = async (p: ProjectRow) => {
    setVideo(p);
    await supabase.from('projects').update({ views: p.views + 1 }).eq('id', p.id);
    refreshAll();
  };

  const like = async (p: ProjectRow) => {
    const isLiked = liked.includes(p.id);
    toggle(p.id);
    await supabase.from('projects').update({ likes: Math.max(0, p.likes + (isLiked ? -1 : 1)) }).eq('id', p.id);
    refreshAll();
  };

  const share = async (p: ProjectRow) => {
    const url = `${window.location.origin}/#project-${p.id}`;
    await navigator.clipboard.writeText(url);
    toast.success('Link copied', { description: p.title });
  };

  // ---- admin actions ----
  const addCard = async () => {
    pushHistory();
    const max = projects.reduce((m, p) => Math.max(m, p.sort_order), 0);
    await supabase.from('projects').insert({ title: 'New project', sort_order: max + 1, visible: false });
    await log('CREATE', 'Added a new project card');
    refreshAll();
    toast.success('Card created — open the console to edit it');
  };

  const duplicate = async (p: ProjectRow) => {
    pushHistory();
    const { id, created_at, updated_at, ...rest } = p;
    await supabase.from('projects').insert({ ...rest, title: `${p.title} copy`, sort_order: p.sort_order + 1 });
    await log('DUPLICATE', p.title);
    refreshAll();
  };

  const remove = async (p: ProjectRow) => {
    pushHistory();
    await supabase.from('projects').delete().eq('id', p.id);
    await log('DELETE', p.title);
    refreshAll();
    toast.success('Card deleted');
  };

  const patch = async (p: ProjectRow, values: Partial<ProjectRow>) => {
    pushHistory();
    await supabase.from('projects').update(values).eq('id', p.id);
    refreshAll();
  };

  const move = async (p: ProjectRow, dir: -1 | 1) => {
    const ordered = [...projects].sort((a, b) => a.sort_order - b.sort_order);
    const i = ordered.findIndex((x) => x.id === p.id);
    const j = i + dir;
    if (j < 0 || j >= ordered.length) return;
    pushHistory();
    await supabase.from('projects').update({ sort_order: ordered[j].sort_order }).eq('id', p.id);
    await supabase.from('projects').update({ sort_order: p.sort_order }).eq('id', ordered[j].id);
    refreshAll();
  };

  const bulkDelete = async () => {
    pushHistory();
    await supabase.from('projects').delete().in('id', selected);
    await log('BULK DELETE', `${selected.length} cards`);
    setSelected([]);
    refreshAll();
  };

  return (
    <section id="projects" className="relative py-20 md:py-24 overflow-hidden">
      <VideoLightbox
        isOpen={!!video}
        videoId={video?.video_id}
        videoUrl={video?.video_url}
        title={video?.title ?? ''}
        onClose={() => setVideo(null)}
      />

      {/* Detail drawer */}
      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[65] bg-foreground/20 backdrop-blur-xl p-4 flex items-center justify-center"
            onClick={() => setDetail(null)}
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className="hud-panel max-w-2xl w-full p-8 max-h-[85vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <p className="kicker mb-3 inline-block">Project details</p>
              <h3 className="font-orbitron text-2xl font-bold mb-2" style={{ color: accentColor(detail.color) }}>
                {detail.title}
              </h3>
              {detail.subtitle && <p className="text-sm text-muted-foreground mb-4">{detail.subtitle}</p>}
              <img src={detail.image_url ?? ''} alt={detail.title} className="w-full rounded-2xl mb-4" loading="lazy" />
              <p className="text-base text-foreground/80 mb-4">{detail.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {detail.tech.map((t) => (
                  <span key={t} className="px-3 py-1 text-xs rounded-full bg-secondary text-foreground/80">{t}</span>
                ))}
              </div>
              <div className="flex gap-3">
                <button className="cyber-btn text-sm" onClick={() => { setDetail(null); openVideo(detail); }}>
                  Play demo
                </button>
                <button className="cyber-btn-ghost text-sm" onClick={() => setDetail(null)}>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="kicker mb-4">{settings.sections.projectsKicker}</span>
          <h2 className="text-4xl md:text-6xl sketch-title sketch-title-fun mt-4">{settings.sections.projectsTitle}</h2>
        </motion.div>

        {/* Controls */}
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search projects…"
                aria-label="Search projects"
                className="w-full bg-card border border-border rounded-full pl-9 pr-3 py-2 text-sm outline-none focus:border-primary transition-colors"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort projects"
              className="bg-card border border-border rounded-full px-4 py-2 text-sm outline-none focus:border-primary transition-colors"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="az">A → Z</option>
              <option value="liked">Most liked</option>
            </select>
            <div className="flex border border-border rounded-full overflow-hidden">
              <button
                onClick={() => setView('grid')}
                aria-label="Grid view"
                className={`p-2 ${view === 'grid' ? 'text-primary bg-secondary' : 'text-muted-foreground'}`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                aria-label="List view"
                className={`p-2 ${view === 'list' ? 'text-primary bg-secondary' : 'text-muted-foreground'}`}
              >
                <ListIcon className="w-4 h-4" />
              </button>
            </div>
            {isAdmin && (
              <button onClick={addCard} className="admin-chip">
                <Plus className="w-3 h-3" /> New card
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.keys(STATUS_LABELS).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(status === s ? null : s)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${status === s ? 'border-primary text-primary bg-secondary' : 'border-border text-muted-foreground'}`}
              >
                {STATUS_LABELS[s]}
              </button>
            ))}
            <span className="w-px bg-border mx-1" />
            {allTags.map((t) => (
              <button
                key={t}
                onClick={() => setTag(tag === t ? null : t)}
                className={`px-3 py-1 text-xs rounded-full border transition-colors ${tag === t ? 'border-neon-magenta text-neon-magenta bg-secondary' : 'border-border text-muted-foreground'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {isAdmin && selected.length > 0 && (
            <div className="flex items-center gap-3 text-xs text-primary">
              {selected.length} selected
              <button onClick={bulkDelete} className="admin-chip text-destructive border-destructive/50">Delete selected</button>
              <button onClick={() => setSelected([])} className="admin-chip">Clear</button>
            </div>
          )}
        </div>

        {/* Grid */}
        <div className={view === 'grid' ? 'grid md:grid-cols-2 gap-8 lg:gap-10' : 'flex flex-col gap-6'}>
          {visible.map((p, i) => (
            <ProjectCard
              key={p.id}
              project={p}
              index={i}
              view={view}
              liked={liked.includes(p.id)}
              admin={isAdmin}
              onPlay={openVideo}
              onDetail={setDetail}
              onLike={like}
              onShare={share}
              onEdit={() => { setAdminOpen(true); window.dispatchEvent(new CustomEvent('admin:edit-project', { detail: p.id })); }}
              onDuplicate={duplicate}
              onDelete={remove}
              onToggleFeatured={(x) => patch(x, { featured: !x.featured })}
              onToggleVisible={(x) => patch(x, { visible: !x.visible })}
              onMove={move}
              selected={selected.includes(p.id)}
              onSelect={(x) => setSelected((s) => (s.includes(x.id) ? s.filter((y) => y !== x.id) : [...s, x.id]))}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-16">No matching projects yet.</p>
        )}

        {filtered.length > pageSize && (
          <div className="text-center mt-12">
            <button
              onClick={() => { playClickSound(); setExpanded((e) => !e); }}
              className="cyber-btn"
            >
              {expanded ? 'Show less' : `Show more (${filtered.length - pageSize})`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
