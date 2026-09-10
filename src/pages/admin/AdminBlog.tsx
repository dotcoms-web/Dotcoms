import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, FileText, Trash2, Save, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useToast } from '@/components/Toast';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category_id: string;
  tags: string[];
  featured_image_url: string;
  meta_title: string;
  meta_description: string;
  status: string;
  published_at: string;
  author_name: string;
}

interface BlogCategory {
  id: string;
  name: string;
}

const emptyPost: Partial<BlogPost> = { title: '', slug: '', excerpt: '', content: '', tags: [], featured_image_url: '', meta_title: '', meta_description: '', status: 'draft', author_name: 'Dotcoms' };

export function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<Partial<BlogPost>>(emptyPost);
  const [tagInput, setTagInput] = useState('');
  const { toast } = useToast();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const [{ data: postData }, { data: catData }] = await Promise.all([
      supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
      supabase.from('blog_categories').select('*'),
    ]);
    setPosts(postData || []);
    setCategories(catData || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const save = async () => {
    if (!form.title || !form.content) { toast('Title and content required', 'error'); return; }
    const slug = form.title.toLowerCase().replace(/\s+/g, '-');
    const payload = { ...form, slug, tags: form.tags || [], published_at: form.status === 'published' ? new Date().toISOString() : null };
    if (editing) {
      const { error } = await supabase.from('blog_posts').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editing.id);
      if (error) { toast('Failed to update', 'error'); return; }
      toast('Post updated', 'success');
    } else {
      const { error } = await supabase.from('blog_posts').insert(payload);
      if (error) { toast('Failed to create', 'error'); return; }
      toast('Post created', 'success');
    }
    setShowForm(false); fetchPosts();
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) { toast('Failed to delete', 'error'); return; }
    toast('Post deleted', 'success'); fetchPosts();
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setForm({ ...form, tags: [...(form.tags || []), tagInput.trim()] });
    setTagInput('');
  };

  return (
    <AdminLayout title="Blog CMS">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink-500">{posts.length} posts</p>
        <button onClick={() => { setForm(emptyPost); setEditing(null); setShowForm(true); }} className="btn-primary"><Plus className="w-4 h-4" />New Post</button>
      </div>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 mx-auto mb-3 text-ink-300 dark:text-ink-600" />
            <p className="text-ink-500 dark:text-ink-400 font-medium">No blog posts yet</p>
          </div>
        ) : (
          posts.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4 flex items-center gap-4 card-hover">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-brand-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-ink-900 dark:text-white truncate">{p.title}</p>
                <p className="text-xs text-ink-400 truncate">{p.excerpt || p.content.slice(0, 80) + '...'}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize shrink-0 ${p.status === 'published' ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>{p.status}</span>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => { setForm(p); setEditing(p); setShowForm(true); }} className="btn-ghost text-xs">Edit</button>
                <button onClick={() => remove(p.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm z-50" onClick={() => setShowForm(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card p-6 z-50 bg-white dark:bg-ink-900">
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-ink-900 pb-4 -mx-6 px-6 border-b border-ink-200 dark:border-ink-800">
                <h3 className="text-lg font-bold text-ink-900 dark:text-white">{editing ? 'Edit Post' : 'New Post'}</h3>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <input className="input-field" placeholder="Title *" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                <input className="input-field" placeholder="Excerpt" value={form.excerpt || ''} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
                <textarea className="input-field resize-none" rows={8} placeholder="Content (supports HTML)" value={form.content || ''} onChange={(e) => setForm({ ...form, content: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <select className="input-field" value={form.category_id || ''} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                    <option value="">No category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select className="input-field" value={form.status || 'draft'} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-ink-400 mb-1 block">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <input className="input-field flex-1" placeholder="Add tag..." value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())} />
                    <button onClick={addTag} className="btn-secondary"><Plus className="w-4 h-4" /></button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {form.tags?.map((t, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs bg-brand-500/10 text-brand-600 flex items-center gap-1">{t}<button onClick={() => setForm({ ...form, tags: form.tags!.filter((_, j) => j !== i) })}><X className="w-3 h-3" /></button></span>
                    ))}
                  </div>
                </div>
                <input className="input-field" placeholder="Featured image URL" value={form.featured_image_url || ''} onChange={(e) => setForm({ ...form, featured_image_url: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <input className="input-field" placeholder="Meta title (SEO)" value={form.meta_title || ''} onChange={(e) => setForm({ ...form, meta_title: e.target.value })} />
                  <input className="input-field" placeholder="Meta description (SEO)" value={form.meta_description || ''} onChange={(e) => setForm({ ...form, meta_description: e.target.value })} />
                </div>
                <button onClick={save} className="btn-primary w-full"><Save className="w-4 h-4" />{editing ? 'Update' : 'Create'} Post</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
