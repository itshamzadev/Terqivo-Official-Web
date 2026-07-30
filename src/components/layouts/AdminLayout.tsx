import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from '../AdminSidebar';
import AdminHeader from '../AdminHeader';
import AdminBreadcrumb from '../admin/AdminBreadcrumb';
import { Loader2 } from 'lucide-react';

export default function AdminLayout() {
  const { user, loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader setMobileOpen={setMobileOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-secondary/20 relative">
          <div className="max-w-7xl mx-auto mb-6">
            <AdminBreadcrumb />
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
