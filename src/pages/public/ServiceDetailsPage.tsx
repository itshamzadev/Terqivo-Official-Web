import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

export default function ServiceDetailsPage() {
  const { slug } = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    apiFetch(`/api/public/services/${slug}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setService(data))
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

  if (!service) {
    return (
      <div className="py-32 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-3xl font-medium mb-4">Service Not Found</h2>
        <p className="text-muted-foreground mb-8">The service you're looking for doesn't exist.</p>
        <Link to="/services" className="text-primary hover:underline inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 relative bg-background overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <Link to="/services" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-10 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Services
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="max-w-4xl mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground mb-8 leading-[1.1]">{service.title}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            {service.shortDescription}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="lg:col-span-2"
          >
            <h2 className="text-3xl font-semibold mb-8 text-foreground tracking-tight">Service Overview</h2>
            <div className="prose prose-invert prose-lg max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary-hover prose-strong:text-foreground marker:text-primary leading-relaxed mb-16">
              <Markdown>{service.fullDescription || service.shortDescription}</Markdown>
            </div>
            
            <div className="bg-gradient-to-br from-secondary/50 to-secondary/10 border border-border/60 rounded-[2rem] p-10 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold mb-4 text-foreground tracking-tight">Ready to start?</h3>
                <p className="text-muted-foreground text-lg mb-8 max-w-md">Let's discuss how we can help with your next big project.</p>
                <Link to="/contact" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-full font-medium hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-95 group">
                  Contact Us <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            {service.features && service.features.length > 0 && (
              <div className="bg-card/40 backdrop-blur-sm border border-border/60 p-8 md:p-10 rounded-[2.5rem] mb-12 shadow-sm">
                <h2 className="text-xl font-semibold mb-6 text-foreground tracking-tight">Key Features</h2>
                <ul className="space-y-4">
                  {service.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold">✓</span>
                      </div>
                      <span className="text-muted-foreground leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {service.process && service.process.length > 0 && (
              <div className="bg-card/40 backdrop-blur-sm border border-border/60 p-8 md:p-10 rounded-[2.5rem] shadow-sm">
                <h2 className="text-xl font-semibold mb-8 text-foreground tracking-tight">Our Process</h2>
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-px before:bg-gradient-to-b before:from-border before:to-transparent">
                  {service.process.map((step: string, idx: number) => (
                    <div key={idx} className="relative flex items-start group">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full border border-border bg-background text-sm font-semibold text-primary z-10 shrink-0 mt-0 shadow-sm group-hover:border-primary/50 transition-colors">
                        {idx + 1}
                      </div>
                      <div className="ml-5">
                        <p className="text-muted-foreground leading-relaxed pt-1">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
