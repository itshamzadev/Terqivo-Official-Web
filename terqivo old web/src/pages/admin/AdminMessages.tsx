import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { Loader2, Trash2, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/admin/messages');
      if (res.ok) setMessages(await res.json());
      else toast.error('Failed to load messages');
    } catch (err) {
      console.error(err);
      toast.error('Network error loading messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    const toastId = toast.loading('Deleting message...');
    try {
      const res = await apiFetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchMessages();
        toast.success('Message deleted', { id: toastId });
      } else {
        toast.error('Failed to delete message', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error occurred', { id: toastId });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/admin/messages/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchMessages();
        toast.success('Status updated');
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error occurred');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Contact Messages</h1>
          <p className="text-muted-foreground mt-1">Review inquiries and communications from users.</p>
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
                <th className="px-8 py-5 font-medium text-muted-foreground">Date</th>
                <th className="px-8 py-5 font-medium text-muted-foreground">From</th>
                <th className="px-8 py-5 font-medium text-muted-foreground">Subject</th>
                <th className="px-8 py-5 font-medium text-muted-foreground w-1/3">Message</th>
                <th className="px-8 py-5 font-medium text-muted-foreground">Status</th>
                <th className="px-8 py-5 font-medium text-muted-foreground w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground bg-secondary/10">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <Mail size={20} className="text-muted-foreground" />
                      </div>
                      <p>No messages found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                messages.map(m => (
                  <tr key={m._id} className="hover:bg-secondary/30 transition-colors group">
                    <td className="px-8 py-5 text-muted-foreground">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-medium text-foreground">{m.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{m.email}</div>
                    </td>
                    <td className="px-8 py-5 font-medium text-foreground">{m.subject}</td>
                    <td className="px-8 py-5 max-w-xs truncate text-muted-foreground" title={m.message}>{m.message}</td>
                    <td className="px-8 py-5">
                      <select 
                        value={m.status || 'unread'} 
                        onChange={(e) => handleStatusChange(m._id, e.target.value)}
                        className={`text-xs font-medium border rounded-md px-3 py-1.5 outline-none transition-colors appearance-none cursor-pointer
                          ${m.status === 'read' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                            m.status === 'archived' ? 'bg-muted text-muted-foreground border-border/50' :
                            'bg-primary/10 text-primary border-primary/20'}`}
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center opacity-70 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDelete(m._id)} className="text-muted-foreground hover:text-destructive transition-colors hover:scale-110 active:scale-95">
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
      </motion.div>
    </div>
  );
}
