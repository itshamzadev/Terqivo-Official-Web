import { motion } from 'motion/react';
import { ShieldCheck, Globe2, Zap } from 'lucide-react';
import { SystemFlowVisual } from './SystemFlowVisual';

export function WhyTerqivo() {
  const principles = [
    {
      icon: ShieldCheck,
      title: "Uncompromising Quality",
      description: "Every line of code is reviewed, tested, and optimized for maximum performance, security, and maintainability."
    },
    {
      icon: Globe2,
      title: "Global Perspective",
      description: "We build systems designed to operate on a global scale, handling multi-region deployments effortlessly."
    },
    {
      icon: Zap,
      title: "Future-Proof Tech",
      description: "Leveraging the latest advancements in AI and cloud infrastructure to keep you ahead of the technological curve."
    }
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
           <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
           >
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Why Terqivo</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  We partner with ambitious companies to build software that drives real business value. Our rigorous standards ensure every project is delivered with precision.
                </p>
              </div>
              <div className="space-y-6">
                 {principles.map((principle, index) => (
                    <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border">
                       <div className="mt-1 h-12 w-12 shrink-0 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                          <principle.icon className="h-6 w-6" />
                       </div>
                       <div>
                         <h4 className="text-xl font-heading font-bold mb-2">{principle.title}</h4>
                         <p className="text-muted-foreground text-sm leading-relaxed">{principle.description}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </motion.div>
           
           <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
           >
              <SystemFlowVisual />
           </motion.div>
        </div>
      </div>
    </section>
  );
}
