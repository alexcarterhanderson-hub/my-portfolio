import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CyberpunkScene from '@/components/CyberpunkScene';
import CustomCursor from '@/components/CustomCursor';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ProjectsSection from '@/components/ProjectsSection';
import TimelineSection from '@/components/TimelineSection';
import ReviewsSection from '@/components/ReviewsSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import IntroAnimation from '@/components/IntroAnimation';

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if intro was already shown in this session
    const introShown = sessionStorage.getItem('introShown');
    if (introShown) {
      setShowIntro(false);
      setIsLoaded(true);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('introShown', 'true');
    setShowIntro(false);
    setIsLoaded(true);
  };

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden noise scanlines">
      {/* Custom cursor (desktop only) */}
      <div className="hidden lg:block">
        <CustomCursor />
      </div>

      {/* Intro animation */}
      <AnimatePresence>
        {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* 3D Background Scene */}
      <CyberpunkScene />

      {/* Main content */}
      <AnimatePresence>
        {(isLoaded || !showIntro) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Navigation />
            
            <main>
              <HeroSection />
              <ProjectsSection />
              <TimelineSection />
              <ReviewsSection />
              <AboutSection />
            </main>
            
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-magenta/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/3 rounded-full blur-[150px]" />
      </div>
    </div>
  );
};

export default Index;
