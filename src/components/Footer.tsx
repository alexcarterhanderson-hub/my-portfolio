import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useSite } from '@/hooks/useSite';

export default function Footer() {
  const { settings } = useSite();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border py-14">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center md:text-left">
            <a href="#home" className="text-2xl font-semibold">
              {settings.nav.logo}
              <span className="text-gradient">{settings.nav.logoAccent}</span>
            </a>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">{settings.footer.note}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex flex-wrap justify-center gap-3">
            {settings.footer.links.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border bg-card px-5 py-2 text-sm text-foreground/80 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </motion.div>

          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            © {year} {settings.nav.logo}
            {settings.nav.logoAccent} · made with <Heart className="w-3.5 h-3.5 text-neon-magenta fill-current" />
          </p>
        </div>
      </div>
    </footer>
  );
}
