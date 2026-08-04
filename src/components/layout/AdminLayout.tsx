import { Outlet, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAdminAuth } from '../auth/AdminAuthContext';
import { LayoutDashboard, Package, Briefcase, GraduationCap, FileText, MessageSquare, Settings, LogOut, Users, FileSignature, UserCheck, Coins, WalletCards, Mail, MailOpen, ScrollText } from 'lucide-react';

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading, logout } = useAdminAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-muted/20">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Services', path: '/admin/services', icon: Briefcase },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Courses', path: '/admin/courses', icon: GraduationCap },
    { name: 'Currencies', path: '/admin/currencies', icon: Coins },
    { name: 'Payment Accounts', path: '/admin/payment-accounts', icon: WalletCards },
    { name: 'Enrollments', path: '/admin/enrollments', icon: UserCheck },
    { name: 'Jobs', path: '/admin/jobs', icon: Users },
    { name: 'Applications', path: '/admin/applications', icon: FileSignature },
    { name: 'Blog', path: '/admin/blog', icon: FileText },
    { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
    { name: 'Email Settings', path: '/admin/email-settings', icon: Mail },
    { name: 'Email Templates', path: '/admin/email-templates', icon: MailOpen },
    { name: 'Email Logs', path: '/admin/email-logs', icon: ScrollText },
    { name: 'Public Users', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/admin/dashboard" className="font-heading font-bold text-xl text-primary">TERQIVO Admin</Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-muted/10">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
