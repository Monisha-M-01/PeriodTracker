import React from 'react';
import { cn } from '../../../lib/utils';

export interface EmojiOption {
  value: number;
  emoji: string;
  label: string;
}

interface EmojiScalePickerProps {
  category: string;
  options: EmojiOption[];
  selectedValue?: number;
  onChange: (value: number) => void;
}

export function EmojiScalePicker({ category, options, selectedValue, onChange }: EmojiScalePickerProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-foreground">{category}</h3>
      <div 
        role="radiogroup" 
        aria-label={`${category} scale`}
        className="flex flex-wrap gap-2 sm:flex-nowrap justify-between"
      >
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${category}: ${option.label}`}
              onClick={() => onChange(option.value)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1",
                "min-w-[44px] min-h-[44px] p-2 rounded-xl transition-all",
                "border-2",
                isSelected 
                  ? "border-primary bg-primary/10 shadow-sm" 
                  : "border-transparent bg-muted/30 active:bg-muted/50"
              )}
            >
              <span className="text-2xl" aria-hidden="true">{option.emoji}</span>
              <span className={cn(
                "text-[10px] font-medium hidden sm:block truncate w-full text-center",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}>
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
