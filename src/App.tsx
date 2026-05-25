import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import TemplatesPage from './pages/TemplatesPage';
import CoursesPage from './pages/CoursesPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import FreeToolsPage from './pages/FreeToolsPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import AtsCheckerPage from './pages/AtsCheckerPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCourses from './pages/admin/AdminCourses';
import AdminTemplates from './pages/admin/AdminTemplates';
import AdminBlog from './pages/admin/AdminBlog';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import ProfilePage from './pages/dashboard/ProfilePage';
import UserCoursesPage from './pages/dashboard/CoursesPage';
import UserTemplatesPage from './pages/dashboard/TemplatesPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import { supabase } from './lib/supabase';

function App() {
  const { user, setUser } = useAuthStore();
  const { isDark } = useThemeStore();

  // Initialize auth state and apply theme
  useEffect(() => {
    const initAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    initAuth();
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Check if user is admin
  const isAdmin = user?.email === 'skillstash.official@gmail.com';

  // Protected route wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      return <Navigate to="/" />;
    }
    return <>{children}</>;
  };

  // Admin route wrapper
  const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAdmin) {
      return <Navigate to="/" />;
    }
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/free-tools" element={<FreeToolsPage />} />
            <Route path="/ats-checker" element={<AtsCheckerPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />

            {/* Protected dashboard routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ProfilePage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/profile" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ProfilePage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/courses" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UserCoursesPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/templates" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UserTemplatesPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/wishlist" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold mb-4 text-gray-100">Wishlist</h1>
                    <p className="text-gray-400">Your wishlist items will appear here.</p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/billing" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold mb-4 text-gray-100">Billing</h1>
                    <p className="text-gray-400">Your billing information will appear here.</p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard/settings" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="text-center py-12">
                    <h1 className="text-2xl font-bold mb-4 text-gray-100">Settings</h1>
                    <p className="text-gray-400">Account settings will appear here.</p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Admin routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/courses" element={
              <AdminRoute>
                <AdminCourses />
              </AdminRoute>
            } />
            <Route path="/admin/templates" element={
              <AdminRoute>
                <AdminTemplates />
              </AdminRoute>
            } />
            <Route path="/admin/blog" element={
              <AdminRoute>
                <AdminBlog />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            } />
            <Route path="/admin/analytics" element={
              <AdminRoute>
                <AdminAnalytics />
              </AdminRoute>
            } />
            <Route path="/admin/settings" element={
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;