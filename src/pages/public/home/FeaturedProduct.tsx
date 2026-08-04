import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/src/components/ui/button';
import { ProgressiveImage } from '@/src/components/ui/progressive-image';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import home1Img from '@/src/assets/images/home-1.png';

export function FeaturedProduct() {
  const highlights = [
    "Intelligent assistance",
    "Desktop productivity",
    "Workflow automation",
    "Secure user controls"
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="bg-muted/30 rounded-[32px] border p-8 md:p-12 lg:p-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1"
            >
              <ProgressiveImage
                src={home1Img}
                alt="Manos AI intelligent desktop assistant interface"
                loading="eager"
                frameClassName="w-full aspect-[4/3] rounded-[24px] shadow-xl border bg-background"
                className="w-full h-full object-contain"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="space-y-8 order-1 lg:order-2"
            >
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold bg-accent/10 text-accent">
                  Featured Product
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold tracking-tight">
                  Meet Manos AI
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  An intelligent desktop assistant being developed to make everyday computer workflows faster, simpler, and more natural.
                </p>
              </div>

              <div className="space-y-3">
                {highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center text-foreground font-medium">
                    <CheckCircle2 className="h-5 w-5 text-accent mr-3 shrink-0" />
                    {highlight}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Button size="lg" className="w-full sm:w-auto h-12" asChild>
                  <Link to="/products/manos-ai">
                    Discover Manos AI <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12" asChild>
                  <Link to="/blog">
                    Product Updates
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
