import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Card, CardContent } from '@/src/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/src/components/ui/dialog';
import { toast } from 'sonner';

interface Job {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  status: 'open' | 'closed' | 'draft';
}

export default function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [paymentAccounts, setPaymentAccounts] = useState<any[]>([]);
  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs/admin');
      if (res.ok) {
        const result = await res.json();
        setJobs(result.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    Promise.all([fetch('/api/currencies').then((res) => res.json()), fetch('/api/payment-accounts').then((res) => res.json())]).then(([currencyResult, accountResult]) => { setCurrencies(currencyResult.data || []); setPaymentAccounts(accountResult.data || []); }).catch(() => undefined);
  }, []);

  const openEdit = (job: Job) => {
    setEditingId(job._id);
    Object.keys(job).forEach((key) => {
      setValue(key, (job as any)[key]);
    });
    setIsOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    reset();
    setValue('status', 'draft');
    setIsOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      if (!data.slug && data.title) {
        data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      
      const url = editingId ? `/api/jobs/${editingId}` : '/api/jobs';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      
      if (res.ok && result.success) {
        setIsOpen(false);
        reset();
        fetchJobs();
        toast.success(editingId ? 'Job updated' : 'Job created');
      } else {
        toast.error(result.message || 'An error occurred');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job?')) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok && result.success) {
        fetchJobs();
        toast.success('Job deleted');
      } else {
        toast.error(result.message || 'An error occurred');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-heading font-bold tracking-tight">Jobs & Careers</h2>
          <p className="text-muted-foreground">Manage open positions and applications.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Job</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Job' : 'Add New Job'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title</label>
                  <Input {...register('title', { required: true })} placeholder="e.g. Senior Frontend Engineer" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug (optional)</label>
                  <Input {...register('slug')} placeholder="e.g. senior-frontend-engineer" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <Input {...register('department')} placeholder="e.g. Engineering" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input {...register('location')} placeholder="e.g. Remote" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea 
                  {...register('description')} 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Detailed description"
                ></textarea>
              </div>
              <div className="border-t pt-4 space-y-4">
                <h3 className="font-medium">Application payment</h3>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('applicationFeeEnabled')} /> Enable application fee</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('applicationFeeRequired')} /> Payment required to apply</label>
                <div className="grid grid-cols-2 gap-4"><Input {...register('applicationFeeAmount', { valueAsNumber: true })} type="number" min="0" placeholder="Fee amount" /><select {...register('applicationFeeCurrencyId')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"><option value="">Select currency</option>{currencies.filter((currency) => currency.isActive).map((currency) => <option key={currency._id} value={currency._id}>{currency.code} — {currency.name}</option>)}</select></div>
                <div className="space-y-2"><label className="text-sm font-medium">Allowed payment accounts (leave empty for all active accounts)</label><select multiple {...register('allowedPaymentAccountIds')} className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">{paymentAccounts.filter((account) => account.isActive).map((account) => <option key={account._id} value={account._id}>{account.accountTitle} — {account.paymentMethod}</option>)}</select></div>
                <div className="grid grid-cols-2 gap-3 text-sm"><label className="flex items-center gap-2"><input type="checkbox" {...register('requirePaymentScreenshot')} /> Require screenshot</label><label className="flex items-center gap-2"><input type="checkbox" {...register('requireTransactionId')} /> Require transaction ID</label><label className="flex items-center gap-2"><input type="checkbox" {...register('applicationsOpen')} defaultChecked /> Applications open</label></div>
                <Input {...register('applicationDeadline')} type="date" /><Input {...register('maxApplications', { valueAsNumber: true })} type="number" min="1" placeholder="Maximum applications (optional)" />
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" {...register('allowWhatsAppApplication')} /> Allow WhatsApp applications</label><Input {...register('applicationWhatsAppNumber')} placeholder="Job WhatsApp number (optional)" /><Input {...register('applicationWhatsAppMessage')} placeholder="WhatsApp message; use {jobTitle}" /><textarea {...register('applicationInstructions')} className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Application instructions" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select {...register('status')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="draft">Draft</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="submit">Save Job</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Job Title</th>
                  <th className="px-6 py-4 font-medium">Department</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Loading jobs...</td></tr>
                ) : jobs.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No jobs found.</td></tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job._id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{job.title}</p>
                        <p className="text-muted-foreground text-xs mt-1">{job.location}</p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {job.department || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${job.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : job.status === 'closed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => window.open(`/jobs/${job.slug}`, '_blank')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEdit(job)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(job._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
