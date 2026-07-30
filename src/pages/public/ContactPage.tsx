import { apiFetch } from '../../lib/api';
import React, { useState, useEffect } from 'react';
import { useForm as useRHForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import SEO from '../../components/SEO';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const { register, handleSubmit, formState: { errors }, reset, watch } = useRHForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    setStatus('submitting');
    try {
      const res = await apiFetch('/api/public/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setStatus('success');
        toast.success('Message sent successfully!');
        reset();
      } else {
        setStatus('error');
        toast.error('Failed to send message.');
      }
    } catch (err) {
      setStatus('error');
      toast.error('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 relative overflow-hidden bg-background">
      <SEO title="Contact | TERQIVO" description="Get in touch with TERQIVO for your technology and software engineering needs." />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter mb-8">Let's talk.</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-16 max-w-md">
              Whether you have a project in mind, need technical consulting, or just want to say hello, we're ready to listen.
            </p>
            
            <div className="space-y-10 text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground text-lg mb-2">Email</h4>
                <a href="mailto:hello@terqivo.com" className="text-xl hover:text-primary transition-colors">hello@terqivo.com</a>
              </div>
              <div>
                <h4 className="font-medium text-foreground text-lg mb-2">Office</h4>
                <p className="text-lg">Silicon Valley, CA<br/>Remote Globally</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="bg-card/40 backdrop-blur-xl border border-border/60 p-8 md:p-12 rounded-[2.5rem] shadow-2xl"
          >
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-8">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-medium mb-4">Message Received</h3>
                <p className="text-muted-foreground mb-10 text-lg">
                  Thank you for reaching out. Our team will get back to you shortly.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-8 py-3 bg-secondary text-foreground rounded-full hover:bg-secondary/80 transition-colors font-medium border border-border/50"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {status === 'error' && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl mb-6 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">Something went wrong. Please check your connection and try again.</p>
                  </div>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">Name</label>
                    <input 
                      {...register('name')}
                      className={`w-full bg-background/50 border ${errors.name ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'} rounded-xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-foreground placeholder:text-muted-foreground/50`}
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">Email</label>
                    <input 
                      {...register('email')}
                      className={`w-full bg-background/50 border ${errors.email ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'} rounded-xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-foreground placeholder:text-muted-foreground/50`}
                      placeholder="john@company.com"
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>
                </div>
                
                <div className="space-y-2 group">
                  <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">Subject</label>
                  <input 
                    {...register('subject')}
                    className={`w-full bg-background/50 border ${errors.subject ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'} rounded-xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-foreground placeholder:text-muted-foreground/50`}
                    placeholder="How can we help?"
                  />
                  {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
                </div>

                <div className="space-y-2 group">
                  <label className="text-sm font-medium text-muted-foreground group-focus-within:text-primary transition-colors">Message</label>
                  <textarea 
                    {...register('message')}
                    rows={5}
                    className={`w-full bg-background/50 border ${errors.message ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'} rounded-xl px-5 py-4 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all resize-none text-foreground placeholder:text-muted-foreground/50`}
                    placeholder="Tell us about your project..."
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
                </div>

                {status === 'error' && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm font-medium">
                    Something went wrong. Please try again later.
                  </motion.div>
                )}

                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-medium hover:bg-primary-hover transition-all flex items-center justify-center disabled:opacity-50 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  {status === 'submitting' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
