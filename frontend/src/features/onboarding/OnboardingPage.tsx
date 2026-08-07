import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { updateSettingsFn } from '../../api/settings.api';
import { logPeriodFn } from '../../api/period.api';
import { Spinner } from '../../components/ui/Spinner';
import { cn } from '../../lib/utils';
import { Calendar, ChevronRight, CheckCircle, Brain, Sparkles } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  
  // Form State
  const [name, setName] = useState<string>('');
  const [lastPeriodDate, setLastPeriodDate] = useState<string>('');
  const [periodLength, setPeriodLength] = useState<number>(5);
  const [cycleLength, setCycleLength] = useState<number>(28);
  const [notSureCycle, setNotSureCycle] = useState(false);
  const [periodStress, setPeriodStress] = useState<string | null>(null);

  const { mutate: updateSettings, isPending: isUpdating } = useMutation({
    mutationFn: updateSettingsFn,
  });

  const { mutate: logPeriod, isPending: isLogging } = useMutation({
    mutationFn: logPeriodFn,
  });

  const handleFinish = async () => {
    try {
      if (lastPeriodDate) {
        await logPeriod({ startDate: new Date(lastPeriodDate).toISOString() });
      }
      await updateSettings({
        hasCompletedOnboarding: true,
        defaultPeriodLength: periodLength,
        defaultCycleLength: notSureCycle ? 28 : cycleLength,
        periodStress: periodStress
      });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.invalidateQueries({ queryKey: ['periods'] });
      queryClient.invalidateQueries({ queryKey: ['predictions'] });
      navigate('/');
    } catch (e) {
      console.error(e);
    }
  };

  const isPending = isUpdating || isLogging;

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -20 }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-primary/10 via-transparent to-accent/10 -z-10 animate-pulse-glow" />

      {/* Progress Indicator */}
      <div className="w-full flex justify-between items-center pt-8 pb-4">
        <div className="flex space-x-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <motion.div 
              key={i}
              className={cn("h-1.5 rounded-full transition-colors", step >= i + 1 ? "bg-primary" : "bg-primary/20")}
              initial={false}
              animate={{ width: step === i + 1 ? 24 : 12 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          ))}
        </div>
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          Step {step} of {totalSteps}
        </div>
      </div>

      <div className="flex-1 flex flex-col pt-4">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-serif font-bold text-primary flex items-center">
            Welcome to Ritvi <Sparkles className="w-6 h-6 ml-2 text-accent" />
          </h1>
          <p className="text-muted-foreground font-medium">Let's personalize your experience.</p>
        </div>

        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="space-y-6 flex flex-col absolute inset-0"
              >
                <div className="glass-card bg-card/80 p-8 rounded-[32px] border border-muted/20 shadow-sm space-y-8 flex flex-col items-center text-center">
                  <motion.div 
                    animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }} 
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="text-7xl drop-shadow-md"
                  >
                    👋✨
                  </motion.div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-serif font-bold text-foreground text-primary">Hi, This is Ritvi!</h2>
                    <p className="text-muted-foreground font-medium">Your personal, empathetic cycle companion.</p>
                  </div>
                  
                  <div className="w-full space-y-4 pt-4">
                    <input 
                      type="text"
                      placeholder="What should we call you?"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white/50 backdrop-blur-sm border border-muted/30 rounded-2xl p-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-base font-medium shadow-inner text-center"
                    />
                  </div>
                </div>

                <div className="mt-auto pb-8 space-y-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(2)}
                    disabled={!name}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center group"
                  >
                    Get Started <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step1"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="space-y-6 flex flex-col absolute inset-0"
              >
                <div className="glass-card bg-card/80 p-6 rounded-[32px] border border-muted/20 shadow-sm space-y-6">
                  <h2 className="text-xl font-serif font-bold text-foreground">When did your last period start?</h2>
                  <div className="flex justify-center bg-white/50 backdrop-blur-sm rounded-3xl p-4 border border-muted/30 shadow-inner">
                    <DayPicker
                      mode="single"
                      selected={lastPeriodDate ? new Date(lastPeriodDate) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const y = date.getFullYear();
                          const m = String(date.getMonth() + 1).padStart(2, '0');
                          const d = String(date.getDate()).padStart(2, '0');
                          setLastPeriodDate(`${y}-${m}-${d}T00:00:00`);
                        } else {
                          setLastPeriodDate('');
                        }
                      }}
                      disabled={{ after: new Date() }}
                      defaultMonth={new Date()}
                      className="border-none"
                      modifiersStyles={{
                        selected: { backgroundColor: '#E07A5F', color: 'white', borderRadius: '100%' },
                        today: { color: '#E07A5F', fontWeight: 'bold' }
                      }}
                      styles={{
                        caption: { color: '#4a4a4a', fontWeight: 'bold', fontFamily: 'serif' },
                        head_cell: { color: '#a0a0a0', fontWeight: 'normal', fontSize: '0.8rem' },
                        day: { borderRadius: '100%' }
                      }}
                    />
                  </div>
                </div>
                <div className="mt-auto pb-8">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(3)}
                    disabled={!lastPeriodDate}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center group"
                  >
                    Continue <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step2"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="space-y-6 flex flex-col absolute inset-0"
              >
                <div className="glass-card bg-card/80 p-6 rounded-[32px] border border-muted/20 shadow-sm space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-xl font-serif font-bold text-foreground">How many days does your period typically last?</h2>
                    <div className="flex items-center space-x-4 bg-white/50 p-4 rounded-2xl border border-muted/20 shadow-inner">
                      <input 
                        type="range"
                        min="2" max="10"
                        value={periodLength}
                        onChange={(e) => setPeriodLength(parseInt(e.target.value))}
                        className="w-full accent-primary"
                      />
                      <span className="text-2xl font-serif font-bold text-primary w-16 text-center">{periodLength} <span className="text-sm font-sans font-normal text-muted-foreground">days</span></span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-serif font-bold text-foreground">How many days are typically in your cycle?</h2>
                    
                    <div className={cn("flex items-center space-x-4 p-4 rounded-2xl border transition-all shadow-inner", notSureCycle ? "bg-muted/10 opacity-60 border-muted/20" : "bg-white/50 border-primary/20")}>
                      <input 
                        type="range"
                        min="21" max="35"
                        value={cycleLength}
                        onChange={(e) => setCycleLength(parseInt(e.target.value))}
                        disabled={notSureCycle}
                        className="w-full accent-primary"
                      />
                      <span className="text-2xl font-serif font-bold text-primary w-16 text-center">{cycleLength} <span className="text-sm font-sans font-normal text-muted-foreground">days</span></span>
                    </div>
                    
                    <button 
                      onClick={() => setNotSureCycle(!notSureCycle)}
                      className="flex items-center space-x-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors p-2"
                    >
                      <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", notSureCycle ? "bg-primary border-primary" : "border-muted-foreground")}>
                        {notSureCycle && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
                      </div>
                      <span>I'm not sure (use 28-day default)</span>
                    </button>
                  </div>
                </div>

                <div className="mt-auto pb-8">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(4)}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20 flex items-center justify-center group"
                  >
                    Continue <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step3"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="space-y-6 flex flex-col absolute inset-0"
              >
                <div className="glass-card bg-card/80 p-6 rounded-[32px] border border-muted/20 shadow-sm space-y-6">
                  <h2 className="text-xl font-serif font-bold text-foreground flex items-center leading-snug">
                    <Brain className="w-6 h-6 mr-3 text-primary flex-shrink-0" />
                    Do you generally experience noticeable stress around your period?
                  </h2>
                  <div className="space-y-3 pt-2">
                    {['Yes', 'Sometimes', 'No'].map((option) => (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        key={option}
                        onClick={() => setPeriodStress(option)}
                        className={cn(
                          "w-full p-4 rounded-2xl border text-left font-bold transition-all shadow-sm",
                          periodStress === option
                            ? "bg-primary/10 border-primary text-primary shadow-primary/10"
                            : "bg-white/50 border-muted/20 hover:border-primary/30 text-foreground"
                        )}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pb-8">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFinish}
                    disabled={isPending || !periodStress}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center group relative overflow-hidden"
                  >
                    {isPending ? (
                      <Spinner size={24} className="text-primary-foreground" />
                    ) : (
                      <>
                        <span className="relative z-10">Finish</span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform rounded-full" />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
