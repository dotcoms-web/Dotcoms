import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Reveal } from '@/components/Reveal';

interface Testimonial {
  id: string;
  client_name: string;
  business: string;
  photo_url: string;
  rating: number;
  review: string;
}

export function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .order('display_order');
      setTestimonials(data || []);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      setDirection(1);
      setActive((p) => (p + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const go = (dir: number) => {
    setDirection(dir);
    setActive((p) => (p + dir + testimonials.length) % testimonials.length);
  };

  const t = testimonials[active];

  return (
    <section id="testimonials" className="section-py relative overflow-hidden">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal className="max-w-3xl mb-16">
          <span className="text-sm font-semibold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-3 mb-4 text-balance">
            Loved by <span className="text-gradient">businesses</span>
          </h2>
          <p className="text-lg text-ink-500 dark:text-ink-400">
            Real reviews from real clients who grew with Dotcoms.
          </p>
        </Reveal>

        {loading ? (
          <div className="skeleton h-64 rounded-2xl max-w-3xl mx-auto" />
        ) : t ? (
          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
                transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="glass-card p-8 md:p-12"
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-2xl font-bold font-display">
                      {t.client_name.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <Quote className="w-10 h-10 text-brand-500/20 mb-4" />
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-lg md:text-xl text-ink-700 dark:text-ink-200 leading-relaxed mb-6">
                      "{t.review}"
                    </p>
                    <div>
                      <p className="font-bold text-ink-900 dark:text-white">{t.client_name}</p>
                      <p className="text-sm text-ink-500 dark:text-ink-400">{t.business}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  onClick={() => go(-1)}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        active === i ? 'w-8 bg-brand-600' : 'w-2 bg-ink-300 dark:bg-ink-700'
                      }`}
                      aria-label={`Testimonial ${i + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => go(1)}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
