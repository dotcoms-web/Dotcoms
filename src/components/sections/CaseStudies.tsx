import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal';

interface CaseStudy {
  id: string;
  title: string;
  client_name: string;
  category: string;
  challenge: string;
  solution: string;
  result: string;
  metrics: { label: string; value: string }[];
  before_image_url: string;
  after_image_url: string;
}

export function CaseStudies() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('display_order')
        .limit(5);
      setStudies(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <section id="case-studies" className="section-py relative overflow-hidden bg-ink-50/50 dark:bg-ink-900/30">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal className="max-w-3xl mb-16">
          <span className="text-sm font-semibold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
            Case Studies
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-3 mb-4 text-balance">
            Real results for <span className="text-gradient">real businesses</span>
          </h2>
          <p className="text-lg text-ink-500 dark:text-ink-400">
            Every project tells a story of transformation. Here is how we turned challenges into growth.
          </p>
        </Reveal>

        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton h-48 rounded-2xl" />
            ))}
          </div>
        ) : (
          <Stagger className="space-y-6" stagger={0.15}>
            {studies.map((study, i) => (
              <StaggerItem key={study.id}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="glass-card overflow-hidden card-hover"
                >
                  <div className="grid lg:grid-cols-12 gap-0">
                    {/* Visual side */}
                    <div className="lg:col-span-4 relative bg-gradient-to-br from-brand-500/10 to-accent-500/10 p-8 flex flex-col justify-center min-h-[200px]">
                      <span className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-2">
                        {study.category}
                      </span>
                      <h3 className="font-display text-2xl font-bold text-ink-900 dark:text-white mb-1">{study.title}</h3>
                      <p className="text-sm text-ink-500 dark:text-ink-400">{study.client_name}</p>
                    </div>

                    {/* Content side */}
                    <div className="lg:col-span-8 p-8">
                      <div className="grid sm:grid-cols-3 gap-6 mb-6">
                        <div>
                          <span className="text-xs font-semibold text-red-500 uppercase tracking-wider">Challenge</span>
                          <p className="text-sm text-ink-600 dark:text-ink-300 mt-2 leading-relaxed">{study.challenge || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider">Solution</span>
                          <p className="text-sm text-ink-600 dark:text-ink-300 mt-2 leading-relaxed">{study.solution || 'N/A'}</p>
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-green-500 uppercase tracking-wider">Result</span>
                          <p className="text-sm text-ink-600 dark:text-ink-300 mt-2 leading-relaxed">{study.result || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Metrics */}
                      {study.metrics && study.metrics.length > 0 && (
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-ink-200 dark:border-ink-700">
                          {study.metrics.map((m, j) => (
                            <div key={j} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ink-100 dark:bg-ink-800">
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-bold text-ink-900 dark:text-white">{m.value}</span>
                              <span className="text-xs text-ink-500 dark:text-ink-400">{m.label}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </section>
  );
}
