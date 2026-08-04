import { motion } from 'motion/react';
import { Shield, Lightbulb, Code2, Hourglass } from 'lucide-react';

export function CoreValues() {
  const values = [
    {
      icon: Shield,
      title: "Integrity",
      desc: "We build with transparency and honesty. Security and privacy are foundational, never compromised for speed."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      desc: "We explore new approaches thoughtfully, turning emerging ideas into useful, responsible software."
    },
    {
      icon: Code2,
      title: "Engineering Excellence",
      desc: "We take pride in our craft. Clean architecture, rigorous testing, and performance optimization define our work."
    },
    {
      icon: Hourglass,
      title: "Long-Term Thinking",
      desc: "We design systems meant to endure. Our solutions are built to scale and adapt to future technological shifts."
    }
  ];

  return (
    <section className="py-24 bg-muted/30 border-y">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Core Values</h2>
          <p className="text-lg text-muted-foreground">The foundational principles that guide our engineering and design decisions every day.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-background p-8 rounded-2xl border hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group"
            >
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 text-accent group-hover:bg-accent group-hover:text-primary-foreground transition-colors duration-300">
                <value.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-3">{value.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
