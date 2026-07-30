import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { getTodayCheckInFn, upsertCheckInFn } from '../../api/checkins.api';
import { Spinner } from '../../components/ui/Spinner';

type TimeWindow = 'morning' | 'afternoon' | 'evening';

const QUESTION_POOLS = {
  morning: [
    { text: "Did you sleep well?", icon: "😴" },
    { text: "Did you drink water this morning?", icon: "💧" },
    { text: "Feeling energized today?", icon: "⚡" }
  ],
  afternoon: [
    { text: "Have you had a good lunch?", icon: "🥗" },
    { text: "Did you stretch today?", icon: "🧘‍♀️" },
    { text: "How is your focus?", icon: "🎯" }
  ],
  evening: [
    { text: "Did you have a calm evening?", icon: "🌅" },
    { text: "Did you move your body today?", icon: "🏃‍♀️" },
    { text: "Feeling ready for rest?", icon: "🌙" }
  ]
};

export default function CheckInPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentAnswers, setCurrentAnswers] = useState<Record<string, boolean>>({});

  const { data: todayCheckIn, isLoading: isLoadingCheckIn } = useQuery({
    queryKey: ['checkins', 'today'],
    queryFn: getTodayCheckInFn
  });

  const { mutate, isPending } = useMutation({
    mutationFn: upsertCheckInFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkins', 'today'] });
      setIsCompleted(true);
    },
  });

  const getCurrentWindow = (): TimeWindow => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const currentWindow = getCurrentWindow();
  const questions = QUESTION_POOLS[currentWindow];
  
  // Parse existing answers
  const existingAnswersData = todayCheckIn?.data?.answers ? JSON.parse(todayCheckIn.data.answers) : {};
  const hasCompletedWindow = !!existingAnswersData[currentWindow];

  const handleAnswer = (answer: boolean) => {
    const newAnswers = { ...currentAnswers, [questions[currentIndex].text]: answer };
    setCurrentAnswers(newAnswers);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Save all windows
      const updatedAnswersData = {
        ...existingAnswersData,
        [currentWindow]: newAnswers
      };
      
      mutate({
        date: new Date().toISOString(),
        answers: JSON.stringify(updatedAnswersData),
      });
    }
  };

  const handleExit = () => navigate('/');

  if (isLoadingCheckIn) {
    return <div className="fixed inset-0 bg-background flex justify-center items-center"><Spinner size={32} /></div>;
  }

  // Already completed this window today
  if (hasCompletedWindow && !isCompleted) {
    const windowAnswers = existingAnswersData[currentWindow];
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col p-6 animate-in fade-in">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif font-bold text-foreground capitalize">{currentWindow} Check-in</h1>
          <button onClick={handleExit} className="p-2 text-muted-foreground hover:bg-card rounded-full transition-colors">
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>
        </header>
        
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl mb-2">
            ✨
          </div>
          <h2 className="text-2xl font-serif text-center font-medium">You're all caught up!</h2>
          <p className="text-muted-foreground text-center">Here's what you logged this {currentWindow}:</p>
          
          <div className="w-full max-w-sm space-y-3 mt-4">
            {Object.entries(windowAnswers).map(([q, ans]: any, idx) => (
              <div key={idx} className="flex justify-between items-center bg-card p-4 rounded-2xl border border-muted/20 shadow-sm">
                <span className="text-sm font-medium pr-4">{q}</span>
                <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", ans ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                  {ans ? 'Yes' : 'No'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-32 h-32 relative mb-6">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75" />
          <div className="absolute inset-0 bg-primary/10 rounded-full flex items-center justify-center animate-bounce shadow-lg">
            <span className="text-6xl">🎉</span>
          </div>
        </div>
        <h1 className="text-3xl font-serif font-bold text-foreground text-center mb-2">
          Saved! Thanks for checking in
        </h1>
        <p className="text-muted-foreground text-center mb-10">
          Your {currentWindow} check-in is complete.
        </p>
        <button 
          onClick={handleExit}
          className="w-full max-w-xs bg-primary text-primary-foreground font-medium py-4 rounded-full shadow-sm hover:shadow-md hover:bg-primary/90 transition-all active:scale-95"
        >
          Return to Today
        </button>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-[#FDFBF7] flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between z-10">
        <button 
          onClick={handleExit}
          className="p-2 text-muted-foreground hover:bg-black/5 rounded-full transition-colors"
        >
          <X className="w-6 h-6 stroke-[1.5]" />
        </button>
        <div className="flex items-center space-x-2">
          {questions.map((_, idx) => (
            <div 
              key={idx}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                idx === currentIndex ? "w-8 bg-primary" : idx < currentIndex ? "w-3 bg-primary/40" : "w-3 bg-primary/20"
              )}
            />
          ))}
        </div>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Flashcard Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
        
        <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[50vh] relative perspective-1000">
          <div 
            key={currentIndex} 
            className="w-full bg-white rounded-[2.5rem] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 flex flex-col items-center justify-center animate-in slide-in-from-right-8 fade-in duration-500 ease-out min-h-[300px]"
          >
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-4xl mb-8 animate-bounce" style={{ animationDuration: '2s' }}>
              {currentQ.icon}
            </div>
            <h2 className="text-3xl font-serif font-semibold text-center text-foreground leading-tight">
              {currentQ.text}
            </h2>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex space-x-4 pb-12 mt-8">
          <button 
            onClick={() => handleAnswer(false)}
            disabled={isPending}
            className="flex-1 bg-white border-2 border-primary/20 text-foreground text-xl font-bold py-5 rounded-full shadow-sm hover:bg-primary/5 transition-all active:scale-95 disabled:opacity-50"
          >
            No
          </button>
          <button 
            onClick={() => handleAnswer(true)}
            disabled={isPending}
            className="flex-1 bg-primary text-primary-foreground text-xl font-bold py-5 rounded-full shadow-sm hover:shadow-md hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
