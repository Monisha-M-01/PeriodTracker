import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTodayCheckInFn, upsertCheckInFn } from '../../api/checkins.api';
import { Spinner } from '../../components/ui/Spinner';
import { SymptomsSection } from './components/SymptomsSection';
import { MoodSection } from './components/MoodSection';
import { WorkoutSection, type WorkoutLog } from './components/WorkoutSection';
import { DietSection, type DietDetails } from './components/DietSection';
import { FlowIntensitySection } from './components/FlowIntensitySection';
import { SleepSection } from './components/SleepSection';
import { getPeriodsFn, updatePeriodFn } from '../../api/period.api';
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';

export default function LogSymptomPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const todayIso = format(new Date(), 'yyyy-MM-dd');
  
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [workouts, setWorkouts] = useState<WorkoutLog[]>([]);
  const [flowIntensity, setFlowIntensity] = useState<string | null>(null);
  const [diet, setDiet] = useState<DietDetails>({
    mealTypes: [],
    mealCount: null,
    quality: null
  });

  const [sleep, setSleep] = useState<{ bedtime?: string, wakeTime?: string, durationMinutes?: number, quality?: string }>({});

  const { data: todayCheckIn, isLoading: isLoadingCheckIn } = useQuery({
    queryKey: ['checkins', 'today'],
    queryFn: getTodayCheckInFn
  });

  const { data: periodsData, isLoading: isLoadingPeriods } = useQuery({
    queryKey: ['periods'],
    queryFn: getPeriodsFn
  });

  const todayPeriodLog = periodsData?.data?.find(log => {
    const start = startOfDay(new Date(log.startDate));
    const end = log.endDate ? endOfDay(new Date(log.endDate)) : endOfDay(new Date(log.startDate));
    return isWithinInterval(new Date(), { start, end });
  });

  const { mutate, isPending: isCheckInPending } = useMutation({
    mutationFn: upsertCheckInFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkins'] });
      navigate(-1);
    }
  });

  const updatePeriodMutation = useMutation({
    mutationFn: (data: { flowIntensity: string }) => updatePeriodFn(todayPeriodLog!.id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['periods'] })
  });

  const isPending = isCheckInPending || updatePeriodMutation.isPending;

  // Populate state on load
  useEffect(() => {
    if (todayCheckIn?.data) {
      const data = todayCheckIn.data;
      if (data.symptoms) setSelectedSymptoms(JSON.parse(data.symptoms));
      if (data.moodString) setSelectedMoods(JSON.parse(data.moodString));
      if (data.workouts) setWorkouts(JSON.parse(data.workouts));
      if (data.dietDetails) setDiet(JSON.parse(data.dietDetails));
      setSleep({
        bedtime: data.sleepBedtime || undefined,
        wakeTime: data.sleepWakeTime || undefined,
        durationMinutes: data.sleepDurationMinutes || undefined,
        quality: data.sleepQuality || undefined,
      });
    }
    if (todayPeriodLog && todayPeriodLog.flowIntensity) {
      setFlowIntensity(todayPeriodLog.flowIntensity);
    }
  }, [todayCheckIn, todayPeriodLog]);

  const handleToggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSave = () => {
    mutate({
      date: new Date().toISOString(),
      moodString: selectedMoods.length > 0 ? JSON.stringify(selectedMoods) : undefined,
      symptoms: JSON.stringify(selectedSymptoms),
      workouts: JSON.stringify(workouts),
      dietDetails: JSON.stringify(diet),
      sleepBedtime: sleep.bedtime,
      sleepWakeTime: sleep.wakeTime,
      sleepDurationMinutes: sleep.durationMinutes,
      sleepQuality: sleep.quality
    });

    if (todayPeriodLog && flowIntensity && flowIntensity !== todayPeriodLog.flowIntensity) {
      updatePeriodMutation.mutate({ flowIntensity });
    }
  };

  if (isLoadingCheckIn || isLoadingPeriods) {
    return <div className="fixed inset-0 bg-background flex justify-center items-center"><Spinner size={32} /></div>;
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col pb-safe overflow-y-auto">
      <div className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-muted/20">
        <h1 className="text-xl font-serif font-bold text-foreground">Log for Today</h1>
        <button 
          onClick={() => navigate(-1)}
          className="p-2 text-muted-foreground hover:bg-card rounded-full transition-colors"
        >
          <X className="w-6 h-6 stroke-[1.5]" />
        </button>
      </div>
      
      <div className="p-4 max-w-md mx-auto w-full flex-1 flex flex-col">
        <div className="flex-1 space-y-12">
          {!!todayPeriodLog && (
            <FlowIntensitySection 
              intensity={flowIntensity}
              onChange={setFlowIntensity}
            />
          )}

          <MoodSection 
            selectedMoods={selectedMoods}
            onToggle={(id) => setSelectedMoods(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id])}
          />

          <SymptomsSection 
            selectedSymptoms={selectedSymptoms} 
            onToggle={handleToggleSymptom} 
          />

          <WorkoutSection 
            workouts={workouts}
            onChange={setWorkouts}
          />

          <SleepSection 
            sleep={sleep}
            onChange={setSleep}
          />

          <DietSection 
            diet={diet}
            onChange={setDiet}
          />
        </div>

        <div className="pt-12 pb-4">
          <button 
            onClick={handleSave}
            disabled={isPending}
            className="w-full flex items-center justify-center space-x-2 bg-primary text-primary-foreground py-4 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
          >
            {isPending ? <Spinner size={20} className="text-primary-foreground" /> : <Check className="w-5 h-5" />}
            <span>{isPending ? 'Saving...' : 'Save Log'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
