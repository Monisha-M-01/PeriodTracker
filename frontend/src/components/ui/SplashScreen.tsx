import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AFFIRMATIONS = [
  "Believe in yourself",
  "You are in sync with you",
  "Be gentle with yourself",
  "Trust your body",
  "One day at a time",
  "In sync with you"
];

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [affirmation, setAffirmation] = useState("");

  useEffect(() => {
    // Pick a random affirmation on mount
    const randomIdx = Math.floor(Math.random() * AFFIRMATIONS.length);
    setAffirmation(AFFIRMATIONS[randomIdx]);

    // Auto dismiss after 2.5s (includes fade out time)
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-[#FFF5F0] flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      onClick={onComplete} // Tap anywhere to skip
    >
      {/* Decorative background elements */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute w-96 h-96 bg-[#FFD1BA] rounded-full blur-3xl opacity-40 top-1/4 -right-20"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
        className="absolute w-72 h-72 bg-[#D4DFC7] rounded-full blur-3xl opacity-30 bottom-1/4 -left-10"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* Floating Affirmation */}
        <AnimatePresence>
          {affirmation && (
            <motion.div
              key="affirmation"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: -10 }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              className="absolute -top-16 text-center w-full whitespace-nowrap"
            >
              <span className="font-serif text-xl md:text-2xl text-[#E76F51]/90 italic tracking-wide">
                "{affirmation}"
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Meditating Woman SVG */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-64 h-64 md:w-80 md:h-80 mt-8"
        >
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-sm">
            {/* Minimalist hand-drawn style meditating woman */}
            {/* Face/Head */}
            <path d="M200 80C178 80 160 98 160 120C160 142 178 160 200 160C222 160 240 142 240 120C240 98 222 80 200 80Z" fill="#F4A261" />
            <path d="M190 120C190 120 195 125 200 125C205 125 210 120 210 120" stroke="#E76F51" strokeWidth="3" strokeLinecap="round" />
            
            {/* Body */}
            <path d="M200 160C170 190 150 240 130 280C120 300 140 320 160 310C180 300 200 280 200 280C200 280 220 300 240 310C260 320 280 300 270 280C250 240 230 190 200 160Z" fill="#E9C46A" />
            
            {/* Arms / Hands resting on knees */}
            <path d="M180 165C150 180 110 230 135 285" stroke="#F4A261" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M220 165C250 180 290 230 265 285" stroke="#F4A261" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />

            {/* Hair/Head Wrap (Olive) */}
            <path d="M155 120C155 90 170 70 200 70C230 70 245 90 245 120C245 140 230 160 200 160" stroke="#2A9D8F" strokeWidth="14" strokeLinecap="round" />
            <path d="M200 65C185 65 175 55 180 40C185 25 215 25 220 40C225 55 215 65 200 65Z" fill="#2A9D8F" />

            {/* Closed eyes (calm) */}
            <path d="M185 110C190 112 195 112 200 110" stroke="#264653" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M205 110C210 112 215 112 220 110" stroke="#264653" strokeWidth="2.5" strokeLinecap="round" />

            {/* Decorative organic shapes around */}
            <path d="M100 150C110 140 120 160 110 170C100 180 90 160 100 150Z" fill="#E76F51" opacity="0.6" />
            <path d="M300 120C310 110 320 130 310 140C300 150 290 130 300 120Z" fill="#2A9D8F" opacity="0.6" />
            <circle cx="280" cy="220" r="8" fill="#F4A261" opacity="0.5" />
            <circle cx="120" cy="240" r="6" fill="#E9C46A" opacity="0.8" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}
