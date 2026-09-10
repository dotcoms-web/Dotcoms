import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, Users, FolderKanban, Mail, TrendingUp,
  Clock, CheckCircle2, Activity, ArrowUpRight, Eye,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Reveal } from '@/components/Reveal';

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  activeProjects: number;
  pendingProjects: number;
  completedProjects: number;
  unreadMessages: number;
  totalRevenue: number;
  monthlyVisits: number;
}

interface RecentLead {
  id: string;
  name: string;
  business: string;
  status: string;
  created_at: string;
}

interface RecentMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  created_at: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0, newLeads: 0, activeProjects: 0, pendingProjects: 0,
    completedProjects: 0, unreadMessages: 0, totalRevenue: 0, monthlyVisits: 0,
  });
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [leads, projects, messages, analytics] = await Promise.all([
        supabase.from('leads').select('*'),
        supabase.from('projects').select('*'),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('analytics').select('*').gte('created_at', new Date(new Date().setDate(1)).toISOString()),
      ]);

      const allLeads = leads.data || [];
      const allProjects = projects.data || [];
      const allMessages = messages.data || [];
      const monthlyAnalytics = analytics.data || [];

      const totalRevenue = allProjects
        .filter((p) => p.payment_status === 'paid')
        .reduce((sum, p) => sum + Number(p.payment_amount || 0), 0);

      setStats({
        totalLeads: allLeads.length,
        newLeads: allLeads.filter((l) => l.status === 'new').length,
        activeProjects: allProjects.filter((p) => p.status === 'in_progress').length,
        pendingProjects: allProjects.filter((p) => p.status === 'pending').length,
        completedProjects: allProjects.filter((p) => p.status === 'completed').length,
        unreadMessages: allMessages.filter((m) => !m.is_read).length,
        totalRevenue,
        monthlyVisits: monthlyAnalytics.length,
      });

      setRecentLeads(allLeads.slice(0, 5).map((l) => ({
        id: l.id, name: l.name, business: l.business || '', status: l.status, created_at: l.created_at,
      })));
      setRecentMessages(allMessages.map((m) => ({
        id: m.id, name: m.name, email: m.email, subject: m.subject || '', created_at: m.created_at,
      })));
      setLoading(false);
    })();
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-green-500 to-emerald-500', change: '+12%' },
    { label: 'Website Visits', value: stats.monthlyVisits.toLocaleString(), icon: Eye, color: 'from-brand-500 to-accent-500', change: '+24%' },
    { label: 'Total Leads', value: stats.totalLeads.toString(), icon: Users, color: 'from-purple-500 to-pink-500', change: '+8%' },
    { label: 'Active Projects', value: stats.activeProjects.toString(), icon: FolderKanban, color: 'from-amber-500 to-orange-500', change: '+3%' },
  ];

  const projectCards = [
    { label: 'Pending', value: stats.pendingProjects, icon: Clock, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Active', value: stats.activeProjects, icon: Activity, color: 'text-brand-500 bg-brand-500/10' },
    { label: 'Completed', value: stats.completedProjects, icon: CheckCircle2, color: 'text-green-500 bg-green-500/10' },
    { label: 'Unread Messages', value: stats.unreadMessages, icon: Mail, color: 'text-red-500 bg-red-500/10' },
  ];

  const statusColors: Record<string, string> = {
    new: 'bg-brand-500/10 text-brand-600 dark:text-brand-400',
    contacted: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    qualified: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    won: 'bg-green-500/10 text-green-600 dark:text-green-400',
    lost: 'bg-red-500/10 text-red-600 dark:text-red-400',
  };

  return (
    <AdminLayout title="Dashboard">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-medium text-green-500 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" />
                {card.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-ink-900 dark:text-white font-display">{card.value}</p>
            <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Secondary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {projectCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="glass-card p-4 flex items-center gap-3"
          >
            <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}>
              <card.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-bold text-ink-900 dark:text-white">{card.value}</p>
              <p className="text-xs text-ink-500 dark:text-ink-400">{card.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Reveal>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-ink-900 dark:text-white">Recent Leads</h3>
              <a href="/admin/leads" className="text-sm text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:gap-1.5 transition-all">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
            ) : recentLeads.length === 0 ? (
              <div className="text-center py-8 text-ink-400">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No leads yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentLeads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-ink-900 dark:text-white">{lead.name}</p>
                      <p className="text-xs text-ink-500 dark:text-ink-400">{lead.business || 'No business listed'}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[lead.status] || 'bg-ink-100 text-ink-500'}`}>
                      {lead.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* Recent Messages */}
        <Reveal delay={0.1}>
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-ink-900 dark:text-white">Recent Messages</h3>
              <span className="text-xs text-ink-400">{stats.unreadMessages} unread</span>
            </div>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
            ) : recentMessages.length === 0 ? (
              <div className="text-center py-8 text-ink-400">
                <Mail className="w-10 h-10 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No messages yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {msg.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900 dark:text-white">{msg.name}</p>
                      <p className="text-xs text-ink-500 dark:text-ink-400 truncate">{msg.subject || msg.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </AdminLayout>
  );
}
