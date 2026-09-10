import { motion } from 'framer-motion';
import { ArrowUpRight, Play, Star, TrendingUp, Users, Globe, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

function AnimatedNumber({ value, suffix = '', duration = 2000 }: { value: number; suffix?: string; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const startTime = performance.now();
    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = eased * value;
      setDisplay(Math.floor(start));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <>{display.toLocaleString()}{suffix}</>;
}

function FloatingCard({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: delay * 2 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 dark:opacity-20" />
        <motion.div
          className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-brand-500/20 dark:bg-brand-500/10 blur-[120px]"
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          style={{ translateX: mousePos.x, translateY: mousePos.y }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-accent-500/20 dark:bg-accent-500/10 blur-[120px]"
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          style={{ translateX: -mousePos.x, translateY: -mousePos.y }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full bg-brand-400/10 dark:bg-brand-400/5 blur-[100px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="container-px max-w-7xl mx-auto w-full relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8"
            >
              <span className="flex h-2 w-2 relative">
                <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-sm font-medium text-ink-600 dark:text-ink-300">Available for new projects</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.05] text-balance"
            >
              <span className="text-ink-900 dark:text-white">Websites That</span>
              <br />
              <span className="text-gradient">Grow Businesses.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-6 text-lg lg:text-xl text-ink-500 dark:text-ink-400 max-w-xl leading-relaxed"
            >
              We design high-converting business websites that help companies earn more customers.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <a href="#contact" className="btn-primary group">
                Start Project
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a href="#showcase" className="btn-secondary group">
                <Play className="w-4 h-4 fill-current" />
                View Live Work
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="mt-12 flex items-center gap-6"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-ink-900 bg-gradient-to-br from-brand-400 to-accent-400 flex items-center justify-center text-white text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-ink-500 dark:text-ink-400">
                  <span className="font-semibold text-ink-900 dark:text-white">200+</span> businesses launched
                </p>
              </div>
            </motion.div>
          </div>

          {/* Right: Floating UI cards */}
          <div className="lg:col-span-5 relative h-[400px] lg:h-[560px] hidden md:block">
            <div className="absolute inset-0 perspective-1000">
              {/* Main card - Conversion rate */}
              <FloatingCard delay={0.5} className="absolute top-8 left-4 lg:left-8 z-20">
                <div className="glass-card p-5 w-56 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-ink-500 dark:text-ink-400">Conversion Rate</span>
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="text-3xl font-bold text-ink-900 dark:text-white">
                    <AnimatedNumber value={248} suffix="%" />
                  </div>
                  <div className="mt-3 flex items-end gap-1 h-10">
                    {[30, 45, 35, 60, 50, 75, 65, 90].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 0.6, delay: 1 + i * 0.08 }}
                        className="flex-1 rounded-t bg-gradient-to-t from-brand-500 to-accent-400"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-green-500 mt-2 font-medium">+248% since launch</p>
                </div>
              </FloatingCard>

              {/* Card - Visitors */}
              <FloatingCard delay={0.7} className="absolute top-32 right-0 z-30">
                <div className="glass-card p-5 w-52 shadow-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-brand-500" />
                    </div>
                    <div>
                      <p className="text-xs text-ink-500 dark:text-ink-400">Monthly Visitors</p>
                      <p className="text-xl font-bold text-ink-900 dark:text-white">
                        <AnimatedNumber value={48200} />
                      </p>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '82%' }}
                      transition={{ duration: 1.2, delay: 1.5 }}
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                    />
                  </div>
                </div>
              </FloatingCard>

              {/* Card - Revenue */}
              <FloatingCard delay={0.9} className="absolute bottom-20 left-8 z-20">
                <div className="glass-card p-5 w-60 shadow-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-ink-500 dark:text-ink-400">Revenue Impact</span>
                    <Globe className="w-4 h-4 text-brand-500" />
                  </div>
                  <p className="text-3xl font-bold text-gradient">
                    $<AnimatedNumber value={184} />K
                  </p>
                  <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">Additional monthly revenue</p>
                </div>
              </FloatingCard>

              {/* Card - Speed */}
              <FloatingCard delay={1.1} className="absolute bottom-8 right-4 z-30">
                <div className="glass-card p-4 w-44 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs text-ink-500 dark:text-ink-400">Load Time</p>
                      <p className="text-xl font-bold text-ink-900 dark:text-white">0.8s</p>
                    </div>
                  </div>
                </div>
              </FloatingCard>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-ink-300 dark:border-ink-600 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-ink-400 dark:bg-ink-500" />
        </motion.div>
      </motion.div>
    </section>
  );
}
