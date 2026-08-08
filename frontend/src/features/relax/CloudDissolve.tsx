import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Cloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CloudItem {
  id: number;
  x: number;
  y: number;
  scale: number;
  speed: number;
  isDissolved: boolean;
}

export default function CloudDissolve({ onExit }: { onExit: () => void }) {
  const [clouds, setClouds] = useState<CloudItem[]>([]);

  const initGame = () => {
    const numClouds = 6;
    const newClouds: CloudItem[] = [];
    const w = window.innerWidth;
    const h = window.innerHeight;
    
    for(let i=0; i<numClouds; i++) {
      newClouds.push({
        id: Date.now() + i,
        x: Math.random() * (w - 100),
        y: 100 + Math.random() * (h - 300),
        scale: 1 + Math.random() * 1.5,
        speed: 10 + Math.random() * 20,
        isDissolved: false,
      });
    }
    setClouds(newClouds);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCloudClick = (id: number) => {
    setClouds(prev => prev.map(c => 
      c.id === id ? { ...c, isDissolved: true } : c
    ));
  };

  const allDissolved = clouds.length > 0 && clouds.every(c => c.isDissolved);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-sky-100 overflow-hidden"
    >
      <div className="absolute top-4 right-4 z-20 pt-safe flex space-x-2">
        <button onClick={initGame} className="p-2 bg-black/5 rounded-full text-sky-700 hover:bg-black/10">
          <RotateCcw className="w-6 h-6" />
        </button>
        <button onClick={onExit} className="p-2 bg-black/5 rounded-full text-sky-700 hover:bg-black/10">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="absolute top-12 w-full text-center pointer-events-none z-10">
        <p className="text-sky-700/60 font-serif font-medium text-lg">Tap the clouds to let them go</p>
      </div>

      {clouds.map((cloud) => (
        <AnimatePresence key={`cloud-${cloud.id}`}>
          {!cloud.isDissolved && (
            <motion.button
              initial={{ opacity: 0, x: cloud.x - 50 }}
              animate={{ opacity: 0.9, x: cloud.x + cloud.speed * 20 }}
              exit={{ opacity: 0, scale: cloud.scale * 1.5, filter: "blur(10px)" }}
              transition={{ 
                x: { repeat: Infinity, duration: cloud.speed, ease: "linear" },
                opacity: { duration: 1 },
                exit: { duration: 1.5, ease: "easeOut" }
              } as any}
              className="absolute text-white drop-shadow-md outline-none"
              style={{ top: cloud.y, scale: cloud.scale }}
              onClick={() => handleCloudClick(cloud.id)}
            >
              <Cloud className="w-24 h-24 fill-white text-white/50" />
            </motion.button>
          )}
        </AnimatePresence>
      ))}

      <AnimatePresence>
        {allDissolved && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
          >
            <div className="text-center pointer-events-auto">
              <p className="text-sky-700/80 font-medium mb-6 text-2xl font-serif">Clear skies ahead.</p>
              <button 
                onClick={initGame}
                className="px-8 py-3 bg-white/50 hover:bg-white/80 rounded-full font-medium text-sky-700 flex items-center space-x-2 mx-auto transition-colors shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Breathe again</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
