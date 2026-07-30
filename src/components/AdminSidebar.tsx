import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Package, 
  BookOpen, 
  GraduationCap,
  MessageSquare,
  FileText,
  Users,
  Settings,
  LogOut,
  Code2,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';

const menuItems = [
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard', path: '/admin' },
  { icon: <Briefcase size={18} />, label: 'Services', path: '/admin/services' },
  { icon: <Package size={18} />, label: 'Products', path: '/admin/products' },
  { icon: <BookOpen size={18} />, label: 'Courses', path: '/admin/courses' },
  { icon: <Users size={18} />, label: 'Enrollments', path: '/admin/enrollments' },
  { icon: <GraduationCap size={18} />, label: 'Jobs', path: '/admin/jobs' },
  { icon: <FileText size={18} />, label: 'Job Apps', path: '/admin/job-applications' },
  { icon: <FileText size={18} />, label: 'Blog', path: '/admin/blog' },
  { icon: <MessageSquare size={18} />, label: 'Messages', path: '/admin/messages' },
  { icon: <FileText size={18} />, label: 'Pages Content', path: '/admin/pages' },
  { icon: <Settings size={18} />, label: 'Settings', path: '/admin/settings' }
];

export default function AdminSidebar({ mobileOpen = false, setMobileOpen }: { mobileOpen?: boolean, setMobileOpen?: (open: boolean) => void }) {
  const location = useLocation();
  const { logout } = useAuth();

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-border/50 flex items-center justify-between shrink-0">
        <Link to="/admin" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground group-hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20">
            <Code2 size={16} strokeWidth={2.5} />
          </div>
          <span className="font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">Admin Portal</span>
        </Link>
        {setMobileOpen && (
          <button className="md:hidden text-muted-foreground hover:text-foreground transition-colors" onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-4">
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative group ${
                  isActive 
                    ? 'text-primary-foreground bg-primary shadow-lg shadow-primary/20' 
                    : 'text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
                }`}
              >
                {item.icon}
                <span className="relative z-10">{item.label}</span>
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-secondary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-border/50 shrink-0">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-300 w-full group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-background border-r border-border/50 h-screen flex-col hidden md:flex shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setMobileOpen && setMobileOpen(false)}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-72 bg-background border-r border-border/50 z-50 flex flex-col md:hidden shadow-2xl"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
