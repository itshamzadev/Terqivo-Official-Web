import { motion } from 'motion/react';
import { Target, Lightbulb, Rocket, ShieldCheck } from 'lucide-react';

export function OurStory() {
  const storyPoints = [
    {
      icon: Lightbulb,
      title: "The Genesis",
      desc: "Terqivo was created with a singular focus: to engineer reliable, scalable software that solves complex problems without compromising on quality or architectural integrity."
    },
    {
      icon: Target,
      title: "Long-Term Vision",
      desc: "We look beyond immediate trends. Our goal is to build digital infrastructure that organizations can rely on for decades, continuously evolving with emerging technologies."
    },
    {
      icon: Rocket,
      title: "Engineering Mindset",
      desc: "Every product we create is rooted in strict engineering principles. We prioritize performance, security, and maintainability at every level of the stack."
    },
    {
      icon: ShieldCheck,
      title: "A Secure Future",
      desc: "As technology advances, so do the risks. We design systems that are inherently secure, protecting data and privacy as fundamental rights, not afterthoughts."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-heading font-bold mb-4"
          >
            Our Story
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            A commitment to engineering excellence and long-term thinking.
          </motion.p>
        </div>

        <div className="space-y-16 relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-muted-foreground/30 md:-translate-x-1/2" />
          
          {storyPoints.map((point, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative flex items-start md:items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              <div className="absolute left-6 md:left-1/2 w-4 h-4 rounded-full bg-background border-2 border-accent md:-translate-x-1/2 mt-2 md:mt-0 z-10" />
              
              <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pl-16' : 'md:pr-16 md:text-right'}`}>
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-accent/10 text-accent mb-5 ${index % 2 !== 0 ? 'md:ml-auto md:mr-0' : ''}`}>
                  <point.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-heading font-bold mb-3">{point.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{point.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
