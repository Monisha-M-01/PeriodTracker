import React, { useState, useMemo } from 'react';
import { Wind, Anchor, PenTool, Users, ChevronDown, PlayCircle, Music, Coffee, Moon, Sun, Book, Smile, Heart, Sparkles, Feather } from 'lucide-react';
import { cn } from '../../lib/utils';

type Tip = {
  id: string;
  icon: React.ElementType;
  title: string;
  detail: string;
  action?: {
    label: string;
    onClick: () => void;
  };
};

const ALL_STRESS_ACTIVITIES: Tip[] = [
  { id: 's1', icon: Wind, title: 'Box Breathing', detail: 'Reset your nervous system with a quick 4-4-4-4 guided breathing exercise.' },
  { id: 's2', icon: Anchor, title: '5-4-3-2-1 Grounding', detail: 'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.' },
  { id: 's3', icon: PenTool, title: 'Brain Dump Journaling', detail: 'Write down every single thought in your head for 3 minutes without stopping to filter.' },
  { id: 's4', icon: Users, title: 'Call a Loved One', detail: 'Voicing what you are feeling to a friend can significantly lighten the emotional load.' },
  { id: 's5', icon: Music, title: '5-Minute Dance Party', detail: 'Put on your favorite upbeat song and dance aggressively to shake out the cortisol.' },
  { id: 's6', icon: Coffee, title: 'Mindful Tea Break', detail: 'Make a cup of tea. Feel the warmth of the mug, watch the steam, and drink it without looking at a screen.' },
  { id: 's7', icon: Moon, title: 'Yoga Nidra (Sleep Yoga)', detail: 'Search for a 10-minute Yoga Nidra track. It is equivalent to an hour of deep rest.' },
  { id: 's8', icon: Sun, title: 'Sunshine Walk', detail: 'Go outside for exactly 10 minutes without your phone. Let the sunlight hit your face.' },
  { id: 's9', icon: Book, title: 'Read Fiction', detail: 'Read just 10 pages of a fiction book to transport your brain out of its current stress loop.' },
  { id: 's10', icon: Smile, title: 'Watch Comedy', detail: 'Laughter reduces stress hormones. Watch a 5-minute standup comedy clip.' },
  { id: 's11', icon: Heart, title: 'Self-Compassion Break', detail: 'Put your hand on your heart and say: "This is a moment of suffering. Suffering is a part of life. May I be kind to myself in this moment."' },
  { id: 's12', icon: Sparkles, title: 'Declutter One Surface', detail: 'Pick one small area (like your desk or a counter) and clear it. Outer order contributes to inner calm.' },
  { id: 's13', icon: Feather, title: 'Progressive Muscle Relaxation', detail: 'Squeeze your toes tightly for 5 seconds, then release. Move up your body to your head.' },
  { id: 's14', icon: Wind, title: 'Sighing Out Loud', detail: 'Take a deep breath in through your nose, and let out a loud, vocalized sigh. Repeat 3 times.' },
  { id: 's15', icon: Anchor, title: 'Temperature Change', detail: 'Splash freezing cold water on your face. It triggers the mammalian dive reflex and instantly lowers your heart rate.' },
  { id: 's16', icon: PenTool, title: 'Doodle your Feelings', detail: 'Take a pen and paper and scribble exactly how you feel. It doesn\'t need to be art.' },
  { id: 's17', icon: Music, title: 'Listen to Binaural Beats', detail: 'Put on headphones and listen to Theta or Alpha binaural beats to help shift your brainwaves into a relaxed state.' },
  { id: 's18', icon: Coffee, title: 'Bake or Cook', detail: 'Following a simple recipe requires just enough focus to distract you from anxiety, and rewards you with food.' },
  { id: 's19', icon: Sparkles, title: 'Aromatherapy Reset', detail: 'Smell an essential oil like lavender, eucalyptus, or even just fresh coffee beans to ground your senses.' },
  { id: 's20', icon: Heart, title: 'Pet an Animal', detail: 'If you have a pet, spend 5 minutes petting them. It releases oxytocin for both of you.' }
];

export default function StressTips({ onStartBreathing }: { onStartBreathing: () => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Pick 4 random activities for the day based on the date seed
  const dailyActivities = useMemo(() => {
    const today = new Date();
    const daySeed = today.getFullYear() * 1000 + today.getMonth() * 100 + today.getDate();
    
    // We want 4 unique indices
    const indices = [
      daySeed % ALL_STRESS_ACTIVITIES.length,
      (daySeed + 7) % ALL_STRESS_ACTIVITIES.length,
      (daySeed + 13) % ALL_STRESS_ACTIVITIES.length,
      (daySeed + 21) % ALL_STRESS_ACTIVITIES.length,
    ];

    const tips = indices.map(i => ALL_STRESS_ACTIVITIES[i]);

    // Ensure Box Breathing always has the action attached if it appears
    return tips.map(tip => {
      if (tip.title === 'Box Breathing') {
        return {
          ...tip,
          action: { label: 'Start Breathing', onClick: onStartBreathing }
        };
      }
      return tip;
    });
  }, [onStartBreathing]);

  return (
    <div className="space-y-6 animate-in fade-in pb-8">
      <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-6 relative overflow-hidden">
        <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2">Daily Refresh</h3>
        <p className="text-lg font-serif font-semibold text-blue-900 leading-tight mb-2">
          Your Stress-Relief Toolkit
        </p>
        <p className="text-sm text-blue-800/70">
          These activities refresh every day. Pick one that sounds comforting right now to help lower your cortisol and restore your peace.
        </p>
      </div>

      <div className="space-y-4">
        {dailyActivities.map((tip) => {
          const isExpanded = expandedId === tip.id;
          return (
            <div 
              key={tip.id}
              className={cn(
                "bg-card border border-muted/30 rounded-2xl p-4 transition-all shadow-sm",
                tip.action ? "" : "cursor-pointer hover:border-primary/30"
              )}
              onClick={() => {
                if (!tip.action) {
                  setExpandedId(isExpanded ? null : tip.id);
                }
              }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <tip.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div 
                    className="flex justify-between items-start"
                    onClick={() => {
                      if (tip.action) {
                        setExpandedId(isExpanded ? null : tip.id);
                      }
                    }}
                  >
                    <h3 className={cn("text-foreground font-medium pr-6 relative", tip.action && "cursor-pointer")}>
                      {tip.title}
                      <ChevronDown 
                        className={cn(
                          "w-4 h-4 text-muted-foreground absolute right-0 top-1 transition-transform",
                          isExpanded && "rotate-180"
                        )} 
                      />
                    </h3>
                  </div>
                  
                  <div 
                    className={cn(
                      "grid transition-all duration-200 ease-in-out",
                      isExpanded ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                        {tip.detail}
                      </p>
                      {tip.action && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            tip.action?.onClick();
                          }}
                          className="inline-flex items-center space-x-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>{tip.action.label}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
