import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Building2, Palette, Mail, Share2, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useToast } from '@/components/Toast';

const SETTINGS_ID = '00000000-0000-0000-0000-000000000001';

export function AdminSettings() {
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('website_settings').select('*').eq('id', SETTINGS_ID).maybeSingle();
      if (data) setForm(data as Record<string, string>);
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from('website_settings').update({ ...form, updated_at: new Date().toISOString() }).eq('id', SETTINGS_ID);
    setSaving(false);
    if (error) { toast('Failed to save settings', 'error'); return; }
    toast('Settings saved', 'success');
  };

  const update = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  if (loading) return <AdminLayout title="Website Settings"><div className="skeleton h-96 rounded-2xl" /></AdminLayout>;

  const sections = [
    {
      icon: Building2,
      title: 'Company Information',
      fields: [
        { key: 'company_name', label: 'Company Name' },
        { key: 'company_tagline', label: 'Tagline' },
        { key: 'logo_url', label: 'Logo URL' },
        { key: 'favicon_url', label: 'Favicon URL' },
      ],
    },
    {
      icon: Palette,
      title: 'Branding',
      fields: [
        { key: 'primary_color', label: 'Primary Color' },
        { key: 'accent_color', label: 'Accent Color' },
        { key: 'hero_headline', label: 'Hero Headline' },
        { key: 'hero_subheadline', label: 'Hero Subheadline' },
      ],
    },
    {
      icon: Mail,
      title: 'Contact Information',
      fields: [
        { key: 'contact_email', label: 'Contact Email' },
        { key: 'contact_phone', label: 'Contact Phone' },
        { key: 'whatsapp_number', label: 'WhatsApp Number' },
        { key: 'address', label: 'Address' },
      ],
    },
    {
      icon: Share2,
      title: 'Social Links',
      fields: [
        { key: 'facebook_url', label: 'Facebook URL' },
        { key: 'twitter_url', label: 'Twitter URL' },
        { key: 'instagram_url', label: 'Instagram URL' },
        { key: 'linkedin_url', label: 'LinkedIn URL' },
      ],
    },
    {
      icon: Search,
      title: 'SEO & Analytics',
      fields: [
        { key: 'meta_title', label: 'Meta Title' },
        { key: 'meta_description', label: 'Meta Description' },
        { key: 'google_analytics_id', label: 'Google Analytics ID' },
      ],
    },
  ];

  return (
    <AdminLayout title="Website Settings">
      <div className="max-w-3xl space-y-6">
        {sections.map((section, si) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
                <section.icon className="w-5 h-5 text-brand-500" />
              </div>
              <h3 className="font-bold text-ink-900 dark:text-white">{section.title}</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-ink-600 dark:text-ink-300 mb-2">{field.label}</label>
                  <input
                    className="input-field"
                    value={form[field.key] || ''}
                    onChange={(e) => update(field.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <button onClick={save} disabled={saving} className="btn-primary w-full sm:w-auto group disabled:opacity-70">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save All Settings'}
        </button>
      </div>
    </AdminLayout>
  );
}
