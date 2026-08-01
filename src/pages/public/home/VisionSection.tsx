import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';
import home2Img from '@/src/assets/images/home-2.png';

export function VisionSection() {
  return (
    <section className="py-24 bg-muted/30 border-y">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.5 }}
           >
              <img 
                src={home2Img}
                alt="Terqivo connected technology ecosystem illustration"
                loading="lazy"
                className="w-full aspect-[4/3] object-contain rounded-[24px] shadow-lg border" 
              />
           </motion.div>
           
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="space-y-8"
           >
             <div>
                <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-accent/10 text-accent mb-4">
                  Company Vision
                </div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Building for the long term.</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Technology is rapidly evolving, but the principles of good engineering remain constant. Terqivo is dedicated to crafting digital infrastructure that not only solves today's challenges but is robust enough to adapt to tomorrow's innovations.
                </p>
             </div>
             
             <div className="pt-4">
                <Button variant="link" className="p-0 text-primary font-semibold text-lg hover:text-accent" asChild>
                  <Link to="/about">Read our full methodology <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
             </div>
           </motion.div>
        </div>
      </div>
    </section>
  );
}
