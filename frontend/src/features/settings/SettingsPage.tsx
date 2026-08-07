import React from 'react';
import { User, Bell, CalendarClock, Shield, LogOut, ChevronRight, Mail } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { getSettingsFn, updateSettingsFn } from '../../api/settings.api';
import { Spinner } from '../../components/ui/Spinner';
import ProfileScreen from '../profile/ProfileScreen';

function NumberEditDialog({ title, initialValue, min, max, onSave, onClose }: any) {
  const [val, setVal] = React.useState(initialValue);
  
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-card bg-card/95 rounded-[32px] p-6 w-full max-w-xs space-y-6 shadow-2xl border border-white/20"
      >
        <h3 className="text-xl font-serif font-bold text-foreground text-center">{title}</h3>
        <div className="flex items-center justify-between bg-muted/30 p-2 rounded-2xl border border-muted/50">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setVal(Math.max(min, val - 1))}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-background shadow-sm text-primary font-bold text-2xl"
          >-</motion.button>
          <span className="text-3xl font-bold font-serif text-primary">{val}</span>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setVal(Math.min(max, val + 1))}
            className="w-12 h-12 flex items-center justify-center rounded-xl bg-background shadow-sm text-primary font-bold text-2xl"
          >+</motion.button>
        </div>
        <div className="flex justify-between space-x-3 pt-2">
          <button onClick={onClose} className="flex-1 px-4 py-3 font-medium text-muted-foreground hover:bg-muted/10 rounded-xl transition-colors">Cancel</button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => onSave(val)} 
            className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium shadow-md shadow-primary/20"
          >Save</motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function TextEditDialog({ title, initialValue, onSave, onClose }: any) {
  const [val, setVal] = React.useState(initialValue);
  
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-card bg-card/95 rounded-[32px] p-6 w-full max-w-xs space-y-6 shadow-2xl border border-white/20"
      >
        <h3 className="text-xl font-serif font-bold text-foreground text-center">{title}</h3>
        <input 
          type="email"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="w-full bg-white/50 backdrop-blur-sm border border-muted/30 rounded-2xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base font-medium shadow-inner text-center"
        />
        <div className="flex justify-between space-x-3 pt-2">
          <button onClick={onClose} className="flex-1 px-4 py-3 font-medium text-muted-foreground hover:bg-muted/10 rounded-xl transition-colors">Cancel</button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => onSave(val)} 
            className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium shadow-md shadow-primary/20"
          >Save</motion.button>
        </div>
      </motion.div>
    </div>
  );
}

function PrivacyDialog({ onClose }: any) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass-card bg-card/95 rounded-[32px] p-6 w-full max-w-sm space-y-6 shadow-2xl border border-white/20"
      >
        <div className="flex justify-center mb-2">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-serif font-bold text-foreground text-center">Privacy & Data</h3>
        <p className="text-sm text-muted-foreground text-center">
          Your data is stored securely. We never sell your personal health data to third parties.
        </p>
        <div className="space-y-3 pt-2">
          <button className="w-full bg-muted/30 text-foreground px-4 py-3 rounded-xl font-medium flex items-center justify-between hover:bg-muted/50 transition-colors">
            <span>Export my data</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold bg-background px-2 py-1 rounded-md">Coming Soon</span>
          </button>
          <button className="w-full bg-destructive/10 text-destructive px-4 py-3 rounded-xl font-medium flex items-center justify-between hover:bg-destructive/20 transition-colors">
            <span>Delete my account</span>
            <span className="text-[10px] text-destructive/70 uppercase tracking-wider font-bold">Danger</span>
          </button>
        </div>
        <button 
          onClick={onClose} 
          className="w-full mt-4 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium shadow-md shadow-primary/20 hover:bg-primary/90 transition-colors"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}

