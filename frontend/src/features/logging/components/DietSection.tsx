import React from 'react';
import { cn } from '../../../lib/utils';

export interface DietDetails {
  mealTypes: string[];
  mealCount: number | null;
  quality: string | null;
}

interface DietSectionProps {
  diet: DietDetails;
  onChange: (diet: DietDetails) => void;
}

const MEAL_TYPES = [
  { id: 'veg', emoji: '🥦', label: 'Veg meal' },
  { id: 'non-veg', emoji: '🍗', label: 'Non-veg meal' }
];

const MEAL_COUNTS = [1, 2, 3, 4, 5];

const QUALITY_OPTIONS = [
  { id: 'mostly_healthy', emoji: '🥗', label: 'Mostly healthy' },
  { id: 'mixed', emoji: '⚖️', label: 'Mixed' },
  { id: 'mostly_unhealthy', emoji: '🍔', label: 'Mostly unhealthy' }
];

export function DietSection({ diet, onChange }: DietSectionProps) {
  const toggleMealType = (id: string) => {
    const newTypes = diet.mealTypes.includes(id) 
      ? diet.mealTypes.filter(t => t !== id)
      : [...diet.mealTypes, id];
    onChange({ ...diet, mealTypes: newTypes });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-xl font-serif font-semibold text-foreground mb-4">How did you eat?</h2>
      
      {/* 1. Meal Type */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">What kind of meals?</h3>
        <div className="grid grid-cols-2 gap-3">
          {MEAL_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => toggleMealType(type.id)}
              className={cn(
                "flex items-center space-x-3 p-4 rounded-2xl border transition-all",
                diet.mealTypes.includes(type.id)
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-muted/20 hover:border-primary/30"
              )}
            >
              <span className="text-2xl">{type.emoji}</span>
              <span className="font-medium">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Meal Count */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">How many times?</h3>
        <div className="flex space-x-2">
          {MEAL_COUNTS.map(count => (
            <button
              key={count}
              onClick={() => onChange({ ...diet, mealCount: count })}
              className={cn(
                "flex-1 py-3 rounded-xl border font-serif text-lg transition-all",
                diet.mealCount === count
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-muted/20 hover:border-primary/30"
              )}
            >
              {count}{count === 5 ? '+' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Diet Quality */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Overall quality</h3>
        <div className="grid grid-cols-3 gap-2">
          {QUALITY_OPTIONS.map(quality => (
            <button
              key={quality.id}
              onClick={() => onChange({ ...diet, quality: quality.id })}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all h-24",
                diet.quality === quality.id
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-muted/20 hover:border-primary/30"
              )}
            >
              <span className="text-2xl mb-2">{quality.emoji}</span>
              <span className="text-[11px] font-medium text-center leading-tight">
                {quality.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
