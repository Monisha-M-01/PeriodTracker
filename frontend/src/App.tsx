import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { SplashScreen } from './components/ui/SplashScreen';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';

import TodayScreen from './features/today/TodayScreen';
import InsightsScreen from './features/insights/InsightsScreen';
import LearnMoreScreen from './features/learn/LearnMoreScreen';
import RelaxScreen from './features/relax/RelaxScreen';
import SettingsPage from './features/settings/SettingsPage';
import CheckInPage from './features/checkin/CheckInPage';
import LogPeriodPage from './features/logging/LogPeriodPage';
import LogSymptomPage from './features/logging/LogSymptomPage';
import ProfileScreen from './features/profile/ProfileScreen';
import CalendarPage from './features/calendar/CalendarPage';
import OnboardingPage from './features/onboarding/OnboardingPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <AnimatePresence>
              {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
            </AnimatePresence>
            <React.Suspense fallback={<div className="h-screen w-screen flex items-center justify-center"><p>Loading...</p></div>}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppShell />}>
                    <Route path="/" element={<TodayScreen />} />
                    <Route path="/insights" element={<InsightsScreen />} />
                    <Route path="/learn" element={<LearnMoreScreen />} />
                    <Route path="/relax" element={<RelaxScreen />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/profile" element={<ProfileScreen />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/checkin" element={<CheckInPage />} />
                    <Route path="/log-period" element={<LogPeriodPage />} />
                    <Route path="/log-symptom" element={<LogSymptomPage />} />
                  </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </React.Suspense>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

