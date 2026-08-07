import React, { useState, useEffect, useRef } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const ROWS = 4;
const COLS = 4;

export default function MelodyGrid({ onExit }: { onExit: () => void }) {
  const [grid, setGrid] = useState<boolean[][]>(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(false))
  );
  const [currentCol, setCurrentCol] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // We could add Web Audio API here, but for now we'll do visual feedback
  
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentCol((prev) => (prev + 1) % COLS);
    }, 500); // 120 BPM roughly

    return () => clearInterval(interval);
  }, [isPlaying]);

  const toggleCell = (r: number, c: number) => {
    const newGrid = [...grid];
    newGrid[r] = [...newGrid[r]];
    newGrid[r][c] = !newGrid[r][c];
    setGrid(newGrid);
  };

  const resetGrid = () => {
    setGrid(Array(ROWS).fill(null).map(() => Array(COLS).fill(false)));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex flex-col bg-slate-50"
    >
      <div className="flex-1 max-w-md w-full mx-auto p-6 flex flex-col pt-safe">
        <div className="flex justify-between items-center mb-8 pt-4">
          <h2 className="text-2xl font-serif font-bold text-slate-700">Melody Grid</h2>
          <button onClick={onExit} className="p-2 bg-slate-200/50 rounded-full text-slate-500 hover:bg-slate-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-slate-500 font-medium mb-8 text-center">Tap squares to create a visual rhythm.</p>
          
          <div className="grid grid-rows-4 gap-3">
            {grid.map((row, rIndex) => (
              <div key={`row-${rIndex}`} className="flex space-x-3">
                {row.map((isActive, cIndex) => {
                  const isScanning = cIndex === currentCol;
                  const isTriggered = isScanning && isActive;
                  
                  return (
                    <motion.button
                      key={`cell-${rIndex}-${cIndex}`}
                      onClick={() => toggleCell(rIndex, cIndex)}
                      className="w-16 h-16 rounded-2xl transition-colors duration-200"
                      animate={{
                        backgroundColor: isTriggered 
                          ? '#818cf8' // Indigo 400 (active & scanned)
                          : isActive
                            ? '#a5b4fc' // Indigo 300 (active)
                            : isScanning
                              ? '#f1f5f9' // Slate 100 (inactive & scanned)
                              : '#e2e8f0', // Slate 200 (inactive)
                        scale: isTriggered ? 1.1 : 1
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-12 flex space-x-4">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-6 py-3 bg-indigo-100 hover:bg-indigo-200 rounded-full font-medium text-indigo-700 flex items-center space-x-2 transition-colors"
            >
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button 
              onClick={resetGrid}
              className="px-6 py-3 bg-slate-200/50 hover:bg-slate-200 rounded-full font-medium text-slate-600 flex items-center space-x-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
