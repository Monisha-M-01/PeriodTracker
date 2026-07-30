import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { getCheckInsFn } from '../../api/checkins.api';
import { Spinner } from '../../components/ui/Spinner';
import { Activity, Brain, Dumbbell, Apple, Calendar } from 'lucide-react';
import { cn } from '../../lib/utils';

type TimeWindow = 7 | 14 | 21 | 28;

export default function InsightsScreen() {
  const [windowDays, setWindowDays] = useState<TimeWindow>(7);
  
  const today = new Date();
  const toDate = endOfDay(today).toISOString();
  const fromDate = startOfDay(subDays(today, windowDays - 1)).toISOString();

  const { data: checkInsData, isLoading } = useQuery({
    queryKey: ['checkins', 'list', windowDays],
    queryFn: () => getCheckInsFn(fromDate, toDate),
  });

  const checkIns = checkInsData?.data || [];

  const stats = useMemo(() => {
    let activeDays = 0;
    const moodCounts: Record<string, number> = {};
    const symptomCounts: Record<string, number> = {};
    let totalWorkouts = 0;
    let healthyMealsCount = 0;
    
    checkIns.forEach(ci => {
      // Check-in activity
      if (ci.answers || ci.moodString || ci.symptoms || ci.workouts || ci.dietDetails) {
        activeDays++;
      }

      // Moods
      if (ci.moodString) {
        try {
          const moods: string[] = JSON.parse(ci.moodString);
          moods.forEach(m => {
            moodCounts[m] = (moodCounts[m] || 0) + 1;
          });
        } catch (e) {}
      }

      // Symptoms
      if (ci.symptoms) {
        try {
          const symptoms: string[] = JSON.parse(ci.symptoms);
          symptoms.forEach(s => {
            symptomCounts[s] = (symptomCounts[s] || 0) + 1;
          });
        } catch (e) {}
      }

      // Workouts
      if (ci.workouts) {
        try {
          const w = JSON.parse(ci.workouts);
          if (Array.isArray(w) && w.length > 0) totalWorkouts += w.length;
        } catch (e) {}
      }

      // Diet
      if (ci.dietDetails) {
        try {
          const d = JSON.parse(ci.dietDetails);
          if (d.quality === 'good' || d.quality === 'excellent') {
            healthyMealsCount++;
          }
        } catch (e) {}
      }
    });

    const topMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
    const topSymptoms = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

    return {
      activeDays,
      topMoods,
      topSymptoms,
      totalWorkouts,
      healthyMealsCount
    };
  }, [checkIns]);

  return (
    <div className="space-y-6 pb-6 animate-in fade-in">
      <header className="flex flex-col space-y-2">
        <h1 className="text-3xl font-serif font-bold text-primary">Your Insights</h1>
        <p className="text-muted-foreground font-medium">See how your body and mind are feeling.</p>
      </header>

      {/* Time Window Selector */}
      <div className="flex bg-card rounded-full p-1 border border-muted/20 shadow-sm w-full max-w-sm mx-auto">
        {([7, 14, 21, 28] as TimeWindow[]).map(days => (
          <button
            key={days}
            onClick={() => setWindowDays(days)}
            className={cn(
              "flex-1 py-2 text-sm font-medium rounded-full transition-all",
              windowDays === days 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:bg-muted/10 hover:text-foreground"
            )}
          >
            {days / 7} {days === 7 ? 'week' : 'weeks'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner size={32} /></div>
      ) : checkIns.length === 0 ? (
        <div className="bg-card rounded-3xl p-8 text-center shadow-sm border border-muted/20 flex flex-col items-center justify-center min-h-[30vh]">
          <Calendar className="w-12 h-12 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-serif font-medium text-foreground mb-2">Not enough data yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Log your moods, symptoms, and check-ins to see your insights here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Consistency Card */}
          <div className="bg-card p-6 rounded-3xl shadow-sm border border-muted/20 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 text-primary mb-1">
                <Activity className="w-5 h-5" />
                <h3 className="font-semibold text-sm uppercase tracking-wider">Logging Consistency</h3>
              </div>
              <p className="text-3xl font-serif font-bold text-foreground mt-2">
                {stats.activeDays} <span className="text-xl text-muted-foreground font-medium">/ {windowDays} days</span>
              </p>
            </div>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{Math.round((stats.activeDays / windowDays) * 100)}%</span>
            </div>
          </div>

          {/* Moods */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-3xl shadow-sm border border-indigo-100/50">
            <div className="flex items-center space-x-2 text-indigo-700 mb-4">
              <Brain className="w-5 h-5" />
              <h3 className="font-semibold text-sm uppercase tracking-wider">Most Frequent Moods</h3>
            </div>
            
            {stats.topMoods.length > 0 ? (
              <div className="space-y-3">
                {stats.topMoods.map(([mood, count], i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="font-medium text-foreground capitalize flex items-center">
                      <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm mr-3 text-sm">
                        {count}x
                      </span>
                      {mood.replace('_', ' ')}
                    </span>
                    <div className="flex-1 ml-4 h-2 bg-indigo-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-400 rounded-full" 
                        style={{ width: `${(count / stats.activeDays) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-indigo-600/70">No moods logged in this period.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Workouts */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-3xl shadow-sm border border-orange-100/50 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-orange-700 mb-2">
                <Dumbbell className="w-5 h-5" />
                <h3 className="font-semibold text-[11px] uppercase tracking-wider">Workouts</h3>
              </div>
              <div>
                <p className="text-4xl font-serif font-bold text-foreground">{stats.totalWorkouts}</p>
                <p className="text-sm text-orange-700/80 font-medium">sessions logged</p>
              </div>
            </div>

            {/* Diet */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-3xl shadow-sm border border-emerald-100/50 flex flex-col justify-between">
              <div className="flex items-center space-x-2 text-emerald-700 mb-2">
                <Apple className="w-5 h-5" />
                <h3 className="font-semibold text-[11px] uppercase tracking-wider">Nutrition</h3>
              </div>
              <div>
                <p className="text-4xl font-serif font-bold text-foreground">{stats.healthyMealsCount}</p>
                <p className="text-sm text-emerald-700/80 font-medium">good days</p>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          {stats.topSymptoms.length > 0 && (
            <div className="bg-card p-6 rounded-3xl shadow-sm border border-muted/20">
              <div className="flex items-center space-x-2 text-foreground/70 mb-4">
                <Activity className="w-5 h-5" />
                <h3 className="font-semibold text-sm uppercase tracking-wider">Frequent Symptoms</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {stats.topSymptoms.map(([symp, count], i) => (
                  <div key={i} className="px-3 py-1.5 bg-muted/30 rounded-lg text-sm font-medium flex items-center">
                    <span className="capitalize">{symp.replace('_', ' ')}</span>
                    <span className="ml-2 text-muted-foreground text-xs bg-white px-1.5 py-0.5 rounded-md shadow-sm">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
