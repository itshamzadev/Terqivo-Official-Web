import { motion } from 'motion/react';
import visionImg from '@/src/assets/images/company-vision.png';
import { CheckCircle2 } from 'lucide-react';

export function Vision() {
  const points = [
    "Pioneering future technology architectures.",
    "Advancing applied Artificial Intelligence.",
    "Designing resilient digital infrastructure.",
    "Fostering long-term innovation cycles."
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="order-2 lg:order-1 relative overflow-hidden rounded-[24px] shadow-lg border bg-muted/10"
          >
            <img 
              src={visionImg}
              alt="Terqivo future technology vision illustration"
              loading="lazy"
              className="w-full aspect-square object-cover scale-[1.2] origin-center" 
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-2 space-y-8 lg:pl-8"
          >
            <div>
              <h2 className="text-4xl font-heading font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                We envision a future where intelligent systems and secure digital infrastructure seamlessly integrate to elevate human potential. By committing to engineering excellence, we are actively shaping a world powered by robust, thoughtful technology.
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
        </div>
      </div>
    </section>
  );
}
