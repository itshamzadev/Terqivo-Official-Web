import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { Loader2, Edit, Trash2, Plus, X, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  status: string;
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Search and Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage) || 1;
  const displayedServices = filteredServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    status: 'active'
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/admin/services');
      if (res.ok) setServices(await res.json());
      else toast.error('Failed to load services');
    } catch (err) {
      console.error(err);
      toast.error('Network error loading services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/api/admin/services/${editingId}` : '/api/admin/services';
    const method = editingId ? 'PUT' : 'POST';
    const toastId = toast.loading(editingId ? 'Updating service...' : 'Creating service...');
    
    try {
      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchServices();
        toast.success(editingId ? 'Service updated successfully' : 'Service created successfully', { id: toastId });
      } else {
        toast.error('Failed to save service', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error occurred', { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    const toastId = toast.loading('Deleting service...');
    try {
      const res = await apiFetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchServices();
        toast.success('Service deleted', { id: toastId });
      } else {
        toast.error('Failed to delete service', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error occurred', { id: toastId });
    }
  };

  const openAdd = () => {
    setFormData({ title: '', slug: '', shortDescription: '', fullDescription: '', status: 'active' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Services</h1>
          <p className="text-muted-foreground mt-1">Manage your platform's service offerings.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <input 
              type="text" 
              placeholder="Search services..." 
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
            <Plus size={18} strokeWidth={2.5} /> <span className="hidden sm:inline">Add Service</span>
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
                <th className="px-8 py-5 font-medium text-muted-foreground">Status</th>
                <th className="px-8 py-5 font-medium text-muted-foreground w-[150px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : displayedServices.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-muted-foreground bg-secondary/10">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <Briefcase size={20} className="text-muted-foreground" />
                      </div>
                      <p>{searchQuery ? 'No services match your search.' : 'No services found. Click "Add Service" to create one.'}</p>
                    </div>
                  </td>
                </tr>
              ) : (
                displayedServices.map(service => (
                  <tr key={service._id} className="hover:bg-secondary/30 transition-colors group">
                    <td className="px-8 py-5 font-medium text-foreground">{service.title}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 text-xs rounded-md font-medium border ${service.status === 'active' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border/50'}`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setFormData({ ...formData, ...service });
                            setEditingId(service._id);
                            setIsModalOpen(true);
                          }}
                          className="text-muted-foreground hover:text-primary transition-colors hover:scale-110 active:scale-95"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(service._id)}
                          className="text-muted-foreground hover:text-destructive transition-colors hover:scale-110 active:scale-95"
                        >
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
            <span className="text-muted-foreground">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredServices.length)} of {filteredServices.length}</span>
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

      {/* Modal */}
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
              className="bg-card border border-border/60 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative z-10 shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-border/50">
                <h3 className="text-xl font-semibold tracking-tight text-foreground">{editingId ? 'Edit Service' : 'Add New Service'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-secondary-hover hover:text-foreground transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <form id="serviceForm" onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Title</label>
                      <input 
                        required
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" 
                        placeholder="e.g. Enterprise Architecture"
                      />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Slug</label>
                      <input 
                        required
                        value={formData.slug}
                        onChange={e => setFormData({...formData, slug: e.target.value})}
                        className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground"
                        placeholder="e.g. enterprise-architecture" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Short Description</label>
                    <textarea 
                      required
                      value={formData.shortDescription}
                      onChange={e => setFormData({...formData, shortDescription: e.target.value})}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none text-foreground"
                      rows={2}
                      placeholder="A brief summary of the service..."
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Full Description</label>
                    <textarea 
                      required
                      value={formData.fullDescription}
                      onChange={e => setFormData({...formData, fullDescription: e.target.value})}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none text-foreground"
                      rows={5}
                      placeholder="Detailed description of the service and its benefits..."
                    />
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({...formData, status: e.target.value})}
                      className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </form>
              </div>
              <div className="p-6 border-t border-border/50 flex justify-end gap-3 bg-secondary/10 rounded-b-2xl">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-medium border border-border hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  form="serviceForm"
                  className="px-5 py-2.5 rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary-hover transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
                >
                  {editingId ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
