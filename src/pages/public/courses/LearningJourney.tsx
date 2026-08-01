import { motion } from 'motion/react';

export function LearningJourney() {
  const steps = [
    {
      num: "01",
      title: "Choose",
      desc: "Select a course aligned with your learning goals."
    },
    {
      num: "02",
      title: "Understand",
      desc: "Build clear foundations around the subject."
    },
    {
      num: "03",
      title: "Practice",
      desc: "Apply concepts through exercises and projects."
    },
    {
      num: "04",
      title: "Build",
      desc: "Create practical work that demonstrates growing ability."
    },
    {
      num: "05",
      title: "Continue",
      desc: "Use the foundation to keep learning and improving."
    }
  ];

  return (
    <section className="py-24 bg-primary text-primary-foreground border-b border-primary/20 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-accent/20 via-transparent to-transparent opacity-30 blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 max-w-7xl">
        <div className="mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-heading font-bold"
          >
            The learning journey.
          </motion.h2>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden lg:block absolute top-[28px] left-0 w-full h-[2px] bg-primary-foreground/10" />

          <div className="grid lg:grid-cols-5 gap-8 lg:gap-6 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="relative z-10 flex flex-row lg:flex-col gap-6 lg:gap-8"
              >
                <div className="shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-primary border-4 border-background text-lg font-bold font-heading text-accent shadow-sm relative lg:mx-auto">
                  {step.num}
                  {/* Vertical line for mobile */}
                  {index !== steps.length - 1 && (
                    <div className="lg:hidden absolute top-14 left-1/2 -translate-x-1/2 w-[2px] h-[calc(100%+1.5rem)] bg-primary-foreground/10 -z-10" />
                  )}
                </div>
                <div className="lg:text-center pt-2 lg:pt-0">
                  <h3 className="text-xl font-heading font-bold mb-2">{step.title}</h3>
                  <p className="text-primary-foreground/70 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
