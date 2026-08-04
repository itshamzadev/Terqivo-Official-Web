import { motion } from 'motion/react';
import missionImg from '@/src/assets/images/company-mission.png';
import { CheckCircle2 } from 'lucide-react';
import { ProgressiveImage } from '@/src/components/ui/progressive-image';

export function Mission() {
  const points = [
    "Building intelligent, scalable products.",
    "Creating inherently secure digital systems.",
    "Empowering organizations through modern software."
  ];

  return (
    <section className="py-24 bg-muted/20 border-y">
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
              <h2 className="text-4xl font-heading font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We exist to build technology that moves humanity forward. Our mission is to engineer software ecosystems that not only solve today's complex challenges but also anticipate the needs of tomorrow's interconnected world.
              </p>
            </div>
            
            <ul className="space-y-4">
              {points.map((point, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-accent shrink-0 mr-4" />
                  <span className="text-foreground font-medium">{point}</span>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <ProgressiveImage
              src={missionImg}
              alt="Terqivo mission illustration"
              frameClassName="w-full aspect-square rounded-[24px] shadow-lg border bg-background"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
