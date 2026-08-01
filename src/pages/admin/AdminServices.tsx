import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Card, CardContent } from '@/src/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/src/components/ui/dialog';
import { toast } from 'sonner';

interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  status: 'published' | 'draft';
  featured: boolean;
}

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const result = await res.json();
        setServices(result.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openEdit = (service: Service) => {
    setEditingId(service._id);
    Object.keys(service).forEach((key) => {
      setValue(key, (service as any)[key]);
    });
    setIsOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    reset();
    setValue('status', 'draft');
    setValue('featured', false);
    setIsOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      if (!data.slug && data.title) {
        data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      
      const url = editingId ? `/api/services/${editingId}` : '/api/services';
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
        fetchServices();
        toast.success(editingId ? 'Service updated' : 'Service created');
      } else {
        toast.error(result.message || 'An error occurred');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok && result.success) {
        fetchServices();
        toast.success('Service deleted');
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
          <h2 className="text-3xl font-heading font-bold tracking-tight">Services</h2>
          <p className="text-muted-foreground">Manage your core company services.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Service</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Service' : 'Add New Service'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Service Title</label>
                  <Input {...register('title', { required: true })} placeholder="e.g. Cloud Infrastructure" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug (optional)</label>
                  <Input {...register('slug')} placeholder="e.g. cloud-infrastructure" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Short Description</label>
                <Input {...register('shortDescription', { required: true })} placeholder="Brief summary of the service" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Description</label>
                <textarea 
                  {...register('fullDescription')} 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Detailed description"
                ></textarea>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="featured" {...register('featured')} className="rounded border-gray-300" />
                <label htmlFor="featured" className="text-sm font-medium">Feature on homepage</label>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select {...register('status')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="submit">Save Service</Button>
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
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">Loading services...</td></tr>
                ) : services.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">No services found.</td></tr>
                ) : (
                  services.map((service) => (
                    <tr key={service._id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-foreground">{service.title}</p>
                          {service.featured && <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">Featured</span>}
                        </div>
                        <p className="text-muted-foreground text-xs mt-1 truncate max-w-xs">{service.shortDescription}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${service.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                          {service.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => window.open(`/services/${service.slug}`, '_blank')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEdit(service)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(service._id)}>
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
