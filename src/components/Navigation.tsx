import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useSite } from '@/hooks/useSite';

export default function Navigation() {
  const { settings, isAdmin, setIsAdmin, setAdminOpen, dark, setDark } = useSite();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const clicks = useRef(0);
  const timer = useRef<number>();
  const navItems = settings.nav.items;


  useEffect(() => {
    let raf = 0;
    const handleScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 40);
        const sections = navItems.map((item) => item.href.slice(1));
        for (const section of [...sections].reverse()) {
          const el = document.getElementById(section);
          if (el && window.scrollY >= el.offsetTop - 220) {
            setActiveSection(section);
            break;
          }
        }
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => { window.removeEventListener('scroll', handleScroll); cancelAnimationFrame(raf); };
  }, [navItems]);

  const handleStatusClick = () => {
    clicks.current += 1;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => { clicks.current = 0; }, 1500);
    if (clicks.current >= 5) {
      clicks.current = 0;
      setIsAdmin(true);
      setAdminOpen(true);
    }
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div
          className={`flex items-center gap-3 rounded-full px-4 py-2.5 transition-all duration-300 ${
            isScrolled ? 'bg-card border-[2.5px] border-border shadow-[4px_4px_0_hsl(var(--ink)/0.9)]' : 'bg-transparent border-[2.5px] border-transparent'
          }`}
        >
          {/* Wordmark with hover draw-on underline */}
          <a href="#top" className="draw-outline group relative shrink-0 pr-2" aria-label="Back to top">
            <span className="font-heading text-lg md:text-xl font-extrabold text-foreground">
              {settings.nav.logo}
              <span className="text-primary">{settings.nav.logoAccent}</span>
            </span>
            <svg className="draw-outline-svg absolute -bottom-1 left-0 w-full h-3 overflow-visible" viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true">
              <path
                d="M2 8 C 25 2, 55 12, 80 5 S 112 3, 118 7"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </a>

          <div className="hidden md:flex items-center gap-1 mx-auto">

            {navItems.map((item) => {
              const active = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative rounded-full px-4 py-2 text-sm font-heading font-bold transition-transform hover:-translate-y-0.5 ${
                    active ? 'text-primary-foreground' : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  {active ? (
                    <motion.span
                      layoutId="navPill"
                      className="absolute inset-0 rounded-full border-[2.5px] border-border shadow-[3px_3px_0_hsl(var(--ink)/0.9)]"
                      style={{
                        background:
                          'linear-gradient(120deg, hsl(var(--primary)), hsl(var(--neon-magenta)) 60%, hsl(var(--neon-blue)))',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <span className="absolute inset-0 rounded-full border-[2px] border-border/0 hover:border-border/70 hover:bg-card/60 transition-colors" />
                  )}
                  <span className="relative">{item.name}</span>
                </a>
              );
            })}
          </div>

          <div className="ml-auto flex items-center gap-2 shrink-0">
            <button
              onClick={() => setDark(!dark)}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={dark ? 'Light mode' : 'Dark mode'}
              className="w-10 h-10 rounded-full bg-card border-[2.5px] border-border shadow-[3px_3px_0_hsl(var(--ink)/0.9)] flex items-center justify-center text-foreground transition-transform hover:-translate-y-0.5 active:translate-y-0.5"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={dark ? 'moon' : 'sun'}
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.25 }}
                >
                  {dark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </motion.span>
              </AnimatePresence>
            </button>
            <button
              onClick={handleStatusClick}
              className="hidden sm:flex items-center gap-2 rounded-full bg-card border-[2.5px] border-border px-4 py-2 text-xs font-bold font-doodle uppercase tracking-wide select-none shadow-[3px_3px_0_hsl(var(--ink)/0.9)]"
              title={settings.nav.statusText}
            >
              <span className={`w-2 h-2 rounded-full ${isAdmin ? 'bg-neon-magenta' : 'bg-neon-green'} animate-pulse`} />
              {isAdmin ? 'Admin mode' : settings.nav.statusText}
            </button>
            <button
              className="md:hidden p-2 text-foreground"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>


        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-3 sketch-card p-3"
            >
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm text-foreground/80 hover:bg-secondary hover:text-primary"
                >
                  {item.name}
                </a>
              ))}
              <button onClick={handleStatusClick} className="mt-1 block w-full rounded-2xl px-4 py-3 text-left text-xs text-muted-foreground">
                {isAdmin ? 'Admin mode' : settings.nav.statusText}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
