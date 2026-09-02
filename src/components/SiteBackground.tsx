import { useMemo } from 'react';
import { useSite } from '@/hooks/useSite';
import { usePerformance } from '@/hooks/usePerformance';
import { DEFAULT_SETTINGS, type BackgroundSettings } from '@/lib/siteContent';

/**
 * Layered animated page backdrop.
 * Pattern layer + optional drifting colour blobs + optional paper grain.
 */
export default function SiteBackground() {
  const { settings } = useSite();
  const { reducedMotion, enableHeavyFx } = usePerformance();
  const bg = settings.background ?? DEFAULT_SETTINGS.background;

  const animate = bg.animated && !reducedMotion;
  const dur = (base: number) => `${Math.round((base * 100) / Math.max(20, bg.speed))}s`;

  const a = `hsl(${bg.colorA})`;
  const b = `hsl(${bg.colorB})`;
  const c = `hsl(${bg.colorC})`;
  const alpha = Math.max(0, Math.min(100, bg.opacity)) / 100;

  const pattern = useMemo(() => patternStyle(bg, a, b, c), [bg, a, b, c]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* base theme colour */}
      <div className="absolute inset-0 bg-background" />

      {/* custom image */}
      {bg.preset === 'image' && bg.imageUrl && (
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `url(${bg.imageUrl})`,
            filter: `blur(${bg.imageBlur}px)`,
            transform: bg.imageBlur ? 'scale(1.06)' : undefined,
            opacity: alpha,
          }}
        />
      )}
      {bg.preset === 'image' && (
        <div className="absolute inset-0 bg-background" style={{ opacity: bg.imageDim / 100 }} />
      )}

      {/* pattern layer */}
      {bg.preset !== 'image' && bg.preset !== 'plain' && (
        <div
          className={animate ? 'absolute inset-0 bg-pan' : 'absolute inset-0'}
          style={{ ...pattern, opacity: alpha, animationDuration: dur(60) }}
        />
      )}

      {/* drifting colour blobs */}
      {bg.blobs && enableHeavyFx && (
        <>
          <div
            className={`absolute -top-32 -left-24 w-[38rem] h-[38rem] rounded-full blur-[130px] ${animate ? 'animate-blob' : ''}`}
            style={{ background: a, opacity: 0.35 * alpha + 0.12, animationDuration: dur(18) }}
          />
          <div
            className={`absolute top-1/3 -right-32 w-[34rem] h-[34rem] rounded-full blur-[130px] ${animate ? 'animate-blob' : ''}`}
            style={{ background: b, opacity: 0.3 * alpha + 0.1, animationDuration: dur(24), animationDelay: '-6s' }}
          />
          <div
            className={`absolute bottom-[-12rem] left-1/4 w-[32rem] h-[32rem] rounded-full blur-[140px] ${animate ? 'animate-blob' : ''}`}
            style={{ background: c, opacity: 0.28 * alpha + 0.1, animationDuration: dur(30), animationDelay: '-12s' }}
          />
        </>
      )}

      {/* paper grain */}
      {bg.grain && <div className="absolute inset-0 paper-grain" />}
    </div>
  );
}

function patternStyle(bg: BackgroundSettings, a: string, b: string, c: string): React.CSSProperties {
  switch (bg.preset) {
    case 'paper':
      return {
        backgroundImage: `radial-gradient(hsl(var(--ink) / 0.10) 1.4px, transparent 1.4px)`,
        backgroundSize: '22px 22px',
      };
    case 'doodle':
      return {
        backgroundImage: `linear-gradient(hsl(var(--ink) / 0.09) 1.5px, transparent 1.5px),
          linear-gradient(90deg, hsl(var(--ink) / 0.09) 1.5px, transparent 1.5px),
          radial-gradient(${a} 2px, transparent 2px)`,
        backgroundSize: '46px 46px, 46px 46px, 138px 138px',
      };
    case 'dots':
      return {
        backgroundImage: `radial-gradient(${a} 7px, transparent 8px), radial-gradient(${b} 5px, transparent 6px)`,
        backgroundSize: '90px 90px, 90px 90px',
        backgroundPosition: '0 0, 45px 45px',
      };
    case 'confetti':
      return {
        backgroundImage: `radial-gradient(${a} 3px, transparent 4px),
          radial-gradient(${b} 4px, transparent 5px),
          radial-gradient(${c} 3px, transparent 4px),
          radial-gradient(hsl(var(--ink) / 0.35) 2px, transparent 3px)`,
        backgroundSize: '120px 120px, 170px 170px, 210px 210px, 90px 90px',
        backgroundPosition: '0 0, 60px 30px, 30px 90px, 80px 70px',
      };
    case 'aurora':
      return {
        backgroundImage: `radial-gradient(60% 50% at 20% 20%, ${a} 0%, transparent 60%),
          radial-gradient(55% 45% at 80% 30%, ${b} 0%, transparent 60%),
          radial-gradient(60% 50% at 50% 85%, ${c} 0%, transparent 60%)`,
        backgroundSize: '200% 200%',
      };
    case 'mesh':
      return {
        backgroundImage: `linear-gradient(120deg, ${a} 0%, transparent 45%),
          linear-gradient(250deg, ${b} 0%, transparent 50%),
          linear-gradient(20deg, ${c} 0%, transparent 55%)`,
        backgroundSize: '180% 180%',
      };
    case 'stripes':
      return {
        backgroundImage: `repeating-linear-gradient(45deg, ${a} 0 22px, transparent 22px 44px, ${b} 44px 66px, transparent 66px 88px)`,
        backgroundSize: '200% 200%',
      };
    case 'rainbow':
      return {
        backgroundImage: `linear-gradient(115deg, ${a}, ${b}, ${c}, ${a})`,
        backgroundSize: '400% 400%',
      };
    default:
      return {};
  }
}
