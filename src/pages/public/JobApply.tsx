import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm as useRHForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const applySchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  cvUrl: z.string().url("Valid URL for CV/Resume required"),
  coverLetter: z.string().min(10, "Cover letter is required")
});

type ApplyFormValues = z.infer<typeof applySchema>;

export default function JobApply() {
  const { slug } = useParams();
  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { register, handleSubmit, reset, formState: { errors } } = useRHForm<ApplyFormValues>({
    resolver: zodResolver(applySchema)
  });

  useEffect(() => {
    fetch(`/api/jobs/${slug}`)
      .then(res => res.json())
      .then(data => {
        setJob(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [slug]);

  const onSubmit = async (data: ApplyFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const payload = {
        ...data,
        jobId: job._id
      };
      
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to submit application');
      
      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-heading font-bold">Job Not Found</h1>
        <Button className="mt-6" asChild><Link to="/jobs">Back to Careers</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground" asChild>
          <Link to={`/jobs/${slug}`}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Job Details</Link>
        </Button>
        
        <div className="mb-10">
          <h1 className="text-4xl font-heading font-bold mb-2">Job Application</h1>
          <p className="text-xl text-muted-foreground">Applying for: <span className="font-semibold text-foreground">{job.title}</span></p>
        </div>

        {submitStatus === 'success' ? (
          <div className="bg-green-50 border border-green-200 rounded-[24px] p-12 text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-6" />
            <h2 className="text-3xl font-heading font-bold text-green-900 mb-4">Application Submitted</h2>
            <p className="text-green-800 mb-8 max-w-md mx-auto">
              Thank you for applying to TERQIVO. Our hiring team will review your application and get back to you if your profile matches our requirements.
            </p>
            <div className="flex justify-center">
              <Button asChild><Link to="/jobs">View Other Openings</Link></Button>
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Application</CardTitle>
              <CardDescription>Please provide your contact information and a link to your resume/CV.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input {...register("name")} placeholder="Jane Doe" />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input {...register("email")} type="email" placeholder="jane@example.com" />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input {...register("phone")} placeholder="+1 (555) 000-0000" />
                    {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Resume/CV URL</label>
                    <Input {...register("cvUrl")} placeholder="https://linkedin.com/in/... or Google Drive link" />
                    {errors.cvUrl && <p className="text-sm text-destructive">{errors.cvUrl.message}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cover Letter / Note</label>
                  <textarea 
                    {...register("coverLetter")}
                    className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us why you're a great fit for TERQIVO..."
                  />
                  {errors.coverLetter && <p className="text-sm text-destructive">{errors.coverLetter.message}</p>}
                </div>

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                    There was an error submitting your application. Please try again.
                  </div>
                )}

                <div className="pt-4 border-t flex justify-end">
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
