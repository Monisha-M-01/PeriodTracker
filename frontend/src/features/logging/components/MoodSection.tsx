import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { useHaptics } from '../../../hooks/useHaptics';

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
  const triggerHaptic = useHaptics();

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-xl font-serif font-semibold text-foreground mb-4">How's your mood?</h2>
      
      <div className="grid grid-cols-3 gap-3">
        {MOOD_OPTIONS.map((mood) => {
          const isSelected = selectedMoods.includes(mood.id);
          
          return (
            <motion.button
              key={mood.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                triggerHaptic('light');
                onToggle(mood.id);
              }}
              className={cn(
                "relative flex flex-col items-center justify-center p-3 rounded-[2rem] border transition-colors overflow-hidden",
                isSelected 
                  ? "bg-primary/10 border-primary/30 shadow-[0_0_20px_rgba(193,95,60,0.15)]"
                  : "bg-card border-muted/20 hover:border-primary/30"
              )}
            >
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5 shadow-sm"
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.span 
                animate={{ scale: isSelected ? 1.3 : 1, y: isSelected ? -2 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="text-3xl mb-1 z-10"
              >
                {mood.emoji}
              </motion.span>
              <span className={cn(
                "text-[10px] font-bold text-center leading-tight uppercase tracking-wider mt-2 transition-colors",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}>
                {mood.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
