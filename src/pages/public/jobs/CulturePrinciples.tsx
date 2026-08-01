import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export function CulturePrinciples() {
  const principles = [
    "Think clearly",
    "Build responsibly",
    "Communicate openly",
    "Learn continuously",
    "Improve through feedback",
    "Respect users and teammates"
  ];

  return (
    <section className="py-24 bg-background border-b overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-8">How we aim to work.</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {principles.map((principle, index) => (
                <div key={index} className="flex items-center gap-3 bg-muted/20 p-4 rounded-xl border">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span className="font-medium text-sm">{principle}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            {/* Lightweight CSS/SVG diagram */}
            <div className="w-full aspect-square max-h-[400px] mx-auto rounded-[24px] border bg-muted/5 p-8 flex flex-col justify-between relative shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent opacity-50" />
              
              <div className="flex flex-col h-full justify-center gap-6 relative z-10 max-w-sm mx-auto w-full py-4">
                <div className="flex items-center justify-between">
                  <div className="bg-background border-2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm z-10 relative">Ideas</div>
                  <div className="flex-1 h-px bg-muted-foreground/30 relative">
                    <ArrowRight className="text-muted-foreground/60 h-4 w-4 absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2" />
                  </div>
                  <div className="bg-background border-2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm z-10 relative">Discussion</div>
                </div>
                
                <div className="flex justify-end pr-10">
                  <div className="h-10 w-px bg-muted-foreground/30 relative">
                    <ArrowRight className="text-muted-foreground/60 h-4 w-4 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-90" />
                  </div>
                </div>
                
                <div className="flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-base font-bold shadow-md z-10 relative">Engineering</div>
                </div>
                
                <div className="flex justify-start pl-10">
                  <div className="h-10 w-px bg-muted-foreground/30 relative">
                    <ArrowRight className="text-muted-foreground/60 h-4 w-4 absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-90" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="bg-background border-2 px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm z-10 relative">Review</div>
                  <div className="flex-1 h-px bg-muted-foreground/30 relative">
                    <ArrowRight className="text-muted-foreground/60 h-4 w-4 absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2" />
                  </div>
                  <div className="bg-accent/10 text-accent border border-accent/20 px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm z-10 relative">Improvement</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
