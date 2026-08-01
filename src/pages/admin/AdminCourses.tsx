import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Card, CardContent } from '@/src/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/src/components/ui/dialog';
import { toast } from 'sonner';

interface Course {
  _id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  price: number;
  enrollmentStatus: 'open' | 'closed';
  featured: boolean;
}

export default function AdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const result = await res.json();
        setCourses(result.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openEdit = (course: Course) => {
    setEditingId(course._id);
    Object.keys(course).forEach((key) => {
      setValue(key, (course as any)[key]);
    });
    setIsOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    reset();
    setValue('enrollmentStatus', 'open');
    setValue('featured', false);
    setIsOpen(true);
  };

  const onSubmit = async (data: any) => {
    try {
      if (!data.slug && data.title) {
        data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      
      const url = editingId ? `/api/courses/${editingId}` : '/api/courses';
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
        fetchCourses();
        toast.success(editingId ? 'Course updated' : 'Course created');
      } else {
        toast.error(result.message || 'An error occurred');
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await fetch(`/api/courses/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok && result.success) {
        fetchCourses();
        toast.success('Course deleted');
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
          <h2 className="text-3xl font-heading font-bold tracking-tight">Courses</h2>
          <p className="text-muted-foreground">Manage educational courses and programs.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Course</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Course' : 'Add New Course'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Course Title</label>
                  <Input {...register('title', { required: true })} placeholder="e.g. AI Mastery" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug (optional)</label>
                  <Input {...register('slug')} placeholder="e.g. ai-mastery" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input {...register('category')} placeholder="e.g. Engineering" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Price (optional)</label>
                  <Input type="number" {...register('price')} placeholder="e.g. 499" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Summary</label>
                <Input {...register('summary', { required: true })} placeholder="Brief summary of the course" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Description</label>
                <textarea 
                  {...register('description')} 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Detailed description"
                ></textarea>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="featured" {...register('featured')} className="rounded border-gray-300" />
                <label htmlFor="featured" className="text-sm font-medium">Feature on homepage</label>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Enrollment Status</label>
                <select {...register('enrollmentStatus')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="submit">Save Course</Button>
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
                  <th className="px-6 py-4 font-medium">Course</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Loading courses...</td></tr>
                ) : courses.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No courses found.</td></tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course._id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-foreground">{course.title}</p>
                          {course.featured && <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">Featured</span>}
                        </div>
                        <p className="text-muted-foreground text-xs mt-1 truncate max-w-xs">{course.summary}</p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {course.category || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${course.enrollmentStatus === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {course.enrollmentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => window.open(`/courses/${course.slug}`, '_blank')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEdit(course)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(course._id)}>
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
