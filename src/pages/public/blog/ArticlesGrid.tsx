import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Calendar, Clock, User } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { ImagePlaceholder } from '@/src/components/ui/image-placeholder';
import type { Article } from './FeaturedArticle';
import { assetUrl } from '@/src/lib/utils';

export function ArticleSkeleton() {
  return (
    <div className="bg-background rounded-2xl border flex flex-col h-full overflow-hidden">
      <div className="w-full aspect-[16/10] bg-muted/50 animate-pulse border-b" />
      <div className="p-6 flex-1 flex flex-col">
        <div className="w-20 h-5 rounded-full bg-muted/50 animate-pulse mb-4" />
        <div className="w-full h-8 rounded bg-muted/50 animate-pulse mb-4" />
        <div className="space-y-2 mb-8">
          <div className="w-full h-4 rounded bg-muted/50 animate-pulse" />
          <div className="w-4/5 h-4 rounded bg-muted/50 animate-pulse" />
        </div>
        <div className="mt-auto pt-4 border-t flex justify-between">
          <div className="w-1/3 h-4 rounded bg-muted/50 animate-pulse" />
          <div className="w-1/4 h-4 rounded bg-muted/50 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function ArticlesEmptyState() {
  return (
    <div className="col-span-full py-20 px-4 bg-background border rounded-[24px] text-center">
      <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
        <BookOpen className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-heading font-bold mb-3">Insights are on the way.</h3>
      <p className="text-muted-foreground max-w-lg mx-auto mb-8">
        Engineering articles, product updates, technical guides, and company news will appear here as they are published.
      </p>
      <Button size="lg" asChild>
        <Link to="/products">Explore Products</Link>
      </Button>
    </div>
  );
}

interface ArticlesGridProps {
  articles: Article[];
  isLoading: boolean;
  hasError: boolean;
}

export function ArticlesGrid({ articles, isLoading, hasError }: ArticlesGridProps) {
  return (
    <section id="dynamic-articles" className="py-24 bg-muted/10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Latest Insights</h2>
          <p className="text-lg text-muted-foreground">
            Explore recent publications from our engineering and design teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <ArticleSkeleton key={i} />
              ))}
            </>
          ) : hasError || articles.length === 0 ? (
            <ArticlesEmptyState />
          ) : (
            articles.map((article, i) => (
              <motion.div
                key={article._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/blog/${article.slug}`} className="block h-full group">
                  <div className="h-full bg-background rounded-2xl border flex flex-col hover:border-accent/40 hover:shadow-md transition-all overflow-hidden">
                    <div className="w-full aspect-[16/10] bg-muted/20 border-b overflow-hidden relative">
                      {article.coverImage ? (
                        <img src={assetUrl(article.coverImage, 'insights')} alt={article.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <ImagePlaceholder title="Article Cover" className="w-full h-full border-0 rounded-none group-hover:scale-105 transition-transform duration-700" />
                      )}
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        {article.category && (
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-accent/5 text-accent">
                            {article.category}
                          </span>
                        )}
                        {article.readTime && (
                          <span className="text-xs text-muted-foreground flex items-center font-medium">
                            <Clock className="mr-1 h-3 w-3" /> {article.readTime}
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-accent transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                        {article.excerpt}
                      </p>
                      
                      <div className="mt-auto pt-5 border-t flex items-center justify-between text-xs text-muted-foreground font-medium">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5" />
                          <span>{article.author || 'Terqivo Team'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{new Date(article.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
