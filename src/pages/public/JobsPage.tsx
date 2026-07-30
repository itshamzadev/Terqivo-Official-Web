import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, MapPin, Briefcase, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

interface Job {
  _id: string;
  title: string;
  slug: string;
  department: string;
  location: string;
  workType: string;
  experienceLevel: string;
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

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    apiFetch('/api/public/jobs')
      .then(async res => {
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      })
      .then(data => setJobs(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-background">
      <SEO title="Jobs | TERQIVO" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-14 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="max-w-3xl mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border/50 text-sm font-medium text-foreground mb-8">
            <span className="w-2 h-2 rounded-full bg-primary" /> Join the Mission
          </div>
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-8 leading-tight">Careers at <br className="hidden md:block"/>TERQIVO.</h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Join a team of elite engineers, designers, and thinkers building the next generation of software.
          </p>
        </motion.div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : jobs.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-muted-foreground border border-border/50 border-dashed p-16 rounded-2xl text-center bg-secondary/10"
          >
            <p className="text-lg">No open positions at the moment. Check back later.</p>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {jobs.map(job => (
              <motion.div key={job._id} variants={cardVariants}>
                <Link to={`/jobs/${job.slug}`} className="group block h-full p-8 md:p-10 bg-card/40 backdrop-blur-sm border border-border/60 rounded-[2.5rem] overflow-hidden hover:border-border hover:bg-card/80 transition-all duration-300 shadow-sm flex flex-col relative">
                  <div className="flex gap-2 mb-8">
                    <span className="px-3 py-1.5 bg-secondary/80 text-foreground text-xs font-semibold rounded-lg border border-border/50 uppercase tracking-wider">{job.department}</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-6 group-hover:text-primary transition-colors text-foreground tracking-tight">{job.title}</h3>
                  
                  <div className="space-y-4 mt-auto pt-8 border-t border-border/30">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <MapPin size={14} className="text-foreground" />
                      </div>
                      <span className="text-sm font-medium">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                        <Briefcase size={14} className="text-foreground" />
                      </div>
                      <span className="text-sm font-medium">{job.workType} • {job.experienceLevel}</span>
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
