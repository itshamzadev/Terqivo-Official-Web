import { motion } from 'motion/react';
import { Target, Lock, MousePointer2, GitBranch } from 'lucide-react';

export function ProductPrinciples() {
  const principles = [
    {
      title: "Useful by Design",
      desc: "Products should solve clear problems and improve real workflows.",
      icon: Target
    },
    {
      title: "Secure by Architecture",
      desc: "Permissions, access, and data boundaries are considered from the beginning.",
      icon: Lock
    },
    {
      title: "Simple to Use",
      desc: "Advanced systems should remain understandable and controlled.",
      icon: MousePointer2
    },
    {
      title: "Built to Evolve",
      desc: "Products are structured for learning, improvement, and future development.",
      icon: GitBranch
    }
  ];

  return (
    <section className="py-24 bg-background border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-heading font-bold mb-4"
          >
            How Terqivo approaches product development.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Every product is treated as a complete system, combining user experience, engineering quality, security, performance, and long-term maintainability.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-muted/10 p-8 rounded-2xl border flex flex-col items-start hover:border-accent/30 transition-colors"
            >
              <div className="h-12 w-12 rounded-xl bg-background border flex items-center justify-center text-foreground mb-6 shadow-sm">
                <principle.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-heading font-bold mb-3">{principle.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{principle.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
