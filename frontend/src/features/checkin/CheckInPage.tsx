import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { getTodayCheckInFn, upsertCheckInFn } from '../../api/checkins.api';
import { Spinner } from '../../components/ui/Spinner';

type TimeWindow = 'morning' | 'afternoon' | 'evening';

const ALL_MORNING_QUESTIONS = [
  [
    { text: "Did you sleep well?", icon: "😴" },
    { text: "Are you feeling energetic this morning?", icon: "⚡" },
    { text: "Are you experiencing any nausea today?", icon: "🤢" }
  ],
  [
    { text: "Did you wake up feeling rested?", icon: "🌅" },
    { text: "Is your body temperature feeling elevated?", icon: "🌡️" },
    { text: "Are you feeling any lower back aches?", icon: "🦴" }
  ],
  [
    { text: "Did you start the day with a glass of water?", icon: "💧" },
    { text: "Are you experiencing any morning headaches?", icon: "🤕" },
    { text: "Is your mood feeling stable today?", icon: "🧘‍♀️" }
  ]
];

const ALL_AFTERNOON_QUESTIONS = [
  [
    { text: "Have you been drinking enough water?", icon: "💧" },
    { text: "Are you experiencing any mid-day bloating?", icon: "🎈" },
    { text: "How is your focus and concentration?", icon: "🎯" }
  ],
  [
    { text: "Are you having strong food cravings?", icon: "🍫" },
    { text: "Are you experiencing any brain fog?", icon: "☁️" },
    { text: "Have you noticed any changes in your digestion?", icon: "🥗" }
  ],
  [
    { text: "Are you feeling fatigued this afternoon?", icon: "🥱" },
    { text: "Have you had a healthy, balanced lunch?", icon: "🥑" },
    { text: "Are you experiencing any sharp pelvic twinges?", icon: "⚡" }
  ]
];

const ALL_EVENING_QUESTIONS = [
  [
    { text: "Are you experiencing any breast tenderness?", icon: "🤲" },
    { text: "Are you feeling any uterine cramping?", icon: "💢" },
    { text: "Do you feel irritable or anxious this evening?", icon: "🌩️" }
  ],
  [
    { text: "Are you feeling calm and relaxed?", icon: "🌙" },
    { text: "Have you noticed any skin breakouts today?", icon: "🧴" },
    { text: "Is your body holding onto excess water weight?", icon: "⚖️" }
  ],
  [
    { text: "Did you manage your stress well today?", icon: "🍃" },
    { text: "Are you experiencing any muscle or joint aches?", icon: "🦵" },
    { text: "Do you feel emotionally sensitive tonight?", icon: "🥺" }
  ]
];

const dayIndex = new Date().getDate();
const QUESTION_POOLS = {
  morning: ALL_MORNING_QUESTIONS[dayIndex % ALL_MORNING_QUESTIONS.length],
  afternoon: ALL_AFTERNOON_QUESTIONS[dayIndex % ALL_AFTERNOON_QUESTIONS.length],
  evening: ALL_EVENING_QUESTIONS[dayIndex % ALL_EVENING_QUESTIONS.length]
};

export default function CheckInPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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

  const handleEdit = () => {
    setCurrentAnswers(existingAnswersData[currentWindow] || {});
    setCurrentIndex(0);
    setIsEditing(true);
    setIsCompleted(false);
  };

  const handleExit = () => navigate('/');

  if (isLoadingCheckIn) {
    return <div className="fixed inset-0 bg-background flex justify-center items-center"><Spinner size={32} /></div>;
  }

  // Already completed this window today
  if (hasCompletedWindow && !isCompleted && !isEditing) {
    const windowAnswers = existingAnswersData[currentWindow];
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col p-6 animate-in fade-in">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-serif font-bold text-foreground capitalize">{currentWindow} Check-in</h1>
          <button onClick={handleExit} className="p-2 text-muted-foreground hover:bg-card rounded-full transition-colors">
            <X className="w-6 h-6 stroke-[1.5]" />
          </button>
        </header>
        
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-4xl mb-2"
          >
            ✨
          </motion.div>
          <h2 className="text-3xl font-serif text-center font-bold text-primary">Caught up!</h2>
          <p className="text-muted-foreground text-center font-medium">Here's what you logged this {currentWindow}:</p>
          
          <div className="w-full max-w-sm space-y-3 mt-4">
            {Object.entries(windowAnswers).map(([q, ans]: any, idx) => (
              <div key={idx} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-muted/20 shadow-sm">
                <span className="text-sm font-medium pr-4">{q}</span>
                <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider", ans ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                  {ans ? 'Yes' : 'No'}
                </span>
              </div>
            ))}
          </div>

          <div className="w-full max-w-sm space-y-3 mt-8 pt-6">
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="w-full bg-secondary text-secondary-foreground font-bold py-4 rounded-full shadow-sm hover:shadow-md hover:bg-secondary/90 transition-all text-lg"
            >
              Edit Check-in
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              onClick={handleExit}
              className="w-full bg-white border border-muted/20 text-foreground font-bold py-4 rounded-full shadow-sm hover:bg-muted/5 transition-all text-lg"
            >
              Return Home
            </motion.button>
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
        
        <div className="w-full flex-1 flex flex-col items-center justify-center min-h-[50vh] relative pt-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 50, rotate: 5 }}
              animate={{ opacity: 1, x: 0, rotate: 0 }}
              exit={{ opacity: 0, x: -50, rotate: -5 }}
              className="w-full flex flex-col items-center"
            >
              {/* Mascot / Blob */}
              <div className="relative mb-6">
                <motion.div 
                  animate={{ 
                    scale: [1, 1.05, 1], 
                    rotate: [0, -3, 3, 0],
                    borderRadius: ["40% 60% 70% 30%", "60% 40% 30% 70%", "40% 60% 70% 30%"]
                  }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="w-32 h-32 bg-gradient-to-br from-primary/30 to-accent/30 shadow-lg flex items-center justify-center overflow-visible border-4 border-white/50"
                >
                  <motion.div 
                    animate={{ y: [0, -8, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="text-6xl drop-shadow-xl z-10"
                  >
                    {currentQ.icon}
                  </motion.div>
                </motion.div>
                {/* Cute little sparkles */}
                <motion.div 
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                  className="absolute -top-2 -right-4 text-2xl"
                >
                  ✨
                </motion.div>
              </div>

              {/* Speech Bubble */}
              <div className="relative bg-white p-8 rounded-[32px] shadow-xl border border-primary/10 w-full mt-4">
                {/* Tail of speech bubble */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-white rotate-45 border-l border-t border-primary/10 shadow-[-4px_-4px_10px_rgba(0,0,0,0.02)]" />
                <h2 className="text-2xl font-serif font-bold text-center text-foreground leading-snug relative z-10">
                  {currentQ.text}
                </h2>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Buttons */}
        <div className="w-full flex space-x-4 pb-12 mt-12">
          <motion.button 
            whileTap={{ scale: 0.95, y: 4 }}
            onClick={() => handleAnswer(false)}
            disabled={isPending}
            className="flex-1 bg-white border-b-4 border-muted/30 text-foreground text-xl font-bold py-5 rounded-[2rem] shadow-sm hover:bg-muted/5 transition-all disabled:opacity-50"
          >
            Not really
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95, y: 4 }}
            onClick={() => handleAnswer(true)}
            disabled={isPending}
            className="flex-1 bg-primary border-b-4 border-black/20 text-primary-foreground text-xl font-bold py-5 rounded-[2rem] shadow-md hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            Yes!
          </motion.button>
        </div>
      </div>
    </div>
  );
}
