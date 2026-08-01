import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useForm as useRHForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

const enrollSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  education: z.string().min(2, "Education background is required"),
  message: z.string().optional()
});

type EnrollFormValues = z.infer<typeof enrollSchema>;

export default function CourseEnroll() {
  const { slug } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { register, handleSubmit, reset, formState: { errors } } = useRHForm<EnrollFormValues>({
    resolver: zodResolver(enrollSchema)
  });

  useEffect(() => {
    fetch(`/api/courses/${slug}`)
      .then(res => res.json())
      .then(data => {
        setCourse(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [slug]);

  const onSubmit = async (data: EnrollFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    try {
      const payload = {
        ...data,
        courseId: course._id
      };
      
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error('Failed to enroll');
      
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

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-heading font-bold">Course Not Found</h1>
        <Button className="mt-6" asChild><Link to="/courses">Back to Courses</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground" asChild>
          <Link to={`/courses/${slug}`}><ArrowLeft className="mr-2 h-4 w-4" /> Back to Course Details</Link>
        </Button>
        
        <div className="mb-10">
          <h1 className="text-4xl font-heading font-bold mb-2">Enrollment Application</h1>
          <p className="text-xl text-muted-foreground">You are applying for: <span className="font-semibold text-foreground">{course.title}</span></p>
        </div>

        {submitStatus === 'success' ? (
          <div className="bg-green-50 border border-green-200 rounded-[24px] p-12 text-center">
            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-6" />
            <h2 className="text-3xl font-heading font-bold text-green-900 mb-4">Application Received</h2>
            <p className="text-green-800 mb-8 max-w-md mx-auto">
              Thank you for applying to {course.title}. Our admissions team will review your application and contact you shortly with the next steps.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild><Link to="/courses">Browse More Courses</Link></Button>
              {/* Optional WhatsApp continuation button as requested */}
              <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-100" asChild>
                <a href="https://wa.me/1234567890" target="_blank" rel="noopener noreferrer">Contact via WhatsApp</a>
              </Button>
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Applicant Details</CardTitle>
              <CardDescription>Please provide accurate information for the admissions review process.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input {...register("name")} placeholder="John Doe" />
                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input {...register("email")} type="email" placeholder="john@example.com" />
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
                    <label className="text-sm font-medium">Highest Education</label>
                    <Input {...register("education")} placeholder="B.S. Computer Science" />
                    {errors.education && <p className="text-sm text-destructive">{errors.education.message}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Why do you want to take this course? (Optional)</label>
                  <textarea 
                    {...register("message")}
                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Briefly describe your goals..."
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                    There was an error submitting your application. Please try again.
                  </div>
                )}

                <div className="pt-4 border-t flex justify-end">
                  <Button type="submit" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
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
