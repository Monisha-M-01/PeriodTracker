import React, { useEffect, Suspense } from 'react';
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Home, BarChart2, BookOpen, Wind, Settings } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getSettingsFn } from '../../api/settings.api';
import { cn } from '../../lib/utils';
import { Spinner } from '../ui/Spinner';
import { MeshBackground } from '../ui/MeshBackground';
import { FloatingBackgroundGlow } from '../ui/FloatingBackgroundGlow';
import { AmbientParticles } from '../ui/AmbientParticles';
import { useHaptics } from '../../hooks/useHaptics';
import { ErrorBoundary } from '../ui/ErrorBoundary';
export const AppShell: React.FC = () => {
  const location = useLocation();
  const triggerHaptic = useHaptics();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettingsFn,
  });

  if (isLoading) {
    return <div className="h-screen w-screen flex items-center justify-center bg-background"><Spinner size={48} /></div>;
  }

  if (settingsData && settingsData.data && !settingsData.data.hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  const navItems = [
    { label: 'Today', icon: Home, path: '/' },
    { label: 'Insights', icon: BarChart2, path: '/insights' },
    { label: 'Learn', icon: BookOpen, path: '/learn' },
    { label: 'Relax', icon: Wind, path: '/relax' },
    { label: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background animate-slow-gradient pb-16 md:pb-0 md:pl-64 transition-all">
      <FloatingBackgroundGlow />
      <AmbientParticles />
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 fixed inset-y-0 left-0 bg-card border-r border-muted z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-6 flex flex-col justify-center">
          <h1 className="text-5xl font-ritvi font-bold text-primary leading-none tracking-tight pt-1">Ritvi</h1>
          <p className="text-[13px] font-sans font-light text-muted-foreground mt-1">In sync with you</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              replace
              onClick={() => triggerHaptic('selection')}
              className={cn(
                "relative flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors z-10",
                location.pathname === item.path 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {location.pathname === item.path && (
                <motion.div
                  layoutId="desktop-nav-indicator"
                  className="absolute inset-0 bg-accent rounded-md -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <item.icon className="w-5 h-5 stroke-[1.5]" />
              </motion.div>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-20 bg-card/80 backdrop-blur-md border-b border-muted px-4 py-3 flex flex-col items-start shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <h1 className="text-4xl font-ritvi font-bold text-primary leading-none tracking-tight">Ritvi</h1>
        <p className="text-[12px] font-sans font-light text-muted-foreground mt-0.5">In sync with you</p>
      </header>

      {/* Main Content Area */}
      <MeshBackground />
      <main className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <ErrorBoundary>
              <Suspense fallback={<div className="flex justify-center p-20"><Spinner size={32} /></div>}>
                <Outlet />
              </Suspense>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav 
        className="md:hidden fixed bottom-0 inset-x-0 bg-card border-t border-muted z-20 flex justify-around items-center pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      >
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            replace
            onClick={() => triggerHaptic('selection')}
            className={cn(
              "relative flex flex-col items-center justify-center w-full py-1 space-y-1 transition-all duration-300 z-10",
              location.pathname === item.path 
                ? "text-primary" 
                : "text-muted-foreground/60 hover:text-foreground"
            )}
          >
            {location.pathname === item.path && (
              <motion.div
                layoutId="mobile-nav-indicator"
                className="absolute top-1 bottom-1 left-3 right-3 bg-primary/10 rounded-xl -z-10 shadow-[0_0_12px_rgba(193,95,60,0.15)]"
                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              />
            )}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <item.icon className={cn("transition-all duration-300", location.pathname === item.path ? "w-7 h-7 stroke-[2]" : "w-6 h-6 stroke-[1.5]")} />
            </motion.div>
            <span className={cn("text-[10px] transition-all duration-300", location.pathname === item.path ? "font-bold" : "font-medium")}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
