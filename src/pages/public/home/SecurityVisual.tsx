import { motion, useReducedMotion } from 'motion/react';
import { Lock } from 'lucide-react';

export function SecurityVisual() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative aspect-square w-full max-w-md mx-auto rounded-full flex items-center justify-center overflow-hidden" aria-hidden="true">
      {/* Background grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 rounded-full" />
      
      {/* Rings */}
      <motion.div 
        className="absolute inset-4 rounded-full border border-dashed border-primary/20"
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={{ duration: 60, ease: 'linear', repeat: Infinity }}
      />
      
      <motion.div 
        className="absolute inset-16 rounded-full border border-dashed border-accent/30"
        animate={shouldReduceMotion ? {} : { rotate: -360 }}
        transition={{ duration: 45, ease: 'linear', repeat: Infinity }}
      >
         {/* Small permission nodes */}
         <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-accent rounded-full" />
         <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-accent/50 rounded-full" />
         <div className="absolute bottom-4 left-1/4 w-3 h-3 bg-accent/80 rounded-full" />
      </motion.div>
      
      <motion.div 
        className="absolute inset-28 rounded-full border border-primary/10"
      />

      {/* Encrypted pulse inward */}
      {!shouldReduceMotion && (
        <motion.div 
          className="absolute rounded-full border border-accent/40 bg-accent/5"
          initial={{ inset: '16px', opacity: 0 }}
          animate={{ inset: '112px', opacity: [0, 1, 0] }}
          transition={{ duration: 3, ease: 'easeOut', repeat: Infinity, repeatDelay: 2 }}
        />
      )}

      {/* Center lock */}
      <div className="relative z-10 w-24 h-24 bg-background border border-primary/10 shadow-lg rounded-full flex items-center justify-center">
        <Lock className="h-10 w-10 text-primary" />
      </div>
    </div>
  );
}
