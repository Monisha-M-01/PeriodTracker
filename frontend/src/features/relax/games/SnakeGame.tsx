import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, RotateCcw, Trophy } from 'lucide-react';
import { cn } from '../../../lib/utils';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 }; // moving up

export default function SnakeGame({ onExit }: { onExit: () => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Make sure food is not on the snake
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  // Sync ref with state
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          if (score > highScore) setHighScore(score);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, 150 - Math.floor(score / 50) * 10);
    const gameLoop = setInterval(moveSnake, speed);
    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver, isPaused, score, highScore, generateFood]);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <div className="absolute top-0 w-full p-6 flex justify-between items-center max-w-md">
        <h2 className="text-xl font-serif font-bold text-foreground">Snake</h2>
        <button 
          onClick={onExit}
          className="p-3 bg-card rounded-full shadow-sm border border-muted/20 text-muted-foreground hover:text-foreground transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col items-center w-full max-w-sm mt-12">
        <div className="flex justify-between w-full mb-4 px-2">
          <div className="bg-card px-4 py-2 rounded-xl shadow-sm border border-muted/20">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Score</span>
            <p className="text-xl font-bold text-primary">{score}</p>
          </div>
          <div className="bg-card px-4 py-2 rounded-xl shadow-sm border border-muted/20 flex flex-col items-end">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider flex items-center">
              <Trophy className="w-3 h-3 mr-1" /> Best
            </span>
            <p className="text-xl font-bold text-secondary">{highScore}</p>
          </div>
        </div>

        <div className="relative bg-card shadow-sm border border-muted/20 rounded-xl overflow-hidden touch-none"
             style={{ width: '100%', maxWidth: '350px', aspectRatio: '1/1' }}>
          
          <div 
            className="absolute inset-0 grid" 
            style={{ 
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)` 
            }}
          >
            {/* Food */}
            <div 
              className="bg-rose-500 rounded-full scale-75 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
              style={{ gridColumn: food.x + 1, gridRow: food.y + 1 }}
            />
            
            {/* Snake */}
            {snake.map((segment, index) => (
              <div 
                key={index}
                className={cn(
                  "rounded-sm",
                  index === 0 ? "bg-primary scale-90" : "bg-primary/70 scale-75"
                )}
                style={{ gridColumn: segment.x + 1, gridRow: segment.y + 1 }}
              />
            ))}
          </div>

          {gameOver && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in">
              <p className="text-2xl font-serif font-bold text-foreground mb-4">Game Over!</p>
              <button
                onClick={resetGame}
                className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-xl font-medium shadow-sm hover:opacity-90 transition-all active:scale-95"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Play Again</span>
              </button>
            </div>
          )}
          
          {isPaused && !gameOver && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
              <p className="text-2xl font-serif font-bold text-white tracking-widest drop-shadow-md">PAUSED</p>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="grid grid-cols-3 gap-2 mt-8 w-48 lg:hidden">
          <div />
          <button 
            onClick={() => { if (directionRef.current.y !== 1) setDirection({ x: 0, y: -1 }) }}
            className="bg-card p-4 rounded-xl border border-muted/20 flex items-center justify-center active:bg-muted/30 touch-manipulation"
          >
            ▲
          </button>
          <div />
          <button 
            onClick={() => { if (directionRef.current.x !== 1) setDirection({ x: -1, y: 0 }) }}
            className="bg-card p-4 rounded-xl border border-muted/20 flex items-center justify-center active:bg-muted/30 touch-manipulation"
          >
            ◀
          </button>
          <button 
            onClick={() => { if (directionRef.current.y !== -1) setDirection({ x: 0, y: 1 }) }}
            className="bg-card p-4 rounded-xl border border-muted/20 flex items-center justify-center active:bg-muted/30 touch-manipulation"
          >
            ▼
          </button>
          <button 
            onClick={() => { if (directionRef.current.x !== -1) setDirection({ x: 1, y: 0 }) }}
            className="bg-card p-4 rounded-xl border border-muted/20 flex items-center justify-center active:bg-muted/30 touch-manipulation"
          >
            ▶
          </button>
        </div>
        
        <p className="text-xs text-muted-foreground mt-6 text-center px-4 hidden lg:block">
          Use arrow keys or WASD to move.<br/>Press Space to pause.
        </p>
      </div>
    </div>
  );
}
