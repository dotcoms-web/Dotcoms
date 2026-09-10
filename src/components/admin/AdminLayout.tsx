import { type ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FolderKanban, Briefcase, Wrench,
  Star, FileText, Image, Settings, LogOut, Menu, X, Bell,
  Search, ChevronDown, ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/Toast';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
  { label: 'Leads', icon: Users, path: '/admin/leads' },
  { label: 'Projects', icon: FolderKanban, path: '/admin/projects' },
  { label: 'Portfolio', icon: Briefcase, path: '/admin/portfolio' },
  { label: 'Services', icon: Wrench, path: '/admin/services' },
  { label: 'Testimonials', icon: Star, path: '/admin/testimonials' },
  { label: 'Blog', icon: FileText, path: '/admin/blog' },
  { label: 'Media', icon: Image, path: '/admin/media' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    toast('Signed out successfully', 'info');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-ink-900 border-r border-ink-200 dark:border-ink-800 fixed h-screen z-30">
        <div className="p-6">
          <Link to="/admin/dashboard" className="flex items-center gap-0.5 text-xl font-bold tracking-tight font-display">
            <span className="text-ink-900 dark:text-white">DOT</span>
            <span className="text-gradient">COMS</span>
          </Link>
          <span className="text-xs text-ink-400 mt-1 block">Admin Panel</span>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                    : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-ink-200 dark:border-ink-800">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            View Website
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink-950/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-ink-900 z-50 lg:hidden flex flex-col"
            >
              <div className="p-6 flex items-center justify-between">
                <Link to="/admin/dashboard" onClick={() => setSidebarOpen(false)} className="flex items-center gap-0.5 text-xl font-bold font-display">
                  <span className="text-ink-900 dark:text-white">DOT</span>
                  <span className="text-gradient">COMS</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 px-3 space-y-1 overflow-y-auto" onClick={() => setSidebarOpen(false)}>
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-brand-600 text-white'
                          : 'text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="p-3 border-t border-ink-200 dark:border-ink-800">
                <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-20 glass border-b border-ink-200/50 dark:border-ink-800/50 px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-ink-900 dark:text-white">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-ink-100 dark:bg-ink-800">
              <Search className="w-4 h-4 text-ink-400" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent text-sm text-ink-700 dark:text-ink-200 placeholder-ink-400 focus:outline-none w-40"
              />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors">
              <Bell className="w-5 h-5 text-ink-600 dark:text-ink-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500" />
            </button>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
                </div>
                <ChevronDown className="w-4 h-4 text-ink-400 hidden md:block" />
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-56 glass-card p-2 shadow-xl z-50"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-ink-200 dark:border-ink-700 mb-1">
                      <p className="text-sm font-medium text-ink-900 dark:text-white truncate">{user?.email}</p>
                      <p className="text-xs text-ink-400">Administrator</p>
                    </div>
                    <Link to="/" target="_blank" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                      View Website
                    </Link>
                    <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
