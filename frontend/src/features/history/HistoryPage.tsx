import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPredictionsFn } from '../../api/cycles.api';
import { getPeriodsFn } from '../../api/period.api';
import { Spinner } from '../../components/ui/Spinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Activity, Droplets } from 'lucide-react';
import type { PeriodLog } from '../../types';

export default function HistoryPage() {
  const { data: predData, isLoading: isLoadingPreds } = useQuery({ queryKey: ['predictions'], queryFn: getPredictionsFn });
  const { data: periodData, isLoading: isLoadingPeriods } = useQuery({ queryKey: ['periods'], queryFn: getPeriodsFn });

  if (isLoadingPreds || isLoadingPeriods) {
    return <div className="flex justify-center h-[50vh] items-center"><Spinner size={32} /></div>;
  }

  const history = predData?.data?.history;
  const periods = periodData?.data || [];

  const chartData = [];
  const sortedPeriods = [...periods].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  
  for (let i = 0; i < sortedPeriods.length - 1; i++) {
    const current = new Date(sortedPeriods[i].startDate);
    const next = new Date(sortedPeriods[i+1].startDate);
    chartData.push({
      name: format(current, 'MMM d'),
      length: differenceInDays(next, current),
    });
  }

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
        <h1 className="text-3xl font-serif font-bold text-primary">History & Trends</h1>
        <p className="text-muted-foreground font-medium">Your cycle patterns over time.</p>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <motion.div variants={itemVariants} className="glass-card bg-gradient-to-br from-primary/10 to-transparent p-5 rounded-[28px] border border-primary/20 shadow-sm flex flex-col items-center justify-center text-center">
            <Calendar className="w-6 h-6 text-primary mb-2 opacity-80" />
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Avg Cycle</p>
            <p className="text-3xl font-serif font-bold text-foreground">{history?.avgCycleLength || '--'} <span className="text-lg font-medium text-muted-foreground">days</span></p>
          </motion.div>
          <motion.div variants={itemVariants} className="glass-card bg-gradient-to-br from-rose-50/80 to-transparent p-5 rounded-[28px] border border-rose-100/50 shadow-sm flex flex-col items-center justify-center text-center">
            <Droplets className="w-6 h-6 text-rose-400 mb-2 opacity-80" />
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Avg Period</p>
            <p className="text-3xl font-serif font-bold text-foreground">{history?.avgPeriodLength || '--'} <span className="text-lg font-medium text-muted-foreground">days</span></p>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="glass-card bg-card p-6 rounded-[28px] border border-muted/20 shadow-sm">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-serif font-semibold text-foreground">Cycle Length Trends</h2>
          </div>
          <div className="h-64 w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: '1px solid rgba(193,95,60,0.2)', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', backgroundColor: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)' }}
                    itemStyle={{ color: '#1f2937', fontWeight: 'bold' }}
                    labelStyle={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}
                    formatter={(val: number) => [`${val} days`, 'Cycle Length']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="length" 
                    stroke="var(--color-primary)" 
                    strokeWidth={4} 
                    dot={{ r: 5, fill: '#fff', stroke: 'var(--color-primary)', strokeWidth: 2 }} 
                    activeDot={{ r: 7, strokeWidth: 0, fill: 'var(--color-primary)' }} 
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-sm bg-muted/10 rounded-2xl border border-dashed border-muted/30">
                <p>Log at least two cycles to see trends.</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="glass-card bg-card p-6 rounded-[28px] border border-muted/20 shadow-sm">
          <h2 className="text-lg font-serif font-semibold text-foreground mb-4">Past Cycles</h2>
          <div className="space-y-3">
            {[...sortedPeriods].reverse().map((period: PeriodLog, idx) => (
              <motion.div 
                whileHover={{ scale: 1.01 }}
                key={period.id} 
                className="flex justify-between items-center p-4 border border-muted/30 rounded-2xl bg-gradient-to-r from-card to-muted/10 transition-colors hover:border-primary/30"
              >
                <div>
                  <p className="font-semibold text-foreground">{format(new Date(period.startDate), 'MMMM d, yyyy')}</p>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">
                    {period.endDate ? `Ended on ${format(new Date(period.endDate), 'MMM d')}` : 'Currently active'}
                  </p>
                </div>
                {period.endDate && (
                  <div className="text-right">
                    <p className="font-bold text-primary bg-primary/10 px-3 py-1 rounded-full text-sm inline-block">
                      {differenceInDays(new Date(period.endDate), new Date(period.startDate)) + 1} days
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
            {sortedPeriods.length === 0 && (
              <p className="text-muted-foreground text-center py-8 text-sm">No past cycles logged yet.</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
