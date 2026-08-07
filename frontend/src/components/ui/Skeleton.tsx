import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <motion.div
      className={cn("bg-muted/30 rounded-md overflow-hidden relative", className)}
      {...props}
    >
      <motion.div
        className="absolute inset-0 z-10"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
          width: '200%',
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
}
