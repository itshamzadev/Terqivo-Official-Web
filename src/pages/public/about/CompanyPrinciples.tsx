import { motion } from 'motion/react';
import { BadgeCheck, Zap, Lock, Settings2, Activity, TrendingUp } from 'lucide-react';

export function CompanyPrinciples() {
  const principles = [
    {
      icon: BadgeCheck,
      title: "Product Quality",
      desc: "Delivering polished, dependable software experiences."
    },
    {
      icon: Zap,
      title: "Performance",
      desc: "Optimizing every layer for speed and efficiency."
    },
    {
      icon: Lock,
      title: "Security",
      desc: "Protecting data through layered security practices."
    },
    {
      icon: Settings2,
      title: "Maintainability",
      desc: "Writing clean, self-documenting code teams can confidently maintain."
    },
    {
      icon: Activity,
      title: "Reliability",
      desc: "Supporting reliable uptime through resilient architectural patterns."
    },
    {
      icon: TrendingUp,
      title: "Continuous Improvement",
      desc: "Improving continuously through metrics, feedback, and learning."
    }
  ];

  return (
    <section className="py-24 bg-background border-y">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Company Principles</h2>
          <p className="text-lg text-muted-foreground">The standards we apply to every project.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((principle, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-muted/10 p-6 rounded-2xl border flex items-start gap-4 hover:border-accent/40 transition-colors"
            >
              <div className="h-10 w-10 rounded-lg bg-background border flex items-center justify-center text-accent shrink-0 shadow-sm mt-1">
                <principle.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-heading font-bold mb-1">{principle.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{principle.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
