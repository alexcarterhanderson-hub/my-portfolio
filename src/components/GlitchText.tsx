import { motion } from 'framer-motion';

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export default function GlitchText({ text, className = '', as: Component = 'span' }: GlitchTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative inline-block"
    >
      <Component 
        className={`glitch font-orbitron ${className}`}
        data-text={text}
      >
        {text}
      </Component>
    </motion.div>
  );
}
