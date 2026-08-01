import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { ArrowLeft, Clock, MapPin, Users, CheckCircle2 } from 'lucide-react';
import { ImagePlaceholder } from '@/src/components/ui/image-placeholder';
import Markdown from 'react-markdown';

export default function CourseDetails() {
  const { slug } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="min-h-screen">
      <section className="bg-muted/30 pt-20 pb-16 border-b">
        <div className="container mx-auto px-4 max-w-5xl">
          <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground" asChild>
            <Link to="/courses"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses</Link>
          </Button>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                  {course.category}
                </span>
                <span className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm font-medium">
                  {course.level || 'Intermediate'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${course.enrollmentStatus === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {course.enrollmentStatus === 'open' ? 'Enrollment Open' : 'Enrollment Closed'}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-heading font-bold">{course.title}</h1>
              <p className="text-xl text-muted-foreground">{course.summary}</p>
              
              <div className="flex flex-wrap gap-6 pt-4 text-sm font-medium text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  {course.duration || '8 Weeks'}
                </div>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4" />
                  {course.learningMode || 'Hybrid'}
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Limited Seats
                </div>
              </div>
            </div>
            
            <div>
              <ImagePlaceholder title="Course Hero" className="w-full aspect-[4/3] rounded-[24px]" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-12">
              <div>
                <h2 className="text-2xl font-heading font-bold mb-4">Course Description</h2>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <Markdown>{course.description || 'No detailed description available.'}</Markdown>
                </div>
              </div>
              
              {course.features && course.features.length > 0 && (
                <div>
                  <h2 className="text-2xl font-heading font-bold mb-6">What You Will Learn</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {course.features.map((feature: string, i: number) => (
                      <div key={i} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-accent mr-3 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-background border border-border rounded-[24px] p-6 sticky top-24 shadow-sm">
                <div className="text-3xl font-heading font-bold mb-6 text-center">
                  {course.salePrice ? (
                    <div className="flex flex-col items-center">
                       <span className="text-muted-foreground line-through text-lg mb-1">${course.price}</span>
                       <span className="text-accent">${course.salePrice}</span>
                    </div>
                  ) : (
                    course.price ? `$${course.price}` : 'Free'
                  )}
                </div>
                
                <div className="space-y-4 mb-6">
                   <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Format</span>
                      <span className="font-medium">{course.learningMode || 'Hybrid'}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Level</span>
                      <span className="font-medium">{course.level || 'Intermediate'}</span>
                   </div>
                   <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{course.duration || '8 Weeks'}</span>
                   </div>
                </div>

                <Button className="w-full h-12 text-lg mb-4" disabled={course.enrollmentStatus !== 'open'} asChild={course.enrollmentStatus === 'open'}>
                  {course.enrollmentStatus === 'open' ? (
                    <Link to={`/courses/${course.slug}/enroll`}>Enroll Now</Link>
                  ) : (
                    <span>Registration Full</span>
                  )}
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Secure checkout. 14-day money-back guarantee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
