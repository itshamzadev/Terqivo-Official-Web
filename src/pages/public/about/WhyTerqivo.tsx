import { motion } from 'motion/react';
import { Cpu, ShieldCheck, Database, Users } from 'lucide-react';

export function WhyTerqivo() {
  const reasons = [
    {
      title: "Applied AI",
      desc: "We apply artificial intelligence where it creates practical value, improving workflows without treating it as an afterthought.",
      icon: Cpu
    },
    {
      title: "Secure by Design",
      desc: "Security is built into our architecture from day one. We use modern encryption, secure protocols, and strict access controls.",
      icon: ShieldCheck
    },
    {
      title: "Scalable Architecture",
      desc: "Our systems are designed to grow. We use modern cloud-native principles so your infrastructure can scale reliably.",
      icon: Database
    },
    {
      title: "Human-Centered Products",
      desc: "We build for people. Alongside deep engineering, every product must be intuitive, accessible, and thoughtfully designed.",
      icon: Users
    }
  ];

  return (
    <section className="py-24 bg-background border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Why Terqivo</h2>
          <p className="text-lg text-muted-foreground">The practical advantages of partnering with our engineering team.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-muted/30 p-8 rounded-2xl border flex flex-col sm:flex-row gap-6 hover:bg-muted/50 transition-colors"
            >
              <div className="h-14 w-14 rounded-xl bg-background border flex items-center justify-center text-accent shrink-0 shadow-sm">
                <reason.icon className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-xl font-heading font-bold mb-2">{reason.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{reason.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
