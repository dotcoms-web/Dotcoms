import { motion } from 'framer-motion';
import {
  Building2, UtensilsCrossed, Croissant, Briefcase, ShoppingCart,
  CalendarCheck, LayoutDashboard, Search, Palette, Server,
  ArrowUpRight,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal';

const iconMap: Record<string, typeof Building2> = {
  Building2, UtensilsCrossed, Croissant, Briefcase, ShoppingCart,
  CalendarCheck, LayoutDashboard, Search, Palette, Server,
};

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  price_range: string;
  features: string[];
  is_featured: boolean;
}

export function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_visible', true)
        .order('display_order');
      setServices(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <section id="services" className="section-py relative overflow-hidden">
      <div className="container-px max-w-7xl mx-auto">
        <Reveal className="max-w-3xl mb-16">
          <span className="text-sm font-semibold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
            What We Do
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mt-3 mb-4 text-balance">
            Services built to <span className="text-gradient">grow your business</span>
          </h2>
          <p className="text-lg text-ink-500 dark:text-ink-400">
            From concept to launch, we handle every aspect of your digital presence with precision and care.
          </p>
        </Reveal>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.08}>
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Building2;
              return (
                <StaggerItem key={service.id}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="group relative h-full glass-card p-7 card-hover overflow-hidden"
                  >
                    <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-brand-500/5 group-hover:bg-brand-500/10 transition-colors duration-500" />
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center mb-5 shadow-lg shadow-brand-500/20 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-ink-900 dark:text-white mb-2">{service.title}</h3>
                      <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed mb-4">{service.description}</p>
                      {service.price_range && (
                        <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 mb-3">{service.price_range}</p>
                      )}
                      {service.features && service.features.length > 0 && (
                        <ul className="space-y-1.5">
                          {service.features.slice(0, 4).map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-xs text-ink-500 dark:text-ink-400">
                              <span className="w-1 h-1 rounded-full bg-brand-500" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-5 flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Learn more
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}
      </div>
    </section>
  );
}
