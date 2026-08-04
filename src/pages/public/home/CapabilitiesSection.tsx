import { motion } from 'motion/react';

export function CapabilitiesSection() {
  const capabilities = [
    { title: "Frontend Engineering", skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"] },
    { title: "Backend Systems", skills: ["Node.js", "Python", "Go", "PostgreSQL"] },
    { title: "Cloud & DevOps", skills: ["AWS", "Google Cloud", "Docker", "Kubernetes"] },
    { title: "Artificial Intelligence", skills: ["LLM Integration", "TensorFlow", "Computer Vision", "NLP"] }
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div 
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Technologies & Capabilities</h2>
          <p className="text-lg text-muted-foreground">We use modern, production-ready technologies to deliver secure, scalable, and high-performance digital products.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {capabilities.map((group, i) => (
            <motion.div 
              key={i} 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <h3 className="text-xl font-heading font-bold border-b pb-4">{group.title}</h3>
              <ul className="space-y-3">
                {group.skills.map((skill, j) => (
                  <li key={j} className="text-muted-foreground font-medium flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mr-3"></span>
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
