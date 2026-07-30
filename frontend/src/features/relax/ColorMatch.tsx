import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ColorMatchProps {
  onExit: () => void;
}

const COLORS = [
  { id: 'rose', value: 'bg-rose-300' },
  { id: 'sky', value: 'bg-sky-300' },
  { id: 'emerald', value: 'bg-emerald-300' },
  { id: 'amber', value: 'bg-amber-300' },
  { id: 'indigo', value: 'bg-indigo-300' },
];

export default function ColorMatch({ onExit }: ColorMatchProps) {
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [driftingShapes, setDriftingShapes] = useState<any[]>([]);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    pickNewTarget();
    
    // Spawn drifting shapes
    const spawnInterval = setInterval(() => {
      setDriftingShapes(prev => {
        if (prev.length > 8) return prev;
        
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        return [...prev, {
          id: Math.random().toString(),
          color: randomColor,
          left: `${Math.random() * 80 + 10}%`,
          top: `110%`,
          speed: Math.random() * 10 + 15, // seconds to cross screen
          size: Math.random() * 30 + 40,
        }];
      });
    }, 2000);

    return () => clearInterval(spawnInterval);
  }, []);

  const pickNewTarget = () => {
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setTargetColor(randomColor);
  };

  const handleTap = (shapeId: string, colorId: string, x: number, y: number) => {
    if (colorId === targetColor.id) {
      // Match!
      // Add particles
      const newParticles = Array.from({ length: 6 }).map((_, i) => ({
        id: Math.random().toString(),
        x, y,
        color: targetColor.value,
        angle: (i * 60) * (Math.PI / 180),
      }));
      setParticles(prev => [...prev, ...newParticles]);
      
      // Remove shape
      setDriftingShapes(prev => prev.filter(s => s.id !== shapeId));
      
      // Pick new target after a tiny delay
      setTimeout(pickNewTarget, 500);
      
      // Cleanup particles
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
      }, 1000);
    } else {
      // Not a match, just let it float. Maybe a gentle wiggle, but we keep it stress free.
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      <button 
        onClick={onExit}
        className="absolute top-6 right-6 p-2 text-muted-foreground hover:bg-card rounded-full transition-colors z-50"
      >
        <X className="w-6 h-6 stroke-[1.5]" />
      </button>

      <div className="absolute top-12 left-0 right-0 flex flex-col items-center z-40 pointer-events-none">
        <h2 className="text-xl font-serif text-muted-foreground mb-4">Tap the matching color</h2>
        <div className={cn("w-16 h-16 rounded-2xl shadow-sm border-4 border-background transition-colors duration-500", targetColor.value)} />
      </div>

      <div className="absolute inset-0 z-10">
        {driftingShapes.map(shape => (
          <button
            key={shape.id}
            onClick={(e) => handleTap(shape.id, shape.color.id, e.clientX, e.clientY)}
            className={cn(
              "absolute rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer",
              shape.color.value
            )}
            style={{
              left: shape.left,
              width: shape.size,
              height: shape.size,
              animation: `floatUp ${shape.speed}s linear forwards`
            }}
          />
        ))}
        
        {particles.map(p => (
          <div
            key={p.id}
            className={cn("absolute w-3 h-3 rounded-full", p.color)}
            style={{
              left: p.x,
              top: p.y,
              animation: `particleBurst 1s ease-out forwards`,
              '--tx': `${Math.cos(p.angle) * 50}px`,
              '--ty': `${Math.sin(p.angle) * 50}px`,
            } as any}
          />
        ))}
      </div>

      <style>{`
        @keyframes floatUp {
          from { top: 110%; transform: rotate(0deg); }
          to { top: -20%; transform: rotate(360deg); }
        }
        @keyframes particleBurst {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
