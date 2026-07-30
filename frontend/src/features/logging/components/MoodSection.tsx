import React from 'react';
import { cn } from '../../../lib/utils';

const MOOD_OPTIONS = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'calm', emoji: '😌', label: 'Calm' },
  { id: 'neutral', emoji: '😐', label: 'Neutral' },
  { id: 'sad', emoji: '😔', label: 'Sad' },
  { id: 'down', emoji: '😢', label: 'Down' },
  { id: 'irritable', emoji: '😠', label: 'Irritable' },
  { id: 'anxious', emoji: '😰', label: 'Anxious' },
  { id: 'tired', emoji: '😴', label: 'Tired' },
  { id: 'low_energy', emoji: '🥱', label: 'Low energy' },
  { id: 'excited', emoji: '🤩', label: 'Excited' },
  { id: 'loved', emoji: '😍', label: 'Loved' },
  { id: 'meh', emoji: '🙃', label: 'Meh' }
];

interface MoodSectionProps {
  selectedMoods: string[];
  onToggle: (id: string) => void;
}

export function MoodSection({ selectedMoods, onToggle }: MoodSectionProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-xl font-serif font-semibold text-foreground mb-4">How's your mood?</h2>
      
      <div className="grid grid-cols-3 gap-3">
        {MOOD_OPTIONS.map((mood) => {
          const isSelected = selectedMoods.includes(mood.id);
          
          return (
            <button
              key={mood.id}
              onClick={() => onToggle(mood.id)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-full border transition-all",
                isSelected 
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-muted/20 hover:border-primary/30"
              )}
            >
              <span className="text-2xl mb-1">{mood.emoji}</span>
              <span className="text-[10px] font-medium text-center leading-tight uppercase tracking-wider">
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
