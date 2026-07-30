import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Download, ExternalLink, Github, FileText, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Markdown from 'react-markdown';
import SEO from '../../components/SEO';

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    apiFetch(`/api/public/products/${slug}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setProduct(data))
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

  if (!product) {
    return (
      <div className="py-32 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-3xl font-medium mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-8">The software product you're looking for doesn't exist.</p>
        <Link to="/products" className="text-primary hover:underline inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-10 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Products
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="px-3.5 py-1.5 bg-secondary text-foreground text-xs font-medium rounded-full border border-border/50">{product.category}</span>
            {product.platform && (
              <span className="px-3.5 py-1.5 bg-primary/10 text-primary border border-primary/20 text-xs font-medium rounded-full">{product.platform}</span>
            )}
            {product.version && (
              <span className="px-3.5 py-1.5 bg-secondary text-muted-foreground text-xs font-medium rounded-full border border-border/50">v{product.version}</span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-8 leading-[1.1]">{product.name}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 max-w-3xl">
            {product.summary}
          </p>
          
          <div className="flex flex-wrap gap-4 mb-20 pb-16 border-b border-border/50">
            {product.downloadUrl && (
              <a href={product.downloadUrl} target="_blank" rel="noreferrer" className="bg-primary text-primary-foreground px-7 py-3.5 rounded-full font-medium hover:bg-primary-hover transition-all duration-300 flex items-center gap-2.5 shadow-lg shadow-primary/20 active:scale-95">
                <Download size={18} /> Download Now
              </a>
            )}
            {product.liveUrl && (
              <a href={product.liveUrl} target="_blank" rel="noreferrer" className="bg-secondary text-foreground px-7 py-3.5 rounded-full font-medium hover:bg-secondary/80 transition-all duration-300 flex items-center gap-2.5 border border-border/50 active:scale-95">
                <ExternalLink size={18} /> Live Demo
              </a>
            )}
            {product.githubUrl && (
              <a href={product.githubUrl} target="_blank" rel="noreferrer" className="border border-border/50 bg-background/50 hover:bg-secondary/50 px-7 py-3.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2.5 active:scale-95">
                <Github size={18} /> Source Code
              </a>
            )}
            {product.documentationUrl && (
              <a href={product.documentationUrl} target="_blank" rel="noreferrer" className="border border-border/50 bg-background/50 hover:bg-secondary/50 px-7 py-3.5 rounded-full font-medium transition-all duration-300 flex items-center gap-2.5 active:scale-95">
                <FileText size={18} /> Documentation
              </a>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="lg:col-span-2"
          >
            <h2 className="text-3xl font-semibold mb-8 text-foreground tracking-tight">Overview</h2>
            <div className="prose prose-invert prose-lg max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary-hover prose-strong:text-foreground marker:text-primary leading-relaxed">
              <Markdown>{product.description}</Markdown>
            </div>
          </motion.div>
          
          {product.features && product.features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              <div className="bg-card/40 backdrop-blur-sm border border-border/60 rounded-[2.5rem] p-8 md:p-10 shadow-sm sticky top-32">
                <h2 className="text-xl font-semibold mb-6 text-foreground tracking-tight">Key Features</h2>
                <ul className="space-y-4">
                  {product.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold">✓</span>
                      </div>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
