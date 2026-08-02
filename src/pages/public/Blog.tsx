import { useEffect, useState } from 'react';
import { InsightsHero } from './blog/InsightsHero';
import { CategoryNavigation } from './blog/CategoryNavigation';
import { FeaturedArticle } from './blog/FeaturedArticle';
import { ArticlesGrid } from './blog/ArticlesGrid';
import { TopicsSection } from './blog/TopicsSection';
import { NewsletterCTA } from './blog/NewsletterCTA';
import type { Article } from './blog/FeaturedArticle';

export default function Blog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const res = await fetch('/api/blog');
        if (!res.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await res.json();
        setArticles((data.data || []).filter((p: any) => p.status === 'published'));
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const featuredArticle = articles.find(a => a.featured) || null;
  const regularArticles = articles.filter(a => a._id !== featuredArticle?._id);

  return (
    <div className="flex flex-col w-full">
      <InsightsHero />
      <CategoryNavigation />
      <FeaturedArticle article={featuredArticle} />
      <ArticlesGrid articles={regularArticles} isLoading={isLoading} hasError={hasError} />
      <TopicsSection />
      <NewsletterCTA />
    </div>
  );
}
