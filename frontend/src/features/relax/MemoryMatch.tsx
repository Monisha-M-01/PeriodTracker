import React, { useState, useEffect } from 'react';
import { X, Moon, Sun, Cloud, Star, Leaf, Flower2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ICONS = [Moon, Sun, Cloud, Star, Leaf, Flower2];
const CARDS_COUNT = 12;

interface Card {
  id: number;
  iconIndex: number;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MemoryMatch({ onExit }: { onExit: () => void }) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const initGame = () => {
    const pairs = [...Array(CARDS_COUNT / 2).keys(), ...Array(CARDS_COUNT / 2).keys()];
    // Shuffle
    for (let i = pairs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pairs[i], pairs[j]] = [pairs[j], pairs[i]];
    }
    setCards(pairs.map((iconIndex, i) => ({ id: i, iconIndex, isFlipped: false, isMatched: false })));
    setFlippedIndices([]);
    setMatches(0);
    setIsLocked(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (index: number) => {
    if (isLocked || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setIsLocked(true);
      const [firstIndex, secondIndex] = newFlippedIndices;
      
      if (newCards[firstIndex].iconIndex === newCards[secondIndex].iconIndex) {
        // Match
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
          setMatches(m => m + 1);
          setIsLocked(false);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          const unmatchedCards = [...newCards];
          unmatchedCards[firstIndex].isFlipped = false;
          unmatchedCards[secondIndex].isFlipped = false;
          setCards(unmatchedCards);
          setFlippedIndices([]);
          setIsLocked(false);
        }, 1000);
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-50 flex flex-col bg-stone-50"
    >
      <div className="flex-1 max-w-md w-full mx-auto p-6 flex flex-col pt-safe">
        <div className="flex justify-between items-center mb-8 pt-4">
          <h2 className="text-2xl font-serif font-bold text-stone-700">Memory Match</h2>
          <button onClick={onExit} className="p-2 bg-stone-200/50 rounded-full text-stone-500 hover:bg-stone-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
            {cards.map((card, idx) => {
              const Icon = ICONS[card.iconIndex];
              return (
                <div 
                  key={card.id} 
                  className="aspect-[3/4] relative perspective-1000"
                  onClick={() => handleCardClick(idx)}
                >
                  <motion.div
                    className="w-full h-full relative preserve-3d"
                    animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Back of card */}
                    <div className="absolute inset-0 backface-hidden bg-stone-200/50 rounded-2xl border-2 border-stone-200/50 hover:bg-stone-200 cursor-pointer shadow-sm flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-stone-300/30" />
                    </div>
                    {/* Front of card */}
                    <div className="absolute inset-0 backface-hidden rounded-2xl border-2 border-primary/20 bg-primary/5 flex items-center justify-center shadow-sm" style={{ transform: 'rotateY(180deg)' }}>
                      <Icon className="w-10 h-10 text-primary drop-shadow-sm" />
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>

          <AnimatePresence>
            {matches === CARDS_COUNT / 2 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12 text-center"
              >
                <p className="text-stone-500 font-medium mb-4">Mind clear.</p>
                <button 
                  onClick={initGame}
                  className="px-6 py-3 bg-stone-200/50 hover:bg-stone-200 rounded-full font-medium text-stone-600 flex items-center space-x-2 mx-auto"
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
