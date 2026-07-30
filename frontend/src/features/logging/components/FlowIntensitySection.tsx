import React from 'react';
import { Droplets } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface FlowIntensitySectionProps {
  intensity: string | null;
  onChange: (intensity: string) => void;
}

const intensities = [
  { id: 'Light', label: 'Light', icon: '🩸' },
  { id: 'Medium', label: 'Medium', icon: '🩸🩸' },
  { id: 'Heavy', label: 'Heavy', icon: '🩸🩸🩸' },
];

export function FlowIntensitySection({ intensity, onChange }: FlowIntensitySectionProps) {
  return (
    <section>
      <div className="flex items-center space-x-2 mb-4">
        <div className="p-2 bg-primary/10 rounded-full">
          <Droplets className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-lg font-serif font-bold text-foreground">Flow Intensity</h2>
      </div>
      
      <div className="grid grid-cols-3 gap-3">
        {intensities.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-sm",
              intensity === item.id 
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-card border-muted/20 hover:border-primary/30 text-foreground"
            )}
          >
            <span className="text-lg mb-1">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
