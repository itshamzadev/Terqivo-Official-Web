import { motion, useReducedMotion } from 'motion/react';

export function EngineeringPhilosophy() {
  const shouldReduceMotion = useReducedMotion();
  const stages = [
    { num: "01", title: "Discover", desc: "Understand the core problem, users, and real-world requirements." },
    { num: "02", title: "Design", desc: "Architect the solution and shape a clear product experience." },
    { num: "03", title: "Engineer", desc: "Build with precision using scalable, maintainable technologies." },
    { num: "04", title: "Validate", desc: "Test rigorously for performance, security, reliability, and edge cases." },
    { num: "05", title: "Improve", desc: "Iterate continuously using data, feedback, and learning." }
  ];

  const totalDuration = 10;
  const stageDuration = totalDuration / stages.length;

  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Engineering Philosophy</h2>
          <p className="text-lg text-primary-foreground/70">Our systematic approach to building reliable, maintainable technology.</p>
        </div>
        
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-6 left-[10%] right-[10%] h-[1px] bg-primary-foreground/20 z-0 overflow-hidden">
            {!shouldReduceMotion && (
              <motion.div 
                className="h-full w-[20%] bg-gradient-to-r from-transparent via-accent to-transparent"
                animate={{ x: ['-100%', '500%'] }}
                transition={{ duration: totalDuration, ease: 'linear', repeat: Infinity }}
              />
            )}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-4 relative z-10">
            {stages.map((stage, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative flex lg:flex-col lg:items-center lg:text-center group"
              >
                {/* Connecting Line (Mobile) */}
                {i !== stages.length - 1 && (
                  <div className="lg:hidden absolute top-12 left-6 w-[1px] h-[calc(100%+32px)] bg-primary-foreground/20 z-0 overflow-hidden">
                     {!shouldReduceMotion && (
                        <motion.div 
                          className="w-full h-[50%] bg-gradient-to-b from-transparent via-accent to-transparent"
                          animate={{ y: ['-100%', '200%'] }}
                          transition={{ duration: totalDuration, ease: 'linear', repeat: Infinity }}
                        />
                     )}
                  </div>
                )}
                
                <motion.div 
                  className="w-12 h-12 rounded-full bg-primary border-2 border-primary-foreground/30 flex items-center justify-center text-sm font-bold shrink-0 relative z-10 lg:mb-6 transition-colors"
                  animate={shouldReduceMotion ? {} : {
                    borderColor: ['rgba(255,255,255,0.3)', 'hsl(var(--accent))', 'rgba(255,255,255,0.3)'],
                    color: ['hsl(var(--primary-foreground))', 'hsl(var(--accent))', 'hsl(var(--primary-foreground))'],
                    boxShadow: ['0 0 0 0 rgba(0,0,0,0)', '0 0 15px 0 hsl(var(--accent)/0.3)', '0 0 0 0 rgba(0,0,0,0)']
                  }}
                  transition={{
                    duration: stageDuration,
                    delay: i * stageDuration,
                    repeat: Infinity,
                    repeatDelay: totalDuration - stageDuration,
                    ease: 'easeInOut'
                  }}
                >
                  {stage.num}
                </motion.div>
                
                <div className="pl-6 lg:pl-0 pt-2 lg:pt-0">
                  <motion.h3 
                    className="text-xl font-heading font-bold mb-2 transition-colors"
                    animate={shouldReduceMotion ? {} : {
                      color: ['hsl(var(--primary-foreground))', 'hsl(var(--accent))', 'hsl(var(--primary-foreground))']
                    }}
                    transition={{
                      duration: stageDuration,
                      delay: i * stageDuration,
                      repeat: Infinity,
                      repeatDelay: totalDuration - stageDuration,
                      ease: 'easeInOut'
                    }}
                  >
                    {stage.title}
                  </motion.h3>
                  <p className="text-primary-foreground/70 text-sm leading-relaxed">{stage.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
