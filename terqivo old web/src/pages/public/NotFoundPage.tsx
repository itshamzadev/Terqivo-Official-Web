import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      <SEO title="NotFound | TERQIVO" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="relative z-10"
      >
        <h1 className="text-[12rem] font-bold text-foreground/5 leading-none tracking-tighter select-none mb-8">404</h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-24">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 tracking-tight text-foreground">Page not found</h2>
          <p className="text-xl text-muted-foreground max-w-md mb-10 leading-relaxed">
            The page you are looking for doesn't exist or has been moved to another location.
          </p>
          <Link to="/" className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary-hover transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:-translate-y-0.5 active:translate-y-0">
            Return to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
