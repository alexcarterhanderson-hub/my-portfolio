import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [isClickable, setIsClickable] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 20, stiffness: 300 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isLink = target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button');
      const isProject = target.closest('.project-clickable');
      
      setIsHovering(!!isLink);
      setIsClickable(!!isProject);
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Main cursor - outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isClickable ? 60 : isHovering ? 50 : 40,
            height: isClickable ? 60 : isHovering ? 50 : 40,
            borderColor: isClickable ? 'hsl(110, 100%, 54%)' : isHovering ? 'hsl(300, 100%, 50%)' : 'hsl(180, 100%, 50%)',
            rotate: isClickable ? 45 : 0,
          }}
          transition={{ duration: 0.2 }}
          className="rounded-full border-2"
          style={{
            boxShadow: isClickable 
              ? '0 0 20px hsl(110, 100%, 54%), 0 0 40px hsl(110, 100%, 54%), inset 0 0 10px hsl(110, 100%, 54%)'
              : isHovering 
                ? '0 0 20px hsl(300, 100%, 50%), 0 0 40px hsl(300, 100%, 50%)' 
                : '0 0 15px hsl(180, 100%, 50%), 0 0 30px hsl(180, 100%, 50%)',
          }}
        />
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            scale: isClickable ? 1.5 : isHovering ? 1.2 : 1,
            backgroundColor: isClickable ? 'hsl(110, 100%, 54%)' : isHovering ? 'hsl(300, 100%, 50%)' : 'hsl(180, 100%, 50%)',
          }}
          transition={{ duration: 0.15 }}
          className="w-3 h-3 rounded-full"
          style={{
            boxShadow: isClickable 
              ? '0 0 10px hsl(110, 100%, 54%), 0 0 20px hsl(110, 100%, 54%)'
              : '0 0 10px hsl(180, 100%, 50%), 0 0 20px hsl(180, 100%, 50%)',
          }}
        />
      </motion.div>

      {/* Crosshair lines for clickable projects */}
      {isClickable && (
        <>
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[9998]"
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative w-20 h-20">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neon-green/50" style={{ boxShadow: '0 0 10px hsl(110, 100%, 54%)' }} />
              <div className="absolute left-1/2 top-0 w-0.5 h-full bg-neon-green/50" style={{ boxShadow: '0 0 10px hsl(110, 100%, 54%)' }} />
            </div>
          </motion.div>
        </>
      )}

      {/* Trail particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="fixed top-0 left-0 pointer-events-none z-[9997] rounded-full"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: '-50%',
            translateY: '-50%',
            width: 8 - i * 2,
            height: 8 - i * 2,
            backgroundColor: `hsla(180, 100%, 50%, ${0.4 - i * 0.1})`,
            filter: `blur(${i * 2}px)`,
          }}
          transition={{ delay: i * 0.03 }}
        />
      ))}

      {/* Custom cursor style */}
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}
