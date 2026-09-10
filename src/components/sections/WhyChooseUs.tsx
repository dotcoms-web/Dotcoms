import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { TrendingDown, TrendingUp, Check, X, BarChart3, Clock, DollarSign, Users } from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal';

function Counter({ value, suffix = '', prefix = '' }: { value: number; suffix?: string; prefix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const startTime = performance.now();
    const duration = 2000;
    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, value]);

  return <span ref={ref}>{prefix}{display.toLocaleString()}{suffix}</span>;
}

const stats = [
  { icon: Users, label: 'Businesses Launched', value: 200, suffix: '+' },
  { icon: DollarSign, label: 'Revenue Generated', value: 12, prefix: '$', suffix: 'M+' },
  { icon: Clock, label: 'Avg. Project Time', value: 3, suffix: ' wks' },
  { icon: BarChart3, label: 'Avg. Conversion Lift', value: 248, suffix: '%' },
];

const comparison = [
  { label: 'Online Visibility', old: false, new: true },
  { label: 'Customer Trust', old: false, new: true },
  { label: '24/7 Availability', old: false, new: true },
  { label: 'Online Booking/Orders', old: false, new: true },
  { label: 'Professional Branding', old: false, new: true },
  { label: 'Customer Reach', old: 'Local only', new: 'Global' },
  { label: 'Marketing Cost', old: 'High (flyers, ads)', new: 'Low (organic SEO)' },
  { label: 'Customer Data', old: 'No access', new: 'Full analytics' },
];

const timeline = [
  { year: '2018', title: 'Started Dotcoms', desc: 'Founded with a mission to help local businesses go digital.' },
  { year: '2020', title: '50+ Websites Launched', desc: 'Expanded to serve restaurants, bakeries, and corporate clients.' },
  { year: '2022', title: '$5M+ Client Revenue', desc: 'Our websites generated over $5M in tracked revenue for clients.' },
  { year: '2024', title: '200+ Businesses', desc: 'Trusted by 200+ businesses across 12 industries worldwide.' },
];

export function WhyChooseUs() {
  return (
    <section id="why-us" className="section-py relative overflow-hidden bg-ink-50/50 dark:bg-ink-900/30">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal className="max-w-3xl mb-16">
          <span className="text-sm font-semibold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
            Why Dotcoms
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-3 mb-4 text-balance">
            The difference is <span className="text-gradient">measurable</span>
          </h2>
          <p className="text-lg text-ink-500 dark:text-ink-400">
            We do not just build websites. We build revenue-generating assets that transform how businesses operate.
          </p>
        </Reveal>

        {/* Stats */}
        <Stagger className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-20" stagger={0.1}>
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className="glass-card p-6 text-center card-hover">
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-brand-500" />
                </div>
                <p className="text-3xl lg:text-4xl font-bold text-ink-900 dark:text-white font-display">
                  <Counter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Before vs After Comparison */}
        <Reveal className="mb-20">
          <h3 className="font-display text-2xl md:text-3xl font-bold text-center mb-12 text-balance">
            Old Business vs <span className="text-gradient">Digital Business</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Old */}
            <div className="glass-card p-8 border-red-200/50 dark:border-red-900/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                </div>
                <h4 className="text-lg font-bold text-ink-900 dark:text-white">Without a Website</h4>
              </div>
              <ul className="space-y-3">
                {comparison.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-ink-500 dark:text-ink-400">
                    <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span>{item.label}: <span className="font-medium text-ink-700 dark:text-ink-300">{typeof item.old === 'string' ? item.old : 'Missing'}</span></span>
                  </li>
                ))}
              </ul>
            </div>

            {/* New */}
            <div className="glass-card p-8 border-green-200/50 dark:border-green-900/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <h4 className="text-lg font-bold text-ink-900 dark:text-white">With Dotcoms</h4>
              </div>
              <ul className="space-y-3">
                {comparison.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-ink-600 dark:text-ink-300">
                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span>{item.label}: <span className="font-medium text-ink-900 dark:text-white">{typeof item.new === 'string' ? item.new : 'Included'}</span></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Timeline */}
        <Reveal>
          <h3 className="font-display text-2xl md:text-3xl font-bold text-center mb-12 text-balance">
            Our <span className="text-gradient">Journey</span>
          </h3>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-500 via-accent-500 to-transparent md:-translate-x-1/2" />
            <div className="space-y-12">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex items-center gap-6 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className="hidden md:block flex-1" />
                  <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-4 h-4 rounded-full bg-brand-500 ring-4 ring-white dark:ring-ink-950 z-10" />
                  <div className="flex-1 ml-12 md:ml-0">
                    <div className="glass-card p-5 card-hover">
                      <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{item.year}</span>
                      <h4 className="text-lg font-bold text-ink-900 dark:text-white mt-1">{item.title}</h4>
                      <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
