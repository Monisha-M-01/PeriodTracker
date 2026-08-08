import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { getPredictionsFn } from '../../api/cycles.api';
import { getPeriodsFn } from '../../api/period.api';
import { getCheckInsFn } from '../../api/checkins.api';
import { updateProfileFn } from '../../api/settings.api';
import { Card, CardContent } from '../../components/ui/Card';
import { format, subDays, isSameDay, startOfDay, endOfDay } from 'date-fns';
import { User, Mail, Calendar, Activity, Trophy, Flame, Edit2 } from 'lucide-react';
import { Spinner } from '../../components/ui/Spinner';

function ProfileEditDialog({ user, onSave, onClose }: any) {
  const [name, setName] = React.useState(user?.name || '');
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-card bg-card/95 rounded-[32px] p-6 w-full max-w-xs space-y-6 shadow-2xl border border-white/20"
      >
        <h3 className="text-xl font-serif font-bold text-foreground text-center">Edit Profile</h3>
        <div className="space-y-4">
          <input 
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!!user?.name}
            className={`w-full bg-white/50 backdrop-blur-sm border border-muted/30 rounded-2xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base font-medium shadow-inner ${!!user?.name ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>
        <div className="flex justify-between space-x-3 pt-2">
          <button onClick={onClose} className="flex-1 px-4 py-3 font-medium text-muted-foreground hover:bg-muted/10 rounded-xl transition-colors">Cancel</button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => onSave({ name })} 
            className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium shadow-md shadow-primary/20"
          >Save</motion.button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProfileScreen() {
  const { user, updateUser } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = React.useState(false);
  const today = new Date();
  const fromDate = startOfDay(subDays(today, 180)).toISOString();
  const toDate = endOfDay(today).toISOString();

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
    <div className="space-y-6 animate-in fade-in">

      <Card className="overflow-hidden border-none shadow-md">
        <div className="bg-primary/10 h-24 w-full"></div>
        <CardContent className="px-6 pb-6 pt-0 relative flex flex-col items-center">
          <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center absolute -top-10 left-1/2 -translate-x-1/2 border-4 border-card shadow-sm">
            <User className="w-10 h-10" />
            <button 
              className="absolute bottom-0 -right-2 bg-secondary text-secondary-foreground p-1.5 rounded-full shadow-md hover:scale-105 active:scale-95 transition-all"
              onClick={() => setIsEditingProfile(true)}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-14 flex flex-col items-center text-center">
            <h2 className="text-2xl font-bold text-foreground capitalize">
              {user?.name || (user?.email ? user.email.split('@')[0] : 'Guest')}
            </h2>
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

      <AnimatePresence>
        {isEditingProfile && (
          <ProfileEditDialog 
            user={user}
            onSave={async (val: any) => {
              try {
                await updateProfileFn({ name: val.name });
                updateUser({ name: val.name });
              } catch (e) {
                console.error("Failed to update profile", e);
              } finally {
                setIsEditingProfile(false);
              }
            }}
            onClose={() => setIsEditingProfile(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
