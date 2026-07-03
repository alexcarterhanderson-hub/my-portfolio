import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import HolographicCard from './HolographicCard';
import GlitchText from './GlitchText';

// Sample reviews data - only owner can modify
const reviews = [
  {
    id: 1,
    name: 'Brian1KB',
    role: 'Developer',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Brian1KB&backgroundColor=0d1117',
    content: 'Calm, deliberate and technically sharp. The code shows intention and structure rather than noise. You can trust the work to hold up under pressure.',
    rating: 5,
    date: '2025.01.20',
  },
  {
    id: 2,
    name: 'Neon_Dev',
    role: 'UI Designer',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Neon_Dev&backgroundColor=0d1117',
    content: 'The cleanest implementation of parallel Luau I\'ve seen. Great communication and super fast delivery.',
    rating: 5,
    date: '2025.01.15',
  },
  {
    id: 3,
    name: 'SenseiWarrior',
    role: 'Developer',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=SenseiWarrior&backgroundColor=0d1117',
    content: 'Turned our vision into a functional masterpiece. The custom physics framework is buttery smooth.',
    rating: 5,
    date: '2025.01.10',
  },
];

function ReviewCard({ review, index }: { review: typeof reviews[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  const glowColors = ['cyan', 'magenta', 'purple'] as const;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, rotateY: index % 2 === 0 ? -10 : 10 }}
      animate={isInView ? { opacity: 1, x: 0, rotateY: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      style={{ perspective: '1000px' }}
    >
      <HolographicCard glowColor={glowColors[index % 3]} className="h-full">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative"
            >
              <img
                src={review.avatar}
                alt={review.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-neon-cyan"
              />
              <div className="absolute inset-0 rounded-full bg-neon-cyan/20 animate-pulse" />
            </motion.div>
            <div>
              <h4 className="font-orbitron text-lg font-bold text-foreground">
                {review.name}
              </h4>
              <p className="font-mono text-xs text-neon-cyan">
                {review.role}
              </p>
            </div>
            <div className="ml-auto font-mono text-xs text-muted-foreground">
              {review.date}
            </div>
          </div>

          {/* Rating */}
          <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-neon-cyan text-xl"
                style={{
                  textShadow: i < review.rating 
                    ? '0 0 10px hsl(180, 100%, 50%)' 
                    : 'none',
                }}
              >
                {i < review.rating ? '★' : '☆'}
              </motion.span>
            ))}
          </div>

          {/* Content */}
          <p className="text-foreground/80 font-rajdhani text-base leading-relaxed">
            "{review.content}"
          </p>

          {/* Verification badge */}
          <div className="mt-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="font-mono text-xs text-neon-green">VERIFIED_CLIENT</span>
          </div>
        </div>
      </HolographicCard>
    </motion.div>
  );
}

export default function ReviewsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10]);

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="relative py-32 overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent" />
        <motion.div
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            repeatType: 'reverse' 
          }}
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at center, hsl(var(--neon-magenta) / 0.3) 0%, transparent 50%)',
            backgroundSize: '100% 100%',
          }}
        />
      </div>

      <motion.div 
        style={{ perspective: '1000px' }}
        className="container mx-auto px-6"
      >
        <motion.div style={{ rotateX }}>
          {/* Section header */}
          <div className="text-center mb-16">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="font-mono text-sm text-neon-magenta mb-4 tracking-[0.3em]"
            >
              {'// CLIENT_TESTIMONIALS'}
            </motion.p>
            <GlitchText
              text="REVIEWS"
              as="h2"
              className="text-4xl md:text-6xl font-bold text-neon-cyan"
            />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-6 h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-neon-magenta to-transparent"
            />
          </div>

          {/* Reviews grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} index={index} />
            ))}
          </div>

          {/* Owner note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12 font-mono text-xs text-muted-foreground"
          >
            {'< Reviews curated by system administrator />'}
          </motion.p>
        </motion.div>
      </motion.div>
    </section>
  );
}
