import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const [isHappy, setIsHappy] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('cycle-theme');
    if (saved === 'happy') {
      setIsHappy(true);
      document.documentElement.classList.add('theme-happy');
    }
  }, []);

  const toggleTheme = () => {
    setIsHappy((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('theme-happy');
        localStorage.setItem('cycle-theme', 'happy');
      } else {
        document.documentElement.classList.remove('theme-happy');
        localStorage.setItem('cycle-theme', 'calm');
      }
      return next;
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm transition-all hover:scale-105 active:scale-95",
        isHappy ? "bg-white/80 border-primary text-primary" : "bg-card border-muted text-foreground/80",
        className
      )}
      title="Toggle Happy Mode"
    >
      {isHappy ? <Sun size={16} strokeWidth={2.5} /> : <Moon size={16} strokeWidth={2.5} />}
      <span className="text-sm font-medium font-sans">{isHappy ? 'Happy' : 'Calm'}</span>
    </button>
  );
};
