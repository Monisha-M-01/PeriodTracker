import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getTodayCheckInFn } from '../../api/checkins.api';
import { cn } from '../../lib/utils';

export default function MoodMascot() {
  const [petIntensity, setPetIntensity] = useState(0);
  const [isHappy, setIsHappy] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);
  let nextHeartId = 0;

  const { data } = useQuery({
    queryKey: ['checkins', 'today'],
    queryFn: getTodayCheckInFn,
  });

  const moodString = data?.data?.moodString || '';
  
  // Mood priority: Anxious/Irritable > Sad/Down > Excited/Loved > Happy > Calm/Neutral
  let baseMood = 'Neutral';
  if (moodString.includes('Anxious') || moodString.includes('Irritable')) {
    baseMood = 'Anxious';
  } else if (moodString.includes('Sad') || moodString.includes('Down')) {
    baseMood = 'Sad';
  } else if (moodString.includes('Excited') || moodString.includes('Loved')) {
    baseMood = 'Excited';
  } else if (moodString.includes('Happy')) {
    baseMood = 'Happy';
  } else if (moodString.includes('Calm')) {
    baseMood = 'Calm';
  }

  // Adjust how many "pets" are needed to make the puppy happy
  let happinessThreshold = 40;
  if (baseMood === 'Happy' || baseMood === 'Excited') {
    happinessThreshold = 20; // 4-5 pets
  } else if (baseMood === 'Calm') {
    happinessThreshold = 40; // 8 pets
  } else if (baseMood === 'Sad') {
    happinessThreshold = 70; // 14 pets
  } else if (baseMood === 'Anxious') {
    happinessThreshold = 90; // 18 pets
  }

  const activeMood = isHappy ? 'Excited' : baseMood;

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (petIntensity > 0) {
      timeout = setTimeout(() => {
        setPetIntensity(prev => Math.max(0, prev - 10)); // Decay intensity
      }, 150);
    }
    
    if (petIntensity > happinessThreshold && !isHappy) {
      setIsHappy(true);
    } else if (petIntensity === 0 && isHappy) {
      setIsHappy(false);
    }
    
    return () => clearTimeout(timeout);
  }, [petIntensity, isHappy]);

  const handlePointerMove = (e: React.PointerEvent) => {
    // If pointer is down (scrubbing/petting)
    if (e.buttons > 0) {
      setPetIntensity(prev => {
        const newInt = Math.min(100, prev + 5);
        // Occasionally spawn a heart if really happy
        if (newInt > 60 && Math.random() > 0.8) {
          setHearts(h => [...h, { id: Date.now() + Math.random(), x: (Math.random() - 0.5) * 60 }]);
        }
        return newInt;
      });
    }
  };

  // Clean up old hearts
  useEffect(() => {
    if (hearts.length > 5) {
      setHearts(h => h.slice(h.length - 5));
    }
  }, [hearts]);

  const renderFace = () => {
    switch (activeMood) {
      case 'Anxious':
        return (
          <>
            {/* Worried eyes */}
            <path d="M 35 38 Q 40 33 45 38" stroke="#64748b" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 55 38 Q 60 33 65 38" stroke="#64748b" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="40" cy="45" r="3" fill="#64748b" />
            <circle cx="60" cy="45" r="3" fill="#64748b" />
            {/* Shivering mouth */}
            <path d="M 43 60 Q 45 58 47 60 T 51 60 T 55 60" stroke="#64748b" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        );
      case 'Sad':
        return (
          <>
            {/* Drooping eyes */}
            <path d="M 35 40 Q 40 45 45 40" stroke="#64748b" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 55 40 Q 60 45 65 40" stroke="#64748b" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="40" cy="48" r="3" fill="#64748b" />
            <circle cx="60" cy="48" r="3" fill="#64748b" />
            {/* Frown */}
            <path d="M 45 62 Q 50 56 55 62" stroke="#64748b" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Tear */}
            <path d="M 38 52 Q 40 56 42 52 Z" fill="#7dd3fc" />
          </>
        );
      case 'Excited': // The "Puppy" state
        return (
          <>
            {/* Happy closed eyes */}
            <path d="M 32 45 Q 40 35 48 45" stroke="#64748b" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 52 45 Q 60 35 68 45" stroke="#64748b" strokeWidth="4" fill="none" strokeLinecap="round" />
            {/* Big open mouth / tongue */}
            <path d="M 40 55 Q 50 70 60 55 Z" fill="#64748b" />
            <path d="M 45 60 Q 50 75 55 60 Z" fill="#f43f5e" /> {/* Tongue */}
            {/* Blush */}
            <ellipse cx="30" cy="50" rx="6" ry="3" fill="#f43f5e" opacity="0.3" />
            <ellipse cx="70" cy="50" rx="6" ry="3" fill="#f43f5e" opacity="0.3" />
          </>
        );
      case 'Happy':
        return (
          <>
            <circle cx="40" cy="45" r="4" fill="#64748b" />
            <circle cx="60" cy="45" r="4" fill="#64748b" />
            {/* Smile */}
            <path d="M 42 55 Q 50 65 58 55" stroke="#64748b" strokeWidth="3" fill="none" strokeLinecap="round" />
            <ellipse cx="32" cy="50" rx="4" ry="2" fill="#f43f5e" opacity="0.2" />
            <ellipse cx="68" cy="50" rx="4" ry="2" fill="#f43f5e" opacity="0.2" />
          </>
        );
      case 'Calm':
      default:
        return (
          <>
            {/* Resting eyes */}
            <path d="M 35 45 Q 40 46 45 45" stroke="#64748b" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 55 45 Q 60 46 65 45" stroke="#64748b" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Tiny smile */}
            <path d="M 48 55 Q 50 57 52 55" stroke="#64748b" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        );
    }
  };

  const getBackgroundColor = () => {
    switch (activeMood) {
      case 'Anxious': return 'fill-slate-200';
      case 'Sad': return 'fill-sky-100';
      case 'Excited': return 'fill-rose-200';
      case 'Happy': return 'fill-amber-100';
      case 'Calm':
      default: return 'fill-emerald-100';
    }
  };

  // Determine animations based on base mood and if being petted
  let mascotAnimate = {};
  let mascotTransition = {};

  if (isHappy) {
    // Wiggling like a happy puppy
    mascotAnimate = { 
      y: [0, -15, 0],
      rotate: [-5, 8, -8, 5, 0],
      scale: [1, 1.05, 1]
    };
    mascotTransition = { repeat: Infinity, duration: 0.4 };
  } else if (baseMood === 'Anxious') {
    // Shivering
    mascotAnimate = { x: [-1, 2, -2, 1, 0] };
    mascotTransition = { repeat: Infinity, duration: 0.15 };
  } else if (baseMood === 'Sad') {
    // Slow breathing
    mascotAnimate = { scaleY: [1, 0.98, 1] };
    mascotTransition = { repeat: Infinity, duration: 3, ease: "easeInOut" };
  } else {
    // Gentle bob
    mascotAnimate = { y: [0, -4, 0] };
    mascotTransition = { repeat: Infinity, duration: 4, ease: "easeInOut" };
  }

  return (
    <div className="flex flex-col items-center justify-center pt-2 pb-8 relative">
      <div className="text-center mb-6">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Your Companion</p>
        <p className="text-xs text-muted-foreground mt-1">
          {isHappy ? "Aww, so happy!" : "Try petting me!"}
        </p>
      </div>

      <div className="relative">
        <AnimatePresence>
          {hearts.map(heart => (
            <motion.div
              key={heart.id}
              initial={{ opacity: 0, y: 0, x: heart.x, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], y: -80, x: heart.x + (Math.random() - 0.5) * 20, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute top-0 left-[45%] text-2xl z-10 pointer-events-none"
            >
              ❤️
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div
          onPointerDown={(e) => (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)}
          onPointerMove={handlePointerMove}
          onPointerUp={(e) => (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)}
          animate={mascotAnimate}
          transition={mascotTransition}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-grab active:cursor-grabbing relative origin-bottom touch-none select-none drop-shadow-md"
          style={{ touchAction: 'none' }} // Prevent scrolling while petting on mobile
        >
          <svg width="140" height="140" viewBox="0 0 100 100">
            {/* Blob Body - puppy-like shape */}
            <motion.path 
              d={isHappy 
                ? "M 50 15 C 85 10 95 45 85 75 C 80 95 20 95 15 75 C 5 45 15 10 50 15 Z" // wider, excited shape
                : "M 50 15 C 80 15 90 40 85 70 C 80 95 20 95 15 70 C 10 40 20 15 50 15 Z" // normal shape
              } 
              animate={{ 
                d: isHappy 
                  ? "M 50 15 C 85 10 95 45 85 75 C 80 95 20 95 15 75 C 5 45 15 10 50 15 Z" 
                  : "M 50 15 C 80 15 90 40 85 70 C 80 95 20 95 15 70 C 10 40 20 15 50 15 Z"
              }}
              transition={{ duration: 0.3 }}
              className={cn("transition-colors duration-500", getBackgroundColor())}
            />
            {/* Puppy Ears (only visible when excited or sad) */}
            <AnimatePresence>
              {(isHappy || activeMood === 'Sad') && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Left ear */}
                  <motion.path 
                    d="M 25 35 Q 10 45 15 65 Q 20 70 30 50 Z" 
                    fill="#cbd5e1" 
                    animate={isHappy ? { rotate: [0, -10, 0], originX: '25px', originY: '35px' } : {}}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                  />
                  {/* Right ear */}
                  <motion.path 
                    d="M 75 35 Q 90 45 85 65 Q 80 70 70 50 Z" 
                    fill="#cbd5e1"
                    animate={isHappy ? { rotate: [0, 10, 0], originX: '75px', originY: '35px' } : {}}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                  />
                </motion.g>
              )}
            </AnimatePresence>

            {renderFace()}
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
