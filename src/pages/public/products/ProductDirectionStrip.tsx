import { motion } from 'motion/react';
import { Cpu, ShieldCheck, Link2, RefreshCw } from 'lucide-react';

export function ProductDirectionStrip() {
  const items = [
    { label: "Intelligent Software", icon: Cpu },
    { label: "Secure Products", icon: ShieldCheck },
    { label: "Connected Systems", icon: Link2 },
    { label: "Continuous Improvement", icon: RefreshCw }
  ];

  return (
    <div className="bg-muted/30 border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-wrap items-center justify-center md:justify-between py-6 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="flex items-center gap-3 text-muted-foreground"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium tracking-wide">{item.label}</span>
              {index < items.length - 1 && (
                <div className="hidden md:block h-4 w-px bg-border ml-6" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
