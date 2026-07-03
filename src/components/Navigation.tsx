import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UserRoundSearch } from 'lucide-react';
import { playHoverSound, playClickSound } from '@/lib/sounds';
import ClassifiedAnimation from './ClassifiedAnimation';

const navItems = [{
  name: 'Home',
  href: '#home'
}, {
  name: 'Projects',
  href: '#projects'
}, {
  name: 'Timeline',
  href: '#timeline'
}, {
  name: 'Reviews',
  href: '#reviews'
}, {
  name: 'About',
  href: '#about'
}];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const sections = navItems.map(item => item.href.slice(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element && window.scrollY >= element.offsetTop - 200) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePersonalClick = () => {
    playClickSound();
    setIsMobileMenuOpen(false);
    setShowAnimation(true);
  };

  const handleAnimationComplete = useCallback(() => {
    setShowAnimation(false);
    navigate('/classified');
  }, [navigate]);

  return <>
      {/* Classified animation overlay */}
      <ClassifiedAnimation isActive={showAnimation} onComplete={handleAnimationComplete} />

      <motion.nav initial={{
        y: -100,
        opacity: 0
      }} animate={{
        y: 0,
        opacity: 1
      }} transition={{
        duration: 0.8,
        delay: 0.5
      }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-xl' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.a href="#home" className="text-neon-cyan font-orbitron text-xl font-bold tracking-wider" whileHover={{
              scale: 1.05
            }} style={{
              textShadow: '0 0 10px hsl(180, 100%, 50%), 0 0 20px hsl(180, 100%, 50%)'
            }}>
              ​Edward<span className="text-neon-magenta">DEV</span>
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => <motion.a key={item.name} href={item.href} initial={{
                opacity: 0,
                y: -20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.6 + index * 0.1
              }} className={`relative font-orbitron text-sm tracking-wider transition-colors duration-300 ${activeSection === item.href.slice(1) ? 'text-neon-cyan' : 'text-foreground/70 hover:text-neon-cyan'}`} whileHover={{
                scale: 1.1
              }} onMouseEnter={() => playHoverSound()} onClick={() => playClickSound()}>
                {item.name}
                {activeSection === item.href.slice(1) && <motion.div layoutId="activeIndicator" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-neon-cyan" style={{
                  boxShadow: '0 0 10px hsl(180, 100%, 50%)'
                }} />}
              </motion.a>)}

              {/* Personal icon */}
              <motion.button
                onClick={handlePersonalClick}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="relative font-orbitron text-sm tracking-wider text-foreground/70 hover:text-neon-magenta transition-colors duration-300 flex items-center gap-1.5"
                whileHover={{ scale: 1.1 }}
                title="Classified"
              >
                <UserRoundSearch className="w-4 h-4" />
                <span>Personal</span>
              </motion.button>
            </div>

            {/* HUD elements */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span>SYSTEM ONLINE</span>
              </div>
            </div>

            {/* Mobile menu button */}
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden flex flex-col gap-1.5 p-2">
              <motion.span animate={{
                rotate: isMobileMenuOpen ? 45 : 0,
                y: isMobileMenuOpen ? 8 : 0
              }} className="w-6 h-0.5 bg-neon-cyan block" />
              <motion.span animate={{
                opacity: isMobileMenuOpen ? 0 : 1
              }} className="w-6 h-0.5 bg-neon-cyan block" />
              <motion.span animate={{
                rotate: isMobileMenuOpen ? -45 : 0,
                y: isMobileMenuOpen ? -8 : 0
              }} className="w-6 h-0.5 bg-neon-cyan block" />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && <motion.div initial={{
          opacity: 0,
          x: '100%'
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: '100%'
        }} transition={{
          type: 'spring',
          damping: 20
        }} className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navItems.map((item, index) => <motion.a key={item.name} href={item.href} initial={{
              opacity: 0,
              x: 50
            }} animate={{
              opacity: 1,
              x: 0
            }} transition={{
              delay: index * 0.1
            }} onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-orbitron text-neon-cyan tracking-wider">
              {item.name}
            </motion.a>)}
            
            {/* Personal in mobile menu */}
            <motion.button
              onClick={handlePersonalClick}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navItems.length * 0.1 }}
              className="text-2xl font-orbitron text-neon-magenta tracking-wider flex items-center gap-3"
            >
              <UserRoundSearch className="w-6 h-6" />
              Personal
            </motion.button>
          </div>
        </motion.div>}
      </AnimatePresence>
    </>;
}