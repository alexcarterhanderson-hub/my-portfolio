import { motion } from 'framer-motion';
import { ArrowDown, Pencil, Sparkles } from 'lucide-react';
import { useSite } from '@/hooks/useSite';
import { useRoblox } from '@/hooks/useRoblox';

export default function HeroSection() {
  const { settings } = useSite();
  const { data } = useRoblox(settings.roblox.userId, settings.roblox.enabled);
  const hero = settings.hero;

  return (
    <section id="home" className="relative flex items-center pt-28 sm:pt-32 pb-14 md:pb-20 overflow-hidden md:min-h-[min(900px,100svh)]">
      {/* Doodle stickers floating around the page */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Pencil className="absolute bottom-24 left-[16%] w-8 h-8 text-neon-green wobble" />
      </div>

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] gap-12 lg:gap-16 items-center">
          <div className="min-w-0">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="kicker"
            >
              <Sparkles className="w-3.5 h-3.5" /> {hero.kicker}
            </motion.span>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-6 w-fit"
            >
              <h1 className="sketch-title text-6xl sm:text-7xl md:text-8xl">
                Edward Dev
              </h1>
              {/* Hand-drawn marker underline */}
              <svg
                className="mt-1 w-full h-5 md:h-6 overflow-visible"
                viewBox="0 0 400 24"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="heroUnderline" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="55%" stopColor="hsl(var(--neon-magenta))" />
                    <stop offset="100%" stopColor="hsl(var(--neon-blue))" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M6 16 C 60 6, 130 22, 200 12 S 340 6, 394 14"
                  fill="none"
                  stroke="hsl(var(--ink) / 0.55)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, delay: 0.55, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M6 16 C 60 6, 130 22, 200 12 S 340 6, 394 14"
                  fill="none"
                  stroke="url(#heroUnderline)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, delay: 0.6, ease: 'easeInOut' }}
                />
                <motion.path
                  d="M14 21 C 90 15, 220 24, 386 19"
                  fill="none"
                  stroke="url(#heroUnderline)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.9, ease: 'easeInOut' }}
                />
              </svg>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-lg font-normal text-foreground/75 max-w-xl"
            >
              {hero.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-9 flex flex-wrap gap-4"
            >
              <a href={hero.cta1Href} className="cyber-btn">{hero.cta1Label}</a>
              <a href={hero.cta2Href} className="cyber-btn-ghost">{hero.cta2Label}</a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-wrap gap-4"
            >
              {[
                { label: 'Roblox followers', value: data ? data.followers.toLocaleString() : '—' },
                { label: 'Years creating', value: settings.about.stats[0]?.value ?? '5+' },
                { label: 'Projects shipped', value: settings.about.stats[1]?.value ?? '800+' },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="sketch-card px-5 py-3"
                  style={{ rotate: `${i % 2 ? 1.5 : -1.5}deg` }}
                >
                  <p className="text-2xl font-heading font-extrabold text-foreground">{s.value}</p>
                  <p className="text-xs font-doodle text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, rotate: 4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.2, type: 'spring', damping: 14 }}
              className="relative mx-auto w-full max-w-md"
          >
            <div className="relative sketch-card p-6 sm:p-8 float">
              <span className="tape -top-3 left-1/2 -translate-x-1/2" />
              <img
                src={data?.avatarUrl || settings.about.avatarUrl}
                alt="Edward's Roblox avatar"
                className="w-56 h-56 md:w-72 md:h-72 rounded-[1.5rem] object-cover bg-secondary mx-auto border-[2.5px] border-border"
                loading="eager"
              />
              <div className="mt-6 text-center">
                <p className="text-xl font-heading font-extrabold">{data?.displayName ?? 'Edward'}</p>
                <p className="text-sm font-doodle text-muted-foreground">@{data?.username ?? 'roblox'}</p>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-accent border-[2px] border-border px-4 py-1.5 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                  {settings.nav.statusText}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.a
          href="#projects"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ y: { repeat: Infinity, duration: 2.4 }, opacity: { delay: 0.8 } }}
          className="mt-12 md:mt-16 mx-auto flex w-fit items-center gap-2 text-sm font-doodle text-muted-foreground hover:text-primary transition-colors"
        >
          Scroll to see my work <ArrowDown className="w-4 h-4" />
        </motion.a>
      </div>
    </section>
  );
}
