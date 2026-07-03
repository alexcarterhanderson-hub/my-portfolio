import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClassifiedAnimationProps {
  isActive: boolean;
  onComplete: () => void;
}

function playSound(type: 'glitch' | 'boom' | 'loading' | 'flash' | 'countdown' | 'tick') {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    if (type === 'glitch') {
      const bufferSize = ctx.sampleRate * 1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1);
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, now);
      filter.frequency.linearRampToValueAtTime(200, now + 1);
      source.connect(filter).connect(gain).connect(ctx.destination);
      source.start(now);
      source.stop(now + 1);
    } else if (type === 'loading') {
      const osc = ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(800, now + 2);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.setValueAtTime(0.08, now + 1.8);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 2);
    } else if (type === 'tick') {
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'countdown') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.3);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'boom') {
      // Massive explosion
      const bufferSize = ctx.sampleRate * 3;
      const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);
      for (let ch = 0; ch < 2; ch++) {
        const data = buffer.getChannelData(ch);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.12));
        }
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 2.5);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(500, now);
      filter.frequency.linearRampToValueAtTime(30, now + 2);
      source.connect(filter).connect(gain).connect(ctx.destination);
      source.start(now);
      source.stop(now + 3);

      // Sub bass
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(15, now + 1.5);
      const bassGain = ctx.createGain();
      bassGain.gain.setValueAtTime(0.8, now);
      bassGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
      osc.connect(bassGain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 2);

      // Secondary crackle
      const crack = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
      const crackData = crack.getChannelData(0);
      for (let i = 0; i < crackData.length; i++) {
        crackData[i] = (Math.random() > 0.95 ? (Math.random() * 2 - 1) : 0) * Math.exp(-i / (crackData.length * 0.3));
      }
      const crackSrc = ctx.createBufferSource();
      crackSrc.buffer = crack;
      const crackGain = ctx.createGain();
      crackGain.gain.setValueAtTime(0.4, now + 0.1);
      crackGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
      crackSrc.connect(crackGain).connect(ctx.destination);
      crackSrc.start(now + 0.05);
      crackSrc.stop(now + 2);
    } else if (type === 'flash') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2000, now);
      osc.frequency.exponentialRampToValueAtTime(500, now + 0.5);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  } catch {
    // Audio not available
  }
}

type Phase = 'glitch' | 'black' | 'flashlight-fall' | 'loading' | 'grenade-transform' | 'countdown' | 'explosion' | 'flash' | 'done';

