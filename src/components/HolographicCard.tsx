import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface HolographicCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'magenta' | 'purple' | 'green';
}

export default function HolographicCard({ children, className = '', glowColor = 'cyan' }: HolographicCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['15deg', '-15deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-15deg', '15deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const glowColors = {
    cyan: 'var(--neon-cyan)',
    magenta: 'var(--neon-magenta)',
    purple: 'var(--neon-purple)',
    green: 'var(--neon-green)',
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
    >
      {/* Holographic background */}
      <motion.div
        animate={{
          boxShadow: isHovered
            ? `0 0 30px hsl(${glowColors[glowColor]}), 0 0 60px hsl(${glowColors[glowColor]} / 0.5), inset 0 0 60px hsl(${glowColors[glowColor]} / 0.1)`
            : `0 0 20px hsl(${glowColors[glowColor]} / 0.3), inset 0 0 30px hsl(${glowColors[glowColor]} / 0.05)`,
        }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 rounded-lg bg-gradient-to-br from-card via-card/90 to-card/80 border border-border"
        style={{
          borderColor: isHovered ? `hsl(${glowColors[glowColor]} / 0.6)` : `hsl(${glowColors[glowColor]} / 0.2)`,
        }}
      />
      
      {/* Scan line effect */}
      <motion.div
        animate={{
          y: isHovered ? ['0%', '100%'] : '0%',
        }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0,
          ease: 'linear',
        }}
        className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none"
      >
        <div 
          className="w-full h-1 blur-sm"
          style={{
            background: `linear-gradient(90deg, transparent, hsl(${glowColors[glowColor]} / 0.5), transparent)`,
          }}
        />
      </motion.div>
      
      {/* HUD corners */}
      <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 rounded-tl-lg" 
        style={{ borderColor: `hsl(${glowColors[glowColor]})` }} 
      />
      <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 rounded-tr-lg" 
        style={{ borderColor: `hsl(${glowColors[glowColor]})` }} 
      />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 rounded-bl-lg" 
        style={{ borderColor: `hsl(${glowColors[glowColor]})` }} 
      />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 rounded-br-lg" 
        style={{ borderColor: `hsl(${glowColors[glowColor]})` }} 
      />
      
      {/* Content */}
      <div className="relative z-10" style={{ transform: 'translateZ(50px)' }}>
        {children}
      </div>
    </motion.div>
  );
}
