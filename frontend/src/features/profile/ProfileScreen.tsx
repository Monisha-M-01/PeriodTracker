import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getPredictionsFn } from '../../api/cycles.api';
import { getPeriodsFn } from '../../api/period.api';
import { getCheckInsFn } from '../../api/checkins.api';
import { Card, CardContent } from '../../components/ui/Card';
import { format, subDays, isSameDay } from 'date-fns';
import { User, Mail, Calendar, Activity, Trophy, Flame } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';

export default function ProfileScreen() {
  const { user } = useAuth();
  const today = new Date();
  const fromDate = format(subDays(today, 180), 'yyyy-MM-dd');
  const toDate = format(today, 'yyyy-MM-dd');

  const { data: predictionsData, isLoading: isLoadingPreds } = useQuery({ queryKey: ['predictions'], queryFn: getPredictionsFn });
  const { data: periodsData, isLoading: isLoadingPeriods } = useQuery({ queryKey: ['periods'], queryFn: getPeriodsFn });
  const { data: checkInsData, isLoading: isLoadingCheckIns } = useQuery({ 
    queryKey: ['checkins', fromDate, toDate], 
    queryFn: () => getCheckInsFn(fromDate, toDate) 
  });

  if (isLoadingPreds || isLoadingPeriods || isLoadingCheckIns) {
    return <div className="flex justify-center h-[50vh] items-center"><Spinner size={32} /></div>;
  }

  // Calculate Streak
  let streak = 0;
  let currentDate = today;
  const checkIns = checkInsData?.data || [];
  
  // Check if there's a check-in today
  const hasToday = checkIns.some(c => isSameDay(new Date(c.date), currentDate));
  if (hasToday) streak++;
  
  // If no checkin today, we start checking from yesterday. 
  // If they have today, we also check backwards from yesterday.
  currentDate = subDays(today, 1);
  while (true) {
    const hasLog = checkIns.some(c => isSameDay(new Date(c.date), currentDate));
    if (hasLog) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }

  const history = predictionsData?.data?.history;
  const totalCycles = periodsData?.data?.length || 0;

  return (
    <div className="space-y-6 animate-in fade-in pb-24">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Profile</h1>

      <Card className="overflow-hidden border-none shadow-md">
        <div className="bg-primary/10 h-24 w-full"></div>
        <CardContent className="px-6 pb-6 pt-0 relative">
          <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center absolute -top-10 border-4 border-card shadow-sm">
            <User className="w-10 h-10" />
          </div>
          <div className="mt-12">
            <h2 className="text-xl font-bold text-foreground">Demo User</h2>
            <div className="flex items-center text-muted-foreground mt-1">
              <Mail className="w-4 h-4 mr-2" />
              <span>{user?.email || 'demo@example.com'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <h3 className="font-semibold text-lg text-foreground mt-8 mb-4 px-1">Cycle Averages</h3>
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card shadow-sm border-muted/20">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-foreground">{history?.avgCycleLength || 28}</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Day Cycle</span>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-sm border-muted/20">
          <CardContent className="p-4 flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-2">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold text-foreground">{history?.avgPeriodLength || 5}</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Day Period</span>
          </CardContent>
        </Card>
      </div>

      <h3 className="font-semibold text-lg text-foreground mt-8 mb-4 px-1">Quick Stats</h3>
      <div className="space-y-3">
        <Card className="bg-card shadow-sm border-muted/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mr-4">
                <Flame className="w-5 h-5" />
              </div>
              <span className="font-medium">Current Streak</span>
            </div>
            <span className="text-xl font-bold">{streak} {streak === 1 ? 'day' : 'days'}</span>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-sm border-muted/20">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mr-4">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="font-medium">Total Cycles Logged</span>
            </div>
            <span className="text-xl font-bold">{totalCycles}</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
