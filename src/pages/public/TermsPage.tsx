import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

export default function TermsPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    apiFetch('/api/public/page/terms')
      .then(res => res.ok ? res.json() : null)
      .then(data => setContent(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-32 flex justify-center min-h-[60vh] items-center">
      <SEO title="Terms & Conditions | TERQIVO" />
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/4" />
      
      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border/50 text-sm font-medium text-foreground mb-8">
            <span className="w-2 h-2 rounded-full bg-primary" /> Legal
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-12 leading-[1.1]">
            {content?.title || "Terms & Conditions"}
          </h1>
          
          {content?.content ? (
            <div className="prose prose-invert prose-lg max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary-hover prose-strong:text-foreground prose-strong:font-semibold marker:text-primary leading-relaxed mt-12 bg-card/30 backdrop-blur-sm border border-border/50 p-8 md:p-12 rounded-[2.5rem]">
              <Markdown>{content.content}</Markdown>
            </div>
          ) : (
            <div className="text-muted-foreground bg-secondary/10 border border-border border-dashed p-12 rounded-3xl text-center mt-12">
              Content will be loaded from the database. 
              <br/>Please configure the "terms" page content in the admin panel.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
