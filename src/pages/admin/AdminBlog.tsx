import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Eye, Upload } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Card, CardContent } from '@/src/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/src/components/ui/dialog';
import { toast } from 'sonner';
import { assetUrl, removeUnusedUpload } from '@/src/lib/utils';
import { ProgressiveImage } from '@/src/components/ui/progressive-image';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  coverImage?: string;
  category: string;
  author: string;
  status: 'published' | 'draft';
  featured: boolean;
}

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState('');
  const [savedCoverImage, setSavedCoverImage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog');
      if (res.ok) {
        const result = await res.json();
        setPosts(result.data || []);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const openEdit = (post: BlogPost) => {
    setEditingId(post._id);
    Object.keys(post).forEach((key) => {
      setValue(key, (post as any)[key]);
    });
    setCoverImage(post.coverImage || '');
    setSavedCoverImage(post.coverImage || '');
    setIsOpen(true);
  };

  const openCreate = () => {
    setEditingId(null);
    reset();
    setValue('status', 'draft');
    setValue('featured', false);
    setCoverImage('');
    setSavedCoverImage('');
    setIsOpen(true);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast.error('Use a JPG, PNG, or WEBP image up to 5MB.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload?type=insight', { method: 'POST', body: formData });
      const result = await res.json();
      if (!res.ok || !result.success) throw new Error(result.message || 'Upload failed');
      setCoverImage(result.data.url);
      toast.success('Blog image uploaded');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      event.target.value = '';
    }
  };

  const onSubmit = async (data: any) => {
    try {
      data.coverImage = coverImage;
      data.featured = Boolean(data.featured);
      if (!data.slug && data.title) {
        data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      }
      
      const url = editingId ? `/api/blog/${editingId}` : '/api/blog';
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
        setSavedCoverImage(coverImage);
        fetchPosts();
        toast.success(editingId ? 'Post updated' : 'Post created');
      } else {
        await removeUnusedUpload(coverImage, savedCoverImage);
        toast.error(result.message || 'An error occurred');
      }
    } catch (error: any) {
      await removeUnusedUpload(coverImage, savedCoverImage);
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (res.ok && result.success) {
        fetchPosts();
        toast.success('Post deleted');
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
          <h2 className="text-3xl font-heading font-bold tracking-tight">Insights & Blog</h2>
          <p className="text-muted-foreground">Manage your articles, news, and insights.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}><Plus className="mr-2 h-4 w-4" /> Add Post</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Post' : 'Add New Post'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Image</label>
                <div className="flex items-center gap-4">
                  {coverImage ? (
                    <ProgressiveImage
                      src={assetUrl(coverImage, 'insights')}
                      alt="Blog cover preview"
                      frameClassName="h-20 w-32 rounded-md border"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-32 items-center justify-center rounded-md border bg-muted/30 text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                  <label className="flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm">
                    <Upload className="h-4 w-4" />
                    {isUploading ? 'Uploading...' : 'Upload image'}
                    <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                  </label>
                </div>
                <Input value={coverImage} onChange={(event) => setCoverImage(event.target.value)} placeholder="Or paste an image URL" disabled={isUploading} />
                <p className="text-xs text-muted-foreground">JPG, PNG, or WEBP up to 5MB.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Post Title</label>
                  <Input {...register('title', { required: true })} placeholder="e.g. The Future of AI" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug (optional)</label>
                  <Input {...register('slug')} placeholder="e.g. the-future-of-ai" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Input {...register('category')} placeholder="e.g. Technology" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Author</label>
                  <Input {...register('author')} placeholder="e.g. John Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Excerpt</label>
                <Input {...register('excerpt', { required: true })} placeholder="Brief summary of the post" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content (Markdown)</label>
                <textarea 
                  {...register('content')} 
                  className="flex min-h-[250px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Write your post content here..."
                ></textarea>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="featured" {...register('featured')} className="rounded border-gray-300" />
                <label htmlFor="featured" className="text-sm font-medium">Feature on blog index</label>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <select {...register('status')} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <DialogFooter>
                <Button type="submit">Save Post</Button>
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
                  <th className="px-6 py-4 font-medium">Title</th>
                  <th className="px-6 py-4 font-medium">Author</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Loading posts...</td></tr>
                ) : posts.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No posts found.</td></tr>
                ) : (
                  posts.map((post) => (
                    <tr key={post._id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {post.coverImage && (
                            <ProgressiveImage
                              src={assetUrl(post.coverImage, 'insights')}
                              alt=""
                              frameClassName="h-10 w-14 rounded"
                              className="h-full w-full object-cover"
                            />
                          )}
                          <p className="font-medium text-foreground">{post.title}</p>
                          {post.featured && <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-semibold">Featured</span>}
                        </div>
                        <p className="text-muted-foreground text-xs mt-1">{post.category}</p>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {post.author || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                          {post.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => window.open(`/blog/${post.slug}`, '_blank')}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => openEdit(post)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(post._id)}>
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
