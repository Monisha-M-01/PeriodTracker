import React from 'react';
import { motion } from 'framer-motion';

export function FloatingBackgroundGlow() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      <motion.div
        className="absolute w-[80vw] h-[80vw] max-w-[600px] max-h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, var(--primary-base) 0%, transparent 70%)',
          filter: 'blur(80px)',
          opacity: 0.05,
        }}
        animate={{
          x: ['-20vw', '20vw', '-10vw', '-20vw'],
          y: ['-10vh', '10vh', '30vh', '-10vh'],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 25,
          ease: "linear",
          repeat: Infinity,
        }}
      />
    </div>
  );
}
