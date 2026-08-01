import { motion } from 'motion/react';
import { Brain, Code2, Shield, Settings2, Package, Building2 } from 'lucide-react';

export function CategoryNavigation() {
  const categories = [
    { label: "Artificial Intelligence", icon: Brain },
    { label: "Engineering", icon: Code2 },
    { label: "Security", icon: Shield },
    { label: "Automation", icon: Settings2 },
    { label: "Product Updates", icon: Package },
    { label: "Company News", icon: Building2 }
  ];

  return (
    <section className="bg-muted/10 py-12 border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {categories.map((cat, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex items-center gap-2 px-6 py-3 rounded-full border bg-background text-sm font-semibold text-foreground hover:border-accent/40 hover:bg-accent/5 hover:text-accent transition-all shadow-sm"
            >
              <cat.icon className="h-4 w-4" />
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
