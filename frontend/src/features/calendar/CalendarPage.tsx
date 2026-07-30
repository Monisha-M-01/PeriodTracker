import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useQuery } from '@tanstack/react-query';
import { getPredictionsFn } from '../../api/cycles.api';
import { getPeriodsFn } from '../../api/period.api';
import { getCheckInsFn } from '../../api/checkins.api';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { format, isSameDay, subDays, addDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { Spinner } from '../../components/ui/Spinner';
import { Droplets, Activity, Utensils, Heart } from 'lucide-react';

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const fromDate = format(subDays(new Date(), 180), 'yyyy-MM-dd');
  const toDate = format(addDays(new Date(), 90), 'yyyy-MM-dd');

  const { data: predictionsData, isLoading: isLoadingPreds } = useQuery({ queryKey: ['predictions'], queryFn: getPredictionsFn });
  const { data: periodsData, isLoading: isLoadingPeriods } = useQuery({ queryKey: ['periods'], queryFn: getPeriodsFn });
  const { data: checkInsData, isLoading: isLoadingCheckIns } = useQuery({ 
    queryKey: ['checkins', fromDate, toDate], 
    queryFn: () => getCheckInsFn(fromDate, toDate) 
  });

  if (isLoadingPreds || isLoadingPeriods || isLoadingCheckIns) {
    return <div className="flex justify-center h-[50vh] items-center"><Spinner size={32} /></div>;
  }

  // Find existing period log for selected date
  const selectedPeriodLog = periodsData?.data?.find(p => {
    if (!selectedDate) return false;
    const start = startOfDay(new Date(p.startDate));
    const end = p.endDate ? endOfDay(new Date(p.endDate)) : endOfDay(new Date(p.startDate));
    return isWithinInterval(selectedDate, { start, end });
  });

  // Find checkin for selected date
  const selectedCheckIn = checkInsData?.data?.find(c => selectedDate && isSameDay(new Date(c.date), selectedDate));

  let parsedSymptoms: string[] = [];
  let parsedMoods: string[] = [];
  let parsedWorkouts: any[] = [];
  let parsedDiet: any = null;

  if (selectedCheckIn) {
    if (selectedCheckIn.symptoms) parsedSymptoms = JSON.parse(selectedCheckIn.symptoms);
    if (selectedCheckIn.moodString) parsedMoods = JSON.parse(selectedCheckIn.moodString);
    if (selectedCheckIn.workouts) parsedWorkouts = JSON.parse(selectedCheckIn.workouts);
    if (selectedCheckIn.dietDetails) parsedDiet = JSON.parse(selectedCheckIn.dietDetails);
  }

  // Custom styling for DayPicker
  const modifiers = {
    fertile: predictionsData?.data?.predictions ? [
      new Date(predictionsData.data.predictions.fertileWindowStart),
      { from: new Date(predictionsData.data.predictions.fertileWindowStart), to: new Date(predictionsData.data.predictions.fertileWindowEnd) }
    ] : [],
    predictedPeriod: predictionsData?.data?.predictions ? [
      new Date(predictionsData.data.predictions.nextPeriodStart),
      { from: new Date(predictionsData.data.predictions.nextPeriodStart), to: new Date(predictionsData.data.predictions.nextPeriodEnd) }
    ] : [],
    loggedPeriod: periodsData?.data?.map(p => new Date(p.startDate)) || [],
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
        <Card className="flex justify-center p-4">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            className="border-none"
          />
        </Card>

        <Card>
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
                  {selectedPeriodLog ? (
                    <div className="bg-card border border-primary/20 p-3 rounded-lg flex justify-between items-center shadow-sm">
                      <span className="font-medium">Period Logged</span>
                      {selectedPeriodLog.flowIntensity && (
                        <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                          {selectedPeriodLog.flowIntensity} Flow
                        </span>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No period logged.</p>
                  )}
                </section>

                <section>
                  <h3 className="font-semibold text-foreground flex items-center mb-3">
                    <Heart className="w-5 h-5 text-rose-500 mr-2" />
                    Daily Check-in
                  </h3>
                  {!selectedCheckIn ? (
                    <p className="text-sm text-muted-foreground">No check-in logged.</p>
                  ) : (
                    <div className="space-y-4">
                      {parsedMoods.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Mood</p>
                          <div className="flex flex-wrap gap-2">
                            {parsedMoods.map(m => (
                              <span key={m} className="text-sm bg-muted px-2 py-1 rounded-md">{m}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {parsedSymptoms.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Symptoms</p>
                          <div className="flex flex-wrap gap-2">
                            {parsedSymptoms.map(s => (
                              <span key={s} className="text-sm bg-muted px-2 py-1 rounded-md">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {parsedWorkouts.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Workout</p>
                          <div className="space-y-2">
                            {parsedWorkouts.map((w, i) => (
                              <div key={i} className="text-sm bg-muted px-3 py-2 rounded-md flex justify-between items-center">
                                <span>{w.type} <span className="text-muted-foreground ml-1">({w.intensity})</span></span>
                                <span className="font-medium">{w.duration} min</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
