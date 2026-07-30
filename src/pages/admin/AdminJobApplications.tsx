import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { Loader2, Trash2, ExternalLink, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface JobApplication {
  _id: string;
  jobId: any;
  name: string;
  email: string;
  phone: string;
  cvUrl: string;
  coverLetter: string;
  status: string;
  createdAt: string;
}

export default function AdminJobApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/api/admin/job-applications');
      if (res.ok) setApplications(await res.json());
      else toast.error('Failed to load applications');
    } catch (err) {
      console.error(err);
      toast.error('Network error loading applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this application?')) return;
    const toastId = toast.loading('Deleting application...');
    try {
      const res = await apiFetch(`/api/admin/job-applications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchApplications();
        toast.success('Application deleted', { id: toastId });
      } else {
        toast.error('Failed to delete application', { id: toastId });
      }
    } catch (err) {
      console.error(err);
      toast.error('Network error occurred', { id: toastId });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await apiFetch(`/api/admin/job-applications/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchApplications();
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
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Job Applications</h1>
          <p className="text-muted-foreground mt-1">Review candidates and track hiring progress.</p>
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
                <th className="px-8 py-5 font-medium text-muted-foreground">Job Role</th>
                <th className="px-8 py-5 font-medium text-muted-foreground">Applicant</th>
                <th className="px-8 py-5 font-medium text-muted-foreground">CV/Resume</th>
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
              ) : applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground bg-secondary/10">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <FileText size={20} className="text-muted-foreground" />
                      </div>
                      <p>No applications found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                applications.map(a => (
                  <tr key={a._id} className="hover:bg-secondary/30 transition-colors group">
                    <td className="px-8 py-5 text-muted-foreground">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 font-medium text-foreground">{a.jobId?.title || 'Unknown Job'}</td>
                    <td className="px-8 py-5">
                      <div className="font-medium text-foreground">{a.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{a.email}</div>
                    </td>
                    <td className="px-8 py-5">
                      {a.cvUrl ? (
                        <a href={a.cvUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 text-foreground text-xs font-medium hover:bg-secondary transition-colors border border-border/50">
                          View CV <ExternalLink size={12} className="opacity-70" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">Not provided</span>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <select 
                        value={a.status || 'pending'} 
                        onChange={(ev) => handleStatusChange(a._id, ev.target.value)}
                        className={`text-xs font-medium border rounded-md px-3 py-1.5 outline-none transition-colors appearance-none cursor-pointer
                          ${a.status === 'hired' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                            a.status === 'rejected' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                            a.status === 'interviewed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                            a.status === 'reviewed' ? 'bg-primary/10 text-primary border-primary/20' :
                            'bg-muted text-muted-foreground border-border/50 hover:border-border'}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="interviewed">Interviewed</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                      </select>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center opacity-70 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleDelete(a._id)} className="text-muted-foreground hover:text-destructive transition-colors hover:scale-110 active:scale-95">
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
