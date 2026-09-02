import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Copy, Heart, Play, Pencil, Copy as Dup, Trash2, Star, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { ProjectRow, STATUS_LABELS, accentColor } from '@/lib/siteContent';
import { usePerformance } from '@/hooks/usePerformance';
import { playHoverSound, playClickSound } from '@/lib/sounds';

interface Props {
  project: ProjectRow;
  index: number;
  view: 'grid' | 'list';
  liked: boolean;
  admin: boolean;
  onPlay: (p: ProjectRow) => void;
  onDetail: (p: ProjectRow) => void;
  onLike: (p: ProjectRow) => void;
  onShare: (p: ProjectRow) => void;
  onEdit?: (p: ProjectRow) => void;
  onDuplicate?: (p: ProjectRow) => void;
  onDelete?: (p: ProjectRow) => void;
  onToggleFeatured?: (p: ProjectRow) => void;
  onToggleVisible?: (p: ProjectRow) => void;
  onMove?: (p: ProjectRow, dir: -1 | 1) => void;
  selected?: boolean;
  onSelect?: (p: ProjectRow) => void;
}

export default function ProjectCard(props: Props) {
  const {
    project, index, view, liked, admin,
    onPlay, onDetail, onLike, onShare,
    onEdit, onDuplicate, onDelete, onToggleFeatured, onToggleVisible, onMove, selected, onSelect,
  } = props;
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-80px' });
  const [hovered, setHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const { enableHeavyFx, reducedMotion } = usePerformance();

  const accent = accentColor(project.color);
  const accentRaw = accent.slice(4, -1);

  const hoverTransform =
    project.hover_effect === 'lift'
      ? { y: -8 }
      : project.hover_effect === 'zoom'
        ? { scale: 1.03 }
        : project.hover_effect === 'none'
          ? {}
          : { y: -6 };

  return (
    <motion.div
      ref={cardRef}
      initial={reducedMotion ? false : { opacity: 0, y: 40 }}
      animate={isInView || reducedMotion ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.07 }}
      whileHover={enableHeavyFx ? hoverTransform : undefined}
      style={{ willChange: 'transform', rotate: `${(index % 2 === 0 ? -1 : 1) * 0.5}deg` }}
      className={`${project.layout === 'wide' && view === 'grid' ? 'md:col-span-2' : ''} ${selected ? 'ring-4 ring-primary rounded-[2rem]' : ''}`}
    >
      <div
        className="sketch-card h-full relative"
        style={{
          background: `linear-gradient(160deg, hsl(${accentRaw} / 0.14) 0%, hsl(var(--card)) 55%)`,
        }}
      >
        {/* colour ribbon */}
        <div className="absolute inset-x-0 top-0 h-2.5 rounded-t-[1.4rem]" style={{ background: accent }} />

        <div className={`p-5 md:p-7 ${view === 'list' ? 'sm:flex sm:gap-6' : ''}`}>
          {/* Cover */}
          <div
            className={`relative overflow-hidden rounded-2xl mb-5 aspect-video project-clickable group border-[3px] border-ink shadow-[4px_5px_0_hsl(var(--ink)/0.35)] ${view === 'list' ? 'sm:w-64 sm:shrink-0 sm:mb-0' : ''}`}
            onMouseEnter={() => { setHovered(true); playHoverSound(); }}
            onMouseLeave={() => setHovered(false)}
            onClick={() => { playClickSound(); onPlay(project); }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onPlay(project)}
            aria-label={`Play ${project.title} demo`}
          >
            {!imgLoaded && <div className="absolute inset-0 bg-muted/40 animate-pulse" />}
            <img
              src={project.image_url || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80'}
              alt={`${project.title} cover`}
              loading="lazy"
              decoding="async"
              onLoad={() => setImgLoaded(true)}
              className="w-full h-full object-cover transition-transform duration-500"
              style={{ transform: hovered && enableHeavyFx ? 'scale(1.08)' : 'scale(1)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

            <div
              className="absolute inset-0 flex items-center justify-center transition-all duration-300"
              style={{ opacity: hovered ? 1 : 0.9, transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
            >
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-card border-[3px] border-ink shadow-[3px_4px_0_hsl(var(--ink))]">
                <Play className="w-6 h-6 ml-0.5 text-primary" />
              </div>
            </div>

            <span
              className="absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full bg-card border-2 border-ink shadow-[2px_2px_0_hsl(var(--ink))]"
              style={{ color: accent }}
            >
              {STATUS_LABELS[project.status] ?? project.status}
            </span>
            {project.featured && (
              <span className="absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full bg-card border-2 border-ink text-neon-magenta shadow-[2px_2px_0_hsl(var(--ink))]">
                ★ Featured
              </span>
            )}
            {!project.visible && (
              <span className="absolute bottom-3 left-3 px-3 py-1 text-xs font-bold rounded-full bg-card border-2 border-ink text-destructive shadow-[2px_2px_0_hsl(var(--ink))]">
                Draft
              </span>
            )}
          </div>


          <div className={view === 'list' ? 'sm:flex-1' : ''}>
            <h3 className="font-heading text-xl md:text-2xl font-extrabold text-foreground mb-1 leading-tight">{project.title}</h3>
            {project.subtitle && (
              <p className="text-sm font-semibold mb-2" style={{ color: accent }}>
                {project.subtitle}
              </p>
            )}
            <p className="text-muted-foreground text-sm md:text-base mb-4 line-clamp-3">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs font-semibold rounded-full border-2 border-ink text-foreground"
                  style={{ background: `hsl(${accentRaw} / 0.18)` }}
                >
                  {tech}
                </span>
              ))}
            </div>


            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <button
                onClick={() => onLike(project)}
                className="flex items-center gap-1 hover:text-neon-magenta transition-colors"
                aria-label="Like this project"
              >
                <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current text-neon-magenta' : ''}`} />
                {project.likes}
              </button>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> {project.views}
              </span>
              <button
                onClick={() => onShare(project)}
                className="flex items-center gap-1 hover:text-primary transition-colors"
                aria-label="Copy share link"
              >
                <Copy className="w-3.5 h-3.5" /> Share
              </button>
              <button
                onClick={() => onDetail(project)}
                className="ml-auto hover:text-primary transition-colors font-medium"
              >
                Details
              </button>
            </div>

            {project.cta_url && (
              <a
                href={project.cta_url}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block cyber-btn-ghost text-sm"
              >
                {project.cta_label || 'Open'}
              </a>
            )}

            {admin && (
              <div className="mt-4 flex flex-wrap gap-2 border-t border-border/50 pt-3">
                {onSelect && (
                  <button onClick={() => onSelect(project)} className="admin-chip">
                    {selected ? '☑' : '☐'} Select
                  </button>
                )}
                <button onClick={() => onEdit?.(project)} className="admin-chip"><Pencil className="w-3 h-3" /> Edit</button>
                <button onClick={() => onDuplicate?.(project)} className="admin-chip"><Dup className="w-3 h-3" /> Duplicate</button>
                <button onClick={() => onToggleFeatured?.(project)} className="admin-chip"><Star className="w-3 h-3" /> Feature</button>
                <button onClick={() => onToggleVisible?.(project)} className="admin-chip">
                  {project.visible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />} {project.visible ? 'Hide' : 'Show'}
                </button>
                <button onClick={() => onMove?.(project, -1)} className="admin-chip"><ArrowUp className="w-3 h-3" /></button>
                <button onClick={() => onMove?.(project, 1)} className="admin-chip"><ArrowDown className="w-3 h-3" /></button>
                <button onClick={() => onDelete?.(project)} className="admin-chip text-destructive border-destructive/50">
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
