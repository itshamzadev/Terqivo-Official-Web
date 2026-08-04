import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import { ArrowDown, ArrowRight } from 'lucide-react';

import heroImg from '@/src/assets/images/solutions-hero.png';
import { ProgressiveImage } from '@/src/components/ui/progressive-image';

export function SolutionsHeroVisual() {
  return (
    <div className="w-full aspect-[4/3] rounded-[24px] shadow-2xl border bg-muted/20 flex flex-col items-center justify-center overflow-hidden">
      <ProgressiveImage
        src={heroImg}
        alt="Terqivo technology solutions ecosystem illustration"
        loading="eager"
        fetchPriority="high"
        frameClassName="w-full h-full"
        className="w-full h-full object-contain object-center scale-[1.06]"
      />
    </div>
  );
}

export function SolutionsHero() {
  const scrollToSolutions = () => {
    document.getElementById('dynamic-solutions')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-background pt-20 pb-24 md:pt-28 md:pb-32 border-b">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      <div className="container relative mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-accent/10 text-accent">
                Terqivo Solutions
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-foreground leading-[1.1]">
                Technology solutions built around real-world needs.
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg font-sans">
                Terqivo combines intelligent software, secure engineering, modern architecture, and practical automation to build systems designed for long-term use.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-sm" onClick={scrollToSolutions}>
                Explore Solutions <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base shadow-sm" asChild>
                <Link to="/contact">
                  Discuss Your Requirements
                </Link>
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground font-medium pt-4">
              From focused product modules to complete digital platforms.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative lg:pl-8"
          >
            <SolutionsHeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
