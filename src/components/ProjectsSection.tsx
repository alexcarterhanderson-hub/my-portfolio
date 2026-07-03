import { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import HolographicCard from './HolographicCard';
import GlitchText from './GlitchText';

// Sample projects data - owner can modify this
// Add your YouTube video IDs here (the part after v= in YouTube URLs)
const projects = [
  {
    id: 1,
    title: 'GLIDER SYSTEM',
    description: 'Custom gliding system that lets players glide smoothly with dynamic control, animations, and optimized performance.',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80',
    tech: ['Lua', 'Rojo', 'PhysicsService'],
    videoId: 'tyfgY3orjmI',
    color: 'cyan' as const,
  },
  {
    id: 2,
    title: 'DEATH SCREEN',
    description: 'A polished death screen with smooth transitions, respawn timer, and dynamic UI effects for an immersive experience.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80',
    tech: ['Lua', 'Gui'],
    videoId: 'elTZnQ4B9rY',
    color: 'magenta' as const,
  },
  {
    id: 3,
    title: 'MOVING STEPS',
    description: 'A smooth moving step system where platforms react to player movement with seamless motion and timing.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    tech: ['Lua', 'Modeling', 'AnimationTrack'],
    videoId: 'eR-V_DlumDU',
    color: 'purple' as const,
  },
  {
    id: 4,
    title: 'WALL CLIMBING',
    description: 'A smooth and realistic climbing mechanic that lets players scale walls with fluid animations and physics based movement. Perfect for parkour and adventure games.',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=600&q=80',
    tech: ['Lua', 'Physics', 'Animations'],
    videoId: 'gbpYu3R_E5I',
    color: 'green' as const,
  },
  {
    id: 5,
    title: 'WISHING SYSTEM',
    description: 'A system where lets players make wishes that are reviewed and fulfilled by a system, creating a fun and interactive way for the community to ask for in game rewards.',
    image: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=600&q=80',
    tech: ['Lua', 'FastCast', 'Events'],
    videoId: 'CKm-1W-UMBE',
    color: 'cyan' as const,
  },
  {
    id: 6,
    title: 'SUGGESTION SYSTEM',
    description: 'A suggestion system that allows players to submit ideas and receive direct replies from admins, improving communication, feedback, and community engagement.',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
    tech: ['Lua', 'Gui', 'Events', 'DataStore', 'Beta'],
    videoId: 'zywkUKWO6Yo',
    color: 'magenta' as const,
  },
  {
    id: 7,
    title: 'TELEPORTING SYSTEM',
    description: 'Player can travel wherever they want quickly.',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
    tech: ['Lua', 'Gui', 'Beta'],
    videoId: 'FZDFI-Afgnc',
    color: 'purple' as const,
  },
];

// Glitch overlay component
function GlitchOverlay({ isActive }: { isActive: boolean }) {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className="fixed inset-0 z-[60] pointer-events-none"
        >
          {/* Glitch bars */}
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scaleX: 0, x: Math.random() > 0.5 ? -100 : 100 }}
              animate={{ 
                scaleX: [0, 1, 0],
                x: [Math.random() * 200 - 100, 0, Math.random() * 200 - 100],
              }}
              transition={{ 
                duration: 0.3,
                delay: i * 0.02,
                repeat: 2,
              }}
              className="absolute w-full h-4"
              style={{
                top: `${Math.random() * 100}%`,
                background: i % 3 === 0 
                  ? 'rgba(0, 255, 255, 0.3)' 
                  : i % 3 === 1 
                    ? 'rgba(255, 0, 255, 0.3)' 
                    : 'rgba(57, 255, 20, 0.3)',
                mixBlendMode: 'screen',
              }}
            />
          ))}
          
          {/* Chromatic aberration flash */}
          <motion.div
            animate={{ 
              opacity: [0, 0.5, 0, 0.3, 0],
            }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, rgba(255,0,0,0.2), transparent, rgba(0,0,255,0.2))',
              mixBlendMode: 'screen',
            }}
          />
          
          {/* Static noise */}
          <motion.div
            animate={{ opacity: [0.1, 0.3, 0.1, 0.2, 0] }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Video modal component
function VideoModal({ videoId, isOpen, onClose }: { videoId: string; isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, rotateX: -30 }}
            animate={{ scale: 1, rotateX: 0 }}
            exit={{ scale: 0.5, rotateX: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HUD corners */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-neon-cyan" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-r-2 border-t-2 border-neon-cyan" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-2 border-b-2 border-neon-cyan" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-neon-cyan" />
            
            {/* Video container */}
            <div 
              className="w-full h-full rounded-lg overflow-hidden neon-border"
              style={{
                boxShadow: '0 0 40px hsl(180, 100%, 50%), 0 0 80px hsl(180, 100%, 50%, 0.3)',
              }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                title="Project Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            
            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute -top-12 right-0 font-orbitron text-sm text-neon-cyan hover:text-neon-magenta transition-colors flex items-center gap-2"
            >
              <span>CLOSE</span>
              <span className="text-xl">✕</span>
            </motion.button>
            
            {/* Status bar */}
            <div className="absolute -bottom-10 left-0 right-0 flex justify-between items-center font-mono text-xs text-muted-foreground">
              <span>{'// VIDEO_PLAYBACK_ACTIVE'}</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                STREAMING
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProjectCard({ project, index, onProjectClick }: { 
  project: typeof projects[0]; 
  index: number;
  onProjectClick: (videoId: string) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      style={{ perspective: '1000px' }}
    >
      <HolographicCard glowColor={project.color} className="h-full">
        <div className="p-6 md:p-8">
          {/* Project image - CLICKABLE */}
          <div 
            className="relative overflow-hidden rounded-lg mb-6 aspect-video project-clickable group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => onProjectClick(project.videoId)}
          >
            <motion.img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-500"
              animate={{ scale: isHovered ? 1.1 : 1 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            
            {/* Play button overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0.7 }}
              className="absolute inset-0 flex items-center justify-center bg-background/30"
            >
              <motion.div
                animate={{ 
                  scale: isHovered ? [1, 1.2, 1] : 1,
                  boxShadow: isHovered 
                    ? '0 0 30px hsl(180, 100%, 50%), 0 0 60px hsl(180, 100%, 50%)'
                    : '0 0 20px hsl(180, 100%, 50%)'
                }}
                transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
                className="w-20 h-20 rounded-full border-2 border-neon-cyan flex items-center justify-center bg-background/50 backdrop-blur-sm"
              >
                <div 
                  className="w-0 h-0 ml-1"
                  style={{
                    borderTop: '12px solid transparent',
                    borderLeft: '20px solid hsl(180, 100%, 50%)',
                    borderBottom: '12px solid transparent',
                    filter: 'drop-shadow(0 0 10px hsl(180, 100%, 50%))',
                  }}
                />
              </motion.div>
            </motion.div>
            
            {/* Click hint */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-xs text-neon-cyan"
            >
              {'[ CLICK TO PLAY ]'}
            </motion.div>
          </div>

          {/* Project info */}
          <h3 className="font-orbitron text-xl md:text-2xl font-bold text-foreground mb-3">
            {project.title}
          </h3>
          <p className="text-muted-foreground font-rajdhani text-sm md:text-base mb-4">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <motion.span
                key={tech}
                whileHover={{ scale: 1.1, y: -2 }}
                className="px-3 py-1 text-xs font-mono rounded-full neon-border bg-card/50"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </HolographicCard>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const [isGlitching, setIsGlitching] = useState(false);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const handleProjectClick = (videoId: string) => {
    // Trigger glitch effect
    setIsGlitching(true);
    
    // After glitch, show video
    setTimeout(() => {
      setIsGlitching(false);
      setActiveVideo(videoId);
    }, 600);
  };

  const handleCloseVideo = () => {
    setActiveVideo(null);
  };

  return (
    <section
      id="projects"
      className="relative py-32 overflow-hidden"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-20" />
      
      {/* Glitch overlay */}
      <GlitchOverlay isActive={isGlitching} />
      
      {/* Video modal */}
      <VideoModal 
        videoId={activeVideo || ''} 
        isOpen={!!activeVideo} 
        onClose={handleCloseVideo} 
      />
      
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-sm text-neon-cyan mb-4 tracking-[0.3em]"
          >
            {'// PORTFOLIO_DATABASE'}
          </motion.p>
          <GlitchText
            text="PROJECTS"
            as="h2"
            className="text-4xl md:text-6xl font-bold text-neon-magenta"
          />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-neon-cyan to-transparent"
          />
        </div>

        {/* Projects grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              index={index}
              onProjectClick={handleProjectClick}
            />
          ))}
        </div>

        {/* Owner note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 font-mono text-xs text-muted-foreground"
        >
          {'< Click any project to view demo video />'}
        </motion.p>
      </div>
    </section>
  );
}
