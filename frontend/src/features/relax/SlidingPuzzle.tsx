import React, { useState, useEffect } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GRID_SIZE = 3;
const TILE_COUNT = GRID_SIZE * GRID_SIZE;

export default function SlidingPuzzle({ onExit }: { onExit: () => void }) {
  const [tiles, setTiles] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);

  const isSolvable = (arr: number[]) => {
    let inversions = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] && arr[j] && arr[i] > arr[j]) inversions++;
      }
    }
    return inversions % 2 === 0;
  };

  const initGame = () => {
    let newTiles = Array.from({ length: TILE_COUNT }, (_, i) => i);
    
    // Shuffle
    do {
      for (let i = newTiles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
      }
    } while (!isSolvable(newTiles) || newTiles.every((val, index) => val === index));
    
    setTiles(newTiles);
    setIsSolved(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleTileClick = (index: number) => {
    if (isSolved) return;

    const emptyIndex = tiles.indexOf(TILE_COUNT - 1);
    
    // Check if clicked tile is adjacent to empty tile
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
    const emptyCol = emptyIndex % GRID_SIZE;

    const isAdjacent = Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;

    if (isAdjacent) {
      const newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      
      // Check win
      if (newTiles.every((val, i) => val === i)) {
        setIsSolved(true);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex flex-col bg-stone-100"
    >
      <div className="flex-1 max-w-md w-full mx-auto p-6 flex flex-col pt-safe">
        <div className="flex justify-between items-center mb-8 pt-4">
          <h2 className="text-2xl font-serif font-bold text-stone-700">Slide Puzzle</h2>
          <button onClick={onExit} className="p-2 bg-stone-200/50 rounded-full text-stone-500 hover:bg-stone-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center pb-20">
          <div className="bg-stone-200/50 p-2 rounded-2xl w-full aspect-square max-w-sm shadow-inner relative">
            {tiles.map((tile, index) => {
              const row = Math.floor(index / GRID_SIZE);
              const col = index % GRID_SIZE;
              
              // The empty tile is TILE_COUNT - 1 (which is 8)
              if (tile === TILE_COUNT - 1 && !isSolved) return null;

              const tileRow = Math.floor(tile / GRID_SIZE);
              const tileCol = tile % GRID_SIZE;

              return (
                <motion.div
                  key={tile}
                  layout
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  onClick={() => handleTileClick(index)}
                  className={`absolute rounded-xl flex items-center justify-center text-2xl font-serif font-bold ${
                    isSolved ? 'bg-primary/80 text-white' : 'bg-white text-stone-500 shadow-sm border border-stone-100 cursor-pointer hover:bg-stone-50'
                  }`}
                  style={{
                    width: 'calc(33.333% - 8px)',
                    height: 'calc(33.333% - 8px)',
                    left: `calc(${col * 33.333}% + 4px)`,
                    top: `calc(${row * 33.333}% + 4px)`,
                    // Use a soothing gradient as background image
                    background: isSolved ? undefined : `radial-gradient(circle at ${50 - tileCol * 50}% ${50 - tileRow * 50}%, #fdfbfb 0%, #ebedee 100%)`
                  }}
                >
                  {!isSolved && tile + 1}
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence>
            {isSolved && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 text-center"
              >
                <p className="text-stone-500 font-medium mb-4">Things always fall into place.</p>
                <button 
                  onClick={initGame}
                  className="px-6 py-3 bg-stone-200/50 hover:bg-stone-200 rounded-full font-medium text-stone-600 flex items-center space-x-2 mx-auto transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
