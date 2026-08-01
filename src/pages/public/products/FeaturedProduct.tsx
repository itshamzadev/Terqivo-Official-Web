import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import manosImg from '@/src/assets/images/home-1.png';

export function FeaturedProduct() {
  const highlights = [
    "Intelligent assistance",
    "Desktop productivity",
    "Workflow automation",
    "Permission-based actions"
  ];

  return (
    <section className="py-24 bg-background border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-primary text-primary-foreground">
                Featured Product
              </div>
              <h2 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight">Meet Manos AI</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                An intelligent desktop assistant being developed to make computer workflows faster, simpler, and more natural while keeping users in control.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((highlight, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span className="font-medium text-foreground">{highlight}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Button size="lg" className="w-full sm:w-auto shadow-sm" asChild>
                <Link to="/products/manos-ai">
                  Discover Manos AI <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto shadow-sm" asChild>
                <Link to="/contact">Product Updates</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="w-full aspect-[4/3] rounded-[24px] shadow-2xl border bg-muted/20 flex items-center justify-center overflow-hidden">
              <img 
                src={manosImg}
                alt="Manos AI desktop assistant interface"
                loading="lazy"
                className="w-full h-full object-contain scale-[1.06]"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
