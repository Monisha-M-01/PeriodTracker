import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { getCheckInsFn } from '../../api/checkins.api';
import { getPredictionsFn } from '../../api/cycles.api';
import { Spinner } from '../../components/ui/Spinner';
import { Activity, Brain, Dumbbell, Apple, Calendar, Moon, Sparkles, Stethoscope, X, AlertCircle, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { generateMedicalReport } from './reportGenerator';
import { getHealthAwarenessFlags } from './healthFlags';
import { getSymptomTip } from './symptomTips';
import { differenceInCalendarDays } from 'date-fns';

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
  
  const { data: predictionsData } = useQuery({
    queryKey: ['predictions'],
    queryFn: getPredictionsFn
  });

  const checkIns = checkInsData?.data || [];
  const [showReport, setShowReport] = useState(false);

  const currentCycleDay = useMemo(() => {
    const history = predictionsData?.data?.history;
    if (history?.lastPeriodStartDate) {
      return differenceInCalendarDays(today, new Date(history.lastPeriodStartDate)) + 1;
    }
    return 1;
  }, [predictionsData, today]);

  const todaySymptoms = useMemo(() => {
    const todayStr = format(today, 'yyyy-MM-dd');
    const todayCheckin = checkIns.find(c => c.date.startsWith(todayStr));
    if (todayCheckin?.symptoms) {
      try {
        const parsed = JSON.parse(todayCheckin.symptoms);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  }, [checkIns, today]);

  const stats = useMemo(() => {
    const moodCounts: Record<string, number> = {};
    const symptomCounts: Record<string, number> = {};
    const workoutTypes: Record<string, number> = {};
    let workoutDays = 0;
    
    let totalSleepMins = 0;
    let sleepLogsCount = 0;
    
    const dietSummary = { good: 0, okay: 0, poor: 0 };
    
    let completedCheckins = 0;
    const possibleCheckins = windowDays * 3; // morning, afternoon, evening per day
    const uniqueDaysSet = new Set<string>();

    checkIns.forEach(ci => {
      if (ci.date) {
        uniqueDaysSet.add(ci.date.split('T')[0]);
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
          if (Array.isArray(w) && w.length > 0) {
            workoutDays++;
            w.forEach(workout => {
              if (workout.type) {
                workoutTypes[workout.type] = (workoutTypes[workout.type] || 0) + 1;
              }
            });
          }
        } catch (e) {}
      }

      // Diet
      if (ci.dietDetails) {
        try {
          const d = JSON.parse(ci.dietDetails);
          if (d.quality === 'good' || d.quality === 'excellent') {
            dietSummary.good++;
          } else if (d.quality === 'poor') {
            dietSummary.poor++;
          } else if (d.quality) {
            dietSummary.okay++;
          }
        } catch (e) {}
      }
      
      // Sleep
      if (ci.sleepDurationMinutes) {
        totalSleepMins += ci.sleepDurationMinutes;
        sleepLogsCount++;
      }
      
      // Check-ins (from answers JSON which stores { morning: {...}, afternoon: {...} })
      if (ci.answers) {
        try {
          const ans = JSON.parse(ci.answers);
          if (ans.morning) completedCheckins++;
          if (ans.afternoon) completedCheckins++;
          if (ans.evening) completedCheckins++;
        } catch (e) {}
      }
    });

    const topMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
    const topSymptoms = Object.entries(symptomCounts).sort((a, b) => b[1] - a[1]);
    const topWorkout = Object.entries(workoutTypes).sort((a, b) => b[1] - a[1])[0];
    const avgSleepMins = sleepLogsCount > 0 ? Math.round(totalSleepMins / sleepLogsCount) : 0;
    
    // Diet dominant pattern
    let dominantDiet = "Not enough data";
    if (dietSummary.good + dietSummary.okay + dietSummary.poor > 0) {
       if (dietSummary.good >= dietSummary.okay && dietSummary.good >= dietSummary.poor) dominantDiet = "Mostly Healthy";
       else if (dietSummary.poor >= dietSummary.good && dietSummary.poor >= dietSummary.okay) dominantDiet = "Mostly Unhealthy";
       else dominantDiet = "Mixed";
    }

    return {
      moodCounts: topMoods,
      symptomCounts: topSymptoms,
      workoutDays,
      topWorkoutName: topWorkout ? topWorkout[0] : null,
      dietSummary,
      dominantDiet,
      avgSleepMins,
      sleepLogsCount,
      completedCheckins,
      possibleCheckins,
      uniqueLoggedDays: uniqueDaysSet.size
    };
  }, [checkIns, windowDays]);

  const medicalReport = useMemo(() => {
    return generateMedicalReport(stats, predictionsData, windowDays, checkIns);
  }, [stats, predictionsData, windowDays, checkIns]);

  const healthFlagsState = useMemo(() => {
    return getHealthAwarenessFlags(checkIns, predictionsData);
  }, [checkIns, predictionsData]);

  const formatMinsToHours = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-6 pb-6 animate-in fade-in">
      <header className="flex flex-col space-y-2">
        <h1 className="text-3xl font-serif font-bold text-primary">Your Insights</h1>
        <p className="text-muted-foreground font-medium">Weekly summary of your body and mind.</p>
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
            Log your moods, symptoms, and check-ins to see your weekly summary here.
          </p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          
          {/* Mood Summary */}
          <motion.div variants={itemVariants} className="glass-card bg-gradient-to-br from-indigo-50/80 to-blue-50/80 p-5 rounded-[28px] shadow-sm border border-indigo-100/50 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-2 text-indigo-700 mb-4">
              <Brain className="w-5 h-5" />
              <h3 className="font-semibold text-sm uppercase tracking-wider">Mood Summary</h3>
            </div>
            {stats.moodCounts.length > 0 ? (
              <div className="flex-1 flex flex-col justify-center">
                <div className="mb-4">
                   <p className="text-sm text-indigo-800 font-medium mb-1">Most Frequent</p>
                   <p className="text-3xl font-serif font-bold text-indigo-900 capitalize">{stats.moodCounts[0][0].replace('_', ' ')}</p>
                </div>
                <div className="space-y-2 mt-auto">
                  {stats.moodCounts.slice(0, 3).map(([mood, count], i) => (
                    <div key={i} className="flex justify-between items-center text-sm font-medium text-indigo-900/80">
                      <span className="capitalize">{mood.replace('_', ' ')}</span>
                      <span className="bg-white/80 backdrop-blur-md px-2 py-0.5 rounded-md shadow-sm border border-white">{count} {count === 1 ? 'day' : 'days'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm font-medium text-indigo-600/60 p-4 bg-white/30 rounded-2xl border border-indigo-200/50">
                Not enough data yet
              </div>
            )}
          </motion.div>

          {/* Sleep Summary */}
          <motion.div variants={itemVariants} className="glass-card bg-gradient-to-br from-slate-800/90 to-slate-900/90 p-5 rounded-[28px] shadow-sm border border-slate-700 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-2 text-blue-300 mb-4">
              <Moon className="w-5 h-5" />
              <h3 className="font-semibold text-sm uppercase tracking-wider">Sleep Summary</h3>
            </div>
            {stats.sleepLogsCount > 0 ? (
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-sm text-slate-400 font-medium mb-1">Average Duration</p>
                <p className="text-4xl font-serif font-bold text-white mb-2">{formatMinsToHours(stats.avgSleepMins)}</p>
                <div className="mt-auto">
                   <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-bold border border-blue-500/30">
                     {stats.sleepLogsCount} nights logged
                   </span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm font-medium text-slate-400 p-4 bg-white/5 rounded-2xl border border-slate-700/50">
                Not enough data yet
              </div>
            )}
          </motion.div>

          {/* Symptom Summary */}
          <motion.div variants={itemVariants} className="glass-card bg-card/80 p-5 rounded-[28px] shadow-sm border border-muted/20 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-2 text-rose-500 mb-4">
              <Activity className="w-5 h-5" />
              <h3 className="font-semibold text-sm uppercase tracking-wider">Symptom Summary</h3>
            </div>
            {stats.symptomCounts.length > 0 ? (
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-medium mb-3">Most Common Symptoms</p>
                <div className="flex flex-wrap gap-2">
                  {stats.symptomCounts.map(([symp, count], i) => (
                    <div key={i} className="px-3 py-2 bg-rose-50/80 backdrop-blur-md rounded-xl text-sm font-medium flex items-center text-rose-900 border border-rose-100 shadow-sm">
                      <span className="capitalize">{symp.replace('_', ' ')}</span>
                      <span className="ml-2 text-rose-500 text-xs bg-white px-1.5 py-0.5 rounded-md shadow-sm font-bold border border-rose-100">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm font-medium text-muted-foreground p-4 bg-muted/20 rounded-2xl border border-muted/10">
                Not enough data yet
              </div>
            )}
          </motion.div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Workout Summary */}
            <motion.div variants={itemVariants} className="glass-card bg-gradient-to-br from-orange-50/80 to-amber-50/80 p-5 rounded-[28px] shadow-sm border border-orange-100/50 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 text-orange-600 mb-3">
                <Dumbbell className="w-4 h-4" />
                <h3 className="font-semibold text-[11px] uppercase tracking-wider">Workouts</h3>
              </div>
              {stats.workoutDays > 0 ? (
                <div className="flex-1 flex flex-col justify-end">
                  <p className="text-3xl font-serif font-bold text-orange-900 mb-1">{stats.workoutDays} <span className="text-lg text-orange-700/70 font-medium">days</span></p>
                  <p className="text-xs text-orange-800 font-medium capitalize truncate">Top: {stats.topWorkoutName}</p>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-center font-medium text-orange-600/60 p-2 bg-white/40 rounded-xl border border-orange-200/50">
                  No data
                </div>
              )}
            </motion.div>

            {/* Diet Summary */}
            <motion.div variants={itemVariants} className="glass-card bg-gradient-to-br from-emerald-50/80 to-teal-50/80 p-5 rounded-[28px] shadow-sm border border-emerald-100/50 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 text-emerald-600 mb-3">
                <Apple className="w-4 h-4" />
                <h3 className="font-semibold text-[11px] uppercase tracking-wider">Nutrition</h3>
              </div>
              {stats.dietSummary.good + stats.dietSummary.okay + stats.dietSummary.poor > 0 ? (
                <div className="flex-1 flex flex-col justify-end">
                  <p className="text-xl font-serif font-bold text-emerald-900 mb-1 leading-tight">{stats.dominantDiet}</p>
                  <p className="text-xs text-emerald-800 font-medium">{stats.dietSummary.good} healthy days</p>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-xs text-center font-medium text-emerald-600/60 p-2 bg-white/40 rounded-xl border border-emerald-200/50">
                  No data
                </div>
              )}
            </motion.div>
          </div>

          {/* Check-in Streak */}
          <motion.div variants={itemVariants} className="md:col-span-2 glass-card bg-gradient-to-r from-primary/10 to-accent/10 p-5 rounded-[28px] shadow-sm border border-primary/20 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center space-x-2 text-primary mb-2">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-semibold text-sm uppercase tracking-wider">Check-in Completion</h3>
              </div>
              <p className="text-sm text-foreground/80 font-medium max-w-[200px]">
                You completed {stats.completedCheckins} out of {stats.possibleCheckins} possible check-ins this period.
              </p>
            </div>
            <div className="relative w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center border border-primary/10">
               <svg className="absolute inset-0 w-full h-full -rotate-90 transform">
                <circle cx="40" cy="40" r="36" className="stroke-primary/20" strokeWidth="8" fill="none" />
                <motion.circle 
                  cx="40" cy="40" r="36" 
                  className="stroke-primary" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeLinecap="round"
                  initial={{ strokeDasharray: "226.2", strokeDashoffset: "226.2" }}
                  animate={{ strokeDashoffset: 226.2 - (226.2 * (stats.completedCheckins / stats.possibleCheckins || 0)) }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                />
              </svg>
              <span className="text-xl font-bold text-primary z-10">
                {Math.round((stats.completedCheckins / (stats.possibleCheckins || 1)) * 100)}%
              </span>
            </div>
          </motion.div>

          {/* Symptom Relief Guide */}
          {todaySymptoms.length > 0 && (
            <motion.div variants={itemVariants} className="md:col-span-2 glass-card bg-gradient-to-br from-rose-50/80 to-pink-50/80 p-5 rounded-[28px] shadow-sm border border-rose-100/50 flex flex-col hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 text-rose-700 mb-4">
                <Activity className="w-5 h-5" />
                <h3 className="font-semibold text-sm uppercase tracking-wider">Today's Symptom Relief Guide</h3>
              </div>
              
              <div className="space-y-3">
                {todaySymptoms.map((sympId, idx) => {
                  const tipInfo = getSymptomTip(sympId, currentCycleDay);
                  return (
                    <div key={idx} className="bg-white/80 backdrop-blur-md p-4 rounded-xl border border-rose-100 shadow-sm">
                      <p className="text-sm font-bold text-rose-900 mb-1">
                        Since you logged <span className="lowercase">{tipInfo.label}</span>...
                      </p>
                      <p className="text-sm text-rose-800/90 leading-relaxed font-medium">
                        {tipInfo.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Worth Knowing Card */}
          <motion.div variants={itemVariants} className="md:col-span-2 glass-card bg-gradient-to-br from-purple-50/80 to-fuchsia-50/80 p-5 rounded-[28px] shadow-sm border border-purple-100/50 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-center space-x-2 text-purple-700 mb-4">
              <AlertCircle className="w-5 h-5" />
              <h3 className="font-semibold text-sm uppercase tracking-wider">Worth knowing</h3>
            </div>
            
            <div className="flex-1">
              {!healthFlagsState.hasEnoughData ? (
                <div className="text-sm font-medium text-purple-600/60 p-4 bg-white/30 rounded-2xl border border-purple-200/50 text-center">
                  Not enough data yet to flag patterns.
                </div>
              ) : healthFlagsState.flags.length === 0 ? (
                <div className="text-sm font-medium text-purple-700 p-4 bg-white/50 rounded-2xl border border-purple-200/50 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2 text-purple-500" />
                  Nothing unusual flagged this week.
                </div>
              ) : (
                <ul className="space-y-3">
                  {healthFlagsState.flags.map((flag, idx) => (
                    <li key={idx} className="bg-white/80 backdrop-blur-md p-3 rounded-xl border border-purple-100 shadow-sm flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 mr-3 shrink-0" />
                      <p className="text-sm text-purple-900 leading-relaxed font-medium">
                        {flag.message}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-purple-200/40">
              <p className="text-[10px] uppercase tracking-widest text-purple-700/60 font-bold leading-tight">
                These are general patterns based on widely-used health guidelines, not a diagnosis. If anything here concerns you, please talk to a doctor.
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2 pt-4">
            {stats.uniqueLoggedDays >= (
              windowDays === 7 ? 4 : windowDays === 14 ? 8 : windowDays === 21 ? 12 : 17
            ) ? (
              <button
                onClick={() => setShowReport(true)}
                className="w-full bg-primary/10 text-primary py-4 rounded-2xl font-bold text-lg hover:bg-primary/20 transition-all flex items-center justify-center shadow-sm"
              >
                <Stethoscope className="w-5 h-5 mr-2" />
                Generate Clinical Report
              </button>
            ) : (
              <div className="w-full bg-muted/10 border border-muted/20 py-4 px-6 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
                <div className="flex items-center text-muted-foreground/80 mb-2">
                  <Lock className="w-5 h-5 mr-2" />
                  <span className="font-bold text-sm uppercase tracking-wider">Report Locked</span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  Log a few more days to unlock your {windowDays}-day report — you've logged {stats.uniqueLoggedDays} of the {windowDays === 7 ? 4 : windowDays === 14 ? 8 : windowDays === 21 ? 12 : 17} days needed.
                </p>
              </div>
            )}
          </motion.div>

        </motion.div>
      )}

      {/* Report Modal */}
      <AnimatePresence>
        {showReport && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-md bg-card border border-muted/20 rounded-[32px] shadow-xl overflow-hidden flex flex-col max-h-[85vh]"
            >
              <div className="p-6 bg-primary/5 border-b border-primary/10 flex justify-between items-start shrink-0">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-primary flex items-center">
                    <Stethoscope className="w-6 h-6 mr-2" />
                    Clinical Report
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">{windowDays}-Day Health Overview</p>
                </div>
                <button 
                  onClick={() => setShowReport(false)}
                  className="p-2 bg-white/50 rounded-full hover:bg-white text-muted-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
                {medicalReport.map((section, idx) => (
                  <div key={idx} className="space-y-2">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-primary">{section.title}</h3>
                    <p className="text-foreground/90 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-muted/20 border-t border-muted/10 shrink-0 text-center">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold leading-tight">
                  Disclaimer: This report is generated algorithmically based on self-reported data and does not constitute medical advice.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
