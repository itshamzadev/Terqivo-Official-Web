import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft, Globe, Code2, Download, CheckCircle2 } from 'lucide-react';
import { ImagePlaceholder } from '@/src/components/ui/image-placeholder';
import Markdown from 'react-markdown';
import { assetUrl } from '@/src/lib/utils';

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then(async (res) => {
        const result = await res.json();
        if (!res.ok || !result.success) {
          throw new Error(result.message || 'Product not found');
        }
        return result.data;
      })
      .then((productData) => {
        setProduct(productData);
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

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-heading font-bold">Product Not Found</h1>
        <Button className="mt-6" asChild><Link to="/products">Back to Products</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-muted/30 pt-20 pb-16 border-b">
        <div className="container mx-auto px-4 max-w-5xl">
          <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground" asChild>
            <Link to="/products"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Products</Link>
          </Button>
          
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                  {product.category || 'Software'}
                </span>
                <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium">
                  {product.platform || 'Cross-Platform'}
                </span>
                {product.version && (
                  <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium">
                    v{product.version}
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold">{product.name}</h1>
              <p className="text-xl text-muted-foreground">{product.summary}</p>
              
              <div className="flex flex-wrap gap-4 pt-4">
                {product.liveUrl && (
                  <Button size="lg" asChild>
                    <a href={product.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Globe className="mr-2 h-4 w-4" /> Live Preview
                    </a>
                  </Button>
                )}
                {product.githubUrl && (
                  <Button size="lg" variant="outline" asChild>
                    <a href={product.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Code2 className="mr-2 h-4 w-4" /> Source Code
                    </a>
                  </Button>
                )}
                {product.downloadUrl && (
                  <Button size="lg" variant="secondary" asChild>
                    <a href={product.downloadUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" /> Download
                    </a>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex-1 w-full">
              {product.image || product.thumbnail ? (
                <div className="w-full aspect-[4/3] rounded-[24px] overflow-hidden border bg-muted/20">
                  <img src={assetUrl(product.image || product.thumbnail)} alt={product.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <ImagePlaceholder title="Product Interface" className="w-full aspect-[4/3] rounded-[24px]" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-heading font-bold mb-4">About this product</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <Markdown>{product.description || 'No detailed description available.'}</Markdown>
              </div>
            </div>
            
            {product.features && product.features.length > 0 && (
              <div>
                <h2 className="text-2xl font-heading font-bold mb-6">Features</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {product.features.map((feature: string, i: number) => (
                    <div key={i} className="flex items-start bg-muted/20 p-4 rounded-xl border border-border">
                      <CheckCircle2 className="h-5 w-5 text-accent mr-3 shrink-0 mt-0.5" />
                      <span className="text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {product.documentationUrl && (
              <div className="bg-primary/5 p-8 rounded-2xl border border-primary/20 text-center">
                <h3 className="text-xl font-heading font-bold mb-2">Need help getting started?</h3>
                <p className="text-muted-foreground mb-6">Read our comprehensive documentation to learn how to integrate and deploy.</p>
                <Button variant="outline" asChild>
                  <a href={product.documentationUrl} target="_blank" rel="noopener noreferrer">Read Documentation</a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
