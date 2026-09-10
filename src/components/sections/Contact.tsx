import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Reveal } from '@/components/Reveal';

interface Settings {
  contact_email: string;
  contact_phone: string;
  whatsapp_number: string;
  address: string;
}

export function Contact() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('website_settings')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000001' as never)
        .maybeSingle();
      if (data) setSettings(data as unknown as Settings);
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    const { error } = await supabase.from('contact_messages').insert({
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      message: form.message,
    });
    if (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    } else {
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  const contactCards = [
    {
      icon: Mail,
      label: 'Email Us',
      value: settings?.contact_email || 'hello@dotcoms.com',
      href: `mailto:${settings?.contact_email || 'hello@dotcoms.com'}`,
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: settings?.whatsapp_number || 'Chat with us',
      href: settings?.whatsapp_number ? `https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}` : '#',
    },
    {
      icon: Phone,
      label: 'Call Us',
      value: settings?.contact_phone || 'Schedule a call',
      href: settings?.contact_phone ? `tel:${settings.contact_phone}` : '#',
    },
    {
      icon: MapPin,
      label: 'Visit Us',
      value: settings?.address || 'Remote & On-site',
      href: '#',
    },
  ];

  return (
    <section id="contact" className="section-py relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-accent-500/10 blur-[120px]" />
      </div>

      <div className="container-px max-w-7xl mx-auto">
        <Reveal className="text-center mb-16">
          <span className="text-sm font-semibold tracking-widest text-brand-600 dark:text-brand-400 uppercase">
            Get In Touch
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mt-3 mb-4 text-balance">
            Let's build something <span className="text-gradient">remarkable</span>
          </h2>
          <p className="text-lg text-ink-500 dark:text-ink-400 max-w-2xl mx-auto">
            Book a free consultation. We'll discuss your goals and show you exactly how we can help your business grow.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Contact cards */}
          <div className="lg:col-span-5 space-y-4">
            {contactCards.map((card, i) => (
              <motion.a
                key={card.label}
                href={card.href}
                target={card.href.startsWith('http') ? '_blank' : undefined}
                rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass-card p-5 flex items-center gap-4 card-hover group"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors duration-300">
                  <card.icon className="w-6 h-6 text-brand-500" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-ink-500 dark:text-ink-400">{card.label}</p>
                  <p className="font-semibold text-ink-900 dark:text-white truncate">{card.value}</p>
                </div>
                <ArrowUpRight className="w-5 h-5 text-ink-400 group-hover:text-brand-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </motion.a>
            ))}
          </div>

          {/* Contact form */}
          <div className="lg:col-span-7">
            <Reveal delay={0.2}>
              <form onSubmit={handleSubmit} className="glass-card p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-ink-600 dark:text-ink-300 mb-2">Name *</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="input-field"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-600 dark:text-ink-300 mb-2">Email *</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="input-field"
                      placeholder="john@business.com"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-ink-600 dark:text-ink-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="input-field"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-600 dark:text-ink-300 mb-2">Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="input-field"
                      placeholder="New website project"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-600 dark:text-ink-300 mb-2">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="input-field resize-none"
                    placeholder="Tell us about your business and what you're looking for..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting' || status === 'success'}
                  className="btn-primary w-full sm:w-auto group disabled:opacity-70"
                >
                  {status === 'submitting' && 'Sending...'}
                  {status === 'success' && (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Message Sent!
                    </>
                  )}
                  {status === 'idle' && (
                    <>
                      Book Consultation
                      <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                  {status === 'error' && 'Try Again'}
                </button>

                {status === 'error' && (
                  <p className="text-sm text-red-500">Something went wrong. Please try again or email us directly.</p>
                )}
                {status === 'success' && (
                  <p className="text-sm text-green-500">We'll get back to you within 24 hours.</p>
                )}
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
