import { apiFetch } from '../../lib/api';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';

const enrollSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(5, 'Phone is required'),
  education: z.string().optional(),
  message: z.string().optional(),
});

type EnrollFormData = z.infer<typeof enrollSchema>;

export default function CourseDetailsPage() {
  const { slug } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const { register, handleSubmit, formState: { errors }, reset } = useRHForm<EnrollFormData>({
    resolver: zodResolver(enrollSchema)
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    apiFetch(`/api/public/courses/${slug}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setCourse(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  const onSubmit = async (data: EnrollFormData) => {
    if (!course) return;
    setStatus('submitting');
    try {
      const res = await apiFetch('/api/public/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, courseId: course._id })
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

  if (!course) {
    return (
      <div className="py-32 text-center flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-3xl font-medium mb-4">Course Not Found</h2>
        <p className="text-muted-foreground mb-8">The course you're looking for doesn't exist.</p>
        <Link to="/courses" className="text-primary hover:underline inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 relative bg-background">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-14">
        <Link to="/courses" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-10 group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="lg:col-span-3"
          >
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="px-3.5 py-1.5 bg-secondary text-foreground text-xs font-medium rounded-full border border-border/50">{course.category}</span>
              <span className="px-3.5 py-1.5 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">{course.level}</span>
              <span className="px-3.5 py-1.5 bg-secondary text-muted-foreground text-xs font-medium rounded-full border border-border/50">{course.duration}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground mb-8 leading-[1.1]">{course.title}</h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12">
              {course.summary}
            </p>
            <div className="prose prose-invert prose-lg max-w-none text-muted-foreground prose-headings:text-foreground prose-a:text-primary hover:prose-a:text-primary-hover prose-strong:text-foreground marker:text-primary leading-relaxed border-t border-border/50 pt-12">
              <div dangerouslySetInnerHTML={{ __html: course.description }} />
            </div>
            
            <div className="mt-16 p-10 bg-secondary/20 border border-border/50 rounded-[2.5rem]">
              <h3 className="text-xl font-medium mb-3 text-muted-foreground">Course Investment</h3>
              <div className="text-5xl font-semibold text-foreground tracking-tight">${course.price}</div>
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
                  <h3 className="text-3xl font-medium mb-4">Enrollment Received</h3>
                  <p className="text-muted-foreground mb-10 text-lg">
                    Thank you for applying. Our team will review your details and contact you shortly.
                  </p>
                  
                  <div className="w-full pt-8 border-t border-border/50 mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Want to speed up the process?</p>
                    <a 
                      href={`https://wa.me/?text=${encodeURIComponent(`Hello, I just enrolled in the ${course.title} course and would like to proceed with the next steps.`)}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-full bg-[#25D366] text-white py-4 rounded-xl font-medium hover:bg-[#20b858] transition-all flex items-center justify-center gap-3 shadow-lg shadow-[#25D366]/20 hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Continue on WhatsApp
                    </a>
                  </div>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-3xl font-semibold mb-3 tracking-tight">Enroll Now</h3>
                  <p className="text-muted-foreground mb-10 text-lg">Fill out the form below to secure your spot.</p>
                  
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
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">Education Background <span className="text-muted-foreground/50 font-normal">(Optional)</span></label>
                      <input 
                        {...register('education')}
                        className="w-full bg-background/50 border border-border rounded-xl px-5 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all text-foreground"
                      />
                    </div>
                    
                    <div className="space-y-2 group">
                      <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">Message / Goals <span className="text-muted-foreground/50 font-normal">(Optional)</span></label>
                      <textarea 
                        {...register('message')}
                        rows={3}
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
                      {status === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Enrollment'}
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
