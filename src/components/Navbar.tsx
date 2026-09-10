import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Menu, X, Moon, Sun, ArrowUpRight } from 'lucide-react';
import { useTheme } from '@/lib/theme';

const navLinks = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#showcase' },
  { label: 'Case Studies', href: '#case-studies' },
  { label: 'ROI Calculator', href: '#roi' },
  { label: 'Process', href: '#process' },
  { label: 'FAQ', href: '#faq' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-[9990] transition-all duration-500 ${
          scrolled
            ? 'glass shadow-sm shadow-ink-900/5'
            : 'bg-transparent'
        }`}
      >
        <nav className="container-px max-w-7xl mx-auto flex items-center justify-between h-16 md:h-20">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-0.5 text-xl font-bold tracking-tight font-display">
            <span className="text-ink-900 dark:text-white">DOT</span>
            <span className="text-gradient">COMS</span>
          </button>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="px-4 py-2 text-sm font-medium text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white transition-colors duration-200"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-ink-600" />
              ) : (
                <Sun className="w-4 h-4 text-ink-300" />
              )}
            </button>
            <button
              onClick={() => scrollTo('#contact')}
              className="hidden sm:inline-flex btn-primary !py-2.5 !px-5 group"
            >
              Start Project
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2.5 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-ink-700 dark:text-ink-200" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9995] lg:hidden"
          >
            <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white dark:bg-ink-900 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-bold font-display">
                  <span className="text-ink-900 dark:text-white">DOT</span>
                  <span className="text-gradient">COMS</span>
                </span>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <motion.button
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => scrollTo(link.href)}
                    className="text-left px-4 py-3 text-lg font-medium text-ink-700 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800 rounded-xl transition-colors"
                  >
                    {link.label}
                  </motion.button>
                ))}
              </div>
              <button onClick={() => scrollTo('#contact')} className="btn-primary mt-6 w-full">
                Start Project
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
