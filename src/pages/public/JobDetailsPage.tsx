import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle2, MapPin, Briefcase, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

const applicationSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(5, 'Phone is required'),
  cvUrl: z.string().url('Must be a valid URL'),
  coverLetter: z.string().optional(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

const formatList = (value?: string | string[]) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  return value
    .split(/\r?\n/)
    .map(item => item.trim().replace(/^[-*•]\s*/, ''))
    .filter(Boolean);
};

export default function JobDetailsPage() {
  const { slug } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const { register, handleSubmit, formState: { errors }, reset } = useRHForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema)
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    apiFetch(`/api/public/jobs/${slug}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setJob(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const onSubmit = async (data: ApplicationFormData) => {
    if (!job) return;
    setStatus('submitting');
    try {
      const res = await apiFetch('/api/public/job-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, jobId: job._id })
      });
      if (res.ok) {
        setStatus('success');
        reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  if (loading) {
    return (
      <div className="py-32 flex justify-center min-h-[60vh] items-center">
      <SEO title="Details | TERQIVO" />
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="py-32 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-3xl font-medium mb-4">Job Not Found</h2>
        <p className="text-muted-foreground mb-8">The position you're looking for doesn't exist or has been closed.</p>
        <Link to="/jobs" className="text-primary hover:underline inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Careers
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 relative bg-background overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-14 relative z-10">
        <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-10 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Careers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="lg:col-span-3"
          >
            <div className="flex gap-2 mb-8">
              <span className="px-3.5 py-1.5 bg-secondary text-foreground text-xs font-medium rounded-full border border-border/50">{job.department}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground mb-10 leading-[1.1]">{job.title}</h1>
            
            <div className="flex flex-wrap gap-8 mb-16 border-y border-border/50 py-8">
              <div className="flex items-center gap-3 text-muted-foreground font-medium">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-primary" />
                </div>
                {job.location}
              </div>
              <div className="flex items-center gap-3 text-muted-foreground font-medium">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0 border border-border/50">
                  <Briefcase size={18} className="text-foreground" />
                </div>
                {job.workType} • {job.experienceLevel}
              </div>
            </div>

            <div className="space-y-16">
              <div className="prose prose-invert prose-lg max-w-none text-muted-foreground">
                <h3 className="text-2xl font-semibold text-foreground mb-6 tracking-tight">About the Role</h3>
                <p className="whitespace-pre-wrap leading-relaxed">{job.description}</p>
              </div>

              <div className="prose prose-invert prose-lg max-w-none text-muted-foreground">
                <h3 className="text-2xl font-semibold text-foreground mb-6 tracking-tight">Responsibilities</h3>
                <ul className="space-y-3 leading-relaxed">
                  {formatList(job.responsibilities).length > 0 ? (
                    formatList(job.responsibilities).map((item: string, index: number) => (
                      <li key={`${item}-${index}`} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="whitespace-pre-wrap">{String(job.responsibilities || '')}</li>
                  )}
                </ul>
              </div>

              <div className="prose prose-invert prose-lg max-w-none text-muted-foreground">
                <h3 className="text-2xl font-semibold text-foreground mb-6 tracking-tight">Requirements</h3>
                <ul className="space-y-3 leading-relaxed">
                  {formatList(job.requirements).length > 0 ? (
                    formatList(job.requirements).map((item: string, index: number) => (
                      <li key={`${item}-${index}`} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-primary shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <li className="whitespace-pre-wrap">{String(job.requirements || '')}</li>
                  )}
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="lg:col-span-2 relative"
          >
            <div className="bg-card/40 backdrop-blur-xl border border-border/60 p-8 md:p-10 rounded-[2.5rem] shadow-2xl sticky top-32">
              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-8">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-medium mb-4">Application Submitted</h3>
                  <p className="text-muted-foreground text-lg mb-4">
                    Thank you for applying to TERQIVO. Our team will review your application and get back to you soon.
                  </p>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-3xl font-semibold mb-3 tracking-tight">Apply for this role</h3>
                  <p className="text-muted-foreground mb-10 text-lg">Fill out the form below to submit your application.</p>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">Full Name</label>
                      <input 
                        {...register('name')}
                        className={`w-full bg-background/50 border ${errors.name ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'} rounded-xl px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-foreground`}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                    </div>
                    
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">Email</label>
                      <input 
                        {...register('email')}
                        className={`w-full bg-background/50 border ${errors.email ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'} rounded-xl px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-foreground`}
                        placeholder="john@company.com"
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                    </div>
                    
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">Phone Number</label>
                      <input 
                        {...register('phone')}
                        className={`w-full bg-background/50 border ${errors.phone ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'} rounded-xl px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-foreground`}
                        placeholder="+1 (555) 000-0000"
                      />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                    </div>
                    
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">CV / Resume URL <span className="text-muted-foreground/50 font-normal">(LinkedIn, Drive, Portfolio)</span></label>
                      <input 
                        {...register('cvUrl')}
                        placeholder="https://"
                        className={`w-full bg-background/50 border ${errors.cvUrl ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'} rounded-xl px-5 py-3.5 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-foreground`}
                      />
                      {errors.cvUrl && <p className="text-sm text-destructive">{errors.cvUrl.message}</p>}
                    </div>
                    
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">Cover Letter <span className="text-muted-foreground/50 font-normal">(Optional)</span></label>
                      <textarea 
                        {...register('coverLetter')}
                        rows={4}
                        className="w-full bg-background/50 border border-border rounded-xl px-5 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all resize-none text-foreground"
                      />
                    </div>

                    {status === 'error' && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm font-medium">
                        Something went wrong. Please try again later.
                      </motion.div>
                    )}

                    <button 
                      type="submit" 
                      disabled={status === 'submitting'}
                      className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium hover:bg-primary-hover transition-all flex items-center justify-center disabled:opacity-50 mt-6 shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {status === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Application'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
