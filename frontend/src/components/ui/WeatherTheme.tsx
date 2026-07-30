import React from 'react';
import { motion } from 'framer-motion';

type WeatherType = 'rain' | 'clouds' | 'stars' | 'storm' | 'none';

interface WeatherThemeProps {
  moods: string[];
}

export const WeatherTheme: React.FC<WeatherThemeProps> = ({ moods }) => {
  // Determine weather type based on moods
  let weather: WeatherType = 'none';
  
  if (moods.some(m => ['anxious', 'irritable'].includes(m))) {
    weather = 'storm';
  } else if (moods.some(m => ['sad', 'down', 'tired', 'low_energy', 'meh'].includes(m))) {
    weather = 'rain';
  } else if (moods.some(m => ['excited', 'loved', 'happy'].includes(m))) {
    weather = 'stars';
  } else if (moods.some(m => ['calm', 'neutral'].includes(m))) {
    weather = 'clouds';
  }

  if (weather === 'none') return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Darken background slightly for evening effect */}
      <div className="absolute inset-0 bg-indigo-900/10 mix-blend-multiply" />

      {weather === 'rain' && (
        <div className="absolute inset-0 flex justify-around">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`rain-${i}`}
              className="w-0.5 h-8 bg-blue-300/40 rounded-full"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: ['0vh', '100vh'], opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 1 + Math.random() * 0.5,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'linear'
              }}
            />
          ))}
        </div>
      )}

      {weather === 'clouds' && (
        <div className="absolute inset-0 opacity-50">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`cloud-${i}`}
              className="absolute bg-white/30 blur-3xl rounded-full"
              style={{
                width: 200 + Math.random() * 200,
                height: 100 + Math.random() * 100,
                top: `${10 + Math.random() * 40}%`,
              }}
              initial={{ x: '-100%' }}
              animate={{ x: '200vw' }}
              transition={{
                duration: 40 + Math.random() * 20,
                repeat: Infinity,
                delay: -Math.random() * 20,
                ease: 'linear'
              }}
            />
          ))}
        </div>
      )}

      {weather === 'storm' && (
        <div className="absolute inset-0 opacity-60">
          <div className="absolute inset-0 bg-slate-900/20 mix-blend-multiply" />
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`storm-cloud-${i}`}
              className="absolute bg-slate-700/40 blur-3xl rounded-full"
              style={{
                width: 300,
                height: 150,
                top: `${Math.random() * 30}%`,
              }}
              initial={{ x: '-100%' }}
              animate={{ x: '200vw' }}
              transition={{
                duration: 30 + Math.random() * 10,
                repeat: Infinity,
                delay: -Math.random() * 20,
                ease: 'linear'
              }}
            />
          ))}
          {/* Lightning effect */}
          <motion.div
            className="absolute inset-0 bg-white"
            animate={{ opacity: [0, 0, 0.8, 0, 0, 0.4, 0, 0] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              times: [0, 0.8, 0.82, 0.85, 0.9, 0.92, 0.95, 1]
            }}
          />
        </div>
      )}

      {weather === 'stars' && (
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-yellow-100 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
