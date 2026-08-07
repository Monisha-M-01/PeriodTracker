import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InfinityTrace({ onExit }: { onExit: () => void }) {
  const [orbPos, setOrbPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isTracing, setIsTracing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOrbPos({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsTracing(true);
    setOrbPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isTracing) return;
    // Add some drag/lag to force them to slow down
    setOrbPos(prev => {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      // move 10% towards target (creates smooth, deliberate trailing)
      return {
        x: prev.x + dx * 0.1,
        y: prev.y + dy * 0.1
      };
    });
  };

  const handlePointerUp = () => {
    setIsTracing(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-slate-900 touch-none overflow-hidden flex items-center justify-center"
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerUp}
    >
      <div className="absolute top-4 right-4 z-10 pt-safe">
        <button onClick={onExit} className="p-2 bg-white/10 rounded-full text-white/70 hover:bg-white/20">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute top-12 w-full text-center pointer-events-none z-10">
        <p className="text-slate-400 font-serif font-medium text-lg">Trace slowly to focus</p>
      </div>

      {/* Infinity Path SVG guide */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        <path 
          d="M 30,50 C 30,30 50,30 50,50 C 50,70 70,70 70,50 C 70,30 50,30 50,50 C 50,70 30,70 30,50 Z" 
          fill="none" 
          stroke="white" 
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </svg>

      {/* Glowing Orb */}
      <motion.div
        className="absolute w-12 h-12 rounded-full bg-indigo-400 blur-sm pointer-events-none"
        animate={{
          left: orbPos.x - 24,
          top: orbPos.y - 24,
          scale: isTracing ? 1.5 : 1,
          opacity: isTracing ? 1 : 0.5
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 120
        }}
      />
      <motion.div
        className="absolute w-4 h-4 rounded-full bg-white pointer-events-none"
        animate={{
          left: orbPos.x - 8,
          top: orbPos.y - 8,
          scale: isTracing ? 1 : 0.5
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 120
        }}
      />
    </motion.div>
  );
}
