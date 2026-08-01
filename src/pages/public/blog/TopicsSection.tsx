import { motion } from 'motion/react';
import { Brain, Code2, Shield, Settings2, Monitor, Box } from 'lucide-react';

export function TopicsSection() {
  const topics = [
    {
      title: "Artificial Intelligence",
      desc: "LLMs, reasoning models, and agent architectures.",
      icon: Brain
    },
    {
      title: "Software Engineering",
      desc: "System design, patterns, and performance optimization.",
      icon: Code2
    },
    {
      title: "Security",
      desc: "Data protection, authentication, and secure infrastructure.",
      icon: Shield
    },
    {
      title: "Automation",
      desc: "Workflow efficiency and programmatic toolchains.",
      icon: Settings2
    },
    {
      title: "Desktop Applications",
      desc: "Native performance and OS-level integrations.",
      icon: Monitor
    },
    {
      title: "Product Development",
      desc: "Lifecycle, UX research, and iterative shipping.",
      icon: Box
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
            Explore topics
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Deep dives into the technologies and methodologies driving our work.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-muted/10 p-6 rounded-2xl border flex flex-col hover:border-accent/30 transition-colors cursor-pointer group"
            >
              <div className="h-10 w-10 rounded-xl bg-background border flex items-center justify-center text-foreground mb-4 shadow-sm group-hover:text-accent group-hover:border-accent/30 transition-colors">
                <topic.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-heading font-bold mb-2 group-hover:text-accent transition-colors">{topic.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{topic.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
