import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, PlayCircle, User } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { ImagePlaceholder } from '@/src/components/ui/image-placeholder';
import type { Course } from '../Courses';
import { assetUrl, formatPrice } from '@/src/lib/utils';
import { ProgressiveImage } from '@/src/components/ui/progressive-image';

export function FeaturedCourse({ course }: { course: Course | null }) {
  if (!course) {
    return (
      <section className="py-24 bg-background border-b">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="w-full bg-muted/10 rounded-3xl border border-dashed border-border/50 p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-2xl md:text-3xl font-heading font-bold mb-3">Featured learning experience coming soon.</h3>
            <p className="text-muted-foreground text-lg max-w-xl">
              A selected Terqivo course will appear here after it is published.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-background border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-primary text-primary-foreground mb-8">
          Featured Course
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group grid lg:grid-cols-2 gap-12 items-center bg-background rounded-[32px] border overflow-hidden hover:border-accent/40 transition-colors shadow-sm hover:shadow-md"
        >
          <div className="w-full h-full min-h-[350px] lg:min-h-[450px] bg-muted/20 overflow-hidden relative">
            {(course.image || course.coverImage || course.thumbnail) ? (
              <ProgressiveImage src={assetUrl(course.image || course.coverImage || course.thumbnail)} alt={course.title} frameClassName="w-full h-full" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            ) : (
              <ImagePlaceholder title="Featured Course Cover" className="w-full h-full rounded-none border-0 group-hover:scale-105 transition-transform duration-700" />
            )}
          </div>
          
          <div className="p-8 lg:p-12 space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground">
              {course.category && (
                <span className="text-accent bg-accent/10 px-3 py-1 rounded-full">{course.category}</span>
              )}
              {course.level && (
                <span className="border px-3 py-1 rounded-full">{course.level}</span>
              )}
            </div>
            
            <h3 className="text-3xl sm:text-4xl font-heading font-bold leading-tight group-hover:text-accent transition-colors">
              {course.title}
            </h3>
            
            <p className="text-muted-foreground text-lg leading-relaxed line-clamp-3">
              {course.shortDescription || course.summary}
            </p>

            <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-muted-foreground font-medium">
              {course.duration && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" /> {course.duration}
                </div>
              )}
              {(course.deliveryFormat || course.format) && (
                <div className="flex items-center gap-2">
                  <PlayCircle className="h-4 w-4" /> {course.deliveryFormat || course.format}
                </div>
              )}
            </div>
            
            <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t">
              {course.instructor && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center border">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-0.5">Instructor</div>
                    <div className="text-sm font-semibold">{course.instructor}</div>
                  </div>
                </div>
              )}
              
              <Button size="lg" className="h-12 shrink-0" asChild>
                <Link to={`/courses/${course.slug}`}>
                  View Course <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
