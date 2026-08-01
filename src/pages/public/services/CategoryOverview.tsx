import { motion } from 'motion/react';
import { Brain, Code2, Cloud, Workflow, Building2, Database, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CategoryOverview() {
  const categories = [
    {
      title: "Artificial Intelligence",
      desc: "Intelligent workflows, model integration, and practical AI experiences.",
      icon: Brain
    },
    {
      title: "Custom Software",
      desc: "Purpose-built software designed around real operational requirements.",
      icon: Code2
    },
    {
      title: "SaaS Platforms",
      desc: "Secure, scalable platforms with maintainable product architecture.",
      icon: Cloud
    },
    {
      title: "Business Automation",
      desc: "Connected workflows that reduce repetitive work and improve consistency.",
      icon: Workflow
    },
    {
      title: "Enterprise Systems",
      desc: "Reliable systems designed for complex processes and long-term evolution.",
      icon: Building2
    },
    {
      title: "Data Engineering",
      desc: "Structured data flows, integrations, and dependable information systems.",
      icon: Database
    }
  ];

  return (
    <section className="py-24 bg-muted/20 border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-heading font-bold mb-4"
          >
            Engineering across the technology lifecycle.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Terqivo brings together product thinking, software engineering, AI integration, security, and delivery to solve complex digital challenges.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link 
                to="#dynamic-solutions" 
                className="group block h-full bg-background p-6 rounded-2xl border hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('dynamic-solutions')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary-foreground transition-colors duration-300">
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors duration-300 group-hover:translate-x-1" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-2">{cat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{cat.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
