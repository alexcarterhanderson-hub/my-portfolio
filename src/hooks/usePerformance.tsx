import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export type PerfMode = 'ultra' | 'balanced' | 'lite';

interface PerfValue {
  mode: PerfMode;
  setMode: (m: PerfMode) => void;
  auto: boolean;
  reducedMotion: boolean;
  enable3D: boolean;
  enableParticles: boolean;
  enableHeavyFx: boolean;
  particleCount: number;
  starCount: number;
  dpr: [number, number];
}

const PerfContext = createContext<PerfValue | null>(null);

function detectMode(): PerfMode {
  if (typeof navigator === 'undefined') return 'balanced';
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (mobile || mem <= 4 || cores <= 4) return 'lite';
  if (mem <= 8 || cores <= 8) return 'balanced';
  return 'ultra';
}

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<PerfMode | null>(
    () => (localStorage.getItem('perf-mode') as PerfMode | null) ?? null,
  );
  const [detected] = useState<PerfMode>(() => detectMode());
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const mode = stored ?? detected;

  const value = useMemo<PerfValue>(() => {
    const effective: PerfMode = reducedMotion ? 'lite' : mode;
    return {
      mode,
      auto: stored === null,
      reducedMotion,
      setMode: (m: PerfMode) => {
        localStorage.setItem('perf-mode', m);
        setStored(m);
      },
      enable3D: effective === 'ultra' || effective === 'balanced',
      enableParticles: effective === 'ultra',
      enableHeavyFx: effective !== 'lite',
      particleCount: effective === 'ultra' ? 300 : effective === 'balanced' ? 120 : 0,
      starCount: effective === 'ultra' ? 1000 : effective === 'balanced' ? 350 : 0,
      dpr: effective === 'ultra' ? [1, 2] : [1, 1.25],
    };
  }, [mode, stored, reducedMotion]);

  useEffect(() => {
    document.documentElement.dataset.perf = value.mode;
  }, [value.mode]);

  return <PerfContext.Provider value={value}>{children}</PerfContext.Provider>;
}

export function usePerformance(): PerfValue {
  const ctx = useContext(PerfContext);
  if (!ctx) throw new Error('usePerformance must be used inside PerformanceProvider');
  return ctx;
}
