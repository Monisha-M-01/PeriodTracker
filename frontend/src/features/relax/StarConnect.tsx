import React, { useState, useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StarPoint {
  id: number;
  x: number;
  y: number;
}

export default function StarConnect({ onExit }: { onExit: () => void }) {
  const [stars, setStars] = useState<StarPoint[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const initGame = () => {
    // Generate 6-8 random points keeping away from edges
    const numStars = 7;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const padding = 100;
    
    const newStars: StarPoint[] = [];
    for(let i=0; i<numStars; i++) {
      newStars.push({
        id: i,
        x: padding + Math.random() * (w - padding * 2),
        y: padding + Math.random() * (h - padding * 2),
      });
    }
    setStars(newStars);
    setCurrentIndex(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleStarClick = (index: number) => {
    if (index === currentIndex) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#0f172a] touch-none overflow-hidden"
    >
      <div className="absolute top-4 right-4 z-20 pt-safe flex space-x-2">
        <button onClick={initGame} className="p-2 bg-white/10 rounded-full text-white/70 hover:bg-white/20">
          <RotateCcw className="w-6 h-6" />
        </button>
        <button onClick={onExit} className="p-2 bg-white/10 rounded-full text-white/70 hover:bg-white/20">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute top-12 w-full text-center pointer-events-none z-10">
        <p className="text-slate-400 font-serif font-medium text-lg">Connect the stars in order</p>
      </div>

      {/* Lines connecting stars */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {stars.map((star, i) => {
          if (i >= currentIndex) return null; // haven't connected this yet
          const prevStar = stars[i - 1];
          if (!prevStar) return null; // first star has no previous
          
          return (
            <motion.line
              key={`line-${i}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              x1={prevStar.x}
              y1={prevStar.y}
              x2={star.x}
              y2={star.y}
              stroke="#e2e8f0"
              strokeWidth="2"
              strokeLinecap="round"
              className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            />
          );
        })}
      </svg>

      {/* Stars */}
      {stars.map((star, i) => {
        const isConnected = i < currentIndex;
        const isNext = i === currentIndex;
        
        return (
          <motion.button
            key={`star-${star.id}`}
            className="absolute rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: star.x, 
              top: star.y,
              width: 48,
              height: 48,
              zIndex: 10
            }}
            onClick={() => handleStarClick(i)}
            animate={{
              scale: isNext ? [1, 1.2, 1] : 1,
            }}
            transition={{
              repeat: isNext ? Infinity : 0,
              duration: 2
            }}
          >
            <div className={`rounded-full transition-all duration-500 ${
              isConnected || isNext 
                ? 'w-4 h-4 bg-white drop-shadow-[0_0_12px_rgba(255,255,255,1)]' 
                : 'w-2 h-2 bg-slate-600'
            }`} />
            
            {/* Number indicator */}
            <span className={`absolute -top-6 text-xs font-bold transition-opacity duration-300 ${
              isNext ? 'text-white opacity-100' : 'text-slate-600 opacity-50'
            }`}>
              {i + 1}
            </span>
          </motion.button>
        );
      })}
      
      <AnimatePresence>
        {currentIndex === stars.length && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 bg-black/20 backdrop-blur-sm"
          >
            <div className="text-center bg-slate-800/80 p-8 rounded-3xl pointer-events-auto">
              <p className="text-white font-medium mb-6 text-xl font-serif">Constellation complete.</p>
              <button 
                onClick={initGame}
                className="px-8 py-3 bg-white hover:bg-slate-200 rounded-full font-medium text-slate-900 flex items-center space-x-2 mx-auto transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Next Sky</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
