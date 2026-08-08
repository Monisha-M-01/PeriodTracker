import React, { useEffect, useRef } from 'react';
import { User, Calendar, Droplets, Activity, CheckCircle, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format, differenceInDays, differenceInCalendarDays, subDays, addDays, isSameDay, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { getPredictionsFn } from '../../api/cycles.api';
import { getPeriodsFn, logPeriodFn, deletePeriodFn } from '../../api/period.api';
import { getTodayCheckInFn } from '../../api/checkins.api';
import { Spinner } from '../../components/ui/Spinner';
import { WeatherTheme } from '../../components/ui/WeatherTheme';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '../../components/ui/Skeleton';
import { AnimatedNumber } from '../../components/ui/AnimatedNumber';
import { useHaptics } from '../../hooks/useHaptics';
const INSIGHT_TIPS = [
  { emoji: '🌙', title: 'Sleep Hygiene', text: 'Going to bed at the same time every day helps regulate your circadian rhythm and improves sleep quality.' },
  { emoji: '💧', title: 'Hydration', text: 'Drinking enough water can help reduce bloating and fatigue, especially during your period.' },
  { emoji: '🧘', title: 'Stress Relief', text: 'Just 10 minutes of deep breathing or meditation can significantly lower your cortisol levels.' },
  { emoji: '🥑', title: 'Nutrition', text: 'Foods rich in magnesium, like dark chocolate and spinach, can help alleviate menstrual cramps.' },
  { emoji: '🚶', title: 'Movement', text: 'Light exercise like walking or yoga can boost endorphins and relieve mild period pain.' },
  { emoji: '☀️', title: 'Morning Light', text: 'Getting sunlight in your eyes first thing in the morning sets your biological clock for better sleep.' },
  { emoji: '🛁', title: 'Self-Care', text: 'A warm bath before bed can relax your muscles and signal to your body that it\'s time to wind down.' },
  { emoji: '🧠', title: 'Mental Check-in', text: 'Taking a moment to write down your thoughts can clear mental clutter and reduce anxiety.' },
  { emoji: '🍎', title: 'Snack Smart', text: 'Pairing carbs with protein helps keep your blood sugar stable throughout the day.' },
  { emoji: '📱', title: 'Digital Detox', text: 'Putting your phone away an hour before bed can drastically improve how quickly you fall asleep.' },
  { emoji: '☕', title: 'Caffeine Check', text: 'Try to stop drinking caffeine by 2 PM to ensure deep, restorative sleep tonight.' },
  { emoji: '🌳', title: 'Nature Time', text: 'Spending just 15 minutes in a green space lowers cortisol levels.' },
  { emoji: '✍️', title: 'Gratitude', text: 'Writing down 3 things you are grateful for can rewire your brain for positivity.' }
];

const PERIOD_FLOW_TIPS: Record<number, string> = {
  1: "Your period starts. Estrogen and progesterone are at their lowest. You may feel tired—rest up.",
  2: "Bleeding is usually heaviest today. Keep hydrating and don't push yourself too hard.",
  3: "Hormone levels are starting to slowly rise. You might begin feeling a tiny lift in energy.",
  4: "Your period is wrapping up. Gentle stretching can help relieve any lingering stiffness.",
  5: "Your uterine lining is shedding its final layers. Estrogen is on the upswing.",
};

const POST_PERIOD_TIPS: Record<number, string> = {
  1: "Welcome to the follicular phase! Rising estrogen means rising energy and sharper focus.",
  2: "Estrogen continues to climb. This is a great time to tackle complex tasks or start new projects.",
  3: "Your brain is highly primed for learning and socializing right now. Enjoy the outgoing energy.",
  4: "Testosterone starts a slow rise, which can boost your confidence and energy levels.",
  5: "You are approaching your peak energy window. High-intensity workouts might feel amazing today.",
  6: "Estrogen is nearing its peak. You might notice your skin looking clearer and glowing.",
  7: "Cervical fluid becomes clearer—a sign your body is preparing for ovulation.",
  8: "Estrogen peaks! You are likely feeling your most sociable, articulate, and energized.",
  9: "Ovulation day (approximate). An egg is released. You might feel a slight twinge in your pelvis.",
  10: "The egg is traveling down the fallopian tube. Progesterone production begins.",
  11: "Welcome to the luteal phase. Progesterone rises, which can have a calming, sedative effect.",
  12: "You might feel your energy shift inward. It's a great time for solo work and organization.",
  13: "Progesterone is high, which can slow digestion. Make sure you are eating plenty of fiber.",
  14: "Your basal body temperature is elevated. You might feel warmer than usual.",
  15: "Estrogen gets a secondary, smaller peak. You might feel a brief return of energy.",
  16: "Progesterone peaks. You may feel deeply relaxed or slightly sluggish. Honor your pace.",
  17: "If no pregnancy occurred, hormones start their steep drop. This is when PMS can begin.",
  18: "Falling hormones can trigger sugar cravings. Try pairing sweet fruits with protein.",
  19: "You might feel more sensitive or irritable. Prioritize self-care and protect your peace.",
  20: "Energy levels drop. Swap intense workouts for yoga, walking, or gentle stretching.",
  21: "Water retention might start. Keep drinking water and limit salty, processed foods.",
  22: "Your uterus is preparing to shed its lining. You may feel pelvic heaviness or mild cramps.",
  23: "The final day of your cycle. Rest, hydrate, and prepare for day 1 tomorrow."
};

export default function TodayScreen() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const shouldReduceMotion = useReducedMotion();
  const triggerHaptic = useHaptics();
  const today = new Date();
  const todayIso = format(today, 'yyyy-MM-dd');
  
  const { data: predictionsData, isLoading: isLoadingPreds } = useQuery({
    queryKey: ['predictions'],
    queryFn: getPredictionsFn,
  });

  const { data: periodsData, isLoading: isLoadingPeriods } = useQuery({
    queryKey: ['periods'],
    queryFn: getPeriodsFn,
  });

  const { data: todayCheckIn, isLoading: isLoadingCheckIn } = useQuery({
    queryKey: ['checkins', 'today'],
    queryFn: getTodayCheckInFn
  });

  const logStartingToday = periodsData?.data?.find(log => isSameDay(new Date(log.startDate), today));
  const isPeriodLoggedToday = periodsData?.data?.some(log => {
    const start = startOfDay(new Date(log.startDate));
    const end = log.endDate ? endOfDay(new Date(log.endDate)) : endOfDay(new Date(log.startDate));
    return isWithinInterval(today, { start, end });
  });

  const togglePeriodMutation = useMutation({
    mutationFn: async () => {
      if (logStartingToday) {
        return deletePeriodFn(logStartingToday.id);
      } else {
        return logPeriodFn({ startDate: new Date().toISOString() });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['periods'] });
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
    }
  });



  if (isLoadingPreds || isLoadingPeriods || isLoadingCheckIn) {
    return (
      <div className="space-y-6 pb-6">
        <Skeleton className="w-full h-[280px] rounded-[2rem]" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-[120px] rounded-2xl" />
          <Skeleton className="h-[120px] rounded-2xl" />
          <Skeleton className="h-[120px] rounded-2xl" />
        </div>
        <Skeleton className="w-full h-[180px] rounded-2xl" />
      </div>
    );
  }

  const predictions = predictionsData?.data?.predictions;
  const history = predictionsData?.data?.history;
  const periodLogs = periodsData?.data || [];

  // Generate week strip: 2 days before, today, 11 days after
  const weekDays = Array.from({ length: 14 }).map((_, i) => {
    const d = addDays(subDays(today, 2), i);
    
    // Check if d is within any logged period
    const hasLog = periodLogs.some(log => {
      const start = startOfDay(new Date(log.startDate));
      const end = log.endDate ? endOfDay(new Date(log.endDate)) : endOfDay(new Date(log.startDate));
      return isWithinInterval(d, { start, end });
    });

    return {
      dateObj: d,
      day: format(d, 'eeeee'), // e.g. M, T, W
      date: d.getDate(),
      isToday: isSameDay(d, today),
      hasLog,
      checkedIn: false // Would require fetching checkins list
    };
  });

  const daysUntilNext = predictions ? differenceInDays(new Date(predictions.nextPeriodStart), today) : null;
  const todayStr = format(today, 'd MMMM');

  // Weather Effect Logic
  let moods: string[] = [];
  const hour = today.getHours();
  const isEvening = hour >= 18 || hour < 6; // Evening / Night (6pm - 6am)
  if (todayCheckIn?.data?.moodString) {
    try {
      moods = JSON.parse(todayCheckIn.data.moodString);
    } catch (e) {
      // Ignore parse error
    }
  }

  // Pick 3 random tips based on today's date so they stay consistent all day
  const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const tip1Index = daySeed % INSIGHT_TIPS.length;
  const tip2Index = (daySeed + 5) % INSIGHT_TIPS.length; 
  const tip3Index = (daySeed + 11) % INSIGHT_TIPS.length; 
  const dailyTips = [INSIGHT_TIPS[tip1Index], INSIGHT_TIPS[tip2Index], INSIGHT_TIPS[tip3Index]];

  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const cycleLength = history?.avgCycleLength || 28;
  const currentDay = (history && history.lastPeriodStartDate) ? differenceInCalendarDays(today, new Date(history.lastPeriodStartDate)) + 1 : 1;
  const progressPercentage = Math.min(Math.max((currentDay / cycleLength) * 100, 0), 100);
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  const mostRecentPeriod = [...periodLogs].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];
  let displayDay = 1;
  let displayLabel = "Cycle Day";
  let displayTip = "";

  if (isPeriodLoggedToday && mostRecentPeriod) {
    displayDay = differenceInCalendarDays(today, startOfDay(new Date(mostRecentPeriod.startDate))) + 1;
    displayLabel = "Period Day";
    displayTip = PERIOD_FLOW_TIPS[Math.min(displayDay, 5)] || "Your period is ongoing. Remember to rest and hydrate.";
  } else {
    if (mostRecentPeriod) {
      const endDate = mostRecentPeriod.endDate ? endOfDay(new Date(mostRecentPeriod.endDate)) : endOfDay(new Date(mostRecentPeriod.startDate));
      displayDay = Math.max(1, differenceInCalendarDays(today, endDate));
    } else {
      displayDay = 1;
    }
    displayLabel = "Cycle Day";
    displayTip = POST_PERIOD_TIPS[Math.min(displayDay, 23)] || "Your body is resetting for the next cycle. Listen to your body and prioritize self-care.";
  }

  return (
    <motion.div 
      className="space-y-6 pb-6 relative"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Weather Overlay */}
      {isEvening && moods.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <WeatherTheme moods={moods} />
        </div>
      )}
      
      {/* Top Bar */}
      <motion.header variants={itemVariants} className="flex items-center justify-between mb-2 md:hidden">
        <div className="w-9" /> {/* Spacer to keep date centered */}
        <h2 className="text-lg font-serif font-semibold">{todayStr}</h2>
        <button 
          onClick={() => navigate('/calendar')}
          className="p-2 rounded-full bg-card shadow-sm border border-muted/20 text-muted-foreground hover:text-primary transition-colors"
        >
          <Calendar className="w-5 h-5 stroke-[1.5]" />
        </button>
      </motion.header>

      {/* Desktop Top Bar Equivalent */}
      <motion.header variants={itemVariants} className="hidden md:flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-primary">Today, {todayStr}</h2>
        <div className="flex space-x-2">
          <button onClick={() => navigate('/calendar')} className="p-2 text-muted-foreground hover:text-primary">
            <Calendar className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>
      </motion.header>

      {/* Week Strip */}
      <section 
        className="flex overflow-x-auto hide-scrollbar space-x-6 px-4 snap-x snap-mandatory py-2 -mx-4 md:mx-0"
      >
        {weekDays.map((d, i) => (
          <div key={i} data-today={d.isToday} className="flex flex-col items-center space-y-2 snap-center shrink-0 min-w-[40px]">
            <span className="text-xs font-medium text-muted-foreground">{d.day}</span>
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold relative transition-colors cursor-pointer",
              d.isToday 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-card text-foreground border border-muted/20 hover:border-primary/50"
            )}>
              {d.date}
              {d.hasLog && (
                <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </div>
            {d.checkedIn && (
              <span className="text-[10px]">✨</span>
            )}
          </div>
        ))}
      </section>

      {/* Hero Section */}
      <motion.div variants={itemVariants} className="relative w-full">
        {/* Progress Ring Background */}
        <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none scale-[1.02]">
          <svg className="w-[280px] h-[280px] -rotate-90">
            <circle cx="140" cy="140" r={radius} className="stroke-primary/20" strokeWidth="4" fill="none" />
            <motion.circle
              cx="140"
              cy="140"
              r={radius}
              className="stroke-primary"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
              strokeDasharray={circumference}
            />
          </svg>
        </div>

        <motion.section 
          animate={shouldReduceMotion ? {} : { 
            scale: [1, 1.02, 1],
            boxShadow: [
              "0 8px 32px rgba(193, 95, 60, 0.05)",
              "0 16px 48px rgba(193, 95, 60, 0.12)",
              "0 8px 32px rgba(193, 95, 60, 0.05)"
            ]
          }}
          transition={shouldReduceMotion ? {} : { duration: 6, ease: "easeInOut", repeat: Infinity }}
          className="glass-card animate-pulse-glow rounded-[2rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden w-full h-[280px]"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 relative z-10">Follicular Phase</h3>
          
          {predictions ? (
            <div className="relative z-10">
              <p className="text-2xl font-serif text-foreground">
                {daysUntilNext! > 0 ? "Period in" : daysUntilNext! === 0 ? "Period expected" : "Period is"}
              </p>
              <div className="text-8xl font-serif font-bold text-primary my-4 drop-shadow-sm leading-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                >
                  {daysUntilNext! === 0 ? "Today" : <AnimatedNumber value={Math.abs(daysUntilNext!)} />}
                </motion.div>
              </div>
              {daysUntilNext! !== 0 && (
                <p className="text-xl font-serif text-foreground">{daysUntilNext! < 0 ? "days late" : "days"}</p>
              )}
            </div>
          ) : (
            <div className="relative z-10">
              <p className="text-xl font-serif text-foreground">No predictions yet</p>
              <p className="text-muted-foreground mt-2">Log your period to get insights</p>
            </div>
          )}
        </motion.section>
      </motion.div>

      {/* Quick Actions Row */}
      <motion.section variants={itemVariants} className="grid grid-cols-3 gap-4">
        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            triggerHaptic('medium');
            togglePeriodMutation.mutate();
          }}
          disabled={togglePeriodMutation.isPending}
          className={cn("glass-card glass-card-interactive flex flex-col items-center justify-center p-4 rounded-2xl transition-colors group", isPeriodLoggedToday ? "border-primary bg-primary/5" : "hover:border-primary/30")}
        >
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors", isPeriodLoggedToday ? "bg-primary text-primary-foreground shadow-sm" : "bg-primary/10 group-hover:bg-primary/20 text-primary")}>
            {isPeriodLoggedToday ? <CheckCircle className="w-6 h-6 stroke-[1.5]" /> : <Droplets className="w-6 h-6 stroke-[1.5]" />}
          </div>
          <span className={cn("text-sm font-medium", isPeriodLoggedToday ? "text-primary" : "text-foreground")}>
            {isPeriodLoggedToday ? 'Logged' : 'Log Period'}
          </span>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            triggerHaptic('selection');
            navigate('/log-symptom');
          }}
          className="glass-card glass-card-interactive flex flex-col items-center justify-center p-4 rounded-2xl hover:border-primary/30 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition-colors">
            <Activity className="w-6 h-6 text-secondary stroke-[1.5]" />
          </div>
          <span className="text-sm font-medium text-foreground">Log</span>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            triggerHaptic('selection');
            navigate('/checkin');
          }}
          className="glass-card glass-card-interactive flex flex-col items-center justify-center p-4 rounded-2xl hover:border-primary/30 transition-colors group"
        >
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
            <CheckCircle className="w-6 h-6 text-accent stroke-[1.5]" />
          </div>
          <span className="text-sm font-medium text-foreground">Check-in</span>
        </motion.button>
      </motion.section>

      {/* Daily Insights Row */}
      <motion.section variants={itemVariants} className="pt-2">
        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="font-serif font-semibold text-lg">Daily Insights</h3>
          <button className="text-sm font-medium text-primary flex items-center">
            See all <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="min-w-[240px] snap-center glass-card p-5 rounded-2xl flex flex-col justify-between border-primary/20"
          >
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xl">✨</span>
              <h4 className="font-medium text-primary flex items-center gap-1">
                <span>{displayLabel}</span>
                <span className="ml-1"><AnimatedNumber value={displayDay} /></span>
              </h4>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed font-medium">
              {displayTip}
            </p>
          </motion.div>

          {dailyTips.map((tip, idx) => (
            <motion.div 
              key={idx} 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="min-w-[240px] snap-center glass-card p-5 rounded-2xl flex flex-col justify-between"
            >
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-xl">{tip.emoji}</span>
                <h4 className="font-medium text-foreground">{tip.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{tip.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}
