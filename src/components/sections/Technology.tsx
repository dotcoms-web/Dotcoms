import { motion } from 'framer-motion';
import { Atom, Type, Database, Wind, Zap, Cloud, Github, Smartphone } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal';

const tech = [
  { icon: Atom, name: 'React', desc: 'Component-driven UI' },
  { icon: Type, name: 'TypeScript', desc: 'Type-safe development' },
  { icon: Database, name: 'Supabase', desc: 'Postgres + Auth + Storage' },
  { icon: Wind, name: 'TailwindCSS', desc: 'Utility-first styling' },
  { icon: Zap, name: 'Framer Motion', desc: 'Buttery animations' },
  { icon: Cloud, name: 'Cloud Hosting', desc: 'Global edge network' },
  { icon: Github, name: 'GitHub', desc: 'Version control & CI/CD' },
  { icon: Smartphone, name: 'Responsive', desc: 'Mobile-first design' },
];

export function Technology() {
  return (
    <section id="technology" className="section-py relative overflow-hidden bg-ink-50/50 dark:bg-ink-900/30">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal className="max-w-3xl mb-16">
          <span className="text-sm font-semibold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
            Technology
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-3 mb-4 text-balance">
            Built with the <span className="text-gradient">best tools</span>
          </h2>
          <p className="text-lg text-ink-500 dark:text-ink-400">
            We use modern, battle-tested technologies so your website is fast, secure, and future-proof.
          </p>
        </Reveal>

        <Stagger className="grid grid-cols-2 sm:grid-cols-4 gap-4" stagger={0.08}>
          {tech.map((t) => (
            <StaggerItem key={t.name}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="glass-card p-6 text-center card-hover group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500/10 to-accent-500/10 flex items-center justify-center mx-auto mb-4 group-hover:from-brand-500/20 group-hover:to-accent-500/20 transition-all duration-300">
                  <t.icon className="w-7 h-7 text-brand-500 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="font-bold text-ink-900 dark:text-white text-sm mb-1">{t.name}</h3>
                <p className="text-xs text-ink-500 dark:text-ink-400">{t.desc}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
