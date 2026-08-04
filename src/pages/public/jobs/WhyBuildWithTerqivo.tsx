import { motion } from 'motion/react';
import { Target, TrendingUp, Cpu, ShieldCheck } from 'lucide-react';

export function WhyBuildWithTerqivo() {
  const points = [
    {
      title: "Meaningful Products",
      desc: "Contribute to software and systems designed around real needs.",
      icon: Target
    },
    {
      title: "Engineering Growth",
      desc: "Learn through practical challenges, collaboration, and product development.",
      icon: TrendingUp
    },
    {
      title: "Modern Technology",
      desc: "Work with AI, software platforms, automation, and secure digital systems.",
      icon: Cpu
    },
    {
      title: "Real Ownership",
      desc: "Take responsibility for outcomes and contribute beyond isolated tasks.",
      icon: ShieldCheck
    }
  ];

  return (
    <section className="py-24 bg-muted/10 border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-heading font-bold mb-4"
          >
            Work on technology with long-term purpose.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            Terqivo is built around thoughtful product development, continuous learning, engineering responsibility, and practical innovation.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 gap-8">
          {points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-background p-8 rounded-2xl border flex items-start gap-6 hover:border-accent/30 transition-colors shadow-sm"
            >
              <div className="shrink-0 h-12 w-12 rounded-xl bg-muted/50 border flex items-center justify-center text-foreground">
                <point.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold mb-2">{point.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{point.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
