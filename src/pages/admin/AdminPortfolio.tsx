import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Briefcase, Star, Trash2, Save, ExternalLink, Github } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useToast } from '@/components/Toast';

interface PortfolioProject {
  id: string;
  title: string;
  client_name: string;
  category: string;
  description: string;
  long_description: string;
  challenge: string;
  solution: string;
  result: string;
  metrics: { label: string; value: string }[];
  live_url: string;
  github_url: string;
  technologies: string[];
  is_featured: boolean;
  display_order: number;
}

const emptyProject: Partial<PortfolioProject> = {
  title: '', client_name: '', category: '', description: '', long_description: '',
  challenge: '', solution: '', result: '', metrics: [], live_url: '', github_url: '',
  technologies: [], is_featured: false, display_order: 0,
};

export function AdminPortfolio() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PortfolioProject | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<PortfolioProject>>(emptyProject);
  const [techInput, setTechInput] = useState('');
  const [metricInput, setMetricInput] = useState({ label: '', value: '' });
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('portfolio_projects').select('*').order('display_order');
    setProjects(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const openNew = () => { setForm(emptyProject); setEditing(null); setShowForm(true); };
  const openEdit = (p: PortfolioProject) => { setForm(p); setEditing(p); setShowForm(true); };

  const save = async () => {
    if (!form.title || !form.category) { toast('Title and category are required', 'error'); return; }
    const slug = form.title.toLowerCase().replace(/\s+/g, '-');
    const payload = { ...form, slug, metrics: form.metrics || [], technologies: form.technologies || [] };

    if (editing) {
      const { error } = await supabase.from('portfolio_projects').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id);
      if (error) { toast('Failed to update', 'error'); return; }
      toast('Portfolio updated', 'success');
    } else {
      const { error } = await supabase.from('portfolio_projects').insert(payload);
      if (error) { toast('Failed to create', 'error'); return; }
      toast('Portfolio created', 'success');
    }
    setShowForm(false);
    fetchProjects();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
    if (error) { toast('Failed to delete', 'error'); return; }
    toast('Project deleted', 'success');
    fetchProjects();
  };

  const addTech = () => {
    if (!techInput.trim()) return;
    setForm({ ...form, technologies: [...(form.technologies || []), techInput.trim()] });
    setTechInput('');
  };

  const addMetric = () => {
    if (!metricInput.label || !metricInput.value) return;
    setForm({ ...form, metrics: [...(form.metrics || []), { ...metricInput }] });
    setMetricInput({ label: '', value: '' });
  };

  return (
    <AdminLayout title="Portfolio Manager">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink-500">{projects.length} projects</p>
        <button onClick={openNew} className="btn-primary">
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-48 rounded-2xl" />)
        ) : projects.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-ink-300 dark:text-ink-600" />
            <p className="text-ink-500 dark:text-ink-400 font-medium">No portfolio projects</p>
            <p className="text-sm text-ink-400 mt-1">Add your first project to showcase</p>
          </div>
        ) : (
          projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5 card-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-ink-900 dark:text-white">{p.title}</h3>
                  <p className="text-xs text-ink-400">{p.category}</p>
                </div>
                {p.is_featured && <Star className="w-4 h-4 fill-amber-400 text-amber-400" />}
              </div>
              <p className="text-sm text-ink-500 dark:text-ink-400 line-clamp-2 mb-3">{p.description}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {p.technologies?.slice(0, 3).map((t, j) => (
                  <span key={j} className="px-2 py-0.5 rounded-full text-xs bg-ink-100 dark:bg-ink-800 text-ink-500">{t}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-ink-100 dark:border-ink-800">
                <button onClick={() => openEdit(p)} className="btn-ghost text-xs flex-1">Edit</button>
                <button onClick={() => remove(p.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm z-50" onClick={() => setShowForm(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card p-6 z-50 bg-white dark:bg-ink-900"
            >
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-ink-900 pb-4 -mx-6 px-6 border-b border-ink-200 dark:border-ink-800">
                <h3 className="text-lg font-bold text-ink-900 dark:text-white">{editing ? 'Edit Project' : 'New Project'}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input className="input-field" placeholder="Title *" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  <input className="input-field" placeholder="Client name" value={form.client_name || ''} onChange={(e) => setForm({ ...form, client_name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input className="input-field" placeholder="Category *" value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                  <input type="number" className="input-field" placeholder="Display order" value={form.display_order || 0} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
                </div>
                <textarea className="input-field resize-none" rows={2} placeholder="Short description" value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                <textarea className="input-field resize-none" rows={3} placeholder="Long description" value={form.long_description || ''} onChange={(e) => setForm({ ...form, long_description: e.target.value })} />
                <div className="grid grid-cols-3 gap-3">
                  <textarea className="input-field resize-none text-sm" rows={2} placeholder="Challenge" value={form.challenge || ''} onChange={(e) => setForm({ ...form, challenge: e.target.value })} />
                  <textarea className="input-field resize-none text-sm" rows={2} placeholder="Solution" value={form.solution || ''} onChange={(e) => setForm({ ...form, solution: e.target.value })} />
                  <textarea className="input-field resize-none text-sm" rows={2} placeholder="Result" value={form.result || ''} onChange={(e) => setForm({ ...form, result: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input className="input-field" placeholder="Live URL" value={form.live_url || ''} onChange={(e) => setForm({ ...form, live_url: e.target.value })} />
                  <input className="input-field" placeholder="GitHub URL" value={form.github_url || ''} onChange={(e) => setForm({ ...form, github_url: e.target.value })} />
                </div>

                {/* Technologies */}
                <div>
                  <label className="text-xs text-ink-400 mb-1 block">Technologies</label>
                  <div className="flex gap-2 mb-2">
                    <input className="input-field flex-1" placeholder="Add tech..." value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())} />
                    <button onClick={addTech} className="btn-secondary"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.technologies?.map((t, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs bg-brand-500/10 text-brand-600 flex items-center gap-1">
                        {t}
                        <button onClick={() => setForm({ ...form, technologies: form.technologies!.filter((_, j) => j !== i) })}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div>
                  <label className="text-xs text-ink-400 mb-1 block">Metrics</label>
                  <div className="flex gap-2 mb-2">
                    <input className="input-field flex-1" placeholder="Label" value={metricInput.label} onChange={(e) => setMetricInput({ ...metricInput, label: e.target.value })} />
                    <input className="input-field flex-1" placeholder="Value" value={metricInput.value} onChange={(e) => setMetricInput({ ...metricInput, value: e.target.value })} />
                    <button onClick={addMetric} className="btn-secondary"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.metrics?.map((m, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs bg-ink-100 dark:bg-ink-800 flex items-center gap-1">
                        {m.label}: {m.value}
                        <button onClick={() => setForm({ ...form, metrics: form.metrics!.filter((_, j) => j !== i) })}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured || false} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-brand-600" />
                  <span className="text-sm text-ink-600 dark:text-ink-300">Featured project</span>
                </label>

                <button onClick={save} className="btn-primary w-full"><Save className="w-4 h-4" />{editing ? 'Update Project' : 'Create Project'}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
