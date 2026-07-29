import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  author: string;
  createdAt: string;
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

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    apiFetch('/api/public/blog')
      .then(res => res.ok ? res.json() : [])
      .then(data => setPosts(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-background">
      <SEO title="Blog | TERQIVO" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="max-w-3xl mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border/50 text-sm font-medium text-foreground mb-8">
            <span className="w-2 h-2 rounded-full bg-primary" /> Journal
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-8 leading-tight">Engineering <br className="hidden md:block"/>Blog.</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Insights on software architecture, artificial intelligence, and building scalable systems.
          </p>
        </motion.div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-muted-foreground border border-border/50 border-dashed p-16 rounded-2xl text-center bg-secondary/10"
          >
            <p className="text-lg">No articles published yet. Check back later.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {posts.map(post => (
              <motion.div key={post._id} variants={cardVariants}>
                <Link to={`/blog/${post.slug}`} className="group block h-full p-8 md:p-10 bg-card/40 backdrop-blur-sm border border-border/60 rounded-[2.5rem] overflow-hidden hover:border-border hover:bg-card/80 transition-all duration-300 shadow-sm flex flex-col relative">
                  <div className="flex gap-2 mb-8">
                    <span className="px-3 py-1.5 bg-secondary/80 text-foreground text-xs font-semibold rounded-lg border border-border/50 uppercase tracking-wider">{post.category}</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 group-hover:text-primary transition-colors text-foreground tracking-tight">{post.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-8 flex-1 group-hover:text-muted-foreground/80 transition-colors">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-border/30 mt-auto">
                    <div className="text-sm font-medium text-foreground">
                      By {post.author}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
                    <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
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
