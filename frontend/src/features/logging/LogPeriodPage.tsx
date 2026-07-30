import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { LogPeriodForm } from './LogPeriodForm';
import { format } from 'date-fns';

export default function LogPeriodPage() {
  const navigate = useNavigate();
  const todayIso = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col pb-safe overflow-y-auto">
      <div className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-muted/20">
        <h1 className="text-xl font-serif font-bold text-foreground">Log Period</h1>
        <button 
          onClick={() => navigate(-1)}
          className="p-2 text-muted-foreground hover:bg-card rounded-full transition-colors"
        >
          <X className="w-6 h-6 stroke-[1.5]" />
        </button>
      </div>
      <div className="p-4 max-w-md mx-auto w-full">
        <LogPeriodForm selectedDate={todayIso} />
      </div>
    </div>
  );
}
