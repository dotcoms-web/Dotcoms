import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Star, Trash2, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useToast } from '@/components/Toast';

interface Testimonial {
  id: string;
  client_name: string;
  business: string;
  photo_url: string;
  rating: number;
  review: string;
  is_featured: boolean;
  display_order: number;
}

const emptyT: Partial<Testimonial> = { client_name: '', business: '', photo_url: '', rating: 5, review: '', is_featured: false, display_order: 0 };

export function AdminTestimonials() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<Partial<Testimonial>>(emptyT);
  const { toast } = useToast();

  const fetchItems = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('testimonials').select('*').order('display_order');
    setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const save = async () => {
    if (!form.client_name || !form.review) { toast('Name and review required', 'error'); return; }
    if (editing) {
      const { error } = await supabase.from('testimonials').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id);
      if (error) { toast('Failed to update', 'error'); return; }
      toast('Testimonial updated', 'success');
    } else {
      const { error } = await supabase.from('testimonials').insert(form);
      if (error) { toast('Failed to create', 'error'); return; }
      toast('Testimonial created', 'success');
    }
    setShowForm(false); fetchItems();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('testimonials').delete().eq('id', id);
    if (error) { toast('Failed to delete', 'error'); return; }
    toast('Deleted', 'success'); fetchItems();
  };

  return (
    <AdminLayout title="Testimonials Manager">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink-500">{items.length} testimonials</p>
        <button onClick={() => { setForm(emptyT); setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="w-4 h-4" />Add Testimonial</button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)
        ) : items.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <Star className="w-12 h-12 mx-auto mb-3 text-ink-300 dark:text-ink-600" />
            <p className="text-ink-500 dark:text-ink-400 font-medium">No testimonials yet</p>
          </div>
        ) : (
          items.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 card-hover">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white font-bold">{t.client_name.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-sm text-ink-900 dark:text-white">{t.client_name}</p>
                    <p className="text-xs text-ink-400">{t.business || 'No business'}</p>
                  </div>
                </div>
                {t.is_featured && <Star className="w-4 h-4 fill-amber-400 text-amber-400" />}
              </div>
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: t.rating }).map((_, j) => <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-sm text-ink-500 dark:text-ink-400 line-clamp-3 mb-4">"{t.review}"</p>
              <div className="flex items-center gap-2 pt-3 border-t border-ink-100 dark:border-ink-800">
                <button onClick={() => { setForm(t); setEditing(t); setShowForm(true); }} className="btn-ghost text-xs flex-1">Edit</button>
                <button onClick={() => remove(t.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm z-50" onClick={() => setShowForm(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass-card p-6 z-50 bg-white dark:bg-ink-900">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-ink-900 dark:text-white">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input className="input-field" placeholder="Client name *" value={form.client_name || ''} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
                  <input className="input-field" placeholder="Business" value={form.business || ''} onChange={(e) => setForm({ ...form, business: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs text-ink-400 mb-1 block">Rating: {form.rating} stars</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} onClick={() => setForm({ ...form, rating: n })}>
                        <Star className={`w-6 h-6 ${(form.rating || 0) >= n ? 'fill-amber-400 text-amber-400' : 'text-ink-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea className="input-field resize-none" rows={4} placeholder="Review *" value={form.review || ''} onChange={(e) => setForm({ ...form, review: e.target.value })} />
                <input className="input-field" placeholder="Photo URL (optional)" value={form.photo_url || ''} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} />
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured || false} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-brand-600" />
                  <span className="text-sm text-ink-600 dark:text-ink-300">Featured testimonial</span>
                </label>
                <button onClick={save} className="btn-primary w-full"><Save className="w-4 h-4" />{editing ? 'Update' : 'Create'} Testimonial</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
