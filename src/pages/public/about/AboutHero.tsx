import { motion } from 'motion/react';
import { ProgressiveImage } from '@/src/components/ui/progressive-image';
import heroImg from '@/src/assets/images/company-hero.png';

export function AboutHero() {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden border-b bg-muted/20">
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="container relative mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground bg-background">
              The Terqivo Company
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold leading-tight tracking-tight">
              Engineering Tomorrow's Technology.
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
              We are a global technology company focused on building intelligent products, secure digital infrastructure, and robust software architectures that stand the test of time.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="w-full aspect-[4/3] rounded-[24px] shadow-2xl border flex items-center justify-center overflow-hidden">
              <ProgressiveImage
                src={heroImg}
                alt="Terqivo engineering and technology illustration"
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
