import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/src/components/ui/button';

export function CoursesCTA() {
  const scrollToCourses = () => {
    document.getElementById('explore-courses')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Soft radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent opacity-50 blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Build skills for the technology you want to create.</h2>
        <p className="text-xl text-primary-foreground/80 leading-relaxed mx-auto mb-10 max-w-2xl">
          Explore published courses and follow Terqivo as new learning experiences become available.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" variant="secondary" className="h-14 px-10 text-base shadow-sm" onClick={scrollToCourses}>
            Explore Courses <ArrowUpRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-10 text-base shadow-sm bg-primary/20 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground hover:text-primary" asChild>
            <Link to="/contact">Contact Terqivo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
