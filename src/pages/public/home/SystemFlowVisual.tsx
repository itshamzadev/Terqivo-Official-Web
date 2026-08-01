import { motion, useReducedMotion } from 'motion/react';
import { Lightbulb, PenTool, Code2, Cpu, CheckCircle } from 'lucide-react';

export function SystemFlowVisual() {
  const shouldReduceMotion = useReducedMotion();

  const nodes = [
    { id: 1, label: 'Idea', icon: Lightbulb },
    { id: 2, label: 'Product Design', icon: PenTool },
    { id: 3, label: 'Engineering', icon: Code2 },
    { id: 4, label: 'Intelligence', icon: Cpu },
    { id: 5, label: 'Reliable Product', icon: CheckCircle }
  ];

  return (
    <div className="w-full aspect-[4/5] rounded-[24px] shadow-lg border bg-muted/10 relative overflow-hidden flex flex-col items-center justify-center p-8" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-background/80 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-8">
        {nodes.map((node, index) => (
          <div key={node.id} className="relative w-full flex items-center justify-center">
            
            {/* Connection line to next node */}
            {index < nodes.length - 1 && (
              <div className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[1px] h-8 bg-border overflow-hidden">
                {!shouldReduceMotion && (
                  <motion.div
                    className="w-full h-1/2 bg-accent"
                    initial={{ y: '-100%' }}
                    animate={{ y: '200%' }}
                    transition={{
                      duration: 1.5,
                      delay: index * 1.5,
                      repeat: Infinity,
                      repeatDelay: nodes.length * 1.5 - 1.5,
                      ease: 'linear'
                    }}
                  />
                )}
              </div>
            )}

            {/* Node */}
            <motion.div 
              className="bg-background border shadow-sm rounded-xl px-6 py-4 flex items-center gap-4 w-64"
              initial={{ opacity: 0.8 }}
              animate={shouldReduceMotion ? {} : {
                opacity: [0.8, 1, 0.8],
                borderColor: ['hsl(var(--border))', 'hsl(var(--accent)/0.5)', 'hsl(var(--border))'],
                boxShadow: ['0 1px 2px 0 rgb(0 0 0 / 0.05)', '0 4px 12px 0 rgb(0 0 0 / 0.05)', '0 1px 2px 0 rgb(0 0 0 / 0.05)']
              }}
              transition={{
                duration: 1.5,
                delay: index * 1.5,
                repeat: Infinity,
                repeatDelay: nodes.length * 1.5 - 1.5,
                ease: 'easeInOut'
              }}
            >
              <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent shrink-0">
                <node.icon className="h-4 w-4" />
              </div>
              <span className="font-medium text-sm text-foreground">{node.label}</span>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
