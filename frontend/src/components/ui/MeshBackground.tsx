import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';

export const MeshBackground: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-background transition-colors duration-1000" />
    );
  }

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Base Background */}
      <div className="absolute inset-0 bg-background transition-colors duration-1000" />
      
      {/* Floating Organic Blobs */}
      <motion.div
        animate={{
          x: ['0%', '5%', '-5%', '0%'],
          y: ['0%', '10%', '-5%', '0%'],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{
          duration: 25,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className={cn(
          "absolute -top-[10%] -left-[10%] w-[60%] h-[60%]",
          "bg-orange-200/20 rounded-full mix-blend-multiply filter blur-[80px]"
        )}
      />
      
      <motion.div
        animate={{
          x: ['0%', '-5%', '5%', '0%'],
          y: ['0%', '-10%', '10%', '0%'],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 28,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className={cn(
          "absolute top-[20%] -right-[10%] w-[50%] h-[50%]",
          "bg-rose-200/20 rounded-full mix-blend-multiply filter blur-[80px]"
        )}
      />

      <motion.div
        animate={{
          x: ['0%', '10%', '-10%', '0%'],
          y: ['0%', '5%', '-5%', '0%'],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration: 32,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className={cn(
          "absolute -bottom-[10%] left-[20%] w-[70%] h-[60%]",
          "bg-[#F5E4D7]/50 rounded-full mix-blend-multiply filter blur-[100px]"
        )}
      />

      {/* Soft Ambient Particles (Dust) */}
      <motion.div
        animate={{ opacity: [0.1, 0.3, 0.1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20"
      />
    </div>
  );
};