export default function SettingsPage() {
  const { login, logout, user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [editingKey, setEditingKey] = React.useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate('/onboarding');
  };

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettingsFn,
  });

  const { mutate } = useMutation({
    mutationFn: updateSettingsFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-full min-h-[50vh]"><Spinner size={32} /></div>;
  }

  const settings = settingsData?.data;

  const SETTING_GROUPS: any[] = [
    {
      title: "Account",
      items: [
        { id: 'notifications', label: 'Notification preferences', icon: Bell, value: settings?.reminderNotificationsEnabled ? 'On' : 'Off' },
      ]
    },
    {
      title: "App Preferences",
      items: [
        { 
          id: 'cycle', 
          label: 'Typical cycle length', 
          icon: CalendarClock, 
          value: `${settings?.defaultCycleLength || 28} days`,
          action: () => setEditingKey('cycle')
        },
        { 
          id: 'period', 
          label: 'Typical period length', 
          icon: CalendarClock, 
          value: `${settings?.defaultPeriodLength || 5} days`,
          action: () => setEditingKey('period')
        }
      ]
    },
    {
      title: "Security & Data",
      items: [
        { id: 'privacy', label: 'Privacy/data', icon: Shield, action: () => setEditingKey('privacy') },
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-6 pb-6 h-full flex flex-col">
      <header className="flex flex-col space-y-2">
        <h1 className="text-3xl font-serif font-bold text-primary">Profile & Settings</h1>
      </header>

      <div className="flex-none -mx-2 px-2">
        <ProfileScreen />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6 flex-1 pt-2"
      >
        {SETTING_GROUPS.map((group, gIdx) => (
          <motion.div variants={itemVariants} key={gIdx} className="space-y-2">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 ml-2">
              {group.title}
            </h2>
            <div className="glass-card bg-card/80 rounded-3xl shadow-sm border border-muted/20 overflow-hidden divide-y divide-muted/10">
              {group.items.map((item: any) => (
                <button 
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/10 transition-colors text-left active:bg-muted/20"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-4.5 h-4.5 text-primary stroke-[1.5]" />
                    </div>
                    <span className="font-medium text-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.value && (
                      <span className="text-sm text-muted-foreground max-w-[120px] truncate">{item.value}</span>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground/40 stroke-[1.5]" />
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        ))}
        
        {/* Log Out Button */}
        <motion.div variants={itemVariants} className="pt-4">
          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full glass-card bg-card/80 p-4 rounded-3xl shadow-sm border border-muted/20 flex items-center justify-between hover:border-destructive/30 hover:bg-destructive/5 transition-all text-left text-destructive group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                <LogOut className="w-4.5 h-4.5 stroke-[1.5]" />
              </div>
              <span className="font-semibold">Log out</span>
            </div>
            <ChevronRight className="w-5 h-5 text-destructive/40 stroke-[1.5]" />
          </motion.button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {editingKey === 'email' && (
          <TextEditDialog 
            title="Edit Email Address"
            initialValue={user?.email || ''}
            onSave={(val: string) => {
              if (val) {
                login('dummy-token', { 
                  ...(user || { id: 'dummy', isVerified: true }), 
                  email: val,
                  name: user?.name || ''
                });
              }
              setEditingKey(null);
            }}
            onClose={() => setEditingKey(null)}
          />
        )}

        {editingKey === 'cycle' && (
          <NumberEditDialog 
            title="Typical Cycle Length"
            initialValue={settings?.defaultCycleLength || 28}
            min={15}
            max={90}
            onSave={(val: number) => {
              mutate({ defaultCycleLength: val });
              setEditingKey(null);
            }}
            onClose={() => setEditingKey(null)}
          />
        )}

        {editingKey === 'period' && (
          <NumberEditDialog 
            title="Typical Period Length"
            initialValue={settings?.defaultPeriodLength || 5}
            min={1}
            max={15}
            onSave={(val: number) => {
              mutate({ defaultPeriodLength: val });
              setEditingKey(null);
            }}
            onClose={() => setEditingKey(null)}
          />
        )}

        {editingKey === 'privacy' && (
          <PrivacyDialog onClose={() => setEditingKey(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
