import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
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

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    apiFetch('/api/public/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setServices(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-background">
      <SEO title="Services | TERQIVO" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="max-w-3xl mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border/50 text-sm font-medium text-foreground mb-8">
            <span className="w-2 h-2 rounded-full bg-primary" /> Engineering Excellence
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-8 leading-tight">Engineering <br className="hidden md:block"/>Services.</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            From concept to deployment, we provide end-to-end technology solutions for forward-thinking enterprises and startups.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : services.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service) => (
              <motion.div key={service._id} variants={cardVariants}>
                <Link 
                  to={`/services/${service.slug}`}
                  className="group block h-full p-8 md:p-10 rounded-[2.5rem] bg-card/40 backdrop-blur-sm border border-border/60 hover:border-border hover:bg-card/80 transition-all duration-300 shadow-sm flex flex-col relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[50px] rounded-full group-hover:bg-primary/20 transition-colors duration-500" />
                  
                  <div className="relative z-10 flex-1 flex flex-col">
                    <h3 className="text-2xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors tracking-tight">{service.title}</h3>
                    <p className="text-muted-foreground text-base leading-relaxed mb-10 flex-grow">
                      {service.shortDescription}
                    </p>
                    <div className="flex justify-end mt-auto">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                        <ArrowRight size={20} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-muted-foreground border border-border/50 border-dashed p-16 rounded-2xl text-center bg-secondary/10"
          >
            <p className="text-lg">Services catalog is currently being updated.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
