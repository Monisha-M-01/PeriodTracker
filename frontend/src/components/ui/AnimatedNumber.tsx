import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const springValue = useSpring(value, { stiffness: 100, damping: 20 });
  const displayValue = useTransform(springValue, (current) => Math.round(current));

  useEffect(() => {
    springValue.set(value);
  }, [springValue, value]);

  return <motion.span className={className}>{displayValue}</motion.span>;
}
