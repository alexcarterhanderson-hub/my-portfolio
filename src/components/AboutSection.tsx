import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import GlitchText from './GlitchText';
const skills = [{
  name: 'Lua',
  level: 100,
  color: 'cyan'
}, {
  name: 'UI Designing',
  level: 98,
  color: 'magenta'
}, {
  name: 'Python',
  level: 94,
  color: 'purple'
}, {
  name: 'Node.js',
  level: 84,
  color: 'green'
}, {
  name: 'Web Development',
  level: 82,
  color: 'cyan'
}, {
  name: 'AI Mechanics',
  level: 76,
  color: 'magenta'
}, {
  name: 'Animations',
  level: 73,
  color: 'purple'
}];
const stats = [{
  label: 'Years Experience',
  value: '5+',
  suffix: ''
}, {
  label: 'Projects Completed',
  value: '800',
  suffix: '+'
}, {
  label: 'Happy Clients',
  value: '600',
  suffix: '+'
}, {
  label: 'Lines of Code',
  value: '2.1M',
  suffix: '+'
}];
function SkillBar({
  skill,
  index
}: {
  skill: typeof skills[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.5
  });
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const colorMap: Record<string, string> = {
    cyan: 'hsl(180, 100%, 50%)',
    magenta: 'hsl(300, 100%, 50%)',
    purple: 'hsl(270, 100%, 50%)',
    green: 'hsl(110, 100%, 54%)'
  };
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedWidth(skill.level);
      }, 300 + index * 150);
      return () => clearTimeout(timer);
    }
  }, [isInView, skill.level, index]);
  return <motion.div ref={ref} initial={{
    opacity: 0,
    x: -30
  }} animate={isInView ? {
    opacity: 1,
    x: 0
  } : {
    opacity: 0,
    x: -30
  }} transition={{
    duration: 0.5,
    delay: index * 0.1
  }} className="mb-6">
      <div className="flex justify-between mb-2">
        <span className="font-orbitron text-sm text-foreground">{skill.name}</span>
        <motion.span className="font-mono text-sm" style={{
        color: colorMap[skill.color]
      }} initial={{
        opacity: 0
      }} animate={isInView ? {
        opacity: 1
      } : {
        opacity: 0
      }} transition={{
        delay: 0.5 + index * 0.1
      }}>
          {skill.level}%
        </motion.span>
      </div>
      <div className="h-3 bg-muted/50 rounded-full overflow-hidden border border-border/50">
        <motion.div className="h-full rounded-full relative overflow-hidden" initial={{
        width: 0
      }} animate={{
        width: `${animatedWidth}%`
      }} transition={{
        duration: 1.2,
        delay: 0.3 + index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94]
      }} style={{
        background: `linear-gradient(90deg, ${colorMap[skill.color]}, ${colorMap[skill.color]}cc)`,
        boxShadow: `0 0 15px ${colorMap[skill.color]}, 0 0 30px ${colorMap[skill.color]}66`
      }}>
          {/* Animated shine effect */}
          <motion.div animate={{
          x: ['-100%', '200%']
        }} transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
          delay: 1 + index * 0.2
        }} className="absolute inset-0 w-1/2" style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
        }} />
          
          {/* Pulsing glow at the end */}
          <motion.div animate={{
          opacity: [0.5, 1, 0.5]
        }} transition={{
          duration: 1.5,
          repeat: Infinity
        }} className="absolute right-0 top-0 bottom-0 w-2" style={{
          background: colorMap[skill.color],
          boxShadow: `0 0 10px ${colorMap[skill.color]}, 0 0 20px ${colorMap[skill.color]}`
        }} />
        </motion.div>
      </div>
    </motion.div>;
}
function StatCard({
  stat,
  index
}: {
  stat: typeof stats[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    amount: 0.5
  });
  return <motion.div ref={ref} initial={{
    opacity: 0,
    scale: 0.8,
    rotateY: -30
  }} animate={isInView ? {
    opacity: 1,
    scale: 1,
    rotateY: 0
  } : {}} transition={{
    duration: 0.6,
    delay: index * 0.15
  }} className="hud-panel p-6 text-center">
      <motion.div initial={{
      opacity: 0,
      scale: 0.5
    }} animate={isInView ? {
      opacity: 1,
      scale: 1
    } : {}} transition={{
      delay: 0.5 + index * 0.1,
      type: 'spring'
    }} className="font-orbitron text-3xl md:text-4xl font-bold text-neon-cyan" style={{
      textShadow: '0 0 20px hsl(var(--neon-cyan))'
    }}>
        {stat.value}<span className="text-neon-magenta">{stat.suffix}</span>
      </motion.div>
      <p className="font-mono text-xs text-muted-foreground mt-2 tracking-wider">
        {stat.label}
      </p>
    </motion.div>;
}
export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  return <section ref={sectionRef} id="about" className="relative py-32 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-10" />
      
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <motion.p initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} transition={{
          duration: 0.5
        }} className="font-mono text-sm text-neon-purple mb-4 tracking-[0.3em]">
            {'// IDENTITY_MATRIX'}
          </motion.p>
          <GlitchText text="ABOUT" as="h2" className="text-4xl md:text-6xl font-bold text-neon-green" />
          <motion.div initial={{
          scaleX: 0
        }} whileInView={{
          scaleX: 1
        }} transition={{
          duration: 0.8,
          delay: 0.3
        }} className="mt-6 h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-neon-purple to-transparent" />
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Avatar / Identity */}
          <motion.div initial={{
          opacity: 0,
          x: -50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8
        }} className="relative">
            {/* Holographic avatar container */}
            <div className="relative max-w-md mx-auto">
              {/* Outer ring */}
              <motion.div animate={{
              rotate: 360
            }} transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }} className="absolute inset-0 rounded-full border-2 border-dashed border-neon-cyan/30" style={{
              margin: '-20px'
            }} />
              
              {/* Avatar */}
              <div className="relative aspect-square rounded-full overflow-hidden neon-border p-1">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <motion.div animate={{
                  background: ['linear-gradient(0deg, hsl(180, 100%, 50%), hsl(300, 100%, 50%))', 'linear-gradient(360deg, hsl(180, 100%, 50%), hsl(300, 100%, 50%))']
                }} transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'linear'
                }} className="absolute inset-0" />
                  
                  {/* Roblox Avatar */}
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 overflow-hidden">
                    <img src="https://thumbs.metrik.app/headshot/5811359021" alt="Roblox Avatar" className="w-full h-full object-cover scale-110" crossOrigin="anonymous" onError={e => {
                    // Fallback to DiceBear avatar
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=CyberDev&backgroundColor=0a0a0f';
                  }} />
                  </div>
                  
                  {/* Scanline effect */}
                  <motion.div animate={{
                  y: ['-100%', '200%']
                }} transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear'
                }} className="absolute inset-x-0 h-1/3 bg-gradient-to-b from-transparent via-neon-cyan/20 to-transparent" />
                </div>
              </div>

              {/* Status indicator */}
              <motion.div animate={{
              scale: [1, 1.2, 1]
            }} transition={{
              duration: 2,
              repeat: Infinity
            }} className="absolute bottom-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
                <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                <span className="font-mono text-xs text-neon-green">ONLINE</span>
              </motion.div>
            </div>

            {/* Bio */}
            <motion.div initial={{
            opacity: 0
          }} whileInView={{
            opacity: 1
          }} transition={{
            delay: 0.5
          }} className="mt-8 text-center lg:text-left">
              <h3 className="font-orbitron text-2xl font-bold text-foreground mb-4">
                Roblox developer and UI designer with 5+ years of experience creating high quality, immersive experiences. I’ve worked with the Blox Fruits team, focusing on intuitive UI, optimized systems, and interactive features that enhance gameplay. I combine creative design with solid scripting to bring ideas from concept to polished in game experiences
              </h3>
              
            </motion.div>
          </motion.div>

          {/* Skills */}
          <motion.div initial={{
          opacity: 0,
          x: 50
        }} whileInView={{
          opacity: 1,
          x: 0
        }} transition={{
          duration: 0.8
        }}>
            <div className="hud-panel p-8">
              <h4 className="font-orbitron text-lg font-bold text-neon-cyan mb-8 tracking-wider">
                {'// SKILL_MATRIX'}
              </h4>
              {skills.map((skill, index) => <SkillBar key={skill.name} skill={skill} index={index} />)}
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div initial={{
        opacity: 0,
        y: 50
      }} whileInView={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {stats.map((stat, index) => <StatCard key={stat.label} stat={stat} index={index} />)}
        </motion.div>
      </div>
    </section>;
}