import { motion } from 'motion/react';
import founderImg from '@/src/assets/images/company-founder.jpeg';

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
                Terqivo is built around strong engineering leadership and long-term product thinking. Our leadership team consists of technologists who understand that great software requires a balance of vision, rigorous discipline, and a deep respect for user experience.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Rather than chasing short-term trends, our leadership focuses on fostering a culture of craftsmanship, where every component is designed with care and every system is built to last.
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
            <img 
              src={founderImg}
              alt="Founder and leadership portrait"
              loading="lazy"
              className="w-full aspect-[4/5] object-cover object-center rounded-[24px] shadow-md border bg-background" 
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
