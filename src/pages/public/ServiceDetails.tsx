import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ImagePlaceholder } from '@/src/components/ui/image-placeholder';
import Markdown from 'react-markdown';

export default function ServiceDetails() {
  const { slug } = useParams();
  const [service, setService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/services/${slug}`)
      .then(res => res.json())
      .then(data => {
        setService(data);
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

  if (!service) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-heading font-bold">Service Not Found</h1>
        <Button className="mt-6" asChild><Link to="/services">Back to Services</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <section className="bg-muted/30 pt-20 pb-16 border-b">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground" asChild>
            <Link to="/services"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Services</Link>
          </Button>
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">{service.title}</h1>
          <p className="text-xl text-muted-foreground mb-8">
            {service.shortDescription}
          </p>
          <ImagePlaceholder title="Service Hero" className="w-full aspect-[21/9] rounded-[24px]" />
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-heading font-bold mb-4">Overview</h2>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <Markdown>{service.fullDescription || 'No detailed description available.'}</Markdown>
                </div>
              </div>
              
              {service.features && service.features.length > 0 && (
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-4">Key Features</h2>
                  <ul className="space-y-3">
                    {service.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-accent mr-3 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-muted/30 border border-border rounded-2xl p-6 sticky top-24">
                <h3 className="text-xl font-heading font-bold mb-4">Interested in this service?</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Contact our engineering team to discuss how we can implement this solution for your business.
                </p>
                <Button className="w-full" asChild>
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
