import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { motion, useReducedMotion } from 'motion/react';

export function AboutCTA() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      
      {/* Slow moving light sweep */}
      {!shouldReduceMotion && (
        <motion.div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)',
            backgroundSize: '300% 300%'
          }}
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 15, ease: 'linear', repeat: Infinity }}
        />
      )}

      {/* Soft radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent opacity-50 blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">Let's Build the Future Together</h2>
        <p className="text-xl text-primary-foreground/80 leading-relaxed mx-auto mb-10 max-w-2xl">
          Partner with Terqivo to turn your vision into reliable, maintainable software. Explore our products or contact our team to discuss your next project.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" variant="secondary" className="h-14 px-10 text-base shadow-sm" asChild>
            <Link to="/products">Explore Products <ArrowUpRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-10 text-base shadow-sm bg-primary/20 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground hover:text-primary" asChild>
            <Link to="/contact">Contact Terqivo</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
