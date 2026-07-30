import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    apiFetch(`/api/public/blog/${slug}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setPost(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="py-32 flex justify-center min-h-[60vh] items-center">
      <SEO title="Details | TERQIVO" />
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-32 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-3xl font-medium mb-4">Article Not Found</h2>
        <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/blog" className="text-primary hover:underline inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 relative bg-background">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-12 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Blog
        </Link>

        <motion.article 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          {post.coverImage && (
            <div className="w-full h-[300px] md:h-[500px] mb-12 rounded-[2.5rem] overflow-hidden bg-secondary relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent z-10" />
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            </div>
          )}
          
          <div className="flex flex-wrap gap-3 mb-8">
            <span className="px-3.5 py-1.5 bg-primary/10 text-primary border border-primary/20 text-xs font-medium rounded-full">{post.category}</span>
            <span className="px-3.5 py-1.5 bg-secondary text-muted-foreground text-xs font-medium rounded-full border border-border/50">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-8 leading-[1.15] text-foreground">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 mb-16 pb-12 border-b border-border/50">
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-secondary/30 rounded-full flex items-center justify-center font-medium text-xl border border-border shadow-sm">
              {post.author.charAt(0)}
            </div>
            <div>
              <div className="font-semibold text-lg text-foreground">{post.author}</div>
              <div className="text-sm text-muted-foreground">TERQIVO</div>
            </div>
          </div>
          
          <div className="prose prose-invert prose-lg md:prose-xl max-w-none text-muted-foreground prose-headings:text-foreground prose-headings:font-semibold prose-a:text-primary hover:prose-a:text-primary-hover prose-img:rounded-2xl prose-strong:text-foreground marker:text-primary leading-relaxed">
            <Markdown>{post.content}</Markdown>
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border/50">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-secondary/50 text-muted-foreground text-sm rounded-lg border border-border/50">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.article>
      </div>
    </div>
  );
}
