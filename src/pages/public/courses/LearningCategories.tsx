import { motion } from 'motion/react';
import { Code2, Cpu, BrainCircuit, Settings2, Monitor, Box } from 'lucide-react';

export function LearningCategories() {
  const categories = [
    {
      title: "Web Development",
      desc: "Full-stack patterns, React, and modern web architectures.",
      icon: Code2
    },
    {
      title: "Software Engineering",
      desc: "System design, databases, and application performance.",
      icon: Cpu
    },
    {
      title: "Artificial Intelligence",
      desc: "LLMs, intelligent agents, and AI integration.",
      icon: BrainCircuit
    },
    {
      title: "Automation",
      desc: "Workflows, scripting, and programmatic systems.",
      icon: Settings2
    },
    {
      title: "Desktop Applications",
      desc: "Native development and cross-platform tools.",
      icon: Monitor
    },
    {
      title: "Product Development",
      desc: "Planning, design systems, and software lifecycles.",
      icon: Box
    }
  ];

  return (
    <section id="learning-categories" className="py-24 bg-background border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-heading font-bold mb-4"
          >
            Explore topics
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Programs structured around the core competencies of modern technology.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-muted/10 p-6 rounded-2xl border flex flex-col hover:border-accent/30 transition-colors cursor-pointer group"
            >
              <div className="h-10 w-10 rounded-xl bg-background border flex items-center justify-center text-foreground mb-4 shadow-sm group-hover:text-accent group-hover:border-accent/30 transition-colors">
                <cat.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-heading font-bold mb-2 group-hover:text-accent transition-colors">{cat.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{cat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
