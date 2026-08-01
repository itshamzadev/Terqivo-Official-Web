import { motion } from 'motion/react';
import { Layers, Monitor, Globe, Server, Bot } from 'lucide-react';

export function ProductEcosystem() {
  return (
    <section className="py-24 bg-background border-b overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold">Products that can work together.</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Terqivo’s long-term direction is to build a connected ecosystem of intelligent products, software platforms, automation tools, and secure digital systems.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="w-full aspect-[4/3] rounded-[24px] bg-muted/10 border flex items-center justify-center p-4 sm:p-8 relative">
              {/* Central Flow Diagram */}
              <div className="relative w-full max-w-md mx-auto flex flex-col items-center gap-4">
                
                {/* Users Node */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="bg-background border rounded-lg px-6 py-3 shadow-sm text-sm font-semibold text-foreground flex items-center gap-2 z-10"
                >
                  Users
                </motion.div>

                {/* Arrow */}
                <div className="w-px h-6 bg-border relative">
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r-2 border-b-2 border-border" />
                </div>

                {/* Terqivo Products Core */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                  className="bg-accent/10 border border-accent/20 rounded-xl px-8 py-4 shadow-sm text-base font-bold text-accent flex items-center gap-2 z-10 w-full justify-center"
                >
                  <Layers className="h-5 w-5" /> Terqivo Products
                </motion.div>

                {/* Arrow */}
                <div className="w-px h-6 bg-border relative">
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r-2 border-b-2 border-border" />
                </div>

                {/* Lower stack */}
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col w-full gap-2 z-10"
                >
                  <div className="bg-background border rounded-lg px-6 py-3 shadow-sm text-sm font-semibold text-foreground text-center">
                    Intelligence Layer
                  </div>
                  <div className="bg-background border rounded-lg px-6 py-3 shadow-sm text-sm font-semibold text-foreground text-center">
                    Automation
                  </div>
                  <div className="bg-background border rounded-lg px-6 py-3 shadow-sm text-sm font-semibold text-foreground text-center">
                    Secure Infrastructure
                  </div>
                </motion.div>
                
                {/* Surrounding Modules - Desktop/Web etc */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  <div className="absolute top-[25%] -left-4 sm:left-0 bg-background border rounded-full px-3 py-1.5 shadow-sm text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Monitor className="h-3.5 w-3.5" /> Desktop
                  </div>
                  <div className="absolute top-[25%] -right-4 sm:right-0 bg-background border rounded-full px-3 py-1.5 shadow-sm text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5" /> Web
                  </div>
                  <div className="absolute bottom-[20%] -left-8 sm:-left-4 bg-background border rounded-full px-3 py-1.5 shadow-sm text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Bot className="h-3.5 w-3.5" /> Business Systems
                  </div>
                  <div className="absolute bottom-[20%] -right-8 sm:-right-4 bg-background border rounded-full px-3 py-1.5 shadow-sm text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Server className="h-3.5 w-3.5" /> Developer Tools
                  </div>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
