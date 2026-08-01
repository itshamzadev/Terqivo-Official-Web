import { motion } from 'motion/react';
import { Layers, Puzzle, Users } from 'lucide-react';

export function EngagementModel() {
  const models = [
    {
      title: "Product Development",
      desc: "For complete products, platforms, and major software initiatives.",
      icon: Layers
    },
    {
      title: "Solution Engineering",
      desc: "For focused systems, integrations, automation, or technical modules.",
      icon: Puzzle
    },
    {
      title: "Technical Collaboration",
      desc: "For long-term product improvement and engineering support.",
      icon: Users
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-heading font-bold mb-4"
          >
            Flexible ways to work with Terqivo.
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {models.map((model, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-muted/10 p-8 rounded-2xl border text-center hover:border-accent/30 transition-colors"
            >
              <div className="h-14 w-14 rounded-xl bg-background border flex items-center justify-center text-accent mx-auto mb-6 shadow-sm">
                <model.icon className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">{model.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{model.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
