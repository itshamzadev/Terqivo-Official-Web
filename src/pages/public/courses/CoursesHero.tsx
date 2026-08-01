import { motion } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import { ArrowDown } from 'lucide-react';

import coursesHero from '@/src/assets/courses-hero.png';

export function CoursesHeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full aspect-[4/3] rounded-[24px] shadow-sm border bg-background flex flex-col items-center justify-center overflow-hidden hover:scale-[1.01] hover:-translate-y-[2px] transition-transform duration-300 relative"
    >
      <img src={coursesHero} alt="Terqivo Learning Ecosystem" className="w-full h-full object-contain object-center absolute inset-0" />
    </motion.div>
  );
}

export function CoursesHero() {
  const scrollToCourses = () => {
    document.getElementById('explore-courses')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCategories = () => {
    document.getElementById('learning-categories')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-background pt-20 pb-24 md:pt-28 md:pb-32 border-b">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      <div className="container relative mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-accent/5 text-accent">
                Terqivo Learning
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-foreground leading-[1.1]">
                Practical technology learning built around real skills.
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg font-sans">
                Explore structured learning experiences in software development, artificial intelligence, automation, and modern digital systems.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-sm" onClick={scrollToCourses}>
                Explore Courses <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base shadow-sm" onClick={scrollToCategories}>
                View Learning Topics
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground font-medium pt-4">
              Courses will appear as they are prepared and published.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative lg:pl-8"
          >
            <CoursesHeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
