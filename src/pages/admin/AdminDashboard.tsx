import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { 
  Briefcase, Package, BookOpen, GraduationCap, MessageSquare,
  FileText, Users, FileSignature, CheckCircle, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    services: 0,
    products: 0,
    courses: 0,
    jobs: 0,
    blog: 0,
    messages: 0,
    enrollments: 0,
    applications: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load dashboard statistics.');
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Services', value: stats.services, icon: <Briefcase />, path: '/admin/services' },
    { label: 'Total Products', value: stats.products, icon: <Package />, path: '/admin/products' },
    { label: 'Courses', value: stats.courses, icon: <BookOpen />, path: '/admin/courses' },
    { label: 'Open Jobs', value: stats.jobs, icon: <GraduationCap />, path: '/admin/jobs' },
    { label: 'Blog Posts', value: stats.blog, icon: <FileText />, path: '/admin/blog' },
    { label: 'Unread Msgs', value: stats.messages, icon: <MessageSquare />, path: '/admin/messages' },
    { label: 'New Enrollments', value: stats.enrollments, icon: <Users />, path: '/admin/enrollments' },
    { label: 'New Job Apps', value: stats.applications, icon: <FileSignature />, path: '/admin/job-applications' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight mb-2 text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground text-lg">Monitor platform activity and system status.</p>
        </div>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {statCards.map((stat, i) => (
          <motion.div key={i} variants={cardVariants}>
            <Link to={stat.path} className="group block bg-card/40 backdrop-blur-sm border border-border/60 p-6 rounded-3xl hover:border-border hover:bg-card/80 transition-all shadow-sm flex flex-col relative overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-secondary/80 border border-border/50 flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-500">
                  {React.cloneElement(stat.icon as React.ReactElement<any>, { size: 22, strokeWidth: 2 })}
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-secondary/50 opacity-0 group-hover:opacity-100 group-hover:bg-primary/10 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-4">
                  <ArrowRight size={16} className="text-primary" />
                </div>
              </div>
              <p className="text-4xl font-semibold mb-2 tracking-tight text-foreground">{loading ? '...' : stat.value}</p>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <motion.div variants={cardVariants} className="bg-card/40 backdrop-blur-sm border border-border/60 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-semibold tracking-tight mb-8 text-foreground">Recent Activity</h3>
          <div className="text-sm text-muted-foreground text-center py-20 border border-dashed border-border/60 rounded-2xl bg-secondary/20">
            Activity tracking engine is initializing.
          </div>
        </motion.div>
        
        <motion.div variants={cardVariants} className="bg-card/40 backdrop-blur-sm border border-border/60 rounded-3xl p-8 shadow-sm">
          <h3 className="text-xl font-semibold tracking-tight mb-8 text-foreground">System Status</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-5 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="font-medium text-foreground">Database Connection</span>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs rounded-full font-medium flex items-center gap-1.5"><CheckCircle size={14} strokeWidth={2.5}/> Online</span>
            </div>
            <div className="flex justify-between items-center pb-5 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="font-medium text-foreground">API Services</span>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs rounded-full font-medium flex items-center gap-1.5"><CheckCircle size={14} strokeWidth={2.5}/> Operational</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <span className="font-medium text-foreground">Storage Block</span>
              </div>
              <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs rounded-full font-medium flex items-center gap-1.5"><CheckCircle size={14} strokeWidth={2.5}/> Operational</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
