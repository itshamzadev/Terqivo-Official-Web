import { motion } from 'motion/react';
import { Cpu, Code, Globe, Shield, Smartphone, Database, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/src/components/ui/button';

export function SolutionsSection() {
  const solutions = [
    { icon: Code, title: 'Custom Software', desc: 'Purpose-built software designed around your operations, users, and long-term goals.' },
    { icon: Cpu, title: 'Artificial Intelligence', desc: 'Practical AI solutions that automate processes, improve decisions, and enhance digital experiences.' },
    { icon: Globe, title: 'Cloud Architecture', desc: 'Secure and scalable cloud infrastructure, migration, integration, and deployment solutions.' },
    { icon: Smartphone, title: 'Mobile Platforms', desc: 'Modern mobile applications designed for reliable performance across supported devices.' },
    { icon: Shield, title: 'Digital Security', desc: 'Security-focused systems designed to protect data, users, applications, and digital operations.' },
    { icon: Database, title: 'Data Engineering', desc: 'Reliable data pipelines, integrations, analytics infrastructure, and intelligent processing systems.' }
  ];

  return (
    <section className="py-24 bg-muted/30 border-y">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Technology Solutions</h2>
            <p className="text-lg text-muted-foreground">Engineering dependable technology solutions for modern business challenges.</p>
          </div>
          <Button variant="outline" asChild>
            <Link to="/services">View All Solutions</Link>
          </Button>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((service, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative bg-background p-8 rounded-2xl border hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group overflow-hidden cursor-pointer"
            >
              {/* Soft gradient highlight near top edge */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="h-12 w-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6 text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300 group-hover:-translate-y-0.5">
                <service.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3 group-hover:text-accent transition-colors flex items-center justify-between">
                {service.title}
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
