import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';
import { Loader2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

export default function AboutPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { general } = useSettings();

  useEffect(() => {
    window.scrollTo(0, 0);
    apiFetch('/api/public/page/about')
      .then(res => res.ok ? res.json() : null)
      .then(data => setContent(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-32 flex justify-center min-h-[60vh] items-center">
      <SEO title="About | TERQIVO" />
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-background">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none translate-x-1/3 -translate-y-1/4" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border/50 text-sm font-medium text-foreground mb-8">
            <span className="w-2 h-2 rounded-full bg-primary" /> About Us
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-foreground mb-10 leading-[1.05]">
            {content?.title || `About ${general?.companyName || 'TERQIVO'}`}
          </h1>
          
          {content?.content ? (
            <div className="prose prose-invert prose-lg md:prose-xl max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary-hover prose-strong:text-foreground prose-strong:font-semibold marker:text-primary leading-relaxed mt-12">
              <Markdown>{content.content}</Markdown>
            </div>
          ) : (
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mt-8 max-w-3xl font-light">
              We are a technology company focused on building robust, scalable, and beautifully designed software systems. Our mission is to engineer digital solutions that stand the test of time.
            </p>
          )}
        </motion.div>

        {!content?.content && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-24 lg:mt-32 border-t border-border/30 pt-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-8">Our Philosophy</h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>
                  We believe that great software is a combination of rigorous engineering and thoughtful design. We do not compromise on code quality, security, or user experience.
                </p>
                <p>
                  Every product we build, whether it's a simple marketing site or a complex distributed system, is crafted with the same level of care and precision.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
              className="bg-card/40 backdrop-blur-sm border border-border/60 rounded-[2.5rem] p-10 md:p-12 shadow-sm"
            >
              <h3 className="text-2xl font-semibold tracking-tight text-foreground mb-8">Our Expertise</h3>
              <ul className="space-y-6">
                {['System Architecture', 'Full-Stack Engineering', 'Artificial Intelligence Integration', 'Cloud Infrastructure (AWS/GCP)', 'UI/UX Design', 'Developer Education'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-muted-foreground text-lg">
                    <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
