import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPredictionsFn } from '../../api/cycles.api';
import { getPeriodsFn, togglePeriodDayFn } from '../../api/period.api';
import { getCheckInsFn } from '../../api/checkins.api';
import { Card, CardHeader, CardTitle, CardContent, InteractiveCard } from '../../components/ui/Card';
import { format, isSameDay, subDays, addDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { Skeleton } from '../../components/ui/Skeleton';
import { Droplets } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptics } from '../../hooks/useHaptics';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const queryClient = useQueryClient();
  const triggerHaptic = useHaptics();
  
  const fromDate = startOfDay(subDays(new Date(), 180)).toISOString();
  const toDate = endOfDay(addDays(new Date(), 90)).toISOString();

  const { data: predictionsData, isLoading: isLoadingPreds } = useQuery({ queryKey: ['predictions'], queryFn: getPredictionsFn });
  const { data: periodsData, isLoading: isLoadingPeriods } = useQuery({ queryKey: ['periods'], queryFn: getPeriodsFn });

  const toggleMutation = useMutation({
    mutationFn: togglePeriodDayFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periods'] });
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
    }
  });

  if (isLoadingPreds || isLoadingPeriods) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Calendar</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] rounded-2xl" />
          <Skeleton className="h-[400px] rounded-2xl" />
        </div>
      </div>
    );
  }

  // Find existing period log for selected date
  const selectedPeriodLog = periodsData?.data?.find(p => {
    if (!selectedDate) return false;
    const start = startOfDay(new Date(p.startDate));
    const end = p.endDate ? endOfDay(new Date(p.endDate)) : endOfDay(new Date(p.startDate));
    return isWithinInterval(selectedDate, { start, end });
  });

  const handleTogglePeriod = (isPeriod: boolean) => {
    if (!selectedDate) return;
    toggleMutation.mutate({
      date: format(selectedDate, "yyyy-MM-dd'T'00:00:00.000'Z'"),
      isPeriod,
      flowIntensity: selectedPeriodLog?.flowIntensity || 'Medium'
    });
  };

  const handleFlowChange = (intensity: string) => {
    if (!selectedDate) return;
    toggleMutation.mutate({
      date: format(selectedDate, "yyyy-MM-dd'T'00:00:00.000'Z'"),
      isPeriod: true,
      flowIntensity: intensity
    });
  };

  const periodSpan = selectedPeriodLog
    ? Math.round((new Date(selectedPeriodLog.endDate || selectedPeriodLog.startDate).getTime() - new Date(selectedPeriodLog.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0;

  // Custom styling for DayPicker
  const modifiers = {
    fertile: predictionsData?.data?.predictions?.fertileWindowStart ? [
      new Date(predictionsData.data.predictions.fertileWindowStart),
      { from: new Date(predictionsData.data.predictions.fertileWindowStart), to: new Date(predictionsData.data.predictions.fertileWindowEnd || predictionsData.data.predictions.fertileWindowStart) }
    ] : [],
    predictedPeriod: predictionsData?.data?.predictions?.nextPeriodStart ? [
      new Date(predictionsData.data.predictions.nextPeriodStart),
      { from: new Date(predictionsData.data.predictions.nextPeriodStart), to: new Date(predictionsData.data.predictions.nextPeriodEnd || predictionsData.data.predictions.nextPeriodStart) }
    ] : [],
    loggedPeriod: periodsData?.data?.map(p => {
      if (p.endDate) {
        return { from: new Date(p.startDate), to: new Date(p.endDate) };
      }
      return new Date(p.startDate);
    }) || [],
  };

  const modifiersStyles = {
    fertile: { backgroundColor: '#DFEEEA', color: '#1F2937' },
    predictedPeriod: { backgroundColor: '#FDE8E8', color: '#E06C75' },
    loggedPeriod: { backgroundColor: '#E06C75', color: '#FFFFFF' },
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-24">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Calendar</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InteractiveCard className="flex flex-col items-center p-4">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(e, { offset }) => {
              if (offset.x > 100) {
                // Swiped right (previous day)
                triggerHaptic('medium');
                setSelectedDate(prev => prev ? subDays(prev, 1) : new Date());
              } else if (offset.x < -100) {
                // Swiped left (next day)
                triggerHaptic('medium');
                setSelectedDate(prev => prev ? addDays(prev, 1) : new Date());
              }
            }}
          >
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={(d) => {
                triggerHaptic('selection');
                setSelectedDate(d);
              }}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="border-none"
            />
          </motion.div>

          {/* Calendar Legend */}
          <div className="mt-4 pt-4 border-t border-primary/10 flex flex-col gap-2 text-sm w-full max-w-[280px]">
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: '#E06C75' }}></span>
              <span className="text-muted-foreground font-medium">Logged Period</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: '#FDE8E8' }}></span>
              <span className="text-muted-foreground font-medium">Predicted Period</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: '#DFEEEA' }}></span>
              <span className="text-muted-foreground font-medium">Fertile Window</span>
            </div>
          </div>
        </InteractiveCard>

        <AnimatePresence mode="wait">
        <motion.div 
          key={selectedDate?.toISOString() || 'none'}
          initial={{ opacity: 0, x: -20, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="h-full"
        >
        <InteractiveCard className="h-full">
          <CardHeader className="bg-primary/5 rounded-t-xl border-b border-primary/10">
            <CardTitle className="text-primary font-serif">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {!selectedDate ? (
              <p className="text-muted-foreground text-center">Select a day on the calendar to see history.</p>
            ) : (
              <>
                <section>
                  <h3 className="font-semibold text-foreground flex items-center mb-3">
                    <Droplets className="w-5 h-5 text-primary mr-2" />
                    Period Log
                  </h3>
                  
                  <div className="bg-card border border-primary/20 p-4 rounded-lg flex flex-col space-y-4 shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">Mark as period day</span>
                      <button 
                        onClick={() => handleTogglePeriod(!selectedPeriodLog)}
                        disabled={toggleMutation.isPending}
                        className={`w-12 h-6 rounded-full transition-colors relative ${selectedPeriodLog ? 'bg-primary' : 'bg-muted'} ${toggleMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all ${selectedPeriodLog ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    {selectedPeriodLog && (
                      <div className="pt-3 border-t border-border flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Flow Intensity</span>
                        <select 
                          value={selectedPeriodLog.flowIntensity || 'Medium'}
                          onChange={(e) => handleFlowChange(e.target.value)}
                          disabled={toggleMutation.isPending}
                          className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium border-none outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                        >
                          <option value="Light">Light</option>
                          <option value="Medium">Medium</option>
                          <option value="Heavy">Heavy</option>
                        </select>
                      </div>
                    )}

                    {selectedPeriodLog && periodSpan > 15 && (
                       <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200/50 p-2 rounded-md flex items-start mt-2">
                         <span className="mr-2">⚠️</span>
                         <span>This period spans <strong>{periodSpan} days</strong>. Make sure this is correct.</span>
                       </div>
                    )}
                  </div>
                </section>

              </>
            )}
          </CardContent>
        </InteractiveCard>
        </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
