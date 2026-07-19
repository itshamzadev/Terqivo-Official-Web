import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { Loader2, Edit, Trash2, Plus, X, LayoutTemplate } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Page {
  _id: string;
  page: string;
  title: string;
  content: string;
}

export default function AdminPages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    page: '',
    title: '',
    content: ''
  });

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/admin/pages');
      if (res.ok) setPages(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const openAdd = () => {
    setFormData({ page: '', title: '', content: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (p: Page) => {
    setFormData({ page: p.page, title: p.title, content: p.content });
    setEditingId(p._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page content?')) return;
    try {
      const res = await apiFetch(`/api/admin/pages/${id}`, { method: 'DELETE' });
      if (res.ok) fetchPages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/pages/${editingId}` : '/api/admin/pages';
      const method = editingId ? 'PUT' : 'POST';
      const res = await apiFetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchPages();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Manage Pages</h1>
          <p className="text-muted-foreground mt-1">Create and manage content for static platform pages.</p>
        </div>
        <button 
          onClick={openAdd}
          className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-hover transition-all duration-300 flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95"
        >
          <Plus size={18} /> Add Page Content
        </button>
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
                <th className="px-8 py-5 font-medium text-muted-foreground">Page Slug</th>
                <th className="px-8 py-5 font-medium text-muted-foreground">Title</th>
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
              ) : pages.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-20 text-center text-muted-foreground bg-secondary/10">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <LayoutTemplate size={20} className="text-muted-foreground" />
                      </div>
                      <p>No pages found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pages.map(p => (
                  <tr key={p._id} className="hover:bg-secondary/30 transition-colors group">
                    <td className="px-8 py-5">
                      <span className="font-mono text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-md">{p.page}</span>
                    </td>
                    <td className="px-8 py-5 font-medium text-foreground">{p.title}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(p)} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors hover:scale-110 active:scale-95">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(p._id)} className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500 transition-colors hover:scale-110 active:scale-95">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
              className="bg-card border border-border/60 rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex-none bg-card/80 backdrop-blur-md border-b border-border/60 p-6 flex justify-between items-center z-10">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-foreground">{editingId ? 'Edit Page' : 'Add Page'}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{editingId ? 'Update existing page content.' : 'Create a new static page.'}</p>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="p-2.5 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <form id="pageForm" onSubmit={handleSubmit} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Page Slug (e.g. 'home', 'about', 'ceo-founder')</label>
                      <input required value={formData.page} onChange={e => setFormData({...formData, page: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" placeholder="home" />
                    </div>
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Title</label>
                      <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground" placeholder="Page Title" />
                    </div>
                  </div>
                  <div className="space-y-2 group flex-1 flex flex-col">
                    <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors block">Content (Markdown)</label>
                    <textarea required rows={15} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-background/50 border border-border rounded-xl px-4 py-3 resize-none font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all text-foreground flex-1" placeholder="Write markdown content here..." />
                  </div>
                </form>
              </div>

              <div className="flex-none p-6 border-t border-border/60 bg-secondary/20 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-medium hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                  Cancel
                </button>
                <button type="submit" form="pageForm" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/20 active:scale-95">
                  {editingId ? 'Save Changes' : 'Add Page'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
