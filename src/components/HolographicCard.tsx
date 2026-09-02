import { useRef } from 'react';
import { motion } from 'framer-motion';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'magenta' | 'purple' | 'green';
}

export default function HolographicCard({ children, className = '' }: HolographicCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`glass-card relative overflow-hidden ${className}`}
    >
      {/* Gentle gradient sheen on hover */}
      <motion.div
        initial={{ opacity: 0, x: '-100%' }}
        whileHover={{ opacity: 1, x: '100%' }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.5) 45%, rgba(234,223,251,0.4) 55%, transparent 80%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
