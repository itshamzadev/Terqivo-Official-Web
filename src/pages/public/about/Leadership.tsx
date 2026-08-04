import { motion } from 'motion/react';
import founderImg from '@/src/assets/images/company-founder.jpeg';
import { ProgressiveImage } from '@/src/components/ui/progressive-image';

export function Leadership() {
  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl font-heading font-bold mb-6">Founder & Leadership</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Terqivo is built on strong engineering leadership and long-term product thinking. Our leaders understand that great software requires vision, discipline, and deep respect for the user experience.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Rather than chasing short-term trends, our leadership cultivates a culture of craftsmanship. Every component is considered carefully, and every system is built for lasting value.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <ProgressiveImage
              src={founderImg}
                alt="Muhammad Hamza, Founder and CEO of Terqivo"
              frameClassName="w-full aspect-[4/5] rounded-[24px] shadow-md border bg-background"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
