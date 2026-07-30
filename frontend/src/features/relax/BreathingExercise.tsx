import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BreathingExerciseProps {
  onExit: () => void;
}

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export default function BreathingExercise({ onExit }: BreathingExerciseProps) {
  const [phase, setPhase] = useState<Phase>('inhale');
  const [time, setTime] = useState(4); // 4 seconds per phase

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          setPhase((p) => {
            switch (p) {
              case 'inhale': return 'hold1';
              case 'hold1': return 'exhale';
              case 'exhale': return 'hold2';
              case 'hold2': return 'inhale';
            }
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In';
      case 'hold1': return 'Hold';
      case 'exhale': return 'Breathe Out';
      case 'hold2': return 'Hold';
    }
  };

  const getCircleClasses = () => {
    switch (phase) {
      case 'inhale': return 'scale-[1.8] transition-transform duration-[4000ms] ease-in-out bg-primary/20';
      case 'hold1': return 'scale-[1.8] bg-primary/20';
      case 'exhale': return 'scale-100 transition-transform duration-[4000ms] ease-in-out bg-secondary/20';
      case 'hold2': return 'scale-100 bg-secondary/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500">
      <button 
        onClick={onExit}
        className="absolute top-6 right-6 p-2 text-muted-foreground hover:bg-card rounded-full transition-colors"
      >
        <X className="w-6 h-6 stroke-[1.5]" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto p-6">
        <h2 className="text-3xl font-serif font-bold text-foreground mb-20">Box Breathing</h2>
        
        <div className="relative w-64 h-64 flex items-center justify-center">
          <div className={cn("absolute w-32 h-32 rounded-full", getCircleClasses())} />
          <div className="absolute w-32 h-32 rounded-full bg-background flex flex-col items-center justify-center shadow-sm border border-muted/10 z-10">
            <span className="text-xl font-medium text-foreground">{getPhaseText()}</span>
            <span className="text-3xl font-serif mt-2 text-primary">{time}</span>
          </div>
        </div>

        <p className="mt-20 text-muted-foreground text-center max-w-xs">
          Follow the circle. Breathe in, hold, breathe out, hold. Each step takes 4 seconds.
        </p>
      </div>
    </div>
  );
}
