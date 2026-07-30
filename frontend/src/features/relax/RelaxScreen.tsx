import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import GamesSubSection from './GamesSubSection';
import DietTips from './DietTips';
import StressTips from './StressTips';
import YogaLibrary from './YogaLibrary';
import CalmingSounds from './CalmingSounds';

type TabType = 'games' | 'diet' | 'stress' | 'yoga' | 'sounds';

export default function RelaxScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('games');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'games', label: 'Games' },
    { id: 'diet', label: 'Maintain Diet' },
    { id: 'stress', label: 'Manage Stress' },
    { id: 'yoga', label: 'Yoga & Meditation' },
    { id: 'sounds', label: 'Calming Sounds' },
  ];

  return (
    <div className="space-y-6 pb-6 h-full flex flex-col animate-in fade-in">
      <header className="flex flex-col space-y-2">
        <h1 className="text-3xl font-serif font-bold text-primary">Relax</h1>
        <p className="text-muted-foreground font-medium">Take a moment for yourself.</p>
      </header>

      {/* Scrollable Tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-2 no-scrollbar scroll-smooth">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 mt-2">
        {activeTab === 'games' && <GamesSubSection />}
        {activeTab === 'diet' && <DietTips />}
        {activeTab === 'stress' && <StressTips onStartBreathing={() => setActiveTab('games')} />}
        {activeTab === 'yoga' && <YogaLibrary />}
        {activeTab === 'sounds' && <CalmingSounds />}
      </div>
    </div>
  );
}
