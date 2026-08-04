import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import { ProgressiveImage } from '@/src/components/ui/progressive-image';
import { ArrowRight } from 'lucide-react';
import heroImg from '@/src/assets/images/home-hero.png';

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-background pt-20 pb-24 md:pt-28 md:pb-32">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          className="absolute -right-24 top-16 h-72 w-72 rounded-full bg-accent/10 blur-3xl"
          animate={shouldReduceMotion ? undefined : { scale: [1, 1.12, 1], x: [0, -18, 0], y: [0, 12, 0] }}
          transition={{ duration: 9, ease: 'easeInOut', repeat: Infinity }}
        />
        <svg
          className="absolute -right-8 top-0 h-full w-[78%] max-w-[920px] text-accent opacity-60 sm:-right-4 lg:right-0"
          viewBox="0 0 900 620"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M-40 130C120 28 220 38 348 164c142 140 278 166 596-48"
            className="stroke-current"
            strokeWidth="1.4"
            opacity="0.18"
          />
          <path
            d="M-60 245c184-132 290-118 414 18 126 138 264 168 590-36"
            className="stroke-current"
            strokeWidth="1"
            opacity="0.12"
          />
          <path
            d="M40 520c152-94 232-90 342-8 126 94 236 66 470-114"
            className="stroke-current"
            strokeWidth="1.2"
            opacity="0.15"
          />
          {!shouldReduceMotion && (
            <motion.path
              d="M-40 130C120 28 220 38 348 164c142 140 278 166 596-48"
              className="stroke-current"
              strokeWidth="2"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: [0, 1, 1], opacity: [0, 0.7, 0.2] }}
              transition={{ duration: 7, times: [0, 0.6, 1], ease: 'easeInOut', repeat: Infinity, repeatDelay: 2 }}
            />
          )}
        </svg>
      </div>
      <div className="container relative mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-accent/10 text-accent"
                animate={shouldReduceMotion ? undefined : { y: [0, -3, 0] }}
                transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
              >
                Built for Real-World Innovation
              </motion.div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-foreground leading-[1.1]">
                Intelligent technology, built for real progress.
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-lg font-sans">
                Terqivo designs and develops reliable software, AI-powered products, modern platforms, and secure digital systems for growing businesses.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-base shadow-sm" asChild>
                <Link to="/products" className="transition-transform hover:scale-[1.02]">
                  Explore Our Products <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-base shadow-sm" asChild>
                <Link to="/contact" className="transition-transform hover:scale-[1.02]">
                  Talk to Terqivo
                </Link>
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground font-medium pt-4">
              Building practical technology for people, teams, and growing businesses.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="relative lg:pl-8"
          >
            <div className="w-full aspect-[4/3] rounded-[24px] shadow-2xl border bg-muted/20 flex items-center justify-center overflow-hidden">
              <ProgressiveImage
                src={heroImg}
                alt="Terqivo AI and software technology ecosystem illustration"
                loading="eager"
                fetchPriority="high"
                frameClassName="w-full h-full"
                className="w-full h-full object-contain scale-[1.06]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
