import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import GlitchText from './GlitchText';
export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const {
    scrollYProgress
  } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  return <section ref={ref} id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{
      y,
      opacity,
      scale
    }} className="relative z-10 text-center px-6">
        {/* HUD overlay elements */}
        <motion.div initial={{
        opacity: 0,
        scale: 0.8
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 1,
        delay: 0.2
      }} className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-0.5 bg-gradient-to-r from-transparent via-neon-cyan to-transparent" />
        
        {/* Status indicators */}
        <motion.div initial={{
        opacity: 0,
        x: -50
      }} animate={{
        opacity: 1,
        x: 0
      }} transition={{
        duration: 0.8,
        delay: 0.5
      }} className="absolute -left-20 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 font-mono text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span>SYS_ACTIVE</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
            <span>NET_CONN</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-magenta animate-pulse" />
            <span>GPU_READY</span>
          </div>
        </motion.div>

        {/* Main title */}
        <motion.div initial={{
        opacity: 0,
        y: 50
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 1,
        delay: 0.3
      }}>
          <p className="font-mono text-sm md:text-base text-neon-cyan mb-4 tracking-[0.3em]">
            {'< INITIALIZING SYSTEM />'}
          </p>
          
          <GlitchText text="Edward" as="h1" className="text-6xl md:text-8xl lg:text-9xl font-black text-neon-cyan tracking-wider" />
          <GlitchText text="DEV" as="h1" className="text-4xl md:text-6xl lg:text-7xl font-bold text-neon-magenta tracking-wider mt-2" />
        </motion.div>

        {/* Subtitle */}
        <motion.p initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 1,
        delay: 0.8
      }} className="mt-8 text-lg md:text-xl text-foreground/80 font-rajdhani max-w-2xl mx-auto">
          Full Stack Developer | UI Designer | Scripter 
        </motion.p>

        {/* CTA Buttons */}
        <motion.div initial={{
        opacity: 0,
        y: 30
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 1
      }} className="mt-12 flex flex-wrap justify-center gap-6">
          <motion.a href="#projects" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} className="cyber-btn">
            View Projects
          </motion.a>
          <motion.a href="#about" whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }} className="cyber-btn" style={{
          borderColor: 'hsl(var(--neon-magenta))',
          color: 'hsl(var(--neon-magenta))'
        }}>
            About Me
          </motion.a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 1.5
      }} className="absolute -bottom-32 left-1/2 -translate-x-1/2">
          <motion.div animate={{
          y: [0, 10, 0]
        }} transition={{
          duration: 1.5,
          repeat: Infinity
        }} className="flex flex-col items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground tracking-wider">SCROLL</span>
            <div className="w-6 h-10 rounded-full border-2 border-neon-cyan/50 flex justify-center pt-2">
              <motion.div animate={{
              y: [0, 12, 0],
              opacity: [1, 0, 1]
            }} transition={{
              duration: 1.5,
              repeat: Infinity
            }} className="w-1.5 h-1.5 rounded-full bg-neon-cyan" />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Decorative elements */}
      <motion.div initial={{
      opacity: 0
    }} animate={{
      opacity: 0.3
    }} transition={{
      duration: 2,
      delay: 1
    }} className="absolute inset-0 pointer-events-none">
        {/* Corner decorations */}
        <div className="absolute top-20 left-10 w-32 h-32 border-l-2 border-t-2 border-neon-cyan/30" />
        <div className="absolute top-20 right-10 w-32 h-32 border-r-2 border-t-2 border-neon-magenta/30" />
        <div className="absolute bottom-20 left-10 w-32 h-32 border-l-2 border-b-2 border-neon-magenta/30" />
        <div className="absolute bottom-20 right-10 w-32 h-32 border-r-2 border-b-2 border-neon-cyan/30" />
      </motion.div>
    </section>;
}