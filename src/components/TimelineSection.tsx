import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useSite } from '@/hooks/useSite';
import { TimelineRow, accentColor } from '@/lib/siteContent';

function TimelineNode({ color, active }: { color: string; active: boolean }) {
  const c = accentColor(color);
  return (
    <div className="relative w-6 h-6 flex items-center justify-center">
      <motion.div
        className="absolute inset-[-6px] rounded-full"
        style={{ background: c, opacity: 0.22 }}
        animate={{ scale: active ? [1, 1.3, 1] : 1 }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: active ? 1 : 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 12 }}
        className="w-4 h-4 rounded-full relative z-10 border-[2.5px] border-border"
        style={{ background: c }}
      />
    </div>
  );
}

function CardBody({ entry }: { entry: TimelineRow }) {
  const c = accentColor(entry.color);
  return (
    <div className="p-5 md:p-6">
      <div className="flex items-center justify-between mb-3 text-xs">
        <span className="font-doodle text-muted-foreground text-sm">{entry.year}</span>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold border-[2px] border-border"
          style={{ color: c, background: `${c}22` }}
        >
          {entry.status}
        </span>
      </div>

      <h3 className="font-heading text-lg md:text-xl font-extrabold mb-2 text-foreground">
        {entry.codename || entry.title}
      </h3>

      <p className="text-foreground/75 text-sm md:text-base mb-4">{entry.description}</p>

      <div className="mb-2 flex justify-between items-center text-xs font-doodle text-muted-foreground">
        <span>Progress</span>
        <span style={{ color: c }}>{entry.progress}%</span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden border-[2px] border-border">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${entry.progress}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="h-full"
          style={{ background: c }}
        />
      </div>
    </div>
  );
}

function MilestoneCard({ entry, index }: { entry: TimelineRow; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-8 items-center mb-12 md:mb-16">
      <div className={`md:order-1 ${isLeft ? '' : 'md:invisible md:pointer-events-none md:h-0'}`}>
        {isLeft && (
          <motion.div
            initial={{ opacity: 0, x: -40, rotate: -2 }}
            animate={isInView ? { opacity: 1, x: 0, rotate: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="sketch-card hidden md:block"
          >
            <CardBody entry={entry} />
          </motion.div>
        )}
      </div>

      <div className="md:order-2 absolute left-0 md:relative md:left-auto flex justify-center">
        <TimelineNode color={entry.color} active={isInView} />
      </div>

      <div className={`md:order-3 ml-10 md:ml-0 ${!isLeft ? '' : 'md:invisible md:pointer-events-none md:h-0'}`}>
        {!isLeft && (
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 2 }}
            animate={isInView ? { opacity: 1, x: 0, rotate: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="sketch-card hidden md:block"
          >
            <CardBody entry={entry} />
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="sketch-card md:hidden"
        >
          <CardBody entry={entry} />
        </motion.div>
      </div>
    </div>
  );
}

export default function TimelineSection() {
  const { timeline, settings } = useSite();
  const spineRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: spineRef,
    offset: ['start 80%', 'end 20%'],
  });
  const spineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="timeline" className="relative py-20 md:py-24 overflow-hidden">
      <div className="container mx-auto px-5 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="kicker mb-4">{settings.sections.timelineKicker}</span>
          <h2 className="text-3xl md:text-6xl sketch-title mt-5">{settings.sections.timelineTitle}</h2>
          <p className="mt-4 text-sm font-doodle text-muted-foreground">{settings.sections.timelineNote}</p>
        </motion.div>

        <div ref={spineRef} className="relative max-w-5xl mx-auto">
          <div className="absolute left-3 md:left-1/2 top-0 bottom-0 md:-translate-x-1/2 w-[3px] pointer-events-none">
            <div className="absolute inset-0 bg-border/30" />
            <motion.div
              className="absolute inset-x-0 top-0 origin-top bg-primary"
              style={{ scaleY: spineScale, height: '100%' }}
            />
          </div>

          <div className="relative pl-0">
            {timeline.map((m, i) => (
              <MilestoneCard key={m.id} entry={m} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
