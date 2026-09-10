import { motion } from 'framer-motion';
import { Search, PenTool, Code, TestTube, Rocket, LifeBuoy } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

const steps = [
  { icon: Search, title: 'Discovery', desc: 'We learn your business, goals, and customers inside out before touching a pixel.' },
  { icon: PenTool, title: 'Research', desc: 'We study your industry, competitors, and target audience to inform every decision.' },
  { icon: Code, title: 'Design', desc: 'We craft a unique visual identity and user experience that sets you apart.' },
  { icon: TestTube, title: 'Development', desc: 'We build with modern tech for speed, SEO, and scalability from day one.' },
  { icon: Rocket, title: 'Testing', desc: 'We rigorously test across devices, browsers, and real-world scenarios.' },
  { icon: LifeBuoy, title: 'Launch & Support', desc: 'We deploy, monitor, and support your website as it grows your business.' },
];

export function Process() {
  return (
    <section id="process" className="section-py relative overflow-hidden bg-ink-50/50 dark:bg-ink-900/30">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal className="max-w-3xl mb-16">
          <span className="text-sm font-semibold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
            Our Process
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-3 mb-4 text-balance">
            From idea to <span className="text-gradient">impact</span>
          </h2>
          <p className="text-lg text-ink-500 dark:text-ink-400">
            A proven six-step process that delivers results, every time.
          </p>
        </Reveal>

        <div className="relative">
          {/* Horizontal line for desktop */}
          <div className="hidden lg:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500 opacity-30" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-6 gap-6 lg:gap-4">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative z-10 w-24 h-24 rounded-2xl glass-card flex items-center justify-center mb-4 card-hover group">
                    <step.icon className="w-8 h-8 text-brand-500 group-hover:scale-110 transition-transform duration-300" />
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center font-display">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-ink-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
