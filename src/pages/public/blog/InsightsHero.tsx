import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import { ArrowDown, ArrowRight } from 'lucide-react';
import heroImg from '@/src/assets/images/insights-hero.png';
import { ProgressiveImage } from '@/src/components/ui/progressive-image';

export function InsightsHeroVisual() {
  return (
    <div className="w-full aspect-[4/3] rounded-[24px] shadow-2xl border bg-muted/20 flex flex-col items-center justify-center overflow-hidden">
      <ProgressiveImage
        src={heroImg}
        alt="Terqivo engineering knowledge and insights illustration"
        loading="eager"
        fetchPriority="high"
        frameClassName="w-full h-full"
        className="w-full h-full object-contain object-center scale-[1.06]"
      />
    </div>
  );
}

export function InsightsHero() {
  const scrollToArticles = () => {
    document.getElementById('dynamic-articles')?.scrollIntoView({ behavior: 'smooth' });
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
                Terqivo Insights
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-foreground leading-[1.1]">
                Engineering knowledge for modern software.
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg font-sans">
                Explore engineering articles, AI insights, product updates, and technical perspectives from the Terqivo team.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-sm" onClick={scrollToArticles}>
                Browse Articles <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base shadow-sm" asChild>
                <Link to="/contact">
                  Product Updates
                </Link>
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground font-medium pt-4">
              New articles will appear as they are published.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative lg:pl-8"
          >
            <InsightsHeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
