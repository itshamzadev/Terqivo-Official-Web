import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Download, Package } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { ImagePlaceholder } from '@/src/components/ui/image-placeholder';
import { ProgressiveImage } from '@/src/components/ui/progressive-image';
import { assetUrl } from '@/src/lib/utils';

export function ProductSkeleton() {
  return (
    <div className="bg-background rounded-2xl border flex flex-col h-full overflow-hidden">
      <div className="w-full h-[220px] bg-muted/50 animate-pulse border-b" />
      <div className="p-6 flex-1 flex flex-col">
        <div className="w-20 h-5 rounded-full bg-muted/50 animate-pulse mb-4" />
        <div className="w-3/4 h-6 rounded bg-muted/50 animate-pulse mb-4" />
        <div className="space-y-2 mb-8">
          <div className="w-full h-4 rounded bg-muted/50 animate-pulse" />
          <div className="w-4/5 h-4 rounded bg-muted/50 animate-pulse" />
        </div>
        <div className="mt-auto pt-4 border-t">
          <div className="w-1/3 h-4 rounded bg-muted/50 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function ProductsEmptyState() {
  return (
    <div className="col-span-full py-16 px-4 bg-background border rounded-2xl text-center">
      <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
        <Package className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-heading font-bold mb-3">More Terqivo products are in development.</h3>
      <p className="text-muted-foreground max-w-lg mx-auto mb-8">
        New software, intelligent tools, and connected digital products will appear here when they are ready to be published.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button asChild>
          <Link to="/products/manos-ai">Explore Manos AI</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/contact">Contact Terqivo</Link>
        </Button>
      </div>
    </div>
  );
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  summary: string;
  thumbnail?: string;
  image?: string;
  category?: string;
  status: 'published' | 'coming-soon';
  downloadUrl?: string;
  featured?: boolean;
  platform?: string;
}

export function DynamicProductsGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await res.json();
      setProducts((data.data || []).filter((p: Product) => p.status === 'published' || p.status === 'coming-soon'));
    } catch (error) {
      console.error('Error fetching products:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <section id="dynamic-products" className="py-24 bg-muted/10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Explore Terqivo products</h2>
          <p className="text-lg text-muted-foreground">
            Published products and upcoming software experiences from Terqivo will appear here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </>
          ) : hasError || products.length === 0 ? (
            <ProductsEmptyState />
          ) : (
            products.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="h-full bg-background rounded-2xl border flex flex-col hover:border-accent/40 hover:shadow-md transition-all group overflow-hidden">
                  <div className="w-full h-[220px] bg-muted/20 border-b overflow-hidden relative">
                    {(product.image || product.thumbnail) ? (
                      <ProgressiveImage src={assetUrl(product.image || product.thumbnail)} alt={product.name} frameClassName="w-full h-full" className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlaceholder title={`${product.name} Preview`} className="w-full h-full border-0 rounded-none" />
                    )}
                    {product.featured && (
                      <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold border shadow-sm text-foreground">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      {product.category && (
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium bg-accent/5 text-accent">
                          {product.category}
                        </span>
                      )}
                      {product.platform && (
                        <span className="text-xs text-muted-foreground font-medium">
                          {product.platform}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-heading font-bold mb-2">{product.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                      {product.summary}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t flex items-center justify-between gap-3">
                      {product.status === 'published' ? (
                        product.downloadUrl ? (
                          <Button size="sm" asChild>
                            <a href={product.downloadUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-1.5 h-4 w-4" /> Download
                            </a>
                          </Button>
                        ) : (
                          <Button size="sm" disabled title="A download link has not been added yet">
                            <Download className="mr-1.5 h-4 w-4" /> Download
                          </Button>
                        )
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          Coming Soon
                        </Button>
                      )}
                      <Link to={`/products/${product.slug}`} className="text-sm font-medium text-accent hover:text-accent/80 transition-colors group-hover:underline underline-offset-4">
                        Details
                      </Link>
                    </div>
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
