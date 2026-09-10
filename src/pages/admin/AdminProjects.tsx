import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, X, FolderKanban, Calendar, DollarSign, Trash2, Save,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useToast } from '@/components/Toast';

interface Project {
  id: string;
  client_id: string;
  title: string;
  description: string;
  status: string;
  deadline: string;
  progress: number;
  payment_status: string;
  payment_amount: number;
  notes: string;
  created_at: string;
}

interface Client {
  id: string;
  name: string;
  business: string;
}

interface ProjectUpdate {
  id: string;
  project_id: string;
  title: string;
  description: string;
  milestone_type: string;
  created_at: string;
}

const statusOptions = ['pending', 'in_progress', 'review', 'completed', 'on_hold', 'cancelled'];
const paymentOptions = ['unpaid', 'partial', 'paid', 'refunded'];

export function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Project | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', client_id: '', description: '', deadline: '', budget: '' });
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const [{ data: projData }, { data: clientData }] = await Promise.all([
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('clients').select('*'),
    ]);
    setProjects(projData || []);
    setClients(clientData || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const fetchUpdates = async (projectId: string) => {
    const { data } = await supabase.from('project_updates').select('*').eq('project_id', projectId).order('created_at', { ascending: false });
    setUpdates(data || []);
  };

  const selectProject = (p: Project) => {
    setSelected(p);
    fetchUpdates(p.id);
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const { error } = await supabase.from('projects').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) { toast('Failed to update', 'error'); }
    else { toast('Project updated', 'success'); fetchProjects(); if (selected?.id === id) setSelected({ ...selected, ...updates }); }
  };

  const createProject = async () => {
    if (!newProject.title) { toast('Title is required', 'error'); return; }
    const { error } = await supabase.from('projects').insert({
      title: newProject.title,
      client_id: newProject.client_id || null,
      description: newProject.description,
      deadline: newProject.deadline || null,
      payment_amount: newProject.budget ? parseFloat(newProject.budget) : 0,
      status: 'pending',
      progress: 0,
      payment_status: 'unpaid',
    });
    if (error) { toast('Failed to create project', 'error'); }
    else { toast('Project created', 'success'); setShowNew(false); setNewProject({ title: '', client_id: '', description: '', deadline: '', budget: '' }); fetchProjects(); }
  };

  const addUpdate = async (projectId: string, title: string, desc: string, type: string) => {
    if (!title) return;
    const { error } = await supabase.from('project_updates').insert({ project_id: projectId, title, description: desc, milestone_type: type });
    if (error) { toast('Failed to add update', 'error'); }
    else { toast('Update added', 'success'); fetchUpdates(projectId); }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    in_progress: 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
    review: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    completed: 'bg-green-500/10 text-green-600 dark:text-green-400',
    on_hold: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
    cancelled: 'bg-red-500/10 text-red-600 dark:text-red-400',
  };

  return (
    <AdminLayout title="Project Management">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink-500">{projects.length} projects</p>
        <button onClick={() => setShowNew(true)} className="btn-primary">
          <Plus className="w-4 h-4" />
          New Project
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)
        ) : projects.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <FolderKanban className="w-12 h-12 mx-auto mb-3 text-ink-300 dark:text-ink-600" />
            <p className="text-ink-500 dark:text-ink-400 font-medium">No projects yet</p>
            <p className="text-sm text-ink-400 mt-1">Create a project to get started</p>
          </div>
        ) : (
          projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => selectProject(p)}
              className="glass-card p-5 cursor-pointer card-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-ink-900 dark:text-white">{p.title}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[p.status]}`}>{p.status}</span>
              </div>
              <p className="text-sm text-ink-500 dark:text-ink-400 mb-4 line-clamp-2">{p.description || 'No description'}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-ink-400">Progress</span>
                  <span className="font-medium text-ink-600 dark:text-ink-300">{p.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-ink-100 dark:bg-ink-800 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500" style={{ width: `${p.progress}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-ink-100 dark:border-ink-800">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${p.payment_status === 'paid' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>
                  {p.payment_status}
                </span>
                {p.deadline && (
                  <span className="text-xs text-ink-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(p.deadline).toLocaleDateString()}
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* New project modal */}
      <AnimatePresence>
        {showNew && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm z-50" onClick={() => setShowNew(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg glass-card p-6 z-50 bg-white dark:bg-ink-900"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-ink-900 dark:text-white">New Project</h3>
                <button onClick={() => setShowNew(false)} className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <input className="input-field" placeholder="Project title *" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} />
                <select className="input-field" value={newProject.client_id} onChange={(e) => setNewProject({ ...newProject, client_id: e.target.value })}>
                  <option value="">Select client (optional)</option>
                  {clients.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.business}</option>)}
                </select>
                <textarea className="input-field resize-none" rows={3} placeholder="Description" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <input type="date" className="input-field" value={newProject.deadline} onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })} />
                  <input type="number" className="input-field" placeholder="Budget $" value={newProject.budget} onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })} />
                </div>
                <button onClick={createProject} className="btn-primary w-full"><Save className="w-4 h-4" />Create Project</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm z-50" onClick={() => setSelected(null)} />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-ink-900 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-ink-900 dark:text-white">{selected.title}</h3>
                  <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800"><X className="w-5 h-5" /></button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-ink-400 mb-1 block">Status</label>
                    <select className="input-field" value={selected.status} onChange={(e) => updateProject(selected.id, { status: e.target.value })}>
                      {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-ink-400 mb-1 block">Progress: {selected.progress}%</label>
                    <input type="range" min="0" max="100" value={selected.progress} onChange={(e) => updateProject(selected.id, { progress: parseInt(e.target.value) })} className="w-full accent-brand-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-ink-400 mb-1 block">Payment Status</label>
                      <select className="input-field" value={selected.payment_status} onChange={(e) => updateProject(selected.id, { payment_status: e.target.value })}>
                        {paymentOptions.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-ink-400 mb-1 block">Amount</label>
                      <input type="number" className="input-field" value={selected.payment_amount} onChange={(e) => updateProject(selected.id, { payment_amount: parseFloat(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-ink-400 mb-1 block">Deadline</label>
                    <input type="date" className="input-field" value={selected.deadline?.split('T')[0] || ''} onChange={(e) => updateProject(selected.id, { deadline: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-xs text-ink-400 mb-1 block">Notes</label>
                    <textarea className="input-field resize-none" rows={3} defaultValue={selected.notes || ''} onBlur={(e) => updateProject(selected.id, { notes: e.target.value })} placeholder="Project notes..." />
                  </div>

                  {/* Milestones */}
                  <div className="pt-4 border-t border-ink-200 dark:border-ink-800">
                    <h4 className="font-bold text-sm text-ink-900 dark:text-white mb-3">Milestones & Updates</h4>
                    <div className="space-y-2 mb-4">
                      {updates.map((u) => (
                        <div key={u.id} className="glass-card p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-600 capitalize">{u.milestone_type}</span>
                            <span className="text-xs text-ink-400">{new Date(u.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-sm font-medium text-ink-900 dark:text-white">{u.title}</p>
                          {u.description && <p className="text-xs text-ink-500 mt-1">{u.description}</p>}
                        </div>
                      ))}
                      {updates.length === 0 && <p className="text-sm text-ink-400">No updates yet</p>}
                    </div>
                    <AddUpdateForm onAdd={(t, d, type) => addUpdate(selected.id, t, d, type)} />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}

function AddUpdateForm({ onAdd }: { onAdd: (title: string, desc: string, type: string) => void }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [type, setType] = useState('update');
  return (
    <div className="glass-card p-3 space-y-2">
      <input className="input-field text-sm" placeholder="Update title..." value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="input-field text-sm resize-none" rows={2} placeholder="Description..." value={desc} onChange={(e) => setDesc(e.target.value)} />
      <div className="flex gap-2">
        <select className="input-field text-sm flex-1" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="update">Update</option>
          <option value="milestone">Milestone</option>
          <option value="note">Note</option>
          <option value="issue">Issue</option>
        </select>
        <button onClick={() => { onAdd(title, desc, type); setTitle(''); setDesc(''); }} className="btn-primary text-sm">
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
