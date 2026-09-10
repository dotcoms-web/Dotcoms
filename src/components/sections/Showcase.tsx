import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Monitor, Tablet, Smartphone, ArrowUpRight, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Reveal } from '@/components/Reveal';

interface PortfolioProject {
  id: string;
  title: string;
  client_name: string;
  category: string;
  description: string;
  live_url: string;
  technologies: string[];
  metrics: { label: string; value: string }[];
}

type Device = 'laptop' | 'tablet' | 'mobile';

export function Showcase() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [active, setActive] = useState(0);
  const [device, setDevice] = useState<Device>('laptop');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('display_order');
      setProjects(data || []);
      setLoading(false);
    })();
  }, []);

  const project = projects[active];

  const deviceSizes: Record<Device, { w: string; h: string; rounded: string }> = {
    laptop: { w: 'w-full max-w-3xl', h: 'h-[420px]', rounded: 'rounded-2xl' },
    tablet: { w: 'w-[480px]', h: 'h-[600px]', rounded: 'rounded-3xl' },
    mobile: { w: 'w-[280px]', h: 'h-[560px]', rounded: 'rounded-[2.5rem]' },
  };

  return (
    <section id="showcase" className="section-py relative overflow-hidden">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal className="max-w-3xl mb-16">
          <span className="text-sm font-semibold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
            Live Work
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-3 mb-4 text-balance">
            Interactive <span className="text-gradient">website showcase</span>
          </h2>
          <p className="text-lg text-ink-500 dark:text-ink-400">
            Do not just look at screenshots. Explore our projects across devices.
          </p>
        </Reveal>

        {/* Device switcher */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {(['laptop', 'tablet', 'mobile'] as Device[]).map((d) => {
            const Icon = d === 'laptop' ? Monitor : d === 'tablet' ? Tablet : Smartphone;
            return (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  device === d
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                    : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300 hover:bg-ink-200 dark:hover:bg-ink-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="capitalize hidden sm:inline">{d}</span>
              </button>
            );
          })}
        </div>

        {/* Showcase area */}
        <div className="relative flex items-center justify-center min-h-[500px] mb-12">
          {loading ? (
            <div className="skeleton w-full max-w-3xl h-[420px] rounded-2xl" />
          ) : project ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${active}-${device}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className={`relative ${deviceSizes[device].w} ${deviceSizes[device].h} ${deviceSizes[device].rounded} bg-gradient-to-br from-ink-100 to-ink-200 dark:from-ink-800 dark:to-ink-900 border border-ink-200 dark:border-ink-700 shadow-2xl overflow-hidden`}
              >
                {/* Browser chrome for laptop */}
                {device === 'laptop' && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-ink-200 dark:bg-ink-800 border-b border-ink-300 dark:border-ink-700">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 mx-4 h-6 rounded-md bg-white dark:bg-ink-900 flex items-center px-3">
                      <span className="text-xs text-ink-400 truncate">{project.live_url || `dotcoms.com/work/${project.title.toLowerCase().replace(/\s+/g, '-')}`}</span>
                    </div>
                  </div>
                )}

                {/* Mock website content */}
                <div className="flex-1 p-6 md:p-8 overflow-hidden h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500" />
                      <span className="font-bold text-sm text-ink-900 dark:text-white">{project.client_name}</span>
                    </div>
                    <div className="flex gap-4 text-xs text-ink-400">
                      <span>Home</span><span>About</span><span>Menu</span><span>Contact</span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="h-8 w-3/4 rounded-lg bg-ink-300 dark:bg-ink-700 mb-3"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="h-4 w-1/2 rounded-lg bg-ink-200 dark:bg-ink-800 mb-6"
                    />
                    <div className="flex gap-3 mb-8">
                      <div className="h-10 w-28 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
                      <div className="h-10 w-28 rounded-full bg-ink-200 dark:bg-ink-800" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          className="aspect-square rounded-xl bg-gradient-to-br from-ink-200 to-ink-300 dark:from-ink-700 dark:to-ink-800"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : null}
        </div>

        {/* Project info + selector */}
        {!loading && project && (
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                {project.category}
              </span>
              <h3 className="font-display text-3xl font-bold text-ink-900 dark:text-white">{project.title}</h3>
              <p className="text-ink-500 dark:text-ink-400">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300">
                    {tech}
                  </span>
                ))}
              </div>
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 hover:gap-2.5 transition-all">
                  Visit live site <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="lg:col-span-7">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {project.metrics?.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-5 text-center"
                  >
                    <p className="text-2xl font-bold text-gradient font-display">{m.value}</p>
                    <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">{m.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Project selector dots */}
        {!loading && projects.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {projects.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setActive(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  active === i ? 'w-10 bg-brand-600' : 'w-2 bg-ink-300 dark:bg-ink-700'
                }`}
                aria-label={`View ${p.title}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
