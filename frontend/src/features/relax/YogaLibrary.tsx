import React from 'react';
import { AlertCircle } from 'lucide-react';

type YogaPose = {
  id: string;
  name: string;
  instructions: string;
  duration: string;
  illustration: React.ReactNode;
};

const POSES: YogaPose[] = [
  {
    id: 'y1',
    name: "Child's Pose",
    instructions: "Kneel on the floor, sit back on your heels, and walk your hands forward until your forehead rests on the ground. Relax your lower back.",
    duration: "Hold for 5-10 slow breaths",
    illustration: (
      <svg viewBox="0 0 100 100" className="w-full h-full stroke-primary fill-none stroke-[2]" strokeLinecap="round" strokeLinejoin="round">
        <path d="M70 60 Q 60 50 45 55 Q 35 60 25 70" />
        <circle cx="20" cy="75" r="5" className="fill-primary/20" />
        <path d="M45 55 L 85 75" />
        <path d="M70 60 L 75 75 L 50 75" />
      </svg>
    )
  },
  {
    id: 'y2',
    name: "Cat-Cow Stretch",
    instructions: "On your hands and knees, gently arch your back up towards the ceiling (Cat), then let your belly drop towards the floor as you lift your chest (Cow).",
    duration: "Repeat 5-8 times",
    illustration: (
      <svg viewBox="0 0 100 100" className="w-full h-full stroke-primary fill-none stroke-[2]" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 30 50 Q 50 35 70 50" />
        <circle cx="80" cy="45" r="5" className="fill-primary/20" />
        <path d="M 30 50 L 30 75" />
        <path d="M 70 50 L 70 75" />
        <path d="M 40 45 L 40 75" />
        <path d="M 60 45 L 60 75" />
      </svg>
    )
  },
  {
    id: 'y3',
    name: "Reclining Bound Angle",
    instructions: "Lie on your back. Bring the soles of your feet together and let your knees fall open to the sides. Place a hand on your heart and belly.",
    duration: "Hold for 10-15 slow breaths",
    illustration: (
      <svg viewBox="0 0 100 100" className="w-full h-full stroke-primary fill-none stroke-[2]" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 20 60 L 50 60 L 60 50 L 70 60 L 80 60" />
        <circle cx="15" cy="55" r="5" className="fill-primary/20" />
        <path d="M 40 60 Q 55 45 70 60" />
      </svg>
    )
  },
  {
    id: 'y4',
    name: "Seated Gentle Twist",
    instructions: "Sit cross-legged. Place your right hand on your left knee and look over your left shoulder gently. Switch sides.",
    duration: "Hold for 5 breaths per side",
    illustration: (
      <svg viewBox="0 0 100 100" className="w-full h-full stroke-primary fill-none stroke-[2]" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 50 70 L 50 40" />
        <circle cx="50" cy="30" r="5" className="fill-primary/20" />
        <path d="M 30 70 Q 50 80 70 70" />
        <path d="M 50 45 Q 65 55 55 65" />
      </svg>
    )
  },
  {
    id: 'y5',
    name: "Body Scan Meditation",
    instructions: "Lie comfortably. Close your eyes and bring your attention slowly from your toes all the way up to the crown of your head, relaxing each part.",
    duration: "5-10 minutes",
    illustration: (
      <svg viewBox="0 0 100 100" className="w-full h-full stroke-primary fill-none stroke-[2]" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 15 60 L 85 60" />
        <circle cx="20" cy="55" r="5" className="fill-primary/20" />
        <path d="M 35 55 Q 50 45 65 55" className="stroke-secondary stroke-[1] stroke-dasharray-[2 2]" />
      </svg>
    )
  }
];

export default function YogaLibrary() {
  return (
    <div className="space-y-6 animate-in fade-in pb-4">
      {/* Safety Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="text-sm font-medium leading-snug">
          Move gently and stop if anything causes pain — this isn't a substitute for guidance from a doctor or qualified instructor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {POSES.map((pose) => (
          <div key={pose.id} className="bg-card border border-muted/30 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Illustration Area */}
            <div className="h-32 bg-primary/5 flex items-center justify-center p-4">
              <div className="w-24 h-24">
                {pose.illustration}
              </div>
            </div>
            
            {/* Content Area */}
            <div className="p-4 space-y-2">
              <h3 className="font-serif font-bold text-lg text-foreground">{pose.name}</h3>
              <p className="text-sm text-muted-foreground">{pose.instructions}</p>
              <div className="pt-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium tracking-wider">
                  {pose.duration}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
