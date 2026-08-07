import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BubblePop from './BubblePop';
import BreathingExercise from './BreathingExercise';
import ZenGarden from './ZenGarden';
import ColorMatch from './ColorMatch';
import MemoryMatch from './MemoryMatch';
import RipplePond from './RipplePond';
import MandalaDraw from './MandalaDraw';
import InfinityTrace from './InfinityTrace';
import StarConnect from './StarConnect';
import CloudDissolve from './CloudDissolve';
import SlidingPuzzle from './SlidingPuzzle';
import MelodyGrid from './MelodyGrid';
import MoodMascot from './MoodMascot';
import TicTacToe from './games/TicTacToe';
import SnakeGame from './games/SnakeGame';
import Game2048 from './games/Game2048';

type GameType = 'bubble' | 'breathing' | 'zen' | 'color' | 'memory' | 'ripple' | 'mandala' | 'infinity' | 'star' | 'cloud' | 'sliding' | 'melody' | 'tictactoe' | 'snake' | '2048' | null;

const MINDFULNESS_GAMES = [
  { id: 'g1', title: 'The 5-4-3-2-1 Game', desc: 'A grounding technique to bring you into the present.', time: '2 min', color: 'bg-blue-100', text: 'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.' },
  { id: 'g2', title: 'Color Hunt', desc: 'Find 5 objects of a specific color around you.', time: '1 min', color: 'bg-rose-100', text: 'Pick a color (like Blue or Yellow). Look around your environment and find 5 items of that color. Study their shades.' },
  { id: 'g3', title: 'Alphabet Game', desc: 'Name an animal for every letter of the alphabet.', time: '3 min', color: 'bg-amber-100', text: 'Start with A (Alligator), B (Bear)... This simple cognitive distraction breaks anxiety loops.' },
  { id: 'g4', title: 'Cloud Watching', desc: 'A visualization exercise for letting go.', time: '3 min', color: 'bg-sky-100', text: 'Close your eyes. Imagine you are lying on a grassy hill. When a stressful thought enters your mind, place it on a cloud and watch it drift away.' },
  { id: 'g5', title: 'Body Scan', desc: 'Release tension from head to toe.', time: '5 min', color: 'bg-emerald-100', text: 'Focus your attention on your toes. Tense them, then relax. Move slowly up your legs, torso, arms, neck, and face, relaxing each part.' },
  { id: 'g6', title: 'Safe Place Visualization', desc: 'Build a mental sanctuary.', time: '3 min', color: 'bg-purple-100', text: 'Imagine a place where you feel completely safe and happy. What does it look like? Smell like? Sound like? Spend 3 minutes exploring it.' },
  { id: 'g7', title: 'Count Backwards', desc: 'Count down from 100 by 7s.', time: '2 min', color: 'bg-indigo-100', text: '100, 93, 86... This requires just enough focus to pull your brain out of emotional spirals into logical thinking.' },
  { id: 'g8', title: 'The Gratitude Alphabet', desc: 'Find something to be grateful for, from A to Z.', time: '4 min', color: 'bg-orange-100', text: 'A is for Apples, B is for my Bed... Go through the alphabet and find one thing you appreciate for each letter.' },
  { id: 'g9', title: 'Left-Hand Tracing', desc: 'Slowly trace the outline of your hand.', time: '2 min', color: 'bg-teal-100', text: 'Hold your left hand out. Use your right index finger to slowly trace the outline. Breathe in as you trace up a finger, breathe out as you trace down.' },
  { id: 'g10', title: 'The Compassion Game', desc: 'Send good thoughts to three people.', time: '1 min', color: 'bg-pink-100', text: 'Think of someone you love. Silently wish them well. Think of a stranger you saw today. Wish them well. Think of yourself. Wish yourself well.' },
  { id: 'g11', title: 'Focus on a Flame', desc: 'Candle meditation visualization.', time: '2 min', color: 'bg-red-100', text: 'Imagine a softly flickering candle in a dark room. Watch the flame dance. If your mind wanders, bring your focus back to the warm light.' },
  { id: 'g12', title: 'The 3x3 Grid', desc: 'Notice 3 colors, 3 shapes, 3 textures.', time: '2 min', color: 'bg-cyan-100', text: 'Look around. Name 3 different colors you see. Name 3 distinct shapes. Name 3 textures you could touch. This anchors you to reality.' },
  { id: 'g13', title: 'Object Focus', desc: 'Study an everyday object intently.', time: '2 min', color: 'bg-lime-100', text: 'Pick up a pen, a cup, or a stone. Look at it as if you have never seen it before. Notice the weight, the temperature, the tiny imperfections.' },
  { id: 'g14', title: 'Square Breathing', desc: 'A variation of box breathing.', time: '3 min', color: 'bg-fuchsia-100', text: 'Look at a rectangular object (a window, a phone). Trace the top edge while inhaling. Trace the right edge while holding. Bottom edge exhaling. Left edge holding.' },
  { id: 'g15', title: 'Category Naming', desc: 'Name 10 things in a specific category.', time: '2 min', color: 'bg-yellow-100', text: 'Pick a category: Movies, Fruits, Capital Cities. Name 10 things in that category as fast as you can. Pick another category and repeat.' },
  { id: 'g16', title: 'Sensory Countdown', desc: 'Tune into your physical senses.', time: '2 min', color: 'bg-green-100', text: 'Notice the temperature of the air on your skin. Notice the feeling of your clothes. Notice the weight of gravity pulling you into your seat.' },
  { id: 'g17', title: 'The Memory Game', desc: 'Recall a happy memory in vivid detail.', time: '3 min', color: 'bg-rose-50', text: 'Think of a day you felt truly peaceful or joyful. Reconstruct it in your mind. Who was there? What was the weather like? What were you wearing?' },
  { id: 'g18', title: 'Mindful Chewing', desc: 'Eat one bite with full attention.', time: '1 min', color: 'bg-orange-50', text: 'Take a small piece of food (like a raisin or chocolate). Put it in your mouth but do not chew yet. Notice the texture. Slowly chew, noticing the flavor changes.' },
  { id: 'g19', title: 'Nature Sound Mapping', desc: 'Listen and map sounds around you.', time: '2 min', color: 'bg-blue-50', text: 'Close your eyes. Listen for the furthest sound you can hear. Now listen for the closest sound. Switch back and forth between them.' },
  { id: 'g20', title: 'Tense and Release', desc: 'Quick physical reset.', time: '1 min', color: 'bg-slate-100', text: 'Squeeze your hands into tight fists for 5 seconds. Squeeze as hard as you can. Now let go completely and notice the rush of warmth in your fingers.' }
];

