import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import { ArrowDown } from 'lucide-react';

import careersHero from '@/src/assets/careers-hero.png';

export function CareersHeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full aspect-[4/3] rounded-[24px] shadow-sm border bg-background flex flex-col items-center justify-center overflow-hidden hover:scale-[1.01] hover:-translate-y-[2px] transition-transform duration-300 relative"
    >
      <img src={careersHero} alt="Careers at Terqivo" className="w-full h-full object-contain object-center absolute inset-0" />
    </motion.div>
  );
}

export function CareersHero() {
  const scrollToPositions = () => {
    document.getElementById('open-positions')?.scrollIntoView({ behavior: 'smooth' });
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
                Terqivo Careers
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-foreground leading-[1.1]">
                Contribute to technology with lasting impact.
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg font-sans">
                Join a team focused on deliberate engineering, thoughtful design, and solving complex problems with modern software systems.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-sm" onClick={scrollToPositions}>
                View Open Positions <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base shadow-sm" asChild>
                <Link to="/contact">Share Your Profile</Link>
              </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative lg:pl-8"
          >
            <CareersHeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
