import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useSite } from '@/hooks/useSite';
import { SkillItem, StatItem, accentColor } from '@/lib/siteContent';

function SkillBar({ skill, index }: { skill: SkillItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const c = accentColor(skill.color);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => setAnimatedWidth(skill.level), 200 + index * 100);
    return () => clearTimeout(timer);
  }, [isInView, skill.level, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="mb-6"
    >
      <div className="flex justify-between mb-2">
        <span className="font-heading font-bold text-sm text-foreground">{skill.name}</span>
        <span className="text-sm font-doodle" style={{ color: c }}>{skill.level}%</span>
      </div>
      <div className="h-3.5 bg-muted rounded-full overflow-hidden border-[2px] border-border">
        <motion.div
          className="h-full"
          initial={{ width: 0 }}
          animate={{ width: `${animatedWidth}%` }}
          transition={{ duration: 1, delay: 0.2 + index * 0.1, ease: 'easeOut' }}
          style={{ background: c }}
        />
      </div>
    </motion.div>
  );
}

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, rotate: index % 2 ? 1.5 : -1.5 }}
      className="sketch-card p-6 text-center"
    >
      <div className="font-heading text-3xl md:text-4xl font-extrabold text-foreground">
        {stat.value}<span className="text-neon-magenta">{stat.suffix}</span>
      </div>
      <p className="text-xs font-doodle text-muted-foreground mt-2">{stat.label}</p>
    </motion.div>
  );
}

export default function AboutSection() {
  const { settings } = useSite();
  const about = settings.about;

  return (
    <section id="about" className="relative py-20 md:py-24 overflow-hidden">
      <div className="container mx-auto px-5 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="kicker mb-4">{settings.sections.aboutKicker}</span>
          <h2 className="text-4xl md:text-6xl sketch-title mt-5">{settings.sections.aboutTitle}</h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative max-w-md mx-auto">
              <div className="relative aspect-square rounded-full overflow-hidden border-[3px] border-border shadow-[6px_7px_0_hsl(var(--ink)/0.9)] bg-secondary">
                <img
                  src={about.avatarUrl}
                  alt="Edward's avatar"
                  className="w-full h-full object-cover scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Edward';
                  }}
                />
              </div>
              <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-card border-[2px] border-border px-3 py-1 rounded-full">
                <div className="w-2 h-2 rounded-full bg-neon-green" />
                <span className="text-xs font-doodle">Available</span>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-8 text-lg text-foreground/80 leading-relaxed text-center lg:text-left"
            >
              {about.bio}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="sketch-card p-6 sm:p-8 min-w-0">
              <h4 className="font-heading text-xl font-extrabold text-foreground mb-8">Skills</h4>
              {about.skills.map((skill, index) => (
                <SkillBar key={skill.name + index} skill={skill} index={index} />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-16"
        >
          {about.stats.map((stat, index) => (
            <StatCard key={stat.label + index} stat={stat} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
