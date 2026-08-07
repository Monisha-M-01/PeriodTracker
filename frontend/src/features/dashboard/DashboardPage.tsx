import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPredictionsFn } from '../../api/cycles.api';
import { Card, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';
import { format, differenceInDays } from 'date-fns';
import { Droplet, CalendarHeart, AlertCircle, Sparkles, SmilePlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['predictions'],
    queryFn: getPredictionsFn,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size={32} />
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="text-center p-8 bg-destructive/10 rounded-[32px] text-destructive">
        <AlertCircle className="mx-auto mb-2 h-8 w-8" strokeWidth={1.5} />
        <p className="font-medium">Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }

  const { predictions, history } = data.data;

  // Empty state if no data logged yet
  if (!predictions) {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-serif font-bold text-primary">Overview</h1>
        <Card className="bg-card border-none shadow-sm rounded-[32px] p-2">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="bg-accent/50 p-6 rounded-full mb-6">
              <CalendarHeart className="h-12 w-12 text-primary opacity-80" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-serif font-semibold mb-3 text-foreground">No cycles logged yet</h2>
            <p className="text-muted-foreground max-w-sm mb-8 text-lg">
              Start tracking by logging your first period to see predictions, history, and insights about your cycle.
            </p>
            <Link to="/calendar" className="bg-primary text-primary-foreground px-8 py-4 rounded-full shadow-md hover:-translate-y-1 hover:shadow-lg font-medium transition-all">
              Log First Period
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate current cycle day
  const today = new Date();
  const lastPeriodStart = new Date(history.lastPeriodStartDate);
  const cycleDay = differenceInDays(today, lastPeriodStart) + 1;
  const daysUntilNext = differenceInDays(new Date(predictions.nextPeriodStart), today);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      
      {/* Header section */}
      <div className="flex flex-col space-y-1">
        <p className="text-muted-foreground font-medium uppercase tracking-widest text-xs ml-1">Today</p>
        <h1 className="text-5xl font-serif font-bold tracking-tight text-foreground">
          {format(today, 'EEEE, MMM do')}
        </h1>
      </div>

      {/* Main Status Card (Editorial style) */}
      <Card className="bg-card border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[32px] overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary/20"></div>
        <CardContent className="p-8 md:p-10 flex flex-col items-center text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/40 text-primary rounded-full text-sm font-semibold mb-6">
            <Sparkles size={16} strokeWidth={2} />
            <span>Follicular Phase</span> {/* Example static phase name, ideally derived from data */}
          </div>
          
          <h2 className="text-muted-foreground text-lg mb-2 font-medium">Cycle Day</h2>
          <div className="text-[7rem] leading-none font-serif font-bold text-primary mb-4 tracking-tighter">
            {cycleDay}
          </div>
          
          <p className="text-muted-foreground/80 max-w-xs mx-auto mb-8">
            You might be feeling a subtle shift in energy today.
          </p>

          <Link to="/checkin" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-foreground text-card px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-medium text-lg">
            <SmilePlus size={20} strokeWidth={2} />
            Log today
          </Link>
        </CardContent>
      </Card>

      {/* Dual Panel Comparison Card Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Next Period Card */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card className="border-none bg-card glass-card-interactive shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-[28px]">
            <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-destructive/10 p-3 rounded-2xl text-destructive">
                <Droplet className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground">Next Period</h3>
            </div>
            
            <div className="mt-2">
              <div className="text-4xl font-serif font-bold text-foreground mb-1">
                {format(new Date(predictions.nextPeriodStart), 'MMM d')}
              </div>
              <p className="text-muted-foreground font-medium text-base">
                {daysUntilNext > 0 ? `In ${daysUntilNext} days` : daysUntilNext === 0 ? 'Expected today' : `${Math.abs(daysUntilNext)} days late`}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-muted/50">
              <p className="text-sm text-muted-foreground">
                Average cycle length: <span className="font-semibold text-foreground">{history.avgPeriodLength} days</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

        {/* Fertile Window Card */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Card className="border-none bg-card glass-card-interactive shadow-[0_4px_20px_rgb(0,0,0,0.03)] rounded-[28px]">
            <CardContent className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                <CalendarHeart className="h-6 w-6" strokeWidth={2} />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground">Fertile Window</h3>
            </div>
            
            <div className="mt-2">
              <div className="text-4xl font-serif font-bold text-foreground mb-1 flex items-baseline gap-2">
                {format(new Date(predictions.fertileWindowStart), 'd')} 
                <span className="text-2xl text-muted-foreground">-</span> 
                {format(new Date(predictions.fertileWindowEnd), 'd')}
                <span className="text-lg text-muted-foreground font-sans ml-1">{format(new Date(predictions.fertileWindowStart), 'MMM')}</span>
              </div>
              <p className="text-primary/80 font-medium text-base">
                Approaching fertility
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-muted/50">
              <p className="text-sm text-muted-foreground">
                Ovulation expected around <span className="font-semibold text-foreground">{format(new Date(predictions.ovulationDate), 'MMM d')}</span>
              </p>
            </div>
          </CardContent>
          </Card>
        </motion.div>
      </div>

    </div>
  );
}
