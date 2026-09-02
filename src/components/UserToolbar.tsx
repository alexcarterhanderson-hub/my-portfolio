import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useSite } from '@/hooks/useSite';

export default function UserToolbar() {
  const { settings } = useSite();
  const [showTop, setShowTop] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setShowTop(window.scrollY > 600));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const map: Record<string, string> = { '1': '#home', '2': '#projects', '3': '#timeline', '4': '#roblox', '5': '#reviews', '6': '#about' };
      if (map[e.key]) document.querySelector(map[e.key])?.scrollIntoView({ behavior: 'smooth' });
      if (e.key === 't') window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <motion.div
        style={{ scaleX: progress }}
        className="fixed top-0 left-0 right-0 h-1 origin-left bg-neon-gradient z-[55]"
      />

      {settings.ticker.enabled && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/80 backdrop-blur-xl overflow-hidden">
          <motion.p
            animate={{ x: ['100%', '-100%'] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
            className="text-xs text-muted-foreground py-2 whitespace-nowrap"
          >
            {settings.ticker.text}
          </motion.p>
        </div>
      )}

      {showTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed right-5 bottom-20 z-[45] w-11 h-11 rounded-full bg-card border border-border shadow-soft flex items-center justify-center text-primary hover:-translate-y-1 transition-transform"
        >
          <ArrowUp className="w-4 h-4" />
        </motion.button>
      )}
    </>
  );
}
