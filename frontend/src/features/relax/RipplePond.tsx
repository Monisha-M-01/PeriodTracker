import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function RipplePond({ onExit }: { onExit: () => void }) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  let rippleId = 0;

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = (e as React.MouseEvent).clientX;
      y = (e as React.MouseEvent).clientY;
    }

    const newRipple = { id: Date.now() + Math.random(), x, y };
    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-cyan-900 overflow-hidden touch-none"
      onMouseDown={handleInteraction}
      onTouchStart={handleInteraction}
      onMouseMove={(e) => {
        if (e.buttons === 1) handleInteraction(e);
      }}
      onTouchMove={handleInteraction}
    >
      <div className="absolute top-4 right-4 z-10 pt-safe">
        <button onClick={onExit} className="p-2 bg-white/10 rounded-full text-white/70 hover:bg-white/20">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute top-12 w-full text-center pointer-events-none z-10">
        <p className="text-cyan-100/50 font-serif font-medium text-lg">Tap to make ripples</p>
      </div>

      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 20, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute rounded-full border border-cyan-300 pointer-events-none"
            style={{ 
              left: ripple.x - 20, 
              top: ripple.y - 20,
              width: 40,
              height: 40,
            }}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
