import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useSite } from '@/hooks/useSite';
import { ReviewRow } from '@/lib/siteContent';

function ReviewCard({ review, index }: { review: ReviewRow; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });
  const avatar =
    review.avatar_url ||
    `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(review.name)}`;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30, rotate: index % 2 ? 2 : -2 }}
      animate={isInView ? { opacity: 1, y: 0, rotate: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.12 }}
      className="sketch-card h-full"
    >
      <div className="p-6 md:p-8">
        <div className="flex items-start gap-4 mb-6">
          <img
            src={avatar}
            alt={review.name}
            className="w-14 h-14 rounded-full object-cover border-[2.5px] border-border bg-secondary"
            loading="lazy"
          />
          <div>
            <h4 className="font-heading text-lg font-extrabold text-foreground">{review.name}</h4>
            <p className="text-xs font-doodle text-primary">{review.role}</p>
          </div>
          <div className="ml-auto text-xs font-doodle text-muted-foreground">
            {new Date(review.created_at).toLocaleDateString()}
          </div>
        </div>

        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="text-neon-magenta text-xl"
            >
              {i < review.rating ? '★' : '☆'}
            </motion.span>
          ))}
        </div>

        <p className="text-foreground/80 text-base leading-relaxed">"{review.content}"</p>

        <div className="mt-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-neon-green" />
          <span className="text-xs font-doodle text-muted-foreground">Verified client</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ReviewsSection() {
  const { reviews, settings, isAdmin } = useSite();
  const visible = reviews.filter((r) => isAdmin || r.approved);

  return (
    <section id="reviews" className="relative py-20 md:py-24 overflow-hidden">
      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="kicker mb-4">{settings.sections.reviewsKicker}</span>
          <h2 className="text-4xl md:text-6xl sketch-title mt-5">{settings.sections.reviewsTitle}</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visible.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="text-center text-sm font-doodle text-muted-foreground py-10">
            No reviews published yet.
          </p>
        )}
      </div>
    </section>
  );
}
