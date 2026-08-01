import { motion } from 'motion/react';
import { Lock, FileKey, ServerCrash } from 'lucide-react';
import { Button } from '@/src/components/ui/button';
import { Link } from 'react-router-dom';
import { SecurityVisual } from './SecurityVisual';

export function SecuritySection() {
  const items = [
    { icon: Lock, title: "Data Encryption", desc: "End-to-end encryption for all sensitive data in transit and at rest." },
    { icon: FileKey, title: "Access Control", desc: "Role-based access controls and robust identity management systems." },
    { icon: ServerCrash, title: "High Availability", desc: "Redundant architectures guaranteeing 99.99% uptime for mission-critical systems." }
  ];

  return (
    <section className="py-24 bg-muted/30 border-y">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Security & Trust</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              We design software with a security-first mindset. From secure authentication protocols to hardened cloud infrastructure, your data's integrity is our highest priority.
            </p>
            <div className="space-y-6">
              {items.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1 h-10 w-10 shrink-0 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-heading font-bold mb-2">{item.title}</h4>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-8">
               <Button variant="outline" asChild>
                 <Link to="/about">Learn about our infrastructure</Link>
               </Button>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative lg:pl-12"
          >
            <SecurityVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
