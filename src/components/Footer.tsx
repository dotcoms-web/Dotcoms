import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowUp, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Reveal } from '@/components/Reveal';

interface FooterSettings {
  company_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  facebook_url: string;
  twitter_url: string;
  instagram_url: string;
  linkedin_url: string;
}

export function Footer() {
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('website_settings')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000001' as never)
        .maybeSingle();
      if (data) setSettings(data as unknown as FooterSettings);
    })();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const { error } = await supabase.from('newsletter').insert({ email });
    if (!error) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const socials = [
    { icon: Facebook, url: settings?.facebook_url, label: 'Facebook' },
    { icon: Twitter, url: settings?.twitter_url, label: 'Twitter' },
    { icon: Instagram, url: settings?.instagram_url, label: 'Instagram' },
    { icon: Linkedin, url: settings?.linkedin_url, label: 'LinkedIn' },
  ].filter((s) => s.url);

  const links = [
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#showcase' },
    { label: 'Case Studies', href: '#case-studies' },
    { label: 'ROI Calculator', href: '#roi' },
    { label: 'Process', href: '#process' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-ink-200 dark:border-ink-800 bg-ink-50/50 dark:bg-ink-900/30">
      <div className="container-px max-w-7xl mx-auto py-16">
        {/* Newsletter CTA */}
        <Reveal className="mb-16">
          <div className="glass-card p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h3 className="font-display text-2xl md:text-3xl font-bold text-ink-900 dark:text-white mb-3">
              Get website tips that <span className="text-gradient">grow your business</span>
            </h3>
            <p className="text-ink-500 dark:text-ink-400 mb-6">
              Join 5,000+ business owners getting our weekly insights. No spam, ever.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="input-field flex-1"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
            {subscribed && <p className="text-sm text-green-500 mt-3">You're in! Check your inbox.</p>}
          </div>
        </Reveal>

        {/* Main footer */}
        <div className="grid md:grid-cols-12 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-0.5 text-2xl font-bold tracking-tight font-display mb-4">
              <span className="text-ink-900 dark:text-white">DOT</span>
              <span className="text-gradient">COMS</span>
            </button>
            <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed mb-6 max-w-xs">
              We design high-converting business websites that help companies earn more customers.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all duration-300 group"
                >
                  <s.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-bold text-ink-900 dark:text-white uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-ink-500 dark:text-ink-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors duration-200"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-5">
            <h4 className="text-sm font-bold text-ink-900 dark:text-white uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href={`mailto:${settings?.contact_email || 'hello@dotcoms.com'}`} className="flex items-center gap-3 text-sm text-ink-500 dark:text-ink-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                  <Mail className="w-4 h-4" />
                  {settings?.contact_email || 'hello@dotcoms.com'}
                </a>
              </li>
              {settings?.contact_phone && (
                <li>
                  <a href={`tel:${settings.contact_phone}`} className="flex items-center gap-3 text-sm text-ink-500 dark:text-ink-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                    <Phone className="w-4 h-4" />
                    {settings.contact_phone}
                  </a>
                </li>
              )}
              {settings?.address && (
                <li className="flex items-center gap-3 text-sm text-ink-500 dark:text-ink-400">
                  <MapPin className="w-4 h-4" />
                  {settings.address}
                </li>
              )}
            </ul>
            <a href="#contact" className="btn-primary mt-6 group">
              Start Your Project
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-ink-200 dark:border-ink-800">
          <p className="text-sm text-ink-400 dark:text-ink-500">
            &copy; {new Date().getFullYear()} {settings?.company_name || 'Dotcoms'}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="/admin" className="text-sm text-ink-400 dark:text-ink-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Admin
            </a>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-brand-500 hover:text-white transition-all duration-300 group"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
