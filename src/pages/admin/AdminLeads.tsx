import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Download, X, Phone, Mail, Building2,
  Star, ChevronLeft, ChevronRight, Users,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useToast } from '@/components/Toast';

interface Lead {
  id: string;
  name: string;
  business: string;
  phone: string;
  email: string;
  whatsapp: string;
  service_interested: string;
  budget: string;
  message: string;
  status: string;
  priority: string;
  notes: string;
  created_at: string;
}

const statusOptions = ['new', 'contacted', 'qualified', 'proposal_sent', 'won', 'lost'];
const priorityOptions = ['low', 'medium', 'high', 'urgent'];
const PAGE_SIZE = 10;

export function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Lead | null>(null);
  const { toast } = useToast();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    let query = supabase.from('leads').select('*', { count: 'exact' }).order('created_at', { ascending: false });

    if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,business.ilike.%${search}%`);
    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    if (priorityFilter !== 'all') query = query.eq('priority', priorityFilter);

    query = query.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    const { data, count } = await query;
    setLeads(data || []);
    setTotal(count || 0);
    setLoading(false);
  }, [search, statusFilter, priorityFilter, page]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateLead = async (id: string, updates: Partial<Lead>) => {
    const { error } = await supabase.from('leads').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) {
      toast('Failed to update lead', 'error');
    } else {
      toast('Lead updated', 'success');
      fetchLeads();
      if (selected && selected.id === id) setSelected({ ...selected, ...updates });
    }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Business', 'Email', 'Phone', 'WhatsApp', 'Service', 'Budget', 'Status', 'Priority', 'Created'];
    const rows = leads.map((l) => [l.name, l.business, l.email, l.phone, l.whatsapp, l.service_interested, l.budget, l.status, l.priority, l.created_at]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c || ''}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast('Leads exported to CSV', 'success');
  };

  const statusColors: Record<string, string> = {
    new: 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
    contacted: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    qualified: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    proposal_sent: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    won: 'bg-green-500/10 text-green-600 dark:text-green-400',
    lost: 'bg-red-500/10 text-red-600 dark:text-red-400',
  };

  const priorityColors: Record<string, string> = {
    low: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
    medium: 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
    high: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    urgent: 'bg-red-500/10 text-red-600 dark:text-red-400',
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AdminLayout title="Leads Management">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            placeholder="Search leads..."
            className="input-field pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="input-field sm:w-40"
        >
          <option value="all">All Status</option>
          {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => { setPriorityFilter(e.target.value); setPage(0); }}
          className="input-field sm:w-40"
        >
          <option value="all">All Priority</option>
          {priorityOptions.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <button onClick={exportCSV} className="btn-secondary whitespace-nowrap">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
        ) : leads.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-12 h-12 mx-auto mb-3 text-ink-300 dark:text-ink-600" />
            <p className="text-ink-500 dark:text-ink-400 font-medium">No leads found</p>
            <p className="text-sm text-ink-400 mt-1">Leads from your website contact form will appear here</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-200 dark:border-ink-800 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase hidden md:table-cell">Business</th>
                  <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase hidden lg:table-cell">Service</th>
                  <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase hidden sm:table-cell">Priority</th>
                  <th className="px-4 py-3 text-xs font-semibold text-ink-500 uppercase hidden lg:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelected(lead)}
                    className="border-b border-ink-100 dark:border-ink-800/50 hover:bg-ink-50 dark:hover:bg-ink-800/30 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-ink-900 dark:text-white">{lead.name}</p>
                      <p className="text-xs text-ink-400">{lead.email}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <p className="text-sm text-ink-600 dark:text-ink-300">{lead.business || '—'}</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-sm text-ink-600 dark:text-ink-300">{lead.service_interested || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateLead(lead.id, { status: e.target.value })}
                        className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer capitalize ${statusColors[lead.status]}`}
                      >
                        {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <select
                        value={lead.priority}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateLead(lead.id, { priority: e.target.value })}
                        className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 cursor-pointer capitalize ${priorityColors[lead.priority]}`}
                      >
                        {priorityOptions.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <p className="text-sm text-ink-400">{new Date(lead.created_at).toLocaleDateString()}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-ink-200 dark:border-ink-800">
            <p className="text-sm text-ink-500">
              Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-2 text-sm font-medium">{page + 1} / {totalPages}</span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink-950/40 backdrop-blur-sm z-50"
              onClick={() => setSelected(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-ink-900 z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-ink-900 dark:text-white">Lead Details</h3>
                  <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xl font-bold">
                      {selected.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-ink-900 dark:text-white">{selected.name}</p>
                      <p className="text-sm text-ink-500">{selected.business || 'No business'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <a href={`mailto:${selected.email}`} className="glass-card p-3 flex items-center gap-2 text-sm hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                      <Mail className="w-4 h-4 text-brand-500" />
                      <span className="truncate text-ink-600 dark:text-ink-300">{selected.email}</span>
                    </a>
                    {selected.phone && (
                      <a href={`tel:${selected.phone}`} className="glass-card p-3 flex items-center gap-2 text-sm hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-colors">
                        <Phone className="w-4 h-4 text-brand-500" />
                        <span className="text-ink-600 dark:text-ink-300">{selected.phone}</span>
                      </a>
                    )}
                  </div>

                  {selected.service_interested && (
                    <div>
                      <p className="text-xs text-ink-400 mb-1">Service Interested</p>
                      <p className="text-sm text-ink-700 dark:text-ink-200">{selected.service_interested}</p>
                    </div>
                  )}
                  {selected.budget && (
                    <div>
                      <p className="text-xs text-ink-400 mb-1">Budget</p>
                      <p className="text-sm text-ink-700 dark:text-ink-200">{selected.budget}</p>
                    </div>
                  )}
                  {selected.message && (
                    <div>
                      <p className="text-xs text-ink-400 mb-1">Message</p>
                      <p className="text-sm text-ink-700 dark:text-ink-200 leading-relaxed">{selected.message}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-ink-400 mb-1 block">Notes</label>
                    <textarea
                      defaultValue={selected.notes || ''}
                      onBlur={(e) => updateLead(selected.id, { notes: e.target.value })}
                      className="input-field resize-none"
                      rows={3}
                      placeholder="Add notes..."
                    />
                  </div>

                  <div className="flex gap-2">
                    {selected.whatsapp && (
                      <a
                        href={`https://wa.me/${selected.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary flex-1"
                      >
                        WhatsApp
                      </a>
                    )}
                    <a href={`mailto:${selected.email}`} className="btn-secondary flex-1">Reply</a>
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
