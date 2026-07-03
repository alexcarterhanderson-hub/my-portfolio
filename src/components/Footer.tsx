import { motion } from 'framer-motion';
import robloxLogo from '@/assets/roblox-logo.png';
import discordLogo from '@/assets/discord-logo.png';

const socialLinks = [{
  name: 'Roblox',
  image: robloxLogo,
  href: 'https://www.roblox.com/users/5811359021/profile'
}, {
  name: 'Discord',
  image: discordLogo,
  href: 'https://discordapp.com/users/1368844680422359102'
}];
export default function Footer() {
  return <footer className="relative py-16 border-t border-neon-cyan/20">
      {/* Background grid */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-10" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} className="text-center md:text-left">
            <a href="#home" className="font-orbitron text-2xl font-bold tracking-wider inline-block">
              <span className="text-neon-cyan" style={{
              textShadow: '0 0 20px hsl(180, 100%, 50%)'
            }}>
                ​Edward
              </span>
              <span className="text-neon-magenta" style={{
              textShadow: '0 0 20px hsl(300, 100%, 50%)'
            }}>
                DEV
              </span>
            </a>
            <p className="font-mono text-xs text-muted-foreground mt-2">
              {'// Digital Architect | Code Artisan'}
            </p>
          </motion.div>

          {/* Social links */}
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} className="flex gap-4">
            {socialLinks.map((link, index) => <motion.a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} transition={{
            delay: index * 0.1
          }} whileHover={{
            scale: 1.2,
            y: -5
          }} className="w-12 h-12 flex items-center justify-center rounded-lg neon-border bg-card/50 hover:shadow-neon-cyan transition-all" title={link.name}>
                <img src={link.image} alt={link.name} className="w-7 h-7 object-contain" style={link.name === 'Roblox' ? { filter: 'invert(1)' } : undefined} />
              </motion.a>)}
          </motion.div>

          {/* Copyright */}
          <motion.div initial={{
          opacity: 0
        }} whileInView={{
          opacity: 1
        }} className="text-center md:text-right">
            <p className="font-mono text-xs text-muted-foreground">
              © 2024 EdwardDEV. All systems operational.
            </p>
            <p className="font-mono text-xs text-neon-cyan/50 mt-1">
              {'< Built with React + Three.js />'}
            </p>
          </motion.div>
        </div>

        {/* Bottom line */}
        <motion.div initial={{
        scaleX: 0
      }} whileInView={{
        scaleX: 1
      }} transition={{
        duration: 1,
        delay: 0.5
      }} className="mt-8 h-px bg-gradient-to-r from-transparent via-neon-cyan/50 to-transparent" />
      </div>
    </footer>;
}