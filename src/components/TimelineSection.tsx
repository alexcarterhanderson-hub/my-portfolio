import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import HolographicCard from './HolographicCard';
import GlitchText from './GlitchText';
import { playDataSound, playTypingSound, playScanSound } from '@/lib/sounds';

type StatusColor = 'cyan' | 'magenta' | 'purple' | 'green';

interface Milestone {
  id: number;
  year: string;
  codename: string;
  description: string;
  status: string;
  statusColor: StatusColor;
  progress: number;
}

const milestones: Milestone[] = [
  {
    id: 1,
    year: '2020',
    codename: 'FIRST CONTACT',
    description: 'Discovered ████. Compiled first script. Subject demonstrated unusual aptitude for logic systems.',
    status: 'RESOLVED',
    statusColor: 'green',
    progress: 100,
  },
  {
    id: 2,
    year: '2021',
    codename: 'OPERATION: DO BIG STUDIOS',
    description: 'Recruited by ██ ███ ██████ to develop and ship features across their games. Contract fulfilled.',
    status: 'RESOLVED',
    statusColor: 'green',
    progress: 100,
  },
  {
    id: 3,
    year: '2022',
    codename: 'OPERATION: BLOX FRUITS',
    description: 'Recruited into the ████ ██████ dev team. Shipped UI systems and gameplay mechanics at scale.',
    status: 'ACTIVE',
    statusColor: 'cyan',
    progress: 95,
  },
  {
    id: 4,
    year: '2024',
    codename: 'OPERATION: NCC GROUP',
    description: 'Embedded at ███ █████ as Head Of CyberSecurity. Oversees offensive/defensive operations at ██████-7 clearance.',
    status: 'OMEGA-7',
    statusColor: 'magenta',
    progress: 100,
  },
  {
    id: 5,
    year: '2025',
    codename: 'OPERATION: DO SMALL STUDIOS',
    description: 'Contracted by ██ █████ ██████ as lead operative. Currently deployed — building and shipping their titles.',
    status: 'ACTIVE',
    statusColor: 'cyan',
    progress: 88,
  },
  {
    id: 6,
    year: '2026',
    codename: 'PROJECT: PPN SUPPORT',
    description: 'Autonomous support bot deployed via DM relay protocol. Bridges members with staff in real time. Uplink stable.',
    status: 'ONLINE',
    statusColor: 'purple',
    progress: 100,
  },
];

const colorMap: Record<StatusColor, string> = {
  cyan: 'hsl(180, 100%, 50%)',
  magenta: 'hsl(300, 100%, 50%)',
  purple: 'hsl(270, 100%, 60%)',
  green: 'hsl(110, 100%, 54%)',
};

// Scrambles to settle on the final text
function ScrambleText({ text, active, delay = 0 }: { text: string; active: boolean; delay?: number }) {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    if (!active) return;
    const chars = '!<>-_\\/[]{}—=+*^?#█▓▒░ABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';
    let frame = 0;
    const total = 24;
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        const progress = frame / total;
        const out = text
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            if (i / text.length < progress) return ch;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        setDisplay(out);
        frame++;
        if (frame > total) {
          clearInterval(interval);
          setDisplay(text);
        }
      }, 40);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(startTimer);
  }, [active, text, delay]);
  return <span>{display}</span>;
}

// Typewriter w/ blink cursor that stops on completion
function TypeLine({ text, active, delay = 0 }: { text: string; active: boolean; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!active) return;
    setDisplayed('');
    setDone(false);
    const startTimer = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          if (i % 3 === 0) playTypingSound();
          i++;
        } else {
          clearInterval(interval);
          setDone(true);
        }
      }, 22);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(startTimer);
  }, [active, text, delay]);
  return (
    <span>
      {displayed}
      {!done && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="text-neon-cyan"
        >
          █
        </motion.span>
      )}
    </span>
  );
}

function TimelineNode({ color, active, index }: { color: StatusColor; active: boolean; index: number }) {
  const c = colorMap[color];
  useEffect(() => {
    if (active) {
      const t = setTimeout(() => playDataSound(), index * 80);
      return () => clearTimeout(t);
    }
  }, [active, index]);
  return (
    <div className="relative w-8 h-8 flex items-center justify-center">
      {/* Outer rotating dashed ring */}
      <motion.div
        className="absolute inset-[-10px] rounded-full"
        style={{ border: `1px dashed ${c}`, opacity: 0.5 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      {/* Pulsing halo */}
      <motion.div
        className="absolute inset-[-4px] rounded-full"
        style={{ background: c, filter: 'blur(8px)' }}
        animate={{ opacity: active ? [0.3, 0.7, 0.3] : 0 }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      {/* Core */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: active ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 12 }}
        className="w-4 h-4 rounded-full relative z-10"
        style={{
          background: c,
          boxShadow: `0 0 12px ${c}, 0 0 24px ${c}`,
        }}
      />
      {/* Flash on unlock */}
      <motion.div
        className="absolute inset-[-16px] rounded-full pointer-events-none"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={active ? { opacity: [0, 0.8, 0], scale: [0.5, 2, 2.4] } : {}}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ border: `2px solid ${c}` }}
      />
    </div>
  );
}

