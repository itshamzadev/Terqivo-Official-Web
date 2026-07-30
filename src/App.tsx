import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AdminLayout from './components/layouts/AdminLayout';

// Lazy loading Public Pages
const HomePage = React.lazy(() => import('./pages/public/HomePage'));
const AboutPage = React.lazy(() => import('./pages/public/AboutPage'));
const ServicesPage = React.lazy(() => import('./pages/public/ServicesPage'));
const ServiceDetailsPage = React.lazy(() => import('./pages/public/ServiceDetailsPage'));
const ProductsPage = React.lazy(() => import('./pages/public/ProductsPage'));
const ProductDetailsPage = React.lazy(() => import('./pages/public/ProductDetailsPage'));
const CoursesPage = React.lazy(() => import('./pages/public/CoursesPage'));
const CourseDetailsPage = React.lazy(() => import('./pages/public/CourseDetailsPage'));
const JobsPage = React.lazy(() => import('./pages/public/JobsPage'));
const JobDetailsPage = React.lazy(() => import('./pages/public/JobDetailsPage'));
const BlogPage = React.lazy(() => import('./pages/public/BlogPage'));
const BlogDetailsPage = React.lazy(() => import('./pages/public/BlogDetailsPage'));
const ContactPage = React.lazy(() => import('./pages/public/ContactPage'));
const CeoFounderPage = React.lazy(() => import('./pages/public/CeoFounderPage'));
const PrivacyPolicyPage = React.lazy(() => import('./pages/public/PrivacyPolicyPage'));
const TermsPage = React.lazy(() => import('./pages/public/TermsPage'));
const NotFoundPage = React.lazy(() => import('./pages/public/NotFoundPage'));

// Lazy loading Admin Pages
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminServices = React.lazy(() => import('./pages/admin/AdminServices'));
const AdminProducts = React.lazy(() => import('./pages/admin/AdminProducts'));
const AdminCourses = React.lazy(() => import('./pages/admin/AdminCourses'));
const AdminJobs = React.lazy(() => import('./pages/admin/AdminJobs'));
const AdminBlog = React.lazy(() => import('./pages/admin/AdminBlog'));
const AdminMessages = React.lazy(() => import('./pages/admin/AdminMessages'));
const AdminEnrollments = React.lazy(() => import('./pages/admin/AdminEnrollments'));
const AdminJobApplications = React.lazy(() => import('./pages/admin/AdminJobApplications'));
const AdminPages = React.lazy(() => import('./pages/admin/AdminPages'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));

const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[60vh]">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SettingsProvider>
          <ThemeProvider>
          <Toaster 
            position="top-center" 
            toastOptions={{ 
              style: { 
                background: 'hsl(var(--card))', 
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))' 
              } 
            }} 
          />
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="services/:slug" element={<ServiceDetailsPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="products/:slug" element={<ProductDetailsPage />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="courses/:slug" element={<CourseDetailsPage />} />
                <Route path="jobs" element={<JobsPage />} />
                <Route path="jobs/:slug" element={<JobDetailsPage />} />
                <Route path="careers" element={<JobsPage />} />
                <Route path="careers/:slug" element={<JobDetailsPage />} />
                <Route path="blog" element={<BlogPage />} />
                <Route path="blog/:slug" element={<BlogDetailsPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="ceo-founder" element={<CeoFounderPage />} />
                <Route path="privacy" element={<PrivacyPolicyPage />} />
                <Route path="terms" element={<TermsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="services" element={<AdminServices />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="enrollments" element={<AdminEnrollments />} />
                <Route path="jobs" element={<AdminJobs />} />
                <Route path="job-applications" element={<AdminJobApplications />} />
                <Route path="blog" element={<AdminBlog />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="pages" element={<AdminPages />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
          </ThemeProvider>
      </SettingsProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}
