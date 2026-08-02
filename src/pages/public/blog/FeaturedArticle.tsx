import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { ImagePlaceholder } from '@/src/components/ui/image-placeholder';
import { assetUrl } from '@/src/lib/utils';

export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category?: string;
  author?: string;
  publishDate: string;
  readTime?: string;
  featured?: boolean;
}

export function FeaturedArticle({ article }: { article: Article | null }) {
  if (!article) {
    return (
      <section className="py-24 bg-background border-b">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="w-full bg-muted/10 rounded-3xl border border-dashed border-border/50 p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-2xl md:text-3xl font-heading font-bold mb-3">Featured article coming soon.</h3>
            <p className="text-muted-foreground text-lg max-w-xl">
              Featured engineering articles will appear here after publication.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-background border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-primary text-primary-foreground mb-8">
          Featured Article
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group grid lg:grid-cols-2 gap-12 items-center bg-background rounded-3xl border overflow-hidden hover:border-accent/40 transition-colors shadow-sm hover:shadow-md"
        >
          <div className="w-full h-full min-h-[300px] lg:min-h-[400px] bg-muted/20 overflow-hidden relative">
            {article.coverImage ? (
              <img src={assetUrl(article.coverImage, 'insights')} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <ImagePlaceholder title="Featured Article Cover" className="w-full h-full rounded-none border-0 group-hover:scale-105 transition-transform duration-700" />
            )}
          </div>
          
          <div className="p-8 lg:p-12 space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground">
              {article.category && (
                <span className="text-accent bg-accent/10 px-3 py-1 rounded-full">{article.category}</span>
              )}
              {article.readTime && (
                <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {article.readTime}</span>
              )}
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(article.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            
            <h3 className="text-3xl sm:text-4xl font-heading font-bold leading-tight group-hover:text-accent transition-colors">
              {article.title}
            </h3>
            
            <p className="text-muted-foreground text-lg leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
            
            <div className="pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center border">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-sm font-medium">{article.author || 'Terqivo Team'}</span>
              </div>
              
              <Button asChild>
                <Link to={`/blog/${article.slug}`}>
                  Read article <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
