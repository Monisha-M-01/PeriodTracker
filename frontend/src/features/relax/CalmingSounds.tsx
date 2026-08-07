import React, { useState } from 'react';
import { Play, Square, Volume2, VolumeX, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useHaptics } from '../../hooks/useHaptics';

type SoundTrack = {
  id: string;
  name: string;
  source: string;
  file: string;
};

const SOUNDS: SoundTrack[] = [
  { id: 'zen-river', name: 'Zen River Flowing', source: 'Local Audio', file: '/audio/zen-river.mp3' },
  { id: 'forest-ambience', name: 'Forest Ambience', source: 'Local Audio', file: '/audio/forest-ambience.mp3' },
  { id: 'ocean-waves', name: 'Ocean Waves', source: 'Local Audio', file: '/audio/ocean-waves.mp3' },
  { id: 'waterfall', name: 'Waterfall', source: 'Local Audio', file: '/audio/waterfall.mp3' },
  { id: 'wind-bamboo', name: 'Wind in Bamboo', source: 'Local Audio', file: '/audio/wind-bamboo.mp3' },
  { id: 'temple-bells', name: 'Temple Bells', source: 'Local Audio', file: '/audio/temple-bells.mp3' },
  { id: 'calming-rain', name: 'Calming Rain', source: 'Local Audio', file: '/audio/calming-rain.mp3' },
  { id: 'night-crickets', name: 'Night Crickets', source: 'Local Audio', file: '/audio/night-crickets.mp3' },
  { id: 'campfire', name: 'Campfire', source: 'Local Audio', file: '/audio/campfire.mp3' },
  { id: 'forest-birds', name: 'Forest Birds', source: 'Local Audio', file: '/audio/forest-birds.mp3' },
  { id: 'rain-on-leaves', name: 'Rain on Leaves', source: 'Local Audio', file: '/audio/rain-on-leaves.mp3' },
  { id: 'the-barrel', name: 'The Barrel Beneath The Eaves', source: 'Local Audio', file: '/audio/the-barrel-beneath-the-eaves.mp3' },
];

export default function CalmingSounds() {
  const [playingId, setPlayingId] = React.useState<string | null>(null);
  const [isMuted, setIsMuted] = React.useState(false);
  const [volume, setVolume] = React.useState(50);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const triggerHaptic = useHaptics();

  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100;
    }
  }, [volume, isMuted]);

  React.useEffect(() => {
    if (audioRef.current) {
      if (playingId) {
        const track = SOUNDS.find(s => s.id === playingId);
        if (track) {
          if (!audioRef.current.src.endsWith(track.file)) {
            audioRef.current.src = track.file;
          }
          audioRef.current.play().catch(console.error);
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [playingId]);

  const handlePlayToggle = (id: string) => {
    triggerHaptic('medium');
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-6">
      <audio ref={audioRef} loop />
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Music className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-foreground">Relaxing Audio Library</p>
            <p className="text-xs text-muted-foreground">
              Select a track below to play soothing background sounds.
            </p>
          </div>
        </div>
      </div>

      {/* Global Controls */}
      <div className="flex items-center justify-between bg-card border border-muted/30 p-4 rounded-2xl shadow-sm">
        <span className="text-sm font-medium text-foreground">Global Volume</span>
        <div className="flex items-center gap-3 w-1/2 max-w-[200px]">
          <button onClick={() => { triggerHaptic('light'); setIsMuted(!isMuted); }} className="text-muted-foreground hover:text-foreground">
            {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={isMuted ? 0 : volume} 
            onChange={(e) => {
              setVolume(parseInt(e.target.value));
              if (parseInt(e.target.value) > 0) setIsMuted(false);
            }}
            className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SOUNDS.map((track) => {
          const isPlaying = playingId === track.id;
          
          return (
            <motion.div 
              key={track.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative overflow-hidden bg-card border rounded-[20px] p-4 flex items-center justify-between shadow-sm transition-all duration-500",
                isPlaying ? "border-primary/50 shadow-[0_0_20px_rgba(193,95,60,0.15)] bg-gradient-to-br from-primary/5 to-transparent" : "border-muted/30 hover:border-primary/30"
              )}
            >
              {/* Background ambient glow if playing */}
              <AnimatePresence>
                {isPlaying && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"
                  />
                )}
              </AnimatePresence>

              <div className="flex-1 min-w-0 pr-4 z-10">
                <h3 className={cn("font-medium truncate transition-colors", isPlaying ? "text-primary font-semibold" : "text-foreground")}>{track.name}</h3>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{track.source}</p>
                <AnimatePresence>
                  {isPlaying && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-end gap-1 mt-3 h-4"
                    >
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            height: ["20%", "100%", "20%"],
                          }}
                          transition={{
                            duration: 0.8 + (Math.random() * 0.5),
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.1
                          }}
                          className="w-1.5 bg-primary rounded-t-sm"
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <button
                onClick={() => handlePlayToggle(track.id)}
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors focus:outline-none z-10",
                  isPlaying 
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90" 
                    : "bg-secondary/10 text-secondary hover:bg-secondary/20"
                )}
              >
                {isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