export default function ClassifiedAnimation({ isActive, onComplete }: ClassifiedAnimationProps) {
  const [phase, setPhase] = useState<Phase>('glitch');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [countdownNum, setCountdownNum] = useState(3);
  const loadingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isActive) {
      setPhase('glitch');
      setLoadingProgress(0);
      setCountdownNum(3);
      return;
    }

    const timers: NodeJS.Timeout[] = [];

    playSound('glitch');

    timers.push(setTimeout(() => setPhase('black'), 1200));
    timers.push(setTimeout(() => setPhase('flashlight-fall'), 2200));
    timers.push(setTimeout(() => {
      setPhase('loading');
      playSound('loading');
    }, 3600));
    timers.push(setTimeout(() => setPhase('grenade-transform'), 6000));
    timers.push(setTimeout(() => {
      setPhase('countdown');
    }, 7200));
    // Countdown: 3, 2, 1 with tick sounds
    timers.push(setTimeout(() => { setCountdownNum(3); playSound('countdown'); }, 7200));
    timers.push(setTimeout(() => { setCountdownNum(2); playSound('countdown'); }, 8200));
    timers.push(setTimeout(() => { setCountdownNum(1); playSound('countdown'); }, 9200));
    timers.push(setTimeout(() => {
      setPhase('explosion');
      playSound('boom');
    }, 10200));
    timers.push(setTimeout(() => {
      setPhase('flash');
      playSound('flash');
    }, 12200));
    timers.push(setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 13500));

    return () => timers.forEach(clearTimeout);
  }, [isActive, onComplete]);

  // Loading bar animation
  useEffect(() => {
    if (phase === 'loading') {
      setLoadingProgress(0);
      let progress = 0;
      loadingRef.current = setInterval(() => {
        progress += Math.random() * 8 + 2;
        if (progress >= 100) {
          progress = 100;
          if (loadingRef.current) clearInterval(loadingRef.current);
        }
        setLoadingProgress(progress);
      }, 80);
    } else {
      if (loadingRef.current) clearInterval(loadingRef.current);
    }
    return () => {
      if (loadingRef.current) clearInterval(loadingRef.current);
    };
  }, [phase]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* GLITCH PHASE */}
        {phase === 'glitch' && (
          <div className="absolute inset-0 bg-background">
            {Array.from({ length: 25 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  height: `${2 + Math.random() * 10}px`,
                  background: i % 3 === 0
                    ? 'hsl(var(--neon-cyan))'
                    : i % 3 === 1
                    ? 'hsl(var(--neon-magenta))'
                    : 'hsl(var(--neon-purple))',
                  opacity: 0.8,
                }}
                animate={{
                  x: [0, Math.random() * 200 - 100, 0, Math.random() * -150, 0],
                  opacity: [0.8, 1, 0, 1, 0.8],
                  scaleX: [1, 1.5, 0.5, 2, 1],
                }}
                transition={{
                  duration: 0.12,
                  repeat: Infinity,
                  repeatType: 'mirror',
                  delay: Math.random() * 0.08,
                }}
              />
            ))}
            <motion.div
              className="absolute inset-0"
              animate={{
                x: [0, -10, 15, -5, 8, -12, 0],
                y: [0, 5, -8, 12, -3, 7, 0],
              }}
              transition={{ duration: 0.15, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 bg-foreground/10"
              animate={{ opacity: [0, 0.3, 0, 0.1, 0.4, 0] }}
              transition={{ duration: 0.08, repeat: Infinity }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ opacity: [0, 1, 0, 1, 0] }}
              transition={{ duration: 0.25, repeat: Infinity }}
            >
              <span className="font-orbitron text-4xl md:text-6xl font-black text-destructive tracking-widest"
                style={{ textShadow: '0 0 30px hsl(0, 84%, 60%), 0 0 60px hsl(0, 84%, 60%)' }}>
                SYSTEM BREACH
              </span>
            </motion.div>
          </div>
        )}

        {/* BLACK SCREEN */}
        {phase === 'black' && (
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
              }}
            />
          </motion.div>
        )}

        {/* FLASHLIGHT FALL + LOADING + GRENADE + COUNTDOWN PHASES */}
        {(phase === 'flashlight-fall' || phase === 'loading' || phase === 'grenade-transform' || phase === 'countdown') && (
          <div className="absolute inset-0 bg-black">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center">
                {/* Flashlight / Grenade */}
                <motion.div
                  className="relative"
                  initial={phase === 'flashlight-fall' ? { y: -400, rotate: -30 } : undefined}
                  animate={
                    phase === 'flashlight-fall'
                      ? { y: 0, rotate: 0 }
                      : (phase === 'grenade-transform' || phase === 'countdown')
                      ? { scale: [1, 1.2, 0.8, 1.1], rotate: [0, 10, -10, 0] }
                      : { y: 0, rotate: 0 }
                  }
                  transition={
                    phase === 'flashlight-fall'
                      ? { type: 'spring', damping: 10, stiffness: 80 }
                      : (phase === 'grenade-transform' || phase === 'countdown')
                      ? { duration: 0.8, repeat: Infinity }
                      : {}
                  }
                >
                  {phase !== 'grenade-transform' && phase !== 'countdown' ? (
                    // FLASHLIGHT
                    <div className="relative w-16 h-40 md:w-20 md:h-48">
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 md:w-10 h-24 md:h-28 rounded-b-lg"
                        style={{
                          background: 'linear-gradient(180deg, hsl(220, 15%, 30%) 0%, hsl(220, 15%, 18%) 100%)',
                          border: '1px solid hsl(var(--neon-cyan) / 0.3)',
                          boxShadow: phase === 'loading' ? '0 0 15px hsl(var(--neon-cyan) / 0.3)' : 'none',
                        }}
                      >
                        {[0, 1, 2, 3, 4].map(i => (
                          <div key={i} className="w-full h-px bg-white/10" style={{ marginTop: `${4 + i * 5}px` }} />
                        ))}
                        <motion.div
                          className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
                          style={{
                            background: phase === 'loading'
                              ? 'radial-gradient(circle, hsl(var(--neon-green)), hsl(var(--neon-green) / 0.5))'
                              : 'hsl(0, 0%, 30%)',
                          }}
                          animate={phase === 'loading' ? { opacity: [1, 0.5, 1], scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        />
                      </div>
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-16 md:h-20 rounded-t-xl"
                        style={{
                          width: '3.5rem',
                          background: 'linear-gradient(180deg, hsl(220, 15%, 35%) 0%, hsl(220, 15%, 22%) 100%)',
                          border: '1px solid hsl(var(--neon-cyan) / 0.4)',
                        }}
                      />
                      <motion.div
                        className="absolute top-1 left-1/2 -translate-x-1/2 w-10 md:w-12 h-10 md:h-12 rounded-full"
                        style={{
                          background: phase === 'loading'
                            ? 'radial-gradient(circle, hsl(50, 100%, 90%) 0%, hsl(50, 100%, 70%) 50%, hsl(50, 80%, 50%) 100%)'
                            : 'radial-gradient(circle, hsl(220, 10%, 20%) 0%, hsl(220, 10%, 10%) 100%)',
                        }}
                        animate={phase === 'loading' ? {
                          boxShadow: [
                            '0 0 40px hsl(50, 100%, 70%), 0 0 80px hsl(50, 100%, 60%)',
                            '0 0 60px hsl(50, 100%, 80%), 0 0 120px hsl(50, 100%, 70%)',
                            '0 0 40px hsl(50, 100%, 70%), 0 0 80px hsl(50, 100%, 60%)',
                          ],
                        } : {}}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                      {phase === 'loading' && (
                        <motion.div
                          className="absolute top-0 left-1/2 -translate-x-1/2"
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: [0.2, 0.4, 0.2], scaleY: 1 }}
                          transition={{ opacity: { duration: 1.5, repeat: Infinity }, scaleY: { duration: 0.5 } }}
                          style={{
                            width: '200px',
                            height: '500px',
                            background: 'linear-gradient(180deg, hsl(50, 100%, 80% / 0.4) 0%, transparent 100%)',
                            clipPath: 'polygon(35% 0%, 65% 0%, 100% 100%, 0% 100%)',
                            transformOrigin: 'top center',
                            transform: 'translateY(-500px)',
                            filter: 'blur(10px)',
                          }}
                        />
                      )}
                    </div>
                  ) : (
                    // GRENADE
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                      className="relative"
                    >
                      <div className="w-20 h-28 relative">
                        <div className="absolute bottom-0 w-20 h-24 rounded-b-lg rounded-t-md"
                          style={{
                            background: 'linear-gradient(180deg, hsl(120, 20%, 25%) 0%, hsl(120, 25%, 15%) 100%)',
                            border: '1px solid hsl(var(--neon-green) / 0.4)',
                            boxShadow: '0 0 20px hsl(var(--neon-green) / 0.2)',
                          }}
                        >
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div key={`h${i}`} className="absolute w-full h-px bg-white/10" style={{ top: `${15 + i * 14}%` }} />
                          ))}
                          {Array.from({ length: 4 }).map((_, i) => (
                            <div key={`v${i}`} className="absolute h-full w-px bg-white/10" style={{ left: `${20 + i * 20}%` }} />
                          ))}
                        </div>
                        <motion.div
                          className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-8"
                          style={{
                            background: 'hsl(40, 10%, 40%)',
                            borderRadius: '2px 2px 0 0',
                            border: '1px solid hsl(var(--neon-cyan) / 0.3)',
                          }}
                          animate={{ rotate: [0, -5, 0, 5, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity }}
                        />
                        <motion.div
                          className="absolute -top-1 -right-3 w-6 h-6 rounded-full border-2"
                          style={{ borderColor: 'hsl(var(--neon-cyan) / 0.6)' }}
                          animate={{ opacity: [1, 0.5, 1], scale: [1, 1.1, 1] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      </div>
                      <motion.div
                        className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-xs text-destructive"
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      >
                        ⚠ DETONATING ⚠
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>

                {/* LOADING BAR */}
                {phase === 'loading' && (
                  <motion.div
                    className="mt-8 w-64"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between font-mono text-xs text-neon-cyan/70 mb-2">
                      <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>
                        INITIALIZING...
                      </motion.span>
                      <span>{Math.min(100, Math.floor(loadingProgress))}%</span>
                    </div>
                    <div className="h-3 bg-white/5 border border-neon-cyan/30 rounded-sm overflow-hidden relative">
                      <motion.div
                        className="h-full rounded-sm relative overflow-hidden"
                        style={{
                          width: `${Math.min(100, loadingProgress)}%`,
                          background: 'linear-gradient(90deg, hsl(var(--neon-cyan)), hsl(var(--neon-green)))',
                          boxShadow: '0 0 15px hsl(var(--neon-cyan) / 0.5)',
                          transition: 'width 0.1s ease-out',
                        }}
                      >
                        <motion.div
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.4), transparent)',
                          }}
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                        />
                      </motion.div>
                      <motion.div
                        className="absolute top-0 h-full w-0.5 bg-white/50"
                        style={{ left: `${Math.min(100, loadingProgress)}%` }}
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 0.3, repeat: Infinity }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between font-mono text-[10px] text-neon-cyan/40">
                      <motion.span animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 0.8, repeat: Infinity }}>
                        {'>'} ACCESSING MAINFRAME
                      </motion.span>
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>
                        ▓▓▒░
                      </motion.span>
                    </div>
                  </motion.div>
                )}

                {/* COUNTDOWN */}
                {phase === 'countdown' && (
                  <motion.div
                    className="mt-12 flex flex-col items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      key={countdownNum}
                      className="font-orbitron text-8xl md:text-9xl font-black text-destructive"
                      initial={{ scale: 2, opacity: 0 }}
                      animate={{ scale: [2, 1, 0.9], opacity: [0, 1, 0.8] }}
                      transition={{ duration: 0.8 }}
                      style={{ textShadow: '0 0 40px hsl(0, 84%, 60%), 0 0 80px hsl(0, 84%, 60%), 0 0 120px hsl(0, 60%, 40%)' }}
                    >
                      {countdownNum}
                    </motion.div>
                    <motion.div
                      className="font-mono text-sm text-destructive/70 mt-4 tracking-[0.3em]"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    >
                      DETONATION IN...
                    </motion.div>
                    {/* Pulsing ring around countdown */}
                    <motion.div
                      className="absolute w-48 h-48 rounded-full border-2 border-destructive/30"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5],
                        borderColor: ['hsl(0, 84%, 60% / 0.5)', 'hsl(0, 84%, 60% / 0)', 'hsl(0, 84%, 60% / 0.5)'],
                      }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  </motion.div>
                )}

                {/* Grenade transform label */}
                {phase === 'grenade-transform' && (
                  <motion.div
                    className="mt-12 font-mono text-sm text-destructive text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.4, repeat: Infinity }}
                    style={{ textShadow: '0 0 20px hsl(0, 84%, 60%)' }}
                  >
                    PAYLOAD ARMED — STANDBY
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* EXPLOSION PHASE - INTENSE */}
        {phase === 'explosion' && (
          <motion.div
            className="absolute inset-0 bg-black overflow-hidden"
            animate={{
              x: [0, -30, 25, -20, 15, -10, 8, -5, 3, 0],
              y: [0, 20, -25, 15, -10, 18, -8, 5, -3, 0],
            }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            {/* Central explosion fireball */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="rounded-full"
                initial={{ width: 10, height: 10, opacity: 1 }}
                animate={{
                  width: [10, 600, 1200, 2500],
                  height: [10, 600, 1200, 2500],
                  opacity: [1, 1, 0.6, 0],
                }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                style={{
                  background: 'radial-gradient(circle, hsl(50, 100%, 95%), hsl(40, 100%, 70%), hsl(20, 100%, 50%), hsl(0, 100%, 35%), transparent)',
                  boxShadow: '0 0 200px hsl(30, 100%, 50%), 0 0 400px hsl(20, 100%, 40%)',
                }}
              />
            </motion.div>

            {/* Secondary explosion wave */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
            >
              <motion.div
                className="rounded-full"
                initial={{ width: 0, height: 0, opacity: 0.8 }}
                animate={{
                  width: [0, 400, 1800],
                  height: [0, 400, 1800],
                  opacity: [0.8, 0.5, 0],
                }}
                transition={{ duration: 1.2, delay: 0.15, ease: 'easeOut' }}
                style={{
                  background: 'radial-gradient(circle, hsl(30, 100%, 80% / 0.5), hsl(0, 100%, 50% / 0.3), transparent)',
                }}
              />
            </motion.div>

            {/* Flying debris/sparks - MORE particles */}
            {Array.from({ length: 60 }).map((_, i) => {
              const angle = (i / 60) * Math.PI * 2 + (Math.random() * 0.3);
              const distance = 200 + Math.random() * 800;
              const size = 1 + Math.random() * 4;
              return (
                <motion.div
                  key={`spark-${i}`}
                  className="absolute rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    width: size,
                    height: size,
                    background: i % 4 === 0 ? 'hsl(50, 100%, 80%)' : i % 4 === 1 ? 'hsl(30, 100%, 60%)' : i % 4 === 2 ? 'hsl(0, 100%, 50%)' : 'hsl(40, 100%, 70%)',
                    boxShadow: `0 0 ${6 + Math.random() * 10}px ${i % 2 === 0 ? 'hsl(30, 100%, 60%)' : 'hsl(50, 100%, 70%)'}`,
                  }}
                  initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                  animate={{
                    x: Math.cos(angle) * distance,
                    y: Math.sin(angle) * distance + (Math.random() * 100),
                    scale: 0,
                    opacity: 0,
                  }}
                  transition={{ duration: 0.8 + Math.random() * 1, ease: 'easeOut' }}
                />
              );
            })}

            {/* Ember trails */}
            {Array.from({ length: 20 }).map((_, i) => {
              const angle = Math.random() * Math.PI * 2;
              const dist = 100 + Math.random() * 600;
              return (
                <motion.div
                  key={`ember-${i}`}
                  className="absolute"
                  style={{
                    top: '50%',
                    left: '50%',
                    width: 2,
                    height: 8 + Math.random() * 15,
                    background: `linear-gradient(to bottom, hsl(40, 100%, 80%), hsl(20, 100%, 50%), transparent)`,
                    borderRadius: '2px',
                    transformOrigin: 'center top',
                    rotate: `${(angle * 180) / Math.PI}deg`,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    opacity: 0,
                    scale: 0.3,
                  }}
                  transition={{ duration: 1 + Math.random() * 0.8, ease: 'easeOut', delay: Math.random() * 0.2 }}
                />
              );
            })}

            {/* Shockwave rings - more rings */}
            {[0, 0.1, 0.25, 0.4, 0.6].map((delay, i) => (
              <motion.div
                key={`ring-${i}`}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                initial={{ width: 0, height: 0, opacity: 0.9 }}
                animate={{
                  width: [0, 2000],
                  height: [0, 2000],
                  opacity: [0.9, 0],
                }}
                transition={{ duration: 1.5, delay, ease: 'easeOut' }}
                style={{
                  border: `${3 - i * 0.4}px solid hsl(${30 + i * 10}, 100%, ${60 - i * 5}%)`,
                  boxShadow: `0 0 ${40 - i * 5}px hsl(${30 + i * 10}, 100%, 50%)`,
                }}
              />
            ))}

            {/* Smoke puffs */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`smoke-${i}`}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                initial={{ width: 20, height: 20, opacity: 0.4 }}
                animate={{
                  width: [20, 200 + Math.random() * 300],
                  height: [20, 200 + Math.random() * 300],
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  opacity: [0.4, 0],
                }}
                transition={{ duration: 1.5 + Math.random(), delay: 0.1 + i * 0.08 }}
                style={{
                  background: `radial-gradient(circle, hsl(0, 0%, ${20 + Math.random() * 20}% / 0.5), transparent)`,
                  filter: 'blur(20px)',
                }}
              />
            ))}

            {/* BOOM text with heavy shake */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                x: [0, -40, 30, -25, 20, -15, 10, -5, 0],
                y: [0, 25, -30, 20, -15, 25, -10, 5, 0],
              }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              <motion.span
                className="font-orbitron text-6xl md:text-8xl font-black text-destructive"
                initial={{ scale: 4, opacity: 1 }}
                animate={{ scale: [4, 1.5, 1], opacity: [1, 0.8, 0] }}
                transition={{ duration: 1.8 }}
                style={{ textShadow: '0 0 60px hsl(0, 84%, 60%), 0 0 120px hsl(30, 100%, 50%), 0 0 200px hsl(20, 100%, 40%)' }}
              >
                BOOM
              </motion.span>
            </motion.div>

            {/* Screen flash overlay */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.8, 0, 0.3, 0] }}
              transition={{ duration: 0.6, times: [0, 0.1, 0.3, 0.5, 1] }}
              style={{ background: 'hsl(40, 100%, 80%)' }}
            />
          </motion.div>
        )}

        {/* FLASH PHASE */}
        {phase === 'flash' && (
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 1] }}
            transition={{ duration: 1, times: [0, 0.2, 0.8, 1] }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
