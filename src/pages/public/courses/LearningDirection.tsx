import { Code, BookOpen, Layers, Target } from 'lucide-react';
import { motion } from 'motion/react';

export function LearningDirection() {
  const items = [
    { label: "Practical Skills", icon: Target },
    { label: "Modern Technology", icon: Code },
    { label: "Project-Based Learning", icon: Layers },
    { label: "Continuous Growth", icon: BookOpen }
  ];

  return (
    <section className="bg-muted/10 py-10 border-b overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12 lg:gap-16">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex items-center gap-3 text-muted-foreground"
            >
              <item.icon className="h-5 w-5 text-accent" />
              <span className="font-semibold text-sm tracking-wide">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
