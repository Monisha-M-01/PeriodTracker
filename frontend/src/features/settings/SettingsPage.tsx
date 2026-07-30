import React from 'react';
import { User, Bell, Palette, CalendarClock, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { getSettingsFn, updateSettingsFn } from '../../api/settings.api';
import { Spinner } from '../../components/ui/Spinner';

export default function SettingsPage() {
  const { logout, user } = useAuth();
  const queryClient = useQueryClient();

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
        { id: 'profile', label: 'Profile', icon: User, value: user?.email },
        { id: 'notifications', label: 'Notification preferences', icon: Bell, value: settings?.reminderNotificationsEnabled ? 'On' : 'Off' },
      ]
    },
    {
      title: "App Preferences",
      items: [
        { 
          id: 'theme', 
          label: 'Theme (Tap to toggle)', 
          icon: Palette, 
          value: settings?.theme || 'Calm',
          action: () => {
            const nextTheme = settings?.theme === 'Calm' ? 'Happy' : 'Calm';
            mutate({ theme: nextTheme });
          }
        },
        { 
          id: 'cycle', 
          label: 'Typical cycle length', 
          icon: CalendarClock, 
          value: `${settings?.defaultCycleLength || 28} days`,
          action: () => {
            const val = window.prompt("Enter your typical cycle length in days:", (settings?.defaultCycleLength || 28).toString());
            const parsed = parseInt(val || '', 10);
            if (!isNaN(parsed) && parsed > 10 && parsed < 100) {
              mutate({ defaultCycleLength: parsed });
            }
          }
        },
        { 
          id: 'period', 
          label: 'Typical period length', 
          icon: CalendarClock, 
          value: `${settings?.defaultPeriodLength || 5} days`,
          action: () => {
            const val = window.prompt("Enter your typical period length in days:", (settings?.defaultPeriodLength || 5).toString());
            const parsed = parseInt(val || '', 10);
            if (!isNaN(parsed) && parsed > 0 && parsed < 20) {
              mutate({ defaultPeriodLength: parsed });
            }
          }
        }
      ]
    },
    {
      title: "Security & Data",
      items: [
        { id: 'privacy', label: 'Privacy/data', icon: Shield },
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-6 h-full flex flex-col animate-in fade-in">
      <header className="flex flex-col space-y-2">
        <h1 className="text-3xl font-serif font-bold text-primary">Settings</h1>
      </header>

      <div className="space-y-6 flex-1 pt-2">
        {SETTING_GROUPS.map((group, gIdx) => (
          <div key={gIdx} className="space-y-2">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
              {group.title}
            </h2>
            <div className="bg-card rounded-2xl shadow-sm border border-muted/20 overflow-hidden divide-y divide-muted/10">
              {group.items.map((item: any) => (
                <button 
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/5 transition-colors text-left"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-primary stroke-[1.5]" />
                    </div>
                    <span className="font-medium text-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {item.value && (
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                    )}
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50 stroke-[1.5]" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
        
        {/* Log Out Button */}
        <div className="pt-4">
          <button 
            onClick={logout}
            className="w-full bg-card p-4 rounded-2xl shadow-sm border border-muted/20 flex items-center space-x-4 hover:border-destructive/30 hover:bg-destructive/5 transition-all text-left text-destructive group"
          >
            <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
              <LogOut className="w-4 h-4 stroke-[1.5]" />
            </div>
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
