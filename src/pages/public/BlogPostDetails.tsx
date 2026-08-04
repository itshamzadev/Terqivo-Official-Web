import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { ImagePlaceholder } from '@/src/components/ui/image-placeholder';
import Markdown from 'react-markdown';
import { ManagedImage } from '@/src/components/ui/managed-image';

export default function BlogPostDetails() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then(async res => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || 'Article not found');
        return data.data;
      })
      .then(data => {
        setPost(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-heading font-bold">Article Not Found</h1>
        <Button className="mt-6" asChild><Link to="/blog">Back to Blog</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-muted/30 pt-20 pb-16 border-b">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="mb-6">
            <Button variant="ghost" className="text-muted-foreground" asChild>
              <Link to="/blog"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog</Link>
            </Button>
          </div>
          
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-accent/10 text-accent mb-6">
            {post.category || 'Engineering'}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6 leading-tight">{post.title}</h1>
          
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center"><User className="mr-2 h-4 w-4" /> {post.author || 'Terqivo Team'}</span>
            <span className="flex items-center"><Calendar className="mr-2 h-4 w-4" /> {post.publishDate ? new Date(post.publishDate).toLocaleDateString() : 'Draft'}</span>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <ManagedImage src={post.coverImage} alt={post.title} className="w-full aspect-[21/9] rounded-[24px] mb-12 object-cover border" fallback={<ImagePlaceholder title="Article Header Visual" className="w-full aspect-[21/9] rounded-[24px] mb-12" />} />
          
          <div className="prose prose-lg prose-slate dark:prose-invert mx-auto">
            <Markdown>{post.content || 'No content available.'}</Markdown>
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t">
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider text-muted-foreground">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
