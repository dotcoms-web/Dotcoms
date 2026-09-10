import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function FAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('faq')
        .select('*')
        .eq('is_visible', true)
        .order('display_order');
      setFaqs(data || []);
      if (data && data.length > 0) setOpen(data[0].id);
      setLoading(false);
    })();
  }, []);

  return (
    <section id="faq" className="section-py relative overflow-hidden">
      <div className="container-px max-w-4xl mx-auto">
        <Reveal className="text-center mb-16">
          <span className="text-sm font-semibold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
            FAQ
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-3 mb-4 text-balance">
            Questions? <span className="text-gradient">Answered.</span>
          </h2>
          <p className="text-lg text-ink-500 dark:text-ink-400">
            Everything you need to know before starting your project.
          </p>
        </Reveal>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-16 rounded-2xl" />
            ))}
          </div>
        ) : (
          <Stagger className="space-y-3" stagger={0.06}>
            {faqs.map((faq) => {
              const isOpen = open === faq.id;
              return (
                <StaggerItem key={faq.id}>
                  <div className={`glass-card overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-lg shadow-brand-500/5' : ''}`}>
                    <button
                      onClick={() => setOpen(isOpen ? null : faq.id)}
                      className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
                    >
                      <span className={`font-semibold text-base md:text-lg transition-colors duration-200 ${isOpen ? 'text-brand-600 dark:text-brand-400' : 'text-ink-900 dark:text-white'}`}>
                        {faq.question}
                      </span>
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-brand-600 rotate-180' : 'bg-ink-100 dark:bg-ink-800'}`}>
                        {isOpen ? (
                          <Minus className="w-4 h-4 text-white" />
                        ) : (
                          <Plus className="w-4 h-4 text-ink-600 dark:text-ink-300" />
                        )}
                      </div>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
                        >
                          <p className="px-5 md:px-6 pb-5 md:pb-6 text-ink-500 dark:text-ink-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}
      </div>
    </section>
  );
}
