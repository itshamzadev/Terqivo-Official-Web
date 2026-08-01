import { useEffect, useState } from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Card, CardContent } from '@/src/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/src/components/ui/dialog';
import { toast } from 'sonner';

interface Enrollment {
  _id: string;
  course: string;
  name: string;
  email: string;
  phone: string;
  education: string;
  message: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: string;
}

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewItem, setViewItem] = useState<Enrollment | null>(null);

  const fetchEnrollments = async () => {
    try {
      const res = await fetch('/api/enrollments');
      if (res.ok) {
        const result = await res.json();
        setEnrollments(result.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/enrollments/${id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        fetchEnrollments();
        toast.success('Status updated');
        if (viewItem && viewItem._id === id) {
          setViewItem({ ...viewItem, status: newStatus as any });
        }
      } else {
        toast.error(result.message || 'An error occurred');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this enrollment?')) return;
    try {
      const res = await fetch(`/api/enrollments/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok && result.success) {
        fetchEnrollments();
        setViewItem(null);
        toast.success('Enrollment deleted');
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
          <h2 className="text-3xl font-heading font-bold tracking-tight">Course Enrollments</h2>
          <p className="text-muted-foreground">Review student enrollments for courses.</p>
        </div>
      </div>

      <Dialog open={!!viewItem} onOpenChange={(open) => !open && setViewItem(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Enrollment Details</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold block">Applicant:</span>
                  <span>{viewItem.name}</span>
                </div>
                <div>
                  <span className="font-semibold block">Course ID:</span>
                  <span className="text-muted-foreground">{viewItem.course}</span>
                </div>
                <div>
                  <span className="font-semibold block">Email:</span>
                  <a href={`mailto:${viewItem.email}`} className="text-primary hover:underline">{viewItem.email}</a>
                </div>
                <div>
                  <span className="font-semibold block">Phone:</span>
                  <a href={`tel:${viewItem.phone}`} className="text-primary hover:underline">{viewItem.phone}</a>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold block">Education:</span>
                  <span>{viewItem.education || '-'}</span>
                </div>
              </div>
              <div className="pt-4 border-t">
                <span className="font-semibold block mb-2">Message:</span>
                <p className="whitespace-pre-wrap text-muted-foreground bg-muted p-4 rounded-md text-sm">
                  {viewItem.message || 'No additional message.'}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="space-x-2">
                  <span className="text-sm font-medium">Update Status:</span>
                  <select 
                    value={viewItem.status}
                    onChange={(e) => handleUpdateStatus(viewItem._id, e.target.value)}
                    className="h-8 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <Button variant="destructive" onClick={() => handleDelete(viewItem._id)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Card>
        <CardContent className="p-0">
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Applicant</th>
                  <th className="px-6 py-4 font-medium">Course</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading enrollments...</td></tr>
                ) : enrollments.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No enrollments found.</td></tr>
                ) : (
                  enrollments.map((item) => (
                    <tr key={item._id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <p className="text-foreground font-medium">{item.name}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">{item.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="truncate max-w-[150px]">{item.course}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          item.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                          item.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => setViewItem(item)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(item._id)}>
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
