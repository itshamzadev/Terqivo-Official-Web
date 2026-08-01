import { motion } from 'motion/react';
import { Hammer, Layers, GitPullRequest, ArrowUpRight } from 'lucide-react';

export function CourseDesign() {
  const points = [
    {
      title: "Learn by Building",
      desc: "Use practical exercises and projects to strengthen understanding.",
      icon: Hammer
    },
    {
      title: "Clear Foundations",
      desc: "Develop the concepts required to work confidently with modern technology.",
      icon: Layers
    },
    {
      title: "Real Workflows",
      desc: "Learn through tools, patterns, and processes used in software development.",
      icon: GitPullRequest
    },
    {
      title: "Continuous Improvement",
      desc: "Build skills through repetition, feedback, and increasingly capable projects.",
      icon: ArrowUpRight
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
            className="text-3xl md:text-4xl font-heading font-bold"
          >
            Learning designed for practical progress.
          </motion.h2>
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
