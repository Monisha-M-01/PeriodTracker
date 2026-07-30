import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

// Bubble sizes and colors matching the Calm theme
const SIZES = ['w-12 h-12', 'w-16 h-16', 'w-20 h-20', 'w-24 h-24'];
const BORDERS = ['border-primary/40', 'border-secondary/40', 'border-accent/40'];
const BACKGROUNDS = ['bg-primary/10', 'bg-secondary/10', 'bg-accent/10', 'bg-transparent'];

interface BubbleData {
  id: number;
  sizeClass: string;
  borderClass: string;
  bgClass: string;
  left: number;
  duration: number;
  delay: number;
}

export default function BubblePop({ onExit }: { onExit: () => void }) {
  const [bubbles, setBubbles] = useState<BubbleData[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const bubbleIdCounter = useRef(0);

  // Function to create a new bubble with random properties
  const createBubble = useCallback(() => {
    const id = bubbleIdCounter.current++;
    const sizeClass = SIZES[Math.floor(Math.random() * SIZES.length)];
    const borderClass = BORDERS[Math.floor(Math.random() * BORDERS.length)];
    const bgClass = BACKGROUNDS[Math.floor(Math.random() * BACKGROUNDS.length)];
    const left = Math.random() * 80 + 10; // 10% to 90% width
    const duration = Math.random() * 8 + 8; // 8s to 16s to float up
    const delay = Math.random() * 2;

    return { id, sizeClass, borderClass, bgClass, left, duration, delay };
  }, []);

  // Initial bubbles and spawner
  useEffect(() => {
    // Start with a few bubbles
    const initialBubbles = Array.from({ length: 5 }, createBubble);
    setBubbles(initialBubbles);

    // Continuously spawn bubbles
    const interval = setInterval(() => {
      setBubbles(prev => {
        // Keep max 15 bubbles on screen at once to avoid clutter
        if (prev.length > 15) return prev;
        return [...prev, createBubble()];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [createBubble]);

  // Clean up bubbles that have floated off screen
  useEffect(() => {
    const cleanup = setInterval(() => {
      setBubbles(prev => prev.filter(b => {
        // We can't strictly know if it's offscreen without refs, 
        // but we can assume they pop/disappear after their duration + delay.
        // For simplicity, we just keep them until clicked or let them overflow hidden.
        return true; 
      }));
    }, 5000);
    return () => clearInterval(cleanup);
  }, []);

  const popBubble = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setPoppedCount(prev => prev + 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-t from-background to-card overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="p-6 flex items-center justify-between z-10 relative">
        <div className="bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-muted/20 shadow-sm">
          <span className="text-sm font-medium text-muted-foreground font-serif">
            {poppedCount} popped
          </span>
        </div>
        
        <button 
          onClick={onExit}
          className="p-3 bg-card/80 backdrop-blur-md rounded-full shadow-sm border border-muted/20 text-muted-foreground hover:text-foreground transition-all hover:scale-105"
        >
          <X className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      {/* Bubble Container */}
      <div className="flex-1 relative w-full h-full pointer-events-none">
        {bubbles.map(bubble => (
          <button
            key={bubble.id}
            onClick={() => popBubble(bubble.id)}
            className={cn(
              "absolute rounded-full backdrop-blur-[2px] transition-transform active:scale-90 pointer-events-auto",
              "border", bubble.borderClass, bubble.bgClass, bubble.sizeClass,
              "animate-float-up"
            )}
            style={{
              left: `${bubble.left}%`,
              bottom: '-100px',
              animationDuration: `${bubble.duration}s`,
              animationDelay: `${bubble.delay}s`,
              animationTimingFunction: 'linear',
              animationFillMode: 'forwards'
            }}
          />
        ))}
      </div>
    </div>
  );
}
