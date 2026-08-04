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
      <svg
        className="absolute inset-0 h-full w-full text-accent opacity-30"
        viewBox="0 0 1440 1000"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          d="M-160 180C120 40 250 62 430 220s340 208 640 30 400-136 600-20"
          className="stroke-current"
          strokeWidth="1"
          opacity="0.2"
        />
        <path
          d="M-180 650c250-174 420-150 590 22s344 214 584 28 352-158 610-34"
          className="stroke-current"
          strokeWidth="1.2"
          opacity="0.15"
        />
        {!shouldReduceMotion && (
          <motion.path
            d="M-160 180C120 40 250 62 430 220s340 208 640 30 400-136 600-20"
            className="stroke-current"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1], opacity: [0, 0.55, 0.12] }}
            transition={{ duration: 12, times: [0, 0.65, 1], ease: 'easeInOut', repeat: Infinity, repeatDelay: 3 }}
          />
        )}
      </svg>
    </div>
  );
}
