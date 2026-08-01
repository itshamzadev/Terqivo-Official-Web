import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

export function SolutionSkeleton() {
  return (
    <div className="bg-background rounded-2xl border p-6 flex flex-col h-full">
      <div className="w-12 h-12 rounded-xl bg-muted/50 animate-pulse mb-6" />
      <div className="w-2/3 h-6 rounded bg-muted/50 animate-pulse mb-4" />
      <div className="space-y-2 mb-8">
        <div className="w-full h-4 rounded bg-muted/50 animate-pulse" />
        <div className="w-4/5 h-4 rounded bg-muted/50 animate-pulse" />
      </div>
      <div className="mt-auto pt-4 border-t">
        <div className="w-1/3 h-4 rounded bg-muted/50 animate-pulse" />
      </div>
    </div>
  );
}

export function SolutionsEmptyState() {
  return (
    <div className="col-span-full py-16 px-4 bg-background border rounded-2xl text-center">
      <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
        <Briefcase className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-heading font-bold mb-3">New solutions are being prepared.</h3>
      <p className="text-muted-foreground max-w-lg mx-auto mb-8">
        Terqivo is continuing to develop intelligent software, automation systems, and secure digital products. Current offerings will appear here when published.
      </p>
      <Button asChild>
        <Link to="/contact">Contact Terqivo</Link>
      </Button>
    </div>
  );
}

interface Solution {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  category?: string;
  featured?: boolean;
  status: string;
}

export function DynamicSolutionsGrid() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchSolutions = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const res = await fetch('/api/services');
      if (!res.ok) {
        throw new Error('Failed to fetch solutions');
      }
      const data = await res.json();
      setSolutions(data.filter((s: Solution) => s.status === 'published'));
    } catch (error) {
      console.error('Error fetching solutions:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  return (
    <section id="dynamic-solutions" className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Available solutions</h2>
          <p className="text-lg text-muted-foreground">
            Explore Terqivo's current technology offerings and engineering capabilities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <SolutionSkeleton key={i} />
              ))}
            </>
          ) : hasError || solutions.length === 0 ? (
            <SolutionsEmptyState />
          ) : (
            solutions.map((solution, i) => (
              <motion.div
                key={solution._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="h-full bg-background p-6 rounded-2xl border flex flex-col hover:border-accent/40 transition-colors group">
                  <div className="mb-6 flex justify-between items-start">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    {solution.featured && (
                      <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-accent/5 text-accent">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-heading font-bold mb-3">{solution.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 line-clamp-3">
                    {solution.shortDescription}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t flex items-center">
                    <Link 
                      to={`/services/${solution.slug}`}
                      className="inline-flex items-center text-sm font-medium text-accent hover:text-accent/80 transition-colors group-hover:underline underline-offset-4"
                    >
                      View solution details <ArrowRight className="ml-1.5 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
