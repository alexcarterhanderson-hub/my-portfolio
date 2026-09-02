import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

interface Props {
  videoId?: string | null;
  videoUrl?: string | null;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoLightbox({ videoId, videoUrl, title, isOpen, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-background/90 backdrop-blur-xl"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} demo video`}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            className="relative w-full max-w-5xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-neon-cyan" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-r-2 border-t-2 border-neon-cyan" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-2 border-b-2 border-neon-cyan" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-neon-cyan" />

            <div className="w-full h-full rounded-lg overflow-hidden neon-border bg-black">
              {videoUrl ? (
                <video src={videoUrl} controls autoPlay className="w-full h-full" />
              ) : videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  title={`${title} video`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full grid place-items-center font-mono text-sm text-muted-foreground">
                  NO VIDEO ATTACHED
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="absolute -top-12 right-0 font-orbitron text-sm text-neon-cyan hover:text-neon-magenta transition-colors flex items-center gap-2"
            >
              <span>CLOSE</span>
              <span className="text-xl">✕</span>
            </button>

            <div className="absolute -bottom-10 left-0 right-0 flex justify-between items-center font-mono text-xs text-muted-foreground">
              <span>{`// ${title.toUpperCase()}`}</span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                ESC TO CLOSE
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
