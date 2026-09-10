import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Wrench, Trash2, Save, Eye, EyeOff, GripVertical } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useToast } from '@/components/Toast';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  price_range: string;
  features: string[];
  display_order: number;
  is_visible: boolean;
  is_featured: boolean;
}

const emptyService: Partial<Service> = {
  title: '', slug: '', description: '', icon: 'Building2', price_range: '',
  features: [], display_order: 0, is_visible: true, is_featured: false,
};

export function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<Partial<Service>>(emptyService);
  const [featureInput, setFeatureInput] = useState('');
  const { toast } = useToast();

  const fetchServices = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('services').select('*').order('display_order');
    setServices(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const openNew = () => { setForm(emptyService); setEditing(null); setShowForm(true); };
  const openEdit = (s: Service) => { setForm(s); setEditing(s); setShowForm(true); };

  const save = async () => {
    if (!form.title || !form.description) { toast('Title and description required', 'error'); return; }
    const slug = form.title.toLowerCase().replace(/\s+/g, '-');
    const payload = { ...form, slug, features: form.features || [] };
    if (editing) {
      const { error } = await supabase.from('services').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id);
      if (error) { toast('Failed to update', 'error'); return; }
      toast('Service updated', 'success');
    } else {
      const { error } = await supabase.from('services').insert(payload);
      if (error) { toast('Failed to create', 'error'); return; }
      toast('Service created', 'success');
    }
    setShowForm(false); fetchServices();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) { toast('Failed to delete', 'error'); return; }
    toast('Service deleted', 'success'); fetchServices();
  };

  const toggleVisible = async (s: Service) => {
    await supabase.from('services').update({ is_visible: !s.is_visible }).eq('id', s.id);
    fetchServices();
  };

  const addFeature = () => {
    if (!featureInput.trim()) return;
    setForm({ ...form, features: [...(form.features || []), featureInput.trim()] });
    setFeatureInput('');
  };

  return (
    <AdminLayout title="Services Manager">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink-500">{services.length} services</p>
        <button onClick={openNew} className="btn-primary"><Plus className="w-4 h-4" />Add Service</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)
        ) : services.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <Wrench className="w-12 h-12 mx-auto mb-3 text-ink-300 dark:text-ink-600" />
            <p className="text-ink-500 dark:text-ink-400 font-medium">No services yet</p>
          </div>
        ) : (
          services.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-ink-300" />
                  <h3 className="font-bold text-ink-900 dark:text-white">{s.title}</h3>
                </div>
                <button onClick={() => toggleVisible(s)} className="p-1.5 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800">
                  {s.is_visible ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-ink-400" />}
                </button>
              </div>
              <p className="text-sm text-ink-500 dark:text-ink-400 line-clamp-2 mb-2">{s.description}</p>
              {s.price_range && <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 mb-3">{s.price_range}</p>}
              <div className="flex flex-wrap gap-1 mb-4">
                {s.features?.slice(0, 3).map((f, j) => <span key={j} className="px-2 py-0.5 rounded-full text-xs bg-ink-100 dark:bg-ink-800 text-ink-500">{f}</span>)}
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-ink-100 dark:border-ink-800">
                <button onClick={() => openEdit(s)} className="btn-ghost text-xs flex-1">Edit</button>
                <button onClick={() => remove(s.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm z-50" onClick={() => setShowForm(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg max-h-[90vh] overflow-y-auto glass-card p-6 z-50 bg-white dark:bg-ink-900">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-ink-900 dark:text-white">{editing ? 'Edit Service' : 'New Service'}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <input className="input-field" placeholder="Title *" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <textarea className="input-field resize-none" rows={2} placeholder="Description *" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <input className="input-field" placeholder="Icon name (lucide)" value={form.icon || ''} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
                  <input className="input-field" placeholder="Price range" value={form.price_range || ''} onChange={(e) => setForm({ ...form, price_range: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-ink-400 mb-1 block">Features</label>
                  <div className="flex gap-2 mb-2">
                    <input className="input-field flex-1" placeholder="Add feature..." value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
                    <button onClick={addFeature} className="btn-secondary"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.features?.map((f, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs bg-brand-500/10 text-brand-600 flex items-center gap-1">{f}<button onClick={() => setForm({ ...form, features: form.features!.filter((_, j) => j !== i) })}><X className="w-3 h-3" /></button></span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_visible || false} onChange={(e) => setForm({ ...form, is_visible: e.target.checked })} className="w-4 h-4 accent-brand-600" />
                    <span className="text-sm text-ink-600 dark:text-ink-300">Visible</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.is_featured || false} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-brand-600" />
                    <span className="text-sm text-ink-600 dark:text-ink-300">Featured</span>
                  </label>
                </div>
                <button onClick={save} className="btn-primary w-full"><Save className="w-4 h-4" />{editing ? 'Update' : 'Create'} Service</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