function MilestoneCard({ milestone, index }: { milestone: Milestone; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = index % 2 === 0;
  const c = colorMap[milestone.statusColor];

  return (
    <div ref={ref} className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center mb-16 md:mb-24">
      {/* LEFT cell */}
      <div className={`md:order-1 ${isLeft ? '' : 'md:invisible md:pointer-events-none md:h-0'}`}>
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -60, rotateY: 15 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ perspective: 1000 }}
          >
            <HolographicCard glowColor={milestone.statusColor}>
              <CardBody milestone={milestone} isInView={isInView} c={c} />
            </HolographicCard>
          </motion.div>
        )}
      </div>

      {/* NODE (center) */}
      <div className="md:order-2 absolute left-0 md:relative md:left-auto flex justify-center">
        <TimelineNode color={milestone.statusColor} active={isInView} index={index} />
      </div>

      {/* RIGHT cell */}
      <div className={`md:order-3 ml-12 md:ml-0 ${!isLeft ? '' : 'md:invisible md:pointer-events-none md:h-0'}`}>
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 60, rotateY: -15 }}
            animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ perspective: 1000 }}
          >
            <HolographicCard glowColor={milestone.statusColor}>
              <CardBody milestone={milestone} isInView={isInView} c={c} />
            </HolographicCard>
          </motion.div>
        )}
        {/* On mobile, always render below the node */}
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="md:hidden"
          >
            <HolographicCard glowColor={milestone.statusColor}>
              <CardBody milestone={milestone} isInView={isInView} c={c} />
            </HolographicCard>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function CardBody({ milestone, isInView, c }: { milestone: Milestone; isInView: boolean; c: string }) {
  return (
    <div className="p-5 md:p-6 font-rajdhani">
      {/* Year + status row */}
      <div className="flex items-center justify-between mb-3 font-mono text-xs">
        <span className="text-muted-foreground tracking-widest">[{milestone.year}]</span>
        <motion.span
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="px-2 py-0.5 border"
          style={{ color: c, borderColor: `${c}80`, textShadow: `0 0 8px ${c}` }}
        >
          {milestone.status}
        </motion.span>
      </div>

      {/* Codename */}
      <h3
        className="font-orbitron text-lg md:text-xl font-bold mb-3 tracking-wider"
        style={{ color: c, textShadow: `0 0 12px ${c}` }}
      >
        <ScrambleText text={milestone.codename} active={isInView} delay={200} />
      </h3>

      {/* Description */}
      <p className="text-foreground/80 text-sm md:text-base mb-4 min-h-[3em]">
        <TypeLine text={milestone.description} active={isInView} delay={1200} />
      </p>

      {/* Progress bar */}
      <div className="mb-2 flex justify-between items-center font-mono text-[10px] text-muted-foreground">
        <span>// MISSION_INTEGRITY</span>
        <span style={{ color: c }}>{milestone.progress}%</span>
      </div>
      <div className="h-1.5 bg-muted/40 overflow-hidden border border-border/40">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${milestone.progress}%` } : {}}
          transition={{ duration: 1.4, delay: 1.6, ease: 'easeOut' }}
          className="h-full relative"
          style={{
            background: c,
            boxShadow: `0 0 10px ${c}, 0 0 20px ${c}80`,
          }}
        >
          <motion.div
            animate={{ x: ['-100%', '300%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: 2.8 }}
            className="absolute inset-0 w-1/3"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)' }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export default function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const spineRef = useRef<HTMLDivElement>(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { scrollYProgress } = useScroll({
    target: spineRef,
    offset: ['start 80%', 'end 20%'],
  });
  const spineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const pulseY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    if (sectionInView) playScanSound();
  }, [sectionInView]);

  return (
    <section ref={sectionRef} id="timeline" className="relative py-32 overflow-hidden">
      {/* Background grid + ambient glow */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-10" />
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[140px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* Matrix-ish background streams */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.05]">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute font-mono text-[10px] text-neon-green whitespace-pre leading-4"
            style={{ left: `${10 + i * 15}%` }}
            animate={{ y: ['-30%', '120%'] }}
            transition={{ duration: 10 + i * 3, repeat: Infinity, ease: 'linear', delay: i }}
          >
            {Array.from({ length: 30 })
              .map(() => (Math.random() > 0.5 ? '1' : '0'))
              .join('\n')}
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="font-mono text-sm text-neon-green mb-4 tracking-[0.3em]"
          >
            {'// MISSION_LOG'}
          </motion.p>
          <GlitchText
            text="OPERATIVE TIMELINE"
            as="h2"
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-neon-cyan"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 font-mono text-xs text-muted-foreground tracking-widest"
          >
            CASE FILE: PHANTOM_DEV — CHRONOLOGICAL RECORD
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-neon-green to-transparent"
          />
        </div>

        {/* Timeline body */}
        <div ref={spineRef} className="relative max-w-5xl mx-auto">
          {/* Spine (mobile: left, desktop: center) */}
          <div className="absolute left-3 md:left-1/2 top-0 bottom-0 md:-translate-x-1/2 w-px pointer-events-none">
            {/* Faint static rail */}
            <div className="absolute inset-0 bg-neon-cyan/10" />
            {/* Animated drawing line */}
            <motion.div
              className="absolute inset-x-0 top-0 origin-top"
              style={{
                scaleY: spineScale,
                height: '100%',
                background: 'linear-gradient(180deg, hsl(180,100%,50%/0.8), hsl(300,100%,50%/0.6), hsl(270,100%,60%/0.8))',
                boxShadow: '0 0 8px hsl(180,100%,50%), 0 0 16px hsl(180,100%,50%/0.5)',
              }}
            />
            {/* Traveling pulse */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-3 h-16 rounded-full pointer-events-none"
              style={{
                top: pulseY,
                background: 'radial-gradient(ellipse at center, hsl(180,100%,80%) 0%, transparent 70%)',
                filter: 'blur(4px)',
              }}
            />
          </div>

          {/* Cards */}
          <div className="relative pl-0">
            {milestones.map((m, i) => (
              <MilestoneCard key={m.id} milestone={m} index={i} />
            ))}
          </div>
        </div>

        {/* Footer line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 font-mono text-xs text-muted-foreground/70"
        >
          {'< END OF DECLASSIFIED RECORD — further entries pending clearance />'}
        </motion.p>
      </div>
    </section>
  );
}
