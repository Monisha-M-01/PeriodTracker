import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { differenceInCalendarDays } from 'date-fns';
import { getPredictionsFn } from '../../api/cycles.api';
import { getPeriodsFn } from '../../api/period.api';

type YogaPose = {
  id: string;
  name: string;
  instructions: string;
  duration: string;
  illustration: React.ReactNode;
};

const POSE_CHILDS = {
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
};

const POSE_CAT_COW = {
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
};

const POSE_BOUND_ANGLE = {
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
};

const POSE_TWIST = {
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
};

const POSE_MEDITATION = {
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
};

const POSE_DOWN_DOG = {
  id: 'y6',
  name: "Downward-Facing Dog",
  instructions: "From hands and knees, tuck your toes and lift your hips up and back. Keep a slight bend in your knees if your hamstrings are tight.",
  duration: "Hold for 5-8 breaths",
  illustration: (
    <svg viewBox="0 0 100 100" className="w-full h-full stroke-primary fill-none stroke-[2]" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 20 80 L 50 30 L 80 80" />
      <circle cx="50" cy="20" r="5" className="fill-primary/20" />
      <path d="M 50 30 L 40 50 L 50 70" />
    </svg>
  )
};

const POSE_WARRIOR_2 = {
  id: 'y7',
  name: "Warrior II",
  instructions: "Step your feet wide apart. Turn your right foot out 90 degrees and bend the right knee. Extend arms out to the sides, gazing over your right hand.",
  duration: "Hold for 5 breaths per side",
  illustration: (
    <svg viewBox="0 0 100 100" className="w-full h-full stroke-primary fill-none stroke-[2]" strokeLinecap="round" strokeLinejoin="round">
      <path d="M 50 40 L 50 60 L 30 80" />
      <path d="M 50 60 L 70 80" />
      <path d="M 20 40 L 80 40" />
      <circle cx="50" cy="25" r="5" className="fill-primary/20" />
    </svg>
  )
};

const PHASE_YOGA_PROGRAMS = {
  menstrual: {
    title: "Menstrual Phase Rest",
    description: "Gentle, restorative poses to ease cramps, support the lower back, and conserve your energy.",
    poses: [POSE_CHILDS, POSE_BOUND_ANGLE, POSE_TWIST]
  },
  follicular: {
    title: "Follicular Phase Flow",
    description: "Energizing and strengthening poses to match your rising estrogen levels and increasing stamina.",
    poses: [POSE_DOWN_DOG, POSE_WARRIOR_2, POSE_CAT_COW]
  },
  ovulatory: {
    title: "Ovulatory Phase Power",
    description: "Heart-opening and active poses. Your energy is peaking, making this a great time for expression and flow.",
    poses: [POSE_WARRIOR_2, POSE_TWIST, POSE_DOWN_DOG]
  },
  luteal: {
    title: "Luteal Phase Grounding",
    description: "Calming poses to help reduce PMS symptoms, stabilize mood, and gently stretch the body as you wind down.",
    poses: [POSE_CAT_COW, POSE_MEDITATION, POSE_CHILDS]
  }
};

export default function YogaLibrary() {
  const { data: predictionsData } = useQuery({ queryKey: ['predictions'], queryFn: getPredictionsFn });
  const { data: periodsData } = useQuery({ queryKey: ['periods'], queryFn: getPeriodsFn });

  const today = new Date();
  const periodLogs = periodsData?.data || [];
  let currentCycleDay = 1;
  const mostRecentPeriod = [...periodLogs].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];

  if (mostRecentPeriod) {
    currentCycleDay = differenceInCalendarDays(today, new Date(mostRecentPeriod.startDate)) + 1;
  } else if (predictionsData?.data?.history?.lastPeriodStartDate) {
    currentCycleDay = differenceInCalendarDays(today, new Date(predictionsData.data.history.lastPeriodStartDate)) + 1;
  }

  // Determine current phase based on typical cycle lengths
  let currentPhaseKey: keyof typeof PHASE_YOGA_PROGRAMS = 'follicular';
  if (currentCycleDay >= 1 && currentCycleDay <= 5) {
    currentPhaseKey = 'menstrual';
  } else if (currentCycleDay >= 6 && currentCycleDay <= 13) {
    currentPhaseKey = 'follicular';
  } else if (currentCycleDay >= 14 && currentCycleDay <= 17) {
    currentPhaseKey = 'ovulatory';
  } else {
    currentPhaseKey = 'luteal';
  }

  const currentProgram = PHASE_YOGA_PROGRAMS[currentPhaseKey];

  return (
    <div className="space-y-6 animate-in fade-in pb-4">
      {/* Dynamic Header */}
      <div className="bg-secondary/5 border border-secondary/20 rounded-[2rem] p-6 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />
        <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-2">Cycle Day {currentCycleDay}</h3>
        <p className="text-xl font-serif font-semibold text-foreground leading-tight mb-2">
          {currentProgram.title}
        </p>
        <p className="text-sm text-muted-foreground">
          {currentProgram.description}
        </p>
      </div>

      {/* Safety Note */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="text-sm font-medium leading-snug">
          Move gently and stop if anything causes pain — this isn't a substitute for guidance from a doctor or qualified instructor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {currentProgram.poses.map((pose) => (
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
