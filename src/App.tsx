import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { type ReactNode } from 'react';
import { ThemeProvider } from '@/lib/theme';
import { AuthProvider, useAuth } from '@/lib/auth';
import { ToastProvider } from '@/components/Toast';
import { LandingPage } from '@/pages/LandingPage';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminLeads } from '@/pages/admin/AdminLeads';
import { AdminProjects } from '@/pages/admin/AdminProjects';
import { AdminPortfolio } from '@/pages/admin/AdminPortfolio';
import { AdminServices } from '@/pages/admin/AdminServices';
import { AdminTestimonials } from '@/pages/admin/AdminTestimonials';
import { AdminBlog } from '@/pages/admin/AdminBlog';
import { AdminMedia } from '@/pages/admin/AdminMedia';
import { AdminSettings } from '@/pages/admin/AdminSettings';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950">
        <div className="flex items-center gap-1.5">
          <span className="loader-dot" />
          <span className="loader-dot" />
          <span className="loader-dot" />
        </div>
      </div>
    );
  }
  if (!session) return <Navigate to="/admin" replace />;
  return <>{children}</>;
}

function AdminLoginRoute() {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950">
        <div className="flex items-center gap-1.5">
          <span className="loader-dot" />
          <span className="loader-dot" />
          <span className="loader-dot" />
        </div>
      </div>
    );
  }
  if (session) return <Navigate to="/admin/dashboard" replace />;
  return <AdminLogin />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/admin" element={<AdminLoginRoute />} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/leads" element={<ProtectedRoute><AdminLeads /></ProtectedRoute>} />
              <Route path="/admin/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
              <Route path="/admin/portfolio" element={<ProtectedRoute><AdminPortfolio /></ProtectedRoute>} />
              <Route path="/admin/services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
              <Route path="/admin/testimonials" element={<ProtectedRoute><AdminTestimonials /></ProtectedRoute>} />
              <Route path="/admin/blog" element={<ProtectedRoute><AdminBlog /></ProtectedRoute>} />
              <Route path="/admin/media" element={<ProtectedRoute><AdminMedia /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
