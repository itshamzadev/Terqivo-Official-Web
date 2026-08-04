import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, PlayCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { ImagePlaceholder } from '@/src/components/ui/image-placeholder';
import type { Course } from '../Courses';
import { assetUrl, formatPrice } from '@/src/lib/utils';
import { ProgressiveImage } from '@/src/components/ui/progressive-image';

function CourseSkeleton() {
  return (
    <div className="bg-background rounded-2xl border flex flex-col h-full overflow-hidden">
      <div className="w-full aspect-[16/10] bg-muted/50 animate-pulse border-b" />
      <div className="p-6 flex-1 flex flex-col">
        <div className="w-20 h-6 rounded-full bg-muted/50 animate-pulse mb-4" />
        <div className="w-full h-8 rounded bg-muted/50 animate-pulse mb-4" />
        <div className="space-y-2 mb-6">
          <div className="w-full h-4 rounded bg-muted/50 animate-pulse" />
          <div className="w-4/5 h-4 rounded bg-muted/50 animate-pulse" />
        </div>
        <div className="mt-auto pt-4 border-t flex justify-between items-center">
          <div className="w-1/3 h-5 rounded bg-muted/50 animate-pulse" />
          <div className="w-24 h-10 rounded-md bg-muted/50 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function CoursesEmptyState() {
  return (
    <div className="col-span-full py-20 px-4 bg-background border rounded-[24px] text-center flex flex-col items-center">
      <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6">
        <BookOpen className="h-8 w-8" />
      </div>
      <h3 className="text-2xl font-heading font-bold mb-3">Courses are being prepared.</h3>
      <p className="text-muted-foreground max-w-lg mx-auto mb-8">
        Practical programs in software engineering, AI, automation, and digital product development will appear here when published.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" onClick={() => {
          document.getElementById('learning-categories')?.scrollIntoView({ behavior: 'smooth' });
        }}>
          Explore Learning Topics
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link to="/contact">Contact Terqivo</Link>
        </Button>
      </div>
    </div>
  );
}

interface CoursesGridProps {
  courses: Course[];
  isLoading: boolean;
  hasError: boolean;
}

export function CoursesGrid({ courses, isLoading, hasError }: CoursesGridProps) {
  return (
    <section id="explore-courses" className="py-24 bg-background border-b relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Explore Terqivo courses</h2>
          <p className="text-lg text-muted-foreground">
            Published courses will appear here.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <CourseSkeleton key={i} />
              ))}
            </>
          ) : hasError || courses.length === 0 ? (
            <CoursesEmptyState />
          ) : (
            courses.map((course, i) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col"
              >
                <div className="flex flex-col flex-1 bg-background rounded-2xl border hover:border-accent/40 hover:shadow-md transition-all overflow-hidden group">
                  <div className="w-full aspect-[16/10] bg-muted/20 border-b overflow-hidden relative">
                    {(course.image || course.coverImage || course.thumbnail) ? (
                      <ProgressiveImage src={assetUrl(course.image || course.coverImage || course.thumbnail)} alt={course.title} frameClassName="w-full h-full" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <ImagePlaceholder title="Course Cover" className="w-full h-full border-0 rounded-none group-hover:scale-105 transition-transform duration-700" />
                    )}
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      {course.category && (
                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-accent/5 text-accent">
                          {course.category}
                        </span>
                      )}
                      {course.level && (
                        <span className="text-xs text-muted-foreground font-medium bg-muted/30 px-2 py-0.5 rounded-full border">
                          {course.level}
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-accent transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-2">
                      {course.shortDescription || course.summary}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium mb-6">
                      {course.duration && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> {course.duration}
                        </div>
                      )}
                      {(course.deliveryFormat || course.format) && (
                        <div className="flex items-center gap-1.5">
                          <PlayCircle className="h-3.5 w-3.5" /> {course.deliveryFormat || course.format}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-auto pt-5 border-t flex items-center justify-between">
                      <div className="font-heading font-bold text-lg">
                        {course.price ? formatPrice(course.salePrice ?? course.price, course.currency) : 'Free'}
                      </div>
                      
                      <Button size="sm" asChild>
                        <Link to={`/courses/${course.slug}`}>
                          Details <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
