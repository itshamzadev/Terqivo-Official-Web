import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

interface Product {
  _id: string;
  name: string;
  slug: string;
  category: string;
  summary: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    apiFetch('/api/public/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-background">
      <SEO title="Products | TERQIVO" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="max-w-3xl mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border/50 text-sm font-medium text-foreground mb-8">
            <span className="w-2 h-2 rounded-full bg-primary" /> Tools & Platforms
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-8 leading-tight">Software that <br className="hidden md:block"/>scales with you.</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Explore our suite of enterprise-grade software products and high-performance tools designed to accelerate modern development.
          </p>
        </motion.div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-muted-foreground border border-border/50 border-dashed p-16 rounded-2xl text-center bg-secondary/10"
          >
            <p className="text-lg">Our product catalog is currently being updated.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {products.map(product => (
              <motion.div key={product._id} variants={cardVariants}>
                <Link to={`/products/${product.slug}`} className="group block h-full bg-card/40 backdrop-blur-sm border border-border/60 rounded-[2.5rem] overflow-hidden hover:border-border hover:bg-card/80 transition-all duration-300 shadow-sm flex flex-col relative">
                  <div className="p-8 md:p-10 flex-1 flex flex-col">
                    <div className="flex gap-2 mb-6">
                      <span className="px-3 py-1.5 bg-secondary/80 text-foreground text-xs font-semibold rounded-lg border border-border/50 uppercase tracking-wider">{product.category}</span>
                    </div>
                    <h3 className="text-2xl font-semibold mb-4 group-hover:text-primary transition-colors text-foreground tracking-tight">{product.name}</h3>
                    <p className="text-muted-foreground text-base leading-relaxed flex-1">
                      {product.summary}
                    </p>
                  </div>
                  <div className="p-6 md:p-8 pt-0 mt-auto flex justify-end">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                      <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
