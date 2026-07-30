import React from 'react';
import { cn } from '../../../lib/utils';

const WORKOUT_OPTIONS = [
  { id: 'gym', emoji: '🏋️', label: 'Gym' },
  { id: 'walking', emoji: '🚶', label: 'Walking' },
  { id: 'running', emoji: '🏃', label: 'Running' },
  { id: 'cycling', emoji: '🚴', label: 'Cycling' },
  { id: 'yoga', emoji: '🧘', label: 'Yoga' },
  { id: 'swimming', emoji: '🏊', label: 'Swimming' },
  { id: 'sports', emoji: '⚽', label: 'Sports' },
  { id: 'rest', emoji: '🛌', label: 'Rest day' }
];

const DURATIONS = [15, 30, 45, 60, 90];

export interface WorkoutLog {
  type: string;
  durationMinutes: number;
}

interface WorkoutSectionProps {
  workouts: WorkoutLog[];
  onChange: (workouts: WorkoutLog[]) => void;
}

export function WorkoutSection({ workouts, onChange }: WorkoutSectionProps) {
  const selectedTypes = workouts.map(w => w.type);
  const isRestDay = selectedTypes.includes('rest');

  const handleToggleType = (id: string) => {
    if (id === 'rest') {
      onChange([{ type: 'rest', durationMinutes: 0 }]);
      return;
    }

    if (selectedTypes.includes(id)) {
      onChange(workouts.filter(w => w.type !== id));
    } else {
      // Remove rest if selecting something else
      const filtered = workouts.filter(w => w.type !== 'rest');
      onChange([...filtered, { type: id, durationMinutes: 30 }]);
    }
  };

  const handleUpdateDuration = (id: string, durationMinutes: number) => {
    onChange(workouts.map(w => w.type === id ? { ...w, durationMinutes } : w));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-xl font-serif font-semibold text-foreground mb-4">Did you work out?</h2>
      
      <div className="grid grid-cols-4 gap-2">
        {WORKOUT_OPTIONS.map((workout) => {
          const isSelected = selectedTypes.includes(workout.id);
          
          return (
            <button
              key={workout.id}
              onClick={() => handleToggleType(workout.id)}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-2xl border transition-all h-20",
                isSelected 
                  ? "bg-secondary text-secondary-foreground border-secondary shadow-sm"
                  : "bg-card text-muted-foreground border-muted/20 hover:border-secondary/30",
                isRestDay && workout.id !== 'rest' && "opacity-50"
              )}
            >
              <span className="text-2xl mb-1">{workout.emoji}</span>
              <span className="text-[10px] font-medium text-center leading-tight">
                {workout.label}
              </span>
            </button>
          );
        })}
      </div>

      {!isRestDay && workouts.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-muted/20">
          <h3 className="text-sm font-medium text-muted-foreground">Workout Durations</h3>
          {workouts.map(workout => {
            const workoutDetails = WORKOUT_OPTIONS.find(w => w.id === workout.type);
            if (!workoutDetails) return null;

            return (
              <div key={workout.type} className="space-y-2">
                <div className="flex items-center space-x-2 text-foreground font-medium text-sm">
                  <span>{workoutDetails.emoji}</span>
                  <span>{workoutDetails.label}</span>
                </div>
                <div className="flex space-x-2 overflow-x-auto pb-1 hide-scrollbar">
                  {DURATIONS.map(dur => (
                    <button
                      key={dur}
                      onClick={() => handleUpdateDuration(workout.type, dur)}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
                        workout.durationMinutes === dur
                          ? "bg-secondary text-secondary-foreground border-secondary shadow-sm"
                          : "bg-card text-muted-foreground border-muted/20 hover:border-secondary/30"
                      )}
                    >
                      {dur} min
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
