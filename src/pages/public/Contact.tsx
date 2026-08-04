import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Mail, Phone, Globe, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSettings } from '../../components/SettingsContext';
import { useAuth } from '../../components/auth/AuthContext';

const contactSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),
  company: z.string().optional(),
  subject: z.string().min(2, "Please enter a subject."),
  message: z.string().min(10, "Please enter at least 10 characters.")
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { settings } = useSettings();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  });
  useEffect(() => { if (user) reset((values) => ({ ...values, fullName: user.name, email: user.email })); }, [user, reset]);

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) throw new Error('Failed to submit message');
      
      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-[calc(100vh-80px)] border-b">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/5 via-background to-background pointer-events-none" />
      
      <div className="container relative mx-auto px-4 py-20 md:py-28 max-w-7xl">
        <div className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-accent/5 text-accent mb-6">
              Contact Terqivo
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              Let's build something <span className="text-accent">useful</span> together.
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-sans">
              Tell us what you are building, what you need to improve, or how we can work together.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Contact Information Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 xl:col-span-4 space-y-8"
          >
            <div className="bg-muted/10 border rounded-[24px] p-8 shadow-sm">
              <h3 className="text-2xl font-heading font-bold mb-8">Contact our team</h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20 group-hover:scale-105 group-hover:bg-accent/20 transition-all">
                    <Mail className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Email</p>
                    <a href={`mailto:${settings?.contact?.email || 'hello@terqivo.com'}`} className="text-muted-foreground hover:text-accent transition-colors font-medium">
                      {settings?.contact?.email || 'hello@terqivo.com'}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 border border-accent/20 group-hover:scale-105 group-hover:bg-accent/20 transition-all">
                    <Phone className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-1">Phone / WhatsApp</p>
                    <a href={`tel:${(settings?.contact?.phone || '+923708121767').replace(/\s+/g, '')}`} className="text-muted-foreground hover:text-accent transition-colors font-medium">
                      {settings?.contact?.phone || '+92 370 812 1767'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary text-primary-foreground border-primary/20 rounded-[24px] p-8 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-pattern opacity-10" />
              <div className="relative z-10">
                <Globe className="h-8 w-8 text-accent mb-4" />
                <h4 className="text-xl font-heading font-bold mb-2">{settings?.contact?.locationLabel || 'Remote-First Company'}</h4>
                <p className="text-primary-foreground/80 leading-relaxed">
                  {settings?.contact?.locationDescription || 'Serving clients worldwide through focused software and AI engineering.'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7 xl:col-span-8"
          >
            <div className="bg-background border rounded-[24px] p-6 sm:p-10 shadow-sm hover:shadow-md transition-shadow duration-300">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Full Name <span className="text-accent">*</span></label>
                    <Input 
                      {...register("fullName")} 
                      placeholder="Jane Doe" 
                      className="h-12 bg-muted/10 border-muted-foreground/20 focus-visible:ring-accent"
                    />
                    {errors.fullName && <p className="text-sm text-destructive font-medium mt-1">{errors.fullName.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Email Address <span className="text-accent">*</span></label>
                    <Input 
                      {...register("email")} 
                      type="email" 
                      placeholder="jane@company.com" 
                      className="h-12 bg-muted/10 border-muted-foreground/20 focus-visible:ring-accent"
                    />
                    {errors.email && <p className="text-sm text-destructive font-medium mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Company <span className="text-muted-foreground font-normal">(Optional)</span></label>
                    <Input 
                      {...register("company")} 
                      placeholder="Your company"
                      className="h-12 bg-muted/10 border-muted-foreground/20 focus-visible:ring-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Subject <span className="text-accent">*</span></label>
                    <Input 
                      {...register("subject")} 
                      placeholder="How can we help?" 
                      className="h-12 bg-muted/10 border-muted-foreground/20 focus-visible:ring-accent"
                    />
                    {errors.subject && <p className="text-sm text-destructive font-medium mt-1">{errors.subject.message}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Message <span className="text-accent">*</span></label>
                  <textarea 
                    {...register("message")}
                    className="flex min-h-[160px] w-full rounded-xl border border-muted-foreground/20 bg-muted/10 px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-colors"
                    placeholder="Tell us about your project or inquiry..."
                  />
                  {errors.message && <p className="text-sm text-destructive font-medium mt-1">{errors.message.message}</p>}
                </div>

                <AnimatePresence mode="wait">
                  {submitStatus === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-green-50/50 text-green-700 rounded-xl border border-green-200/50 flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium leading-relaxed">
                          Thanks - your message has been sent. We will be in touch soon.
                        </p>
                      </div>
                    </motion.div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, y: -10 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -10 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-red-50/50 text-red-700 rounded-xl border border-red-200/50 flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium leading-relaxed">
                          We could not send your message. Please try again or email us directly.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="pt-2 flex justify-end">
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full sm:w-auto h-12 px-8 text-base shadow-sm" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