export default function GamesSubSection() {
  const [activeGame, setActiveGame] = useState<GameType>(null);
  const [selectedMindGame, setSelectedMindGame] = useState<typeof MINDFULNESS_GAMES[0] | null>(null);

  if (activeGame === 'bubble') return <BubblePop onExit={() => setActiveGame(null)} />;
  if (activeGame === 'breathing') return <BreathingExercise onExit={() => setActiveGame(null)} />;
  if (activeGame === 'zen') return <ZenGarden onExit={() => setActiveGame(null)} />;
  if (activeGame === 'color') return <ColorMatch onExit={() => setActiveGame(null)} />;
  if (activeGame === 'memory') return <MemoryMatch onExit={() => setActiveGame(null)} />;
  if (activeGame === 'ripple') return <RipplePond onExit={() => setActiveGame(null)} />;
  if (activeGame === 'mandala') return <MandalaDraw onExit={() => setActiveGame(null)} />;
  if (activeGame === 'infinity') return <InfinityTrace onExit={() => setActiveGame(null)} />;
  if (activeGame === 'star') return <StarConnect onExit={() => setActiveGame(null)} />;
  if (activeGame === 'cloud') return <CloudDissolve onExit={() => setActiveGame(null)} />;
  if (activeGame === 'sliding') return <SlidingPuzzle onExit={() => setActiveGame(null)} />;
  if (activeGame === 'melody') return <MelodyGrid onExit={() => setActiveGame(null)} />;
  if (activeGame === 'tictactoe') return <TicTacToe onExit={() => setActiveGame(null)} />;
  if (activeGame === 'snake') return <SnakeGame onExit={() => setActiveGame(null)} />;
  if (activeGame === '2048') return <Game2048 onExit={() => setActiveGame(null)} />;

  return (
    <div className="space-y-6 animate-in fade-in pb-8">
      <MoodMascot />

      {/* Classic Arcade Games */}
      <h3 className="text-xl font-serif font-semibold text-foreground px-1 pt-4">Classic Arcade Games</h3>
      <p className="text-sm text-muted-foreground px-1 mb-4">Playable retro games to take your mind off things.</p>
      
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Snake */}
        <button onClick={() => setActiveGame('snake')} className="bg-card p-4 rounded-2xl shadow-sm border border-muted/20 flex flex-col hover:border-primary/40 transition-all text-left group">
          <div className="w-full h-24 bg-green-500/10 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-green-500/20 transition-colors">
             <div className="w-10 h-10 bg-green-500 rounded-sm" />
             <Play className="w-8 h-8 text-green-600 drop-shadow-sm absolute" />
          </div>
          <h3 className="text-md font-serif font-bold text-foreground">Snake</h3>
          <p className="text-xs text-muted-foreground mt-1">The classic game.</p>
        </button>

        {/* 2048 */}
        <button onClick={() => setActiveGame('2048')} className="bg-card p-4 rounded-2xl shadow-sm border border-muted/20 flex flex-col hover:border-primary/40 transition-all text-left group">
          <div className="w-full h-24 bg-orange-500/10 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-orange-500/20 transition-colors">
             <div className="w-12 h-12 bg-orange-400 rounded-md flex items-center justify-center font-bold text-white text-lg">2048</div>
             <Play className="w-8 h-8 text-orange-600 drop-shadow-sm absolute" />
          </div>
          <h3 className="text-md font-serif font-bold text-foreground">2048</h3>
          <p className="text-xs text-muted-foreground mt-1">Join the numbers.</p>
        </button>

        {/* Tic-Tac-Toe */}
        <button onClick={() => setActiveGame('tictactoe')} className="bg-card p-4 rounded-2xl shadow-sm border border-muted/20 flex flex-col hover:border-primary/40 transition-all text-left group">
          <div className="w-full h-24 bg-blue-500/10 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-blue-500/20 transition-colors">
             <div className="w-12 h-12 flex items-center justify-center font-bold text-blue-500 text-3xl">X</div>
             <Play className="w-8 h-8 text-blue-600 drop-shadow-sm absolute" />
          </div>
          <h3 className="text-md font-serif font-bold text-foreground">Tic-Tac-Toe</h3>
          <p className="text-xs text-muted-foreground mt-1">X's and O's.</p>
        </button>
      </div>

      {/* Main Interactive Games */}
      <h3 className="text-xl font-serif font-semibold text-foreground px-1 pt-4">Mindfulness Mini-Games</h3>
      <p className="text-sm text-muted-foreground px-1 mb-4">Interactive experiences designed to soothe anxiety and restore focus.</p>

      <div className="grid grid-cols-2 gap-4">
        {/* Bubble Pop */}
        <button onClick={() => setActiveGame('bubble')} className="bg-card p-4 rounded-2xl shadow-sm border border-muted/20 flex flex-col hover:border-primary/40 transition-all text-left group">
          <div className="w-full h-24 bg-primary/5 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-primary/10 transition-colors">
             <div className="w-8 h-8 rounded-full bg-primary/20 backdrop-blur-sm absolute top-2 left-2" />
             <div className="w-12 h-12 rounded-full bg-secondary/20 backdrop-blur-sm absolute bottom-2 right-4" />
             <Play className="w-8 h-8 text-primary drop-shadow-sm" />
          </div>
          <h3 className="text-md font-serif font-bold text-foreground">Bubble Pop</h3>
          <p className="text-xs text-muted-foreground mt-1">Pop gentle bubbles.</p>
        </button>

        {/* Box Breathing */}
        <button onClick={() => setActiveGame('breathing')} className="bg-card p-4 rounded-2xl shadow-sm border border-muted/20 flex flex-col hover:border-primary/40 transition-all text-left group">
          <div className="w-full h-24 bg-secondary/5 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-secondary/10 transition-colors">
             <div className="w-16 h-16 rounded-full bg-secondary/20 animate-pulse absolute" />
             <Play className="w-8 h-8 text-secondary drop-shadow-sm relative z-10" />
          </div>
          <h3 className="text-md font-serif font-bold text-foreground">Box Breathing</h3>
          <p className="text-xs text-muted-foreground mt-1">4-4-4-4 breathing.</p>
        </button>

        {/* Zen Garden */}
        <button onClick={() => setActiveGame('zen')} className="bg-card p-4 rounded-2xl shadow-sm border border-muted/20 flex flex-col hover:border-primary/40 transition-all text-left group">
          <div className="w-full h-24 bg-[#F5EFE6] rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-[#EAE0CD] transition-colors">
             <div className="absolute inset-0 flex flex-col justify-evenly p-2 opacity-50"><div className="w-full h-1 bg-[#D9CDB8] rounded-full"/><div className="w-full h-1 bg-[#D9CDB8] rounded-full"/></div>
             <Play className="w-8 h-8 text-stone-500 drop-shadow-sm relative z-10" />
          </div>
          <h3 className="text-md font-serif font-bold text-foreground">Zen Garden</h3>
          <p className="text-xs text-muted-foreground mt-1">Draw in the sand.</p>
        </button>

        {/* Color Match */}
        <button onClick={() => setActiveGame('color')} className="bg-card p-4 rounded-2xl shadow-sm border border-muted/20 flex flex-col hover:border-primary/40 transition-all text-left group">
          <div className="w-full h-24 bg-accent/5 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-accent/10 transition-colors">
             <div className="w-6 h-6 rounded-full bg-rose-300 absolute top-4 left-4" />
             <div className="w-8 h-8 rounded-full bg-sky-300 absolute bottom-2 right-6" />
             <Play className="w-8 h-8 text-accent drop-shadow-sm relative z-10" />
          </div>
          <h3 className="text-md font-serif font-bold text-foreground">Color Match</h3>
          <p className="text-xs text-muted-foreground mt-1">Tap matching colors.</p>
        </button>

        {/* Memory Match */}
        <button onClick={() => setActiveGame('memory')} className="bg-card p-4 rounded-2xl shadow-sm border border-muted/20 flex flex-col hover:border-primary/40 transition-all text-left group">
          <div className="w-full h-24 bg-stone-100 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-stone-200 transition-colors">
             <div className="w-8 h-10 bg-white rounded shadow-sm transform -rotate-12 absolute left-6" />
             <div className="w-8 h-10 bg-white rounded shadow-sm transform rotate-6 absolute right-8" />
             <Play className="w-8 h-8 text-stone-400 drop-shadow-sm relative z-10" />
          </div>
          <h3 className="text-md font-serif font-bold text-foreground">Memory Match</h3>
          <p className="text-xs text-muted-foreground mt-1">Gentle card pairing.</p>
        </button>

        {/* Ripple Pond */}
        <button onClick={() => setActiveGame('ripple')} className="bg-card p-4 rounded-2xl shadow-sm border border-muted/20 flex flex-col hover:border-primary/40 transition-all text-left group">
          <div className="w-full h-24 bg-cyan-900 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-cyan-800 transition-colors">
             <div className="w-16 h-16 rounded-full border-2 border-cyan-300/30 absolute scale-150" />
             <div className="w-16 h-16 rounded-full border-2 border-cyan-300/50 absolute scale-100" />
             <div className="w-16 h-16 rounded-full border-2 border-cyan-300/80 absolute scale-50" />
             <Play className="w-8 h-8 text-cyan-200 drop-shadow-sm relative z-10" />
          </div>
          <h3 className="text-md font-serif font-bold text-foreground">Ripple Pond</h3>
          <p className="text-xs text-muted-foreground mt-1">Sensory water tapping.</p>
        </button>

        {/* Mandala Draw */}
        <button onClick={() => setActiveGame('mandala')} className="bg-card p-4 rounded-2xl shadow-sm border border-muted/20 flex flex-col hover:border-primary/40 transition-all text-left group">
          <div className="w-full h-24 bg-amber-50 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-amber-100 transition-colors">
             {/* Simple geometric pattern for thumbnail */}
             <div className="absolute w-12 h-12 border border-amber-200 rotate-45" />
             <div className="absolute w-12 h-12 border border-amber-200 rotate-0" />
             <Play className="w-8 h-8 text-amber-500 drop-shadow-sm relative z-10" />
          </div>
          <h3 className="text-md font-serif font-bold text-foreground">Mandala Draw</h3>
          <p className="text-xs text-muted-foreground mt-1">Symmetrical flow art.</p>
        </button>

        {/* Infinity Trace */}
        <button onClick={() => setActiveGame('infinity')} className="bg-card p-4 rounded-2xl shadow-sm border border-muted/20 flex flex-col hover:border-primary/40 transition-all text-left group">
          <div className="w-full h-24 bg-slate-900 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-slate-800 transition-colors">
             <div className="absolute w-12 h-6 border-2 border-slate-700 rounded-full" />
             <Play className="w-8 h-8 text-indigo-400 drop-shadow-sm relative z-10" />
          </div>
          <h3 className="text-md font-serif font-bold text-foreground">Infinity Trace</h3>
          <p className="text-xs text-muted-foreground mt-1">Slow down and focus.</p>
        </button>

        {/* Star Connect */}
        <button onClick={() => setActiveGame('star')} className="bg-card p-4 rounded-2xl shadow-sm border border-muted/20 flex flex-col hover:border-primary/40 transition-all text-left group">
          <div className="w-full h-24 bg-indigo-950 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-indigo-900 transition-colors">
             <div className="absolute top-4 left-4 w-1 h-1 bg-white rounded-full shadow-[0_0_4px_white]" />
             <div className="absolute bottom-4 right-6 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_4px_white]" />
             <Play className="w-8 h-8 text-indigo-200 drop-shadow-sm relative z-10" />
          </div>
          <h3 className="text-md font-serif font-bold text-foreground">Star Connect</h3>
          <p className="text-xs text-muted-foreground mt-1">Draw constellations.</p>
        </button>

        {/* Cloud Dissolve */}
        <button onClick={() => setActiveGame('cloud')} className="bg-card p-4 rounded-2xl shadow-sm border border-muted/20 flex flex-col hover:border-primary/40 transition-all text-left group">
          <div className="w-full h-24 bg-sky-200 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-sky-300 transition-colors">
             <div className="absolute top-4 left-4 w-8 h-4 bg-white/60 rounded-full blur-sm" />
             <div className="absolute bottom-4 right-4 w-12 h-6 bg-white/60 rounded-full blur-[2px]" />
             <Play className="w-8 h-8 text-sky-600 drop-shadow-sm relative z-10" />
          </div>
          <h3 className="text-md font-serif font-bold text-foreground">Cloud Dissolve</h3>
          <p className="text-xs text-muted-foreground mt-1">Let thoughts float away.</p>
        </button>

        {/* Sliding Puzzle */}
        <button onClick={() => setActiveGame('sliding')} className="bg-card p-4 rounded-2xl shadow-sm border border-muted/20 flex flex-col hover:border-primary/40 transition-all text-left group">
          <div className="w-full h-24 bg-stone-100 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-stone-200 transition-colors">
             <div className="grid grid-cols-3 gap-0.5 w-12 h-12 absolute">
               {[...Array(8)].map((_, i) => <div key={i} className="bg-white rounded-[2px]" />)}
             </div>
             <Play className="w-8 h-8 text-stone-400 drop-shadow-sm relative z-10" />
          </div>
          <h3 className="text-md font-serif font-bold text-foreground">Slide Puzzle</h3>
          <p className="text-xs text-muted-foreground mt-1">Gentle tile sliding.</p>
        </button>

        {/* Melody Grid */}
        <button onClick={() => setActiveGame('melody')} className="bg-card p-4 rounded-2xl shadow-sm border border-muted/20 flex flex-col hover:border-primary/40 transition-all text-left group">
          <div className="w-full h-24 bg-slate-50 rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-slate-100 transition-colors">
             <div className="grid grid-cols-4 gap-1 w-16 h-16 absolute">
               {[...Array(16)].map((_, i) => <div key={i} className={`rounded-[2px] ${i % 5 === 0 ? 'bg-indigo-300' : 'bg-slate-200'}`} />)}
             </div>
             <Play className="w-8 h-8 text-slate-500 drop-shadow-sm relative z-10" />
          </div>
          <h3 className="text-md font-serif font-bold text-foreground">Melody Grid</h3>
          <p className="text-xs text-muted-foreground mt-1">Visual rhythm maker.</p>
        </button>
      </div>

      <h3 className="text-xl font-serif font-semibold text-foreground px-1 pt-8 border-t border-muted/20 mt-8">Mental Exercises</h3>
      <p className="text-sm text-muted-foreground px-1 mb-4">Certified mental grounding exercises (text-based) to rapidly break anxiety loops.</p>
      
      <div className="grid grid-cols-2 gap-4">
        {MINDFULNESS_GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => setSelectedMindGame(game)}
            className="bg-card p-4 rounded-2xl shadow-sm border border-muted/20 flex flex-col hover:border-primary/40 transition-all text-left group"
          >
            <div className={`w-full h-24 ${game.color} rounded-xl mb-3 flex items-center justify-center relative overflow-hidden group-hover:opacity-80 transition-all`}>
              <div className="absolute top-2 right-2 bg-white/50 text-foreground/70 text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap">
                {game.time}
              </div>
              <Play className="w-8 h-8 text-foreground/30 drop-shadow-sm" />
            </div>
            <h4 className="text-md font-serif font-bold text-foreground truncate w-full">{game.title}</h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{game.desc}</p>
          </button>
        ))}
      </div>

      {/* Mind Game Modal */}
      <AnimatePresence>
        {selectedMindGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative ${selectedMindGame.color}`}
            >
              <button 
                onClick={() => setSelectedMindGame(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
              >
                <X className="w-5 h-5 text-foreground/70" />
              </button>
              
              <div className="w-12 h-12 rounded-full bg-white/40 flex items-center justify-center mb-4">
                <Play className="w-5 h-5 text-foreground/60" />
              </div>
              
              <h3 className="text-2xl font-serif font-bold text-foreground mb-2">{selectedMindGame.title}</h3>
              <div className="inline-flex items-center px-2 py-1 rounded-full bg-white/50 text-[11px] font-bold uppercase tracking-wider text-foreground/70 mb-4">
                Duration: {selectedMindGame.time}
              </div>
              
              <p className="text-[15px] leading-relaxed text-foreground/90 font-medium pb-2">
                {selectedMindGame.text}
              </p>
              
              <div className="mt-8">
                <button 
                  onClick={() => setSelectedMindGame(null)}
                  className="w-full py-3.5 bg-white/60 hover:bg-white/80 text-foreground font-semibold rounded-xl transition-colors shadow-sm"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
