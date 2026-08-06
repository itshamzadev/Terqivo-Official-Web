import { motion, useReducedMotion } from 'motion/react';

export function AmbientPageDecor() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute -left-40 top-[22%] h-80 w-80 rounded-full bg-accent/5 blur-3xl"
        animate={shouldReduceMotion ? undefined : { x: [0, 28, 0], y: [0, -18, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 14, ease: 'easeInOut', repeat: Infinity }}
      />
      <motion.div
        className="absolute -right-48 bottom-[8%] h-[28rem] w-[28rem] rounded-full bg-primary/5 blur-3xl"
        animate={shouldReduceMotion ? undefined : { x: [0, -22, 0], y: [0, 18, 0], scale: [1, 1.06, 1] }}
        transition={{ duration: 17, ease: 'easeInOut', repeat: Infinity, delay: 1 }}
      />
    </div>
  );
}
