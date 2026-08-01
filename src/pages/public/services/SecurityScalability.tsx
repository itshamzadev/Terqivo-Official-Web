import { motion } from 'motion/react';
import { Shield, Key, Network, Wrench } from 'lucide-react';

export function SecurityScalability() {
  const points = [
    {
      title: "Secure by Design",
      desc: "Security decisions are included in the architecture rather than added at the end.",
      icon: Shield
    },
    {
      title: "Controlled Access",
      desc: "Clear authentication, authorization, and permission boundaries.",
      icon: Key
    },
    {
      title: "Scalable Foundations",
      desc: "Systems structured to evolve as products, users, and workflows grow.",
      icon: Network
    },
    {
      title: "Maintainable Engineering",
      desc: "Readable architecture designed for long-term improvement.",
      icon: Wrench
    }
  ];

  return (
    <section className="py-24 bg-muted/10 border-b overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-heading font-bold mb-4"
          >
            Designed for security, scale, and maintainability.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Terqivo considers permissions, data handling, system boundaries, performance, and future development from the beginning.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="grid sm:grid-cols-2 gap-6 order-2 lg:order-1">
            {points.map((point, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-background p-6 rounded-2xl border flex flex-col items-start hover:shadow-sm transition-shadow"
              >
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4 border border-accent/20">
                  <point.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-heading font-bold mb-2">{point.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{point.desc}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-2 relative aspect-square md:aspect-[4/3] rounded-[24px] bg-background border shadow-md flex items-center justify-center p-8"
          >
            {/* Minimal SVG Security/Scalability Diagram */}
            <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
              {/* Outer rotating dashed ring */}
              <motion.div 
                className="absolute inset-0 rounded-full border-2 border-dashed border-accent/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, ease: "linear", repeat: Infinity }}
              />
              
              {/* Inner glowing core */}
              <div className="w-24 h-24 bg-accent/10 rounded-full border border-accent/50 flex items-center justify-center relative shadow-[0_0_30px_-5px_hsl(var(--accent)/0.3)]">
                <Shield className="w-12 h-12 text-accent" />
                <motion.div 
                  className="absolute inset-0 rounded-full border border-accent"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
                />
              </div>

              {/* Orbiting nodes */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-4 h-4 -ml-2 -mt-2 bg-background border-2 border-accent rounded-full shadow-sm"
                  initial={{ rotate: i * 120 }}
                  animate={{ rotate: i * 120 + 360 }}
                  transition={{ duration: 15, ease: "linear", repeat: Infinity }}
                  style={{ transformOrigin: "140px center" }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
