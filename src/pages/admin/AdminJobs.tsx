import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { Loader2, Edit, Trash2, Plus, X, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface Job {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  workType: string;
  experienceLevel: string;
  description: string;
  responsibilities: string;
  requirements: string;
  status: string;
}

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Search and Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    j.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    j.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;
  const displayedJobs = filteredJobs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    department: '',
    location: '',
    workType: '',
    experienceLevel: '',
    description: '',
    responsibilities: '',
    requirements: '',
    status: 'open'
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/admin/jobs');
      if (res.ok) setJobs(await res.json());
      else toast.error('Failed to load jobs');
    } catch (err) {
      console.error(err);
      toast.error('Network error loading jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const openAdd = () => {
    setFormData({
      title: '', slug: '', department: '', location: '', workType: '', 
      experienceLevel: '', description: '', responsibilities: '', 
      requirements: '', status: 'open'
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (j: Job) => {
    setFormData({
      title: j.title,
      slug: j.slug,
      department: j.department,
      location: j.location,
      workType: j.workType,
      experienceLevel: j.experienceLevel,
      description: j.description || '',
      responsibilities: j.responsibilities || '',
      requirements: j.requirements || '',
      status: j.status || 'open'
    });
    setEditingId(j._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    const toastId = toast.loading('Deleting job...');
    try {
      const res = await apiFetch(`/api/admin/jobs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchJobs();
        toast.success('Job deleted', { id: toastId });
      } else {
        toast.error('Failed to delete job', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error occurred', { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading(editingId ? 'Updating job...' : 'Adding job...');
    try {
      const url = editingId ? `/api/admin/jobs/${editingId}` : '/api/admin/jobs';
      const method = editingId ? 'PUT' : 'POST';
      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchJobs();
        toast.success(editingId ? 'Job updated successfully' : 'Job added successfully', { id: toastId });
      } else {
        toast.error('Failed to save job', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error occurred', { id: toastId });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Jobs</h1>
          <p className="text-muted-foreground mt-1">Manage open positions and career opportunities.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input 
              type="text" 
              placeholder="Search jobs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-card/50 backdrop-blur-sm border border-border/60 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
          </div>
          <button 
            onClick={openAdd}
            className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover transition-all duration-300 flex items-center gap-2 shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
          >
            <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Add Job</span>
          </button>
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-2xl overflow-hidden shadow-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/50 border-b border-border/60">
              <tr>
                <th className="px-8 py-5 font-medium text-muted-foreground">Title</th>
                <th className="px-8 py-5 font-medium text-muted-foreground">Department</th>
                <th className="px-8 py-5 font-medium text-muted-foreground">Status</th>
                <th className="px-8 py-5 font-medium text-muted-foreground w-[150px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : displayedJobs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-muted-foreground bg-secondary/10">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <Briefcase size={20} className="text-muted-foreground" />
                      </div>
                      <p>{searchQuery ? 'No jobs match your search.' : 'No jobs found. Click "Add Job" to create one.'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedJobs.map(j => (
                  <tr key={j._id} className="hover:bg-secondary/30 transition-colors group">
                    <td className="px-8 py-5 font-medium text-foreground">{j.title}</td>
                    <td className="px-8 py-5 text-muted-foreground">{j.department}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-md text-xs font-medium border ${j.status === 'open' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border/50'}`}>
                        {j.status.charAt(0).toUpperCase() + j.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(j)} className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 active:scale-95">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(j._id)} className="text-muted-foreground hover:text-destructive transition-colors hover:scale-110 active:scale-95">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="p-4 border-t border-border/60 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredJobs.length)} of {filteredJobs.length}</span>
            <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1} 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                className="px-3 py-1.5 border border-border/60 rounded-md hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-foreground"
              >
                Previous
              </button>
              <span className="px-2 text-muted-foreground font-medium">{currentPage} / {totalPages}</span>
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                className="px-3 py-1.5 border border-border/60 rounded-md hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-foreground"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
              className="bg-card border border-border/60 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative z-10"
            >
              <div className="flex justify-between items-center p-6 border-b border-border/50">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">{editingId ? 'Edit Job' : 'Add Job'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary-hover hover:text-foreground transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <form id="jobForm" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Title</label>
                      <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" placeholder="e.g. Senior Frontend Engineer" />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Slug</label>
                      <input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" placeholder="e.g. senior-frontend-engineer" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Department</label>
                      <input required value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" placeholder="e.g. Engineering" />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Location</label>
                      <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" placeholder="e.g. New York, Remote" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Work Type</label>
                      <input required value={formData.workType} onChange={e => setFormData({...formData, workType: e.target.value})} placeholder="e.g. Full-time, Contract" className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Experience Level</label>
                      <input required value={formData.experienceLevel} onChange={e => setFormData({...formData, experienceLevel: e.target.value})} placeholder="e.g. Mid-Level, Senior" className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Description</label>
                    <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none text-foreground" placeholder="Job overview..." />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Responsibilities (New line for each point)</label>
                    <textarea required rows={4} value={formData.responsibilities} onChange={e => setFormData({...formData, responsibilities: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none text-foreground" placeholder="- Lead architecture...&#10;- Mentor junior..." />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Requirements (New line for each point)</label>
                    <textarea required rows={4} value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none text-foreground" placeholder="- 5+ years of React...&#10;- Strong CS fundamentals..." />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Status</label>
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground">
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-border/50 flex justify-end gap-3 bg-secondary/10 rounded-b-2xl">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium border border-border hover:bg-secondary transition-colors">
                  Cancel
                </button>
                <button type="submit" form="jobForm" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary-hover transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95">
                  {editingId ? 'Save Changes' : 'Add Job'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
