import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlitchText from './GlitchText';
import { playBootSound, playDataSound, playWhooshSound } from '@/lib/sounds';

export default function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);

  const stableComplete = useCallback(onComplete, [onComplete]);

  useEffect(() => {
    playBootSound();
    
    const timers = [
      setTimeout(() => { setPhase(1); playDataSound(); }, 500),
      setTimeout(() => { setPhase(2); playDataSound(); }, 1500),
      setTimeout(() => { setPhase(3); playDataSound(); }, 2500),
      setTimeout(() => { setPhase(4); playWhooshSound(); }, 3500),
      setTimeout(() => stableComplete(), 4500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [stableComplete]);

  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-[100] bg-background flex items-center justify-center overflow-hidden"
      >
        {/* Background grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px]"
        />

        {/* Scan lines */}
        <motion.div
          animate={{ y: ['0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)',
          }}
        />

        {/* Particle field */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: 2 + Math.random() * 3,
              height: 2 + Math.random() * 3,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: i % 2 === 0 ? 'hsl(var(--neon-cyan))' : 'hsl(var(--neon-magenta))',
            }}
            animate={{
              y: [0, -30 - Math.random() * 50, 0],
              x: [0, (Math.random() - 0.5) * 40, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <div className="text-center relative z-10">
          {/* Boot sequence */}
          {phase >= 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-mono text-xs text-neon-green mb-8 space-y-1"
            >
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {'>_ INITIALIZING SYSTEM...'}
              </motion.p>
              {phase >= 1 && (
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {'>_ LOADING NEURAL NETWORKS... [OK]'}
                </motion.p>
              )}
              {phase >= 2 && (
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {'>_ CONNECTING TO CYBERSPACE... [OK]'}
                </motion.p>
              )}
              {phase >= 3 && (
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {'>_ SYSTEM READY. WELCOME.'}
                </motion.p>
              )}
            </motion.div>
          )}

          {/* Main logo reveal */}
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: 'spring' }}
            >
              <GlitchText
                text="Edward"
                as="h1"
                className="text-6xl md:text-8xl font-black text-neon-cyan tracking-wider"
              />
              <GlitchText
                text="DEVELOPER"
                as="h1"
                className="text-3xl md:text-5xl font-bold text-neon-magenta tracking-wider mt-2"
              />
            </motion.div>
          )}

          {/* Loading bar */}
          {phase >= 1 && phase < 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-12 w-64 mx-auto"
            >
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: `${(phase / 3) * 100}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-neon-cyan"
                  style={{ boxShadow: '0 0 10px hsl(180, 100%, 50%)' }}
                />
              </div>
              <p className="font-mono text-xs text-muted-foreground mt-2">
                LOADING... {Math.round((phase / 3) * 100)}%
              </p>
            </motion.div>
          )}

          {/* Enter prompt */}
          {phase >= 3 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="mt-8 font-mono text-sm text-neon-cyan"
            >
              {'> ENTERING CYBERSPACE...'}
            </motion.p>
          )}
        </div>

        {/* Corner decorations with pulse */}
        {[
          { pos: 'top-10 left-10', border: 'border-l-2 border-t-2', color: 'border-neon-cyan/50' },
          { pos: 'top-10 right-10', border: 'border-r-2 border-t-2', color: 'border-neon-magenta/50' },
          { pos: 'bottom-10 left-10', border: 'border-l-2 border-b-2', color: 'border-neon-magenta/50' },
          { pos: 'bottom-10 right-10', border: 'border-r-2 border-b-2', color: 'border-neon-cyan/50' },
        ].map((corner, i) => (
          <motion.div
            key={i}
            className={`absolute ${corner.pos} w-20 h-20 ${corner.border} ${corner.color}`}
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
