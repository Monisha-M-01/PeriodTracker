import React, { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { Moon, Sun } from 'lucide-react';

export interface SleepLog {
  bedtime?: string;
  wakeTime?: string;
  durationMinutes?: number;
  quality?: string;
}

interface SleepSectionProps {
  sleep: SleepLog;
  onChange: (sleep: SleepLog) => void;
}

const QUALITY_OPTIONS = [
  { id: 'poor', emoji: '😴', label: 'Poor' },
  { id: 'okay', emoji: '😐', label: 'Okay' },
  { id: 'good', emoji: '😊', label: 'Good' }
];

export function SleepSection({ sleep, onChange }: SleepSectionProps) {
  const [bedtime, setBedtime] = useState(sleep.bedtime || '');
  const [wakeTime, setWakeTime] = useState(sleep.wakeTime || '');

  useEffect(() => {
    if (bedtime && wakeTime) {
      // Calculate duration
      const [bHours, bMins] = bedtime.split(':').map(Number);
      const [wHours, wMins] = wakeTime.split(':').map(Number);
      
      let durationMins = (wHours * 60 + wMins) - (bHours * 60 + bMins);
      // If wake time is earlier than bedtime, assume it's the next day
      if (durationMins < 0) {
        durationMins += 24 * 60;
      }
      onChange({ ...sleep, bedtime, wakeTime, durationMinutes: durationMins });
    } else {
      onChange({ ...sleep, bedtime, wakeTime, durationMinutes: undefined });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bedtime, wakeTime]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <h2 className="text-xl font-serif font-semibold text-foreground mb-4">How did you sleep?</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center">
            <Moon className="w-4 h-4 mr-2" />
            Bedtime
          </label>
          <input 
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className="w-full bg-card border border-muted/30 rounded-xl p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center">
            <Sun className="w-4 h-4 mr-2" />
            Wake Time
          </label>
          <input 
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="w-full bg-card border border-muted/30 rounded-xl p-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {sleep.durationMinutes !== undefined && (
        <div className="text-center p-3 bg-primary/10 rounded-xl border border-primary/20">
          <span className="font-medium text-primary">
            {Math.floor(sleep.durationMinutes / 60)}h {sleep.durationMinutes % 60}m
          </span>
          <span className="text-sm text-primary/80 ml-2">total sleep</span>
        </div>
      )}

      <div className="space-y-3 pt-4 border-t border-muted/20">
        <h3 className="text-sm font-medium text-muted-foreground">Sleep Quality</h3>
        <div className="grid grid-cols-3 gap-2">
          {QUALITY_OPTIONS.map((q) => {
            const isSelected = sleep.quality === q.id;
            return (
              <button
                key={q.id}
                onClick={() => onChange({ ...sleep, quality: q.id })}
                className={cn(
                  "flex flex-col items-center justify-center py-3 rounded-2xl border transition-all",
                  isSelected 
                    ? "bg-secondary text-secondary-foreground border-secondary shadow-sm"
                    : "bg-card text-muted-foreground border-muted/20 hover:border-secondary/30"
                )}
              >
                <span className="text-2xl mb-1">{q.emoji}</span>
                <span className="text-xs font-medium">{q.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
