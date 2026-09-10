import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-white dark:bg-ink-950"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative">
              <motion.div
                className="flex items-center gap-1 text-3xl font-bold tracking-tight font-display"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-ink-900 dark:text-white">DOT</span>
                <span className="text-gradient">COMS</span>
              </motion.div>
              <motion.div
                className="absolute -inset-4 rounded-full bg-brand-500/10 blur-2xl"
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="loader-dot" />
              <span className="loader-dot" />
              <span className="loader-dot" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
