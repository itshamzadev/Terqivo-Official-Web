import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { Loader2, Edit, Trash2, Plus, X, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface Course {
  _id: string;
  title: string;
  slug: string;
  category: string;
  level: string;
  status: string;
  summary?: string;
  description?: string;
  price?: number;
  duration?: string;
  featured?: boolean;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Search and Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage) || 1;
  const displayedCourses = filteredCourses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    level: '',
    summary: '',
    description: '',
    price: 0,
    duration: '',
    featured: false,
    status: 'active'
  });

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/admin/courses');
      if (res.ok) setCourses(await res.json());
      else toast.error('Failed to load courses');
    } catch (err) {
      console.error(err);
      toast.error('Network error loading courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openAdd = () => {
    setFormData({
      title: '', slug: '', category: '', level: '', summary: '', description: '', 
      price: 0, duration: '', featured: false, status: 'active'
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (c: Course) => {
    setFormData({
      title: c.title,
      slug: c.slug,
      category: c.category,
      level: c.level,
      summary: c.summary || '',
      description: c.description || '',
      price: c.price || 0,
      duration: c.duration || '',
      featured: c.featured || false,
      status: c.status || 'active'
    });
    setEditingId(c._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    const toastId = toast.loading('Deleting course...');
    try {
      const res = await apiFetch(`/api/admin/courses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCourses();
        toast.success('Course deleted', { id: toastId });
      } else {
        toast.error('Failed to delete course', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error occurred', { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading(editingId ? 'Updating course...' : 'Adding course...');
    try {
      const url = editingId ? `/api/admin/courses/${editingId}` : '/api/admin/courses';
      const method = editingId ? 'PUT' : 'POST';
      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchCourses();
        toast.success(editingId ? 'Course updated successfully' : 'Course added successfully', { id: toastId });
      } else {
        toast.error('Failed to save course', { id: toastId });
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
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Courses</h1>
          <p className="text-muted-foreground mt-1">Manage technical education curriculum.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input 
              type="text" 
              placeholder="Search courses..." 
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
            <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Add Course</span>
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
                <th className="px-8 py-5 font-medium text-muted-foreground">Category</th>
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
              ) : displayedCourses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-muted-foreground bg-secondary/10">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <GraduationCap size={20} className="text-muted-foreground" />
                      </div>
                      <p>{searchQuery ? 'No courses match your search.' : 'No courses found. Click "Add Course" to create one.'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedCourses.map(c => (
                  <tr key={c._id} className="hover:bg-secondary/30 transition-colors group">
                    <td className="px-8 py-5 font-medium text-foreground">{c.title}</td>
                    <td className="px-8 py-5 text-muted-foreground">{c.category}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-md text-xs font-medium border ${c.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border/50'}`}>
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(c)} className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 active:scale-95">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(c._id)} className="text-muted-foreground hover:text-destructive transition-colors hover:scale-110 active:scale-95">
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
            <span className="text-muted-foreground">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCourses.length)} of {filteredCourses.length}</span>
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
                <h3 className="text-xl font-semibold tracking-tight text-foreground">{editingId ? 'Edit Course' : 'Add Course'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary-hover hover:text-foreground transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <form id="courseForm" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Title</label>
                      <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" placeholder="e.g. Advanced System Design" />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Slug</label>
                      <input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" placeholder="e.g. advanced-system-design" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Category</label>
                      <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" placeholder="e.g. Software Engineering" />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Level</label>
                      <input required value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" placeholder="e.g. Intermediate, Advanced" />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Summary</label>
                    <input required value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" placeholder="Brief summary..." />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Description</label>
                    <textarea required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none text-foreground" placeholder="Full course description..." />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Price ($)</label>
                      <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" placeholder="0.00" />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Duration</label>
                      <input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" placeholder="e.g. 12 Weeks" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Status</label>
                      <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground">
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="flex items-center h-[52px]">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.featured ? 'bg-primary border-primary' : 'bg-background border-border group-hover:border-primary/50'}`}>
                          {formData.featured && <svg viewBox="0 0 14 14" fill="none" className="w-3 h-3 text-primary-foreground"><path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor"/></svg>}
                        </div>
                        <input type="checkbox" checked={formData.featured} onChange={e => setFormData({...formData, featured: e.target.checked})} className="hidden" />
                        <span className="text-sm font-medium text-foreground select-none">Featured Course</span>
                      </label>
                    </div>
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-border/50 flex justify-end gap-3 bg-secondary/10 rounded-b-2xl">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium border border-border hover:bg-secondary transition-colors">
                  Cancel
                </button>
                <button type="submit" form="courseForm" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary-hover transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95">
                  {editingId ? 'Save Changes' : 'Add Course'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
