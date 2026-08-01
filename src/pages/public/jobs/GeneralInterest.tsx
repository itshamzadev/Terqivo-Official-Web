import { motion } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import { Link } from 'react-router-dom';

export function GeneralInterest() {
  return (
    <section id="general-interest" className="py-24 bg-background border-b overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-muted/10 rounded-[32px] border p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-accent/10 via-transparent to-transparent opacity-50 blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3" />
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Interested in contributing in the future?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Even when a suitable role is not listed, professionals interested in Terqivo’s direction may share their profile for future consideration.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 lg:justify-end"
            >
              <Button size="lg" className="h-14 px-8 text-base shadow-sm" asChild>
                <Link to="/contact">Share Your Profile</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-background shadow-sm" asChild>
                <Link to="/about">Learn About Terqivo</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
