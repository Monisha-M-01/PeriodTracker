import React, { useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { cn } from '../../../lib/utils';

type Player = 'X' | 'O' | null;

export default function TicTacToe({ onExit }: { onExit: () => void }) {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState<boolean>(true);

  const calculateWinner = (squares: Player[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(square => square !== null);

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center">
      {/* Top Bar */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center max-w-md">
        <h2 className="text-xl font-serif font-bold text-foreground">Tic-Tac-Toe</h2>
        <button 
          onClick={onExit}
          className="p-3 bg-card rounded-full shadow-sm border border-muted/20 text-muted-foreground hover:text-foreground transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-col items-center w-full max-w-sm px-6">
        <div className="mb-8 text-center">
          {winner ? (
            <p className="text-2xl font-serif font-bold text-primary animate-in zoom-in">
              Player {winner} wins!
            </p>
          ) : isDraw ? (
            <p className="text-xl font-serif font-semibold text-muted-foreground">
              It's a draw!
            </p>
          ) : (
            <p className="text-lg font-medium text-foreground">
              Next player: <span className="font-bold text-primary">{isXNext ? 'X' : 'O'}</span>
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 w-full aspect-square max-w-[300px] mb-8">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleClick(index)}
              className={cn(
                "w-full h-full bg-card rounded-xl border-2 shadow-sm text-4xl font-bold flex items-center justify-center transition-all",
                !cell && !winner ? "hover:bg-muted/20 hover:scale-105 active:scale-95" : "",
                cell === 'X' ? "text-primary border-primary/20" : cell === 'O' ? "text-secondary border-secondary/20" : "border-muted/20"
              )}
              disabled={!!cell || !!winner}
            >
              {cell}
            </button>
          ))}
        </div>

        <button
          onClick={resetGame}
          className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-xl font-medium shadow-sm hover:opacity-90 transition-all active:scale-95"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Restart Game</span>
        </button>
      </div>
    </div>
  );
}
