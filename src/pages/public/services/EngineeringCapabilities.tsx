import { motion } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

export function EngineeringCapabilities() {
  const capabilities = [
    "Product architecture",
    "Frontend engineering",
    "Backend and API systems",
    "AI model integration",
    "Data architecture",
    "Deployment and delivery"
  ];

  const diagramLayers = [
    { label: "Interface", color: "bg-background border-border text-foreground" },
    { label: "Application Logic", color: "bg-blue-500/5 border-blue-500/20 text-blue-600 dark:text-blue-400" },
    { label: "Intelligence", color: "bg-accent/10 border-accent/30 text-accent" },
    { label: "Data", color: "bg-muted/50 border-border text-foreground/80" },
    { label: "Infrastructure", color: "bg-muted border-border/80 text-muted-foreground" }
  ];

  return (
    <section className="py-24 bg-background border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Complete engineering capabilities.</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
            Solutions are developed as complete systems, not isolated screens or disconnected features. We construct every layer with intent.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {capabilities.map((cap, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span className="font-medium text-foreground">{cap}</span>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="w-full aspect-square md:aspect-[4/3] rounded-[24px] bg-muted/20 border flex flex-col justify-center items-center p-8 gap-4 shadow-sm">
              {diagramLayers.map((layer, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (index * 0.1), duration: 0.4 }}
                  className={`w-full max-w-sm p-4 rounded-xl border flex items-center justify-center font-semibold text-sm tracking-wide shadow-sm relative ${layer.color}`}
                >
                  {layer.label}
                  {/* Connection arrow to next layer (except last) */}
                  {index < diagramLayers.length - 1 && (
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-border">
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r-2 border-b-2 border-border" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
