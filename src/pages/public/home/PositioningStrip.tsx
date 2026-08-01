import { motion, useReducedMotion } from 'motion/react';

export function PositioningStrip() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative border-y bg-secondary/30 py-8 overflow-hidden">
      {/* Animated data pulse line */}
      {!shouldReduceMotion && (
        <motion.div
          className="absolute top-0 h-[1px] w-[200px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-40"
          animate={{
            left: ['-200px', '100%']
          }}
          transition={{
            duration: 4,
            ease: 'linear',
            repeat: Infinity,
            repeatDelay: 3
          }}
        />
      )}
      <div className="container relative z-10 mx-auto px-4 max-w-7xl">
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-center text-sm sm:text-base font-semibold text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            Enterprise Software
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            Artificial Intelligence
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            Cloud Infrastructure
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent"></span>
            Digital Security
          </div>
        </div>
      </div>
    </section>
  );
}
