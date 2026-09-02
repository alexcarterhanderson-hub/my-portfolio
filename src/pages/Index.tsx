import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import ProjectsSection from '@/components/ProjectsSection';
import TimelineSection from '@/components/TimelineSection';
import RobloxSection from '@/components/RobloxSection';
import ReviewsSection from '@/components/ReviewsSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import AdminConsole from '@/components/AdminConsole';
import UserToolbar from '@/components/UserToolbar';
import SiteBackground from '@/components/SiteBackground';
import { SiteProvider } from '@/hooks/useSite';
import { PerformanceProvider } from '@/hooks/usePerformance';

const IndexInner = () => {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden">
      <SiteBackground />


      <AnimatePresence>
        {ready && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <Navigation />
            <main>
              <HeroSection />
              <ProjectsSection />
              <TimelineSection />
              <RobloxSection />
              <ReviewsSection />
              <AboutSection />
            </main>
            
            <Footer />
            <UserToolbar />
            <AdminConsole />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Index = () => (
  <PerformanceProvider>
    <SiteProvider>
      <IndexInner />
    </SiteProvider>
  </PerformanceProvider>
);

export default Index;
