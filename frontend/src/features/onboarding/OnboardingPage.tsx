import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSettingsFn } from '../../api/settings.api';
import { logPeriodFn } from '../../api/period.api';
import { Spinner } from '../../components/ui/Spinner';
import { cn } from '../../lib/utils';
import { Calendar, ChevronRight, CheckCircle, Brain } from 'lucide-react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  
  // Form State
  const [lastPeriodDate, setLastPeriodDate] = useState<string>('');
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [notSureCycle, setNotSureCycle] = useState(false);
  const [periodStress, setPeriodStress] = useState<string | null>(null);

  const { mutate: updateSettings, isPending: isUpdating } = useMutation({
    mutationFn: updateSettingsFn,
  });

  const { mutate: logPeriod, isPending: isLogging } = useMutation({
    mutationFn: logPeriodFn,
  });

  const handleFinish = async () => {
    try {
      // 1. Log the period if a date was provided
      if (lastPeriodDate) {
        await logPeriod({ startDate: new Date(lastPeriodDate).toISOString() });
      }

      // 2. Update settings to mark onboarding as complete and save custom lengths
      await updateSettings({
        hasCompletedOnboarding: true,
        defaultPeriodLength: periodLength,
        defaultCycleLength: notSureCycle ? 28 : cycleLength,
        periodStress: periodStress
      });

      // 3. Invalidate queries and navigate home
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['periods'] });
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const isPending = isUpdating || isLogging;

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 max-w-md mx-auto">
      <div className="flex-1 flex flex-col pt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif font-bold text-primary">Welcome to Cycle</h1>
          <p className="text-muted-foreground">Let's personalize your predictions with a few quick questions.</p>
        </div>

        {step === 1 && (
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            <h2 className="text-xl font-medium">When did your last period start?</h2>
            <input 
              type="date"
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
              className="w-full bg-card border border-muted/30 rounded-2xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
              max={new Date().toISOString().split('T')[0]}
            />
            <button
              onClick={() => setStep(2)}
              disabled={!lastPeriodDate}
              className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 mt-8 flex items-center justify-center"
            >
              Continue <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 flex-1 flex flex-col justify-center">
            <div className="space-y-4">
              <h2 className="text-xl font-medium">How many days does your period typically last?</h2>
              <div className="flex items-center space-x-4 bg-card p-4 rounded-2xl border border-muted/20">
                <input 
                  type="range"
                  min="2" max="10"
                  value={periodLength}
                  onChange={(e) => setPeriodLength(parseInt(e.target.value))}
                  className="w-full accent-primary"
                />
                <span className="text-2xl font-serif font-bold text-primary w-16 text-center">{periodLength} <span className="text-sm font-sans font-normal text-muted-foreground">days</span></span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-medium">How many days are typically in your cycle?</h2>
              <p className="text-sm text-muted-foreground">(From the first day of one period to the first day of the next)</p>
              
              <div className={cn("flex items-center space-x-4 bg-card p-4 rounded-2xl border transition-all", notSureCycle ? "opacity-50 border-muted/20" : "border-primary/30")}>
                <input 
                  type="range"
                  min="21" max="35"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(parseInt(e.target.value))}
                  disabled={notSureCycle}
                  className="w-full accent-primary"
                />
                <span className="text-2xl font-serif font-bold text-primary w-16 text-center">{cycleLength} <span className="text-sm font-sans font-normal text-muted-foreground">days</span></span>
              </div>
              
              <button 
                onClick={() => setNotSureCycle(!notSureCycle)}
                className="flex items-center space-x-2 text-sm text-muted-foreground"
              >
                <div className={cn("w-5 h-5 rounded border flex items-center justify-center", notSureCycle ? "bg-primary border-primary" : "border-muted-foreground")}>
                  {notSureCycle && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
                </div>
                <span>I'm not sure (use 28-day default)</span>
              </button>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-sm mt-8 flex items-center justify-center"
            >
              Continue <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 flex-1 flex flex-col justify-center">
            <h2 className="text-xl font-medium flex items-center">
              <Brain className="w-6 h-6 mr-2 text-primary" />
              Do you generally experience noticeable stress around your period?
            </h2>
            <div className="space-y-3">
              {['Yes', 'Sometimes', 'No'].map((option) => (
                <button
                  key={option}
                  onClick={() => setPeriodStress(option)}
                  className={cn(
                    "w-full p-4 rounded-2xl border text-left font-medium transition-all",
                    periodStress === option
                      ? "bg-primary/10 border-primary text-primary shadow-sm"
                      : "bg-card border-muted/20 hover:border-primary/30"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              onClick={handleFinish}
              disabled={isPending || !periodStress}
              className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 mt-8 flex items-center justify-center"
            >
              {isPending ? <Spinner size={24} className="text-primary-foreground" /> : "Finish"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
