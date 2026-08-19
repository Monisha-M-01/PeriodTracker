import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './hooks/useToast';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppShell } from './components/layout/AppShell';
import { SplashScreen } from './components/ui/SplashScreen';
import { AnimatePresence } from 'framer-motion';
const LoginPage = React.lazy(() => import('./features/auth/LoginPage'));
const SignupPage = React.lazy(() => import('./features/auth/SignupPage'));

const TodayScreen = React.lazy(() => import('./features/today/TodayScreen'));
const InsightsScreen = React.lazy(() => import('./features/insights/InsightsScreen'));
const LearnMoreScreen = React.lazy(() => import('./features/learn/LearnMoreScreen'));
const RelaxScreen = React.lazy(() => import('./features/relax/RelaxScreen'));
const SettingsPage = React.lazy(() => import('./features/settings/SettingsPage'));
const CheckInPage = React.lazy(() => import('./features/checkin/CheckInPage'));
const LogPeriodPage = React.lazy(() => import('./features/logging/LogPeriodPage'));
const LogSymptomPage = React.lazy(() => import('./features/logging/LogSymptomPage'));
const ProfileScreen = React.lazy(() => import('./features/profile/ProfileScreen'));
const CalendarPage = React.lazy(() => import('./features/calendar/CalendarPage'));
const OnboardingPage = React.lazy(() => import('./features/onboarding/OnboardingPage'));

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
                
                <Route element={<AppShell />}>
                  <Route path="/" element={<Navigate to="/today" replace />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/today" element={<TodayScreen />} />
                  <Route path="/insights" element={<InsightsScreen />} />
                  <Route path="/learn" element={<LearnMoreScreen />} />
                  <Route path="/relax" element={<RelaxScreen />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/checkin" element={<CheckInPage />} />
                  <Route path="/log-period" element={<LogPeriodPage />} />
                  <Route path="/log-symptom" element={<LogSymptomPage />} />
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

