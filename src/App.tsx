/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import { SettingsProvider } from './components/SettingsContext';
import { Toaster } from 'sonner';
import { PublicLayout } from './components/layout/PublicLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import Home from './pages/public/Home';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Services from './pages/public/Services';
import ServiceDetails from './pages/public/ServiceDetails';
import Products from './pages/public/Products';
import ProductDetails from './pages/public/ProductDetails';
import Courses from './pages/public/Courses';
import CourseDetails from './pages/public/CourseDetails';
import CourseEnroll from './pages/public/CourseEnroll';
import Jobs from './pages/public/Jobs';
import JobDetails from './pages/public/JobDetails';
import JobApply from './pages/public/JobApply';
import Blog from './pages/public/Blog';
import BlogPostDetails from './pages/public/BlogPostDetails';
import CeoFounder from './pages/public/CeoFounder';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsConditions from './pages/public/TermsConditions';
import NotFound from './pages/public/NotFound';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminServices from './pages/admin/AdminServices';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCourses from './pages/admin/AdminCourses';
import AdminJobs from './pages/admin/AdminJobs';
import AdminBlog from './pages/admin/AdminBlog';
import AdminMessages from './pages/admin/AdminMessages';
import AdminEnrollments from './pages/admin/AdminEnrollments';
import AdminApplications from './pages/admin/AdminApplications';
import AdminSettings from './pages/admin/AdminSettings';

// Placeholder components for public routes
const Placeholder = ({ title }: { title: string }) => (
  <div className="container mx-auto px-4 py-20 text-center">
    <h1 className="text-4xl font-heading font-bold mb-4">{title}</h1>
    <p className="text-muted-foreground">This page is under construction.</p>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
        <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="about/ceo" element={<CeoFounder />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:slug" element={<ServiceDetails />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:slug" element={<ProductDetails />} />
          <Route path="courses" element={<Courses />} />
          <Route path="courses/:slug" element={<CourseDetails />} />
          <Route path="courses/:slug/enroll" element={<CourseEnroll />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="jobs/:slug" element={<JobDetails />} />
          <Route path="jobs/:slug/apply" element={<JobApply />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:slug" element={<BlogPostDetails />} />
          <Route path="contact" element={<Contact />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<TermsConditions />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="enrollments" element={<AdminEnrollments />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
        <Toaster position="top-right" richColors />
      </SettingsProvider>
      </AuthProvider>
  );
}
