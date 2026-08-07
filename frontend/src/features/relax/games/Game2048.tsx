import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Trophy } from 'lucide-react';
import { cn } from '../../../lib/utils';

type Board = number[][];

const GRID_SIZE = 4;
const CELL_COLORS: Record<number, string> = {
  2: 'bg-stone-200 text-stone-700',
  4: 'bg-stone-300 text-stone-700',
  8: 'bg-[#f2b179] text-white',
  16: 'bg-[#f59563] text-white',
  32: 'bg-[#f67c5f] text-white',
  64: 'bg-[#f65e3b] text-white',
  128: 'bg-[#edcf72] text-white shadow-[0_0_10px_rgba(237,207,114,0.5)]',
  256: 'bg-[#edcc61] text-white shadow-[0_0_15px_rgba(237,204,97,0.6)]',
  512: 'bg-[#edc850] text-white shadow-[0_0_20px_rgba(237,200,80,0.7)]',
  1024: 'bg-[#edc53f] text-white shadow-[0_0_25px_rgba(237,197,63,0.8)]',
  2048: 'bg-[#edc22e] text-white shadow-[0_0_30px_rgba(237,194,46,0.9)]',
};

export default function Game2048({ onExit }: { onExit: () => void }) {
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  // Initialize game
  useEffect(() => {
    initGame();
  }, []);

  const getEmptyCells = (currentBoard: Board) => {
    const emptyCells: {r: number, c: number}[] = [];
    currentBoard.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === 0) emptyCells.push({r, c});
      });
    });
    return emptyCells;
  };

  const addRandomTile = (currentBoard: Board): Board => {
    const emptyCells = getEmptyCells(currentBoard);
    if (emptyCells.length === 0) return currentBoard;
    
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = currentBoard.map(row => [...row]);
    newBoard[randomCell.r][randomCell.c] = Math.random() < 0.9 ? 2 : 4;
    return newBoard;
  };

  const initGame = () => {
    let newBoard = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    newBoard = addRandomTile(newBoard);
    newBoard = addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
  };

  // Movement Logic
  const moveLeft = (board: Board): { newBoard: Board, pointsAdded: number, moved: boolean } => {
    let moved = false;
    let pointsAdded = 0;
    const newBoard = board.map(row => {
      let newRow = row.filter(val => val !== 0);
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] !== 0 && newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          pointsAdded += newRow[i];
          newRow.splice(i + 1, 1);
        }
      }
      while (newRow.length < GRID_SIZE) {
        newRow.push(0);
      }
      if (newRow.join(',') !== row.join(',')) moved = true;
      return newRow;
    });
    return { newBoard, pointsAdded, moved };
  };

  const rotateRight = (matrix: Board) => {
    const result = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        result[c][GRID_SIZE - 1 - r] = matrix[r][c];
      }
    }
    return result;
  };

  const handleMove = (direction: 'LEFT' | 'RIGHT' | 'UP' | 'DOWN') => {
    if (gameOver || gameWon) return;

    let currentBoard = board;
    let rotations = 0;

    if (direction === 'RIGHT') rotations = 2;
    if (direction === 'DOWN') rotations = 1;
    if (direction === 'UP') rotations = 3;

    for (let i = 0; i < rotations; i++) {
      currentBoard = rotateRight(currentBoard);
    }

    const { newBoard, pointsAdded, moved } = moveLeft(currentBoard);
    currentBoard = newBoard;

    for (let i = 0; i < (4 - rotations) % 4; i++) {
      currentBoard = rotateRight(currentBoard);
    }

    if (moved) {
      const finalBoard = addRandomTile(currentBoard);
      setBoard(finalBoard);
      setScore(s => {
        const newScore = s + pointsAdded;
        if (newScore > bestScore) setBestScore(newScore);
        return newScore;
      });

      // Check win/loss
      if (finalBoard.some(row => row.some(cell => cell === 2048))) {
        setGameWon(true);
      } else if (checkGameOver(finalBoard)) {
        setGameOver(true);
      }
    }
  };

  const checkGameOver = (currentBoard: Board) => {
    if (getEmptyCells(currentBoard).length > 0) return false;
    
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const current = currentBoard[r][c];
        if (r < GRID_SIZE - 1 && current === currentBoard[r + 1][c]) return false;
        if (c < GRID_SIZE - 1 && current === currentBoard[r][c + 1]) return false;
      }
    }
    return true;
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          handleMove('UP');
          break;
        case 'ArrowDown':
        case 's':
          handleMove('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
          handleMove('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
          handleMove('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, gameOver, gameWon]);

  // Touch Swipe controls
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY
    };

    const dx = touchEnd.x - touchStart.x;
    const dy = touchEnd.y - touchStart.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (Math.max(absDx, absDy) > 30) {
      if (absDx > absDy) {
        handleMove(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        handleMove(dy > 0 ? 'DOWN' : 'UP');
      }
    }
    setTouchStart(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#faf8ef] flex flex-col items-center p-4 touch-none">
      <div className="w-full max-w-sm flex justify-between items-center mb-6 mt-4">
        <h1 className="text-4xl font-bold text-[#776e65]">2048</h1>
        
        <div className="flex gap-2">
          <div className="bg-[#bbada0] px-4 py-2 rounded-md text-white flex flex-col items-center min-w-[70px]">
            <span className="text-[10px] uppercase font-bold text-[#eee4da]">Score</span>
            <span className="font-bold">{score}</span>
          </div>
          <div className="bg-[#bbada0] px-4 py-2 rounded-md text-white flex flex-col items-center min-w-[70px]">
            <span className="text-[10px] uppercase font-bold text-[#eee4da]">Best</span>
            <span className="font-bold">{bestScore}</span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-sm flex justify-between items-center mb-8">
        <p className="text-[#776e65] text-sm">Join the numbers to get to <strong className="font-bold">2048</strong>!</p>
        <button 
          onClick={onExit}
          className="p-2 bg-[#8f7a66] text-white rounded-md hover:bg-[#9f8b77] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div 
        className="relative bg-[#bbada0] p-3 rounded-lg w-full max-w-sm aspect-square"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="grid grid-cols-4 grid-rows-4 gap-3 w-full h-full">
          {board.map((row, r) => (
            row.map((cell, c) => (
              <div 
                key={`${r}-${c}`}
                className={cn(
                  "rounded-md flex items-center justify-center font-bold text-2xl md:text-3xl transition-all",
                  cell === 0 ? "bg-[#cdc1b4]" : CELL_COLORS[cell] || 'bg-[#3c3a32] text-[#f9f6f2] shadow-[0_0_30px_rgba(255,255,255,0.4)]',
                  cell > 0 ? "scale-100" : "scale-100"
                )}
              >
                {cell !== 0 ? cell : ''}
              </div>
            ))
          ))}
        </div>

        {(gameOver || gameWon) && (
          <div className="absolute inset-0 bg-[#eee4da]/70 rounded-lg flex flex-col items-center justify-center animate-in fade-in z-10 backdrop-blur-sm">
            <h2 className={cn(
              "text-4xl font-bold mb-6",
              gameWon ? "text-green-600" : "text-[#776e65]"
            )}>
              {gameWon ? "You Win!" : "Game Over!"}
            </h2>
            <button
              onClick={initGame}
              className="bg-[#8f7a66] text-white px-6 py-3 rounded-md font-bold text-lg hover:bg-[#9f8b77] transition-colors flex items-center shadow-md"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try again
            </button>
          </div>
        )}
      </div>

      <p className="text-[#776e65] text-sm mt-8 text-center max-w-sm hidden lg:block">
        <strong className="font-bold">HOW TO PLAY:</strong> Use your <strong>arrow keys</strong> to move the tiles. Tiles with the same number merge into one when they touch. Add them up to reach <strong>2048!</strong>
      </p>
      
      <p className="text-[#776e65] text-sm mt-8 text-center max-w-sm lg:hidden">
        <strong className="font-bold">HOW TO PLAY:</strong> Swipe <strong>up, down, left, or right</strong> to move the tiles. Tiles with the same number merge into one when they touch.
      </p>
    </div>
  );
}
