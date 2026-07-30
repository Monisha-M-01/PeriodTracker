import React from 'react';
import { cn } from '../../../lib/utils';

const SYMPTOM_OPTIONS = [
  { id: 'nothing_new', emoji: '✨', label: 'Nothing new' },
  { id: 'cramps', emoji: '🤕', label: 'Cramps' },
  { id: 'nausea', emoji: '🤢', label: 'Nausea' },
  { id: 'fatigue', emoji: '😵', label: 'Fatigue' },
  { id: 'headache', emoji: '🤯', label: 'Headache' },
  { id: 'bloating', emoji: '🎈', label: 'Bloating' },
  { id: 'cravings', emoji: '🍫', label: 'Cravings' },
  { id: 'back_pain', emoji: '💥', label: 'Back pain' },
  { id: 'tender_breasts', emoji: '🦵', label: 'Tender breasts' },
  { id: 'insomnia', emoji: '😪', label: 'Insomnia' },
  { id: 'acne', emoji: '🌡️', label: 'Acne' },
  { id: 'digestive', emoji: '🚽', label: 'Digestive issues' },
  { id: 'sore_joints', emoji: '❤️‍🩹', label: 'Sore joints' }
];

interface SymptomsSectionProps {
  selectedSymptoms: string[];
  onToggle: (id: string) => void;
}

export function SymptomsSection({ selectedSymptoms, onToggle }: SymptomsSectionProps) {
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-xl font-serif font-semibold text-foreground mb-4">How are you feeling today??</h2>
      
      <div className="grid grid-cols-3 gap-3">
        {SYMPTOM_OPTIONS.map((symptom) => {
          const isSelected = selectedSymptoms.includes(symptom.id);
          
          return (
            <button
              key={symptom.id}
              onClick={() => onToggle(symptom.id)}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all",
                isSelected 
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-muted/20 hover:border-primary/30"
              )}
            >
              <span className="text-2xl mb-2">{symptom.emoji}</span>
              <span className="text-xs font-medium text-center leading-tight">
                {symptom.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
