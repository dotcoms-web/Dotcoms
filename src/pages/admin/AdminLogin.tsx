import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/Toast';

export function AdminLogin() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'login') {
      const { error: err } = await signIn(email, password);
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        toast('Welcome back!', 'success');
        navigate('/admin/dashboard');
      }
    } else {
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      const { error: err } = await signUp(email, password, fullName);
      if (err) {
        setError(err);
        setLoading(false);
      } else {
        toast('Account created! Welcome to Dotcoms Admin.', 'success');
        navigate('/admin/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-950 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-600/15 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="glass-card p-8 bg-ink-900/80 border-ink-700/50">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="flex items-center gap-0.5 text-2xl font-bold tracking-tight font-display mb-8">
            <span className="text-white">DOT</span>
            <span className="text-gradient">COMS</span>
          </button>

          <h1 className="text-2xl font-bold text-white mb-1">
            {mode === 'login' ? 'Admin Login' : 'Create Admin Account'}
          </h1>
          <p className="text-sm text-ink-400 mb-8">
            {mode === 'login' ? 'Sign in to manage your dashboard' : 'Set up your admin account to get started'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-ink-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-ink-800 border border-ink-700 text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-transparent transition-all"
                    placeholder="John Smith"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-ink-800 border border-ink-700 text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-transparent transition-all"
                  placeholder="admin@dotcoms.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-ink-800 border border-ink-700 text-white placeholder-ink-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-brand-600 text-white font-semibold text-sm transition-all duration-300 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-500/30 disabled:opacity-60 group"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
              className="text-sm text-ink-400 hover:text-brand-400 transition-colors"
            >
              {mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="mt-6 mx-auto flex items-center gap-2 text-sm text-ink-500 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to website
        </button>
      </motion.div>
    </div>
  );
}
