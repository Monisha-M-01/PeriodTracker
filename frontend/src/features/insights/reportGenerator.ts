import { differenceInCalendarDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

export interface ReportSection {
  title: string;
  content: string;
}

export function generateMedicalReport(stats: any, predictionsData: any, windowDays: number, checkIns: any[] = []): ReportSection[] {
  const sections: ReportSection[] = [];
  const today = new Date();

  // 1. How you were feeling (Symptomatology & Affect)
  let feelingText = "";
  if (stats.moodCounts && stats.moodCounts.length > 0) {
    const topMoods = stats.moodCounts.slice(0, 2).map((m: any) => m[0].replace('_', ' '));
    feelingText += `Your mood was predominantly characterized as ${topMoods.join(' and ')}. `;
  } else {
    feelingText += "You didn't log any strong moods. ";
  }

  const validSymptoms = stats.symptomCounts ? stats.symptomCounts.filter((s: any) => s[0] !== 'nothing_new') : [];
  if (validSymptoms.length > 0) {
    const topSymptoms = validSymptoms.slice(0, 3).map((s: any) => s[0].replace('_', ' '));
    feelingText += `You frequently experienced ${topSymptoms.join(', ')}. `;
  } else {
    feelingText += "You didn't log any significant physical symptoms. ";
  }

  if (stats.sleepLogsCount > 0) {
    const avgSleepHours = (stats.avgSleepMins / 60).toFixed(1);
    feelingText += `You averaged ${avgSleepHours} hours of sleep. `;
  }

  sections.push({
    title: "How You Were Feeling",
    content: feelingText
  });

  const topMood = stats.moodCounts && stats.moodCounts.length > 0 ? stats.moodCounts[0][0] : null;
  const topSymptom = validSymptoms.length > 0 ? validSymptoms[0][0] : null;

  // 2. How the phase affected you
  let phaseText = "You haven't logged your last period yet! Once you log a period, we can determine your cycle phase and how it affects your symptoms.";
  
  const history = predictionsData?.data?.history;
  const p = predictionsData?.data?.predictions;

  if (!history?.lastPeriodStartDate && (topMood || topSymptom)) {
    phaseText += "\n\nFor example, we could tell you if ";
    if (topMood && topSymptom) {
      phaseText += `your ${topMood.replace('_', ' ')} mood and ${topSymptom.replace('_', ' ')} `;
    } else if (topMood) {
      phaseText += `your ${topMood.replace('_', ' ')} mood `;
    } else {
      phaseText += `your ${topSymptom.replace('_', ' ')} `;
    }
    phaseText += "are typically triggered by a specific part of your cycle, like the luteal phase.";
  }

  let normalcyText = "";
  if (topSymptom) {
    normalcyText = `Based on your logs over the last ${windowDays} days, you frequently experienced ${topSymptom.replace('_', ' ')}. Recognizing this pattern is a great first step in tracking your personal baseline.`;
  } else if (topMood) {
    normalcyText = `Based on your logs over the last ${windowDays} days, your tendency to feel ${topMood.replace('_', ' ')} is a clear personal pattern. This consistency shows good self-awareness.`;
  } else {
    normalcyText = `Based on your logs over the last ${windowDays} days, you have a steady tracking pattern with no single overwhelming symptom or mood, which is completely normal.`;
  }
  
  if (history?.lastPeriodStartDate && p) {
    
    const getPhase = (dateStr: string) => {
      if (!history.lastPeriodStartDate) return null;
      const date = new Date(dateStr);
      const cDay = differenceInCalendarDays(date, new Date(history.lastPeriodStartDate)) + 1;
      
      const fertileStart = p.fertileWindowStart ? startOfDay(new Date(p.fertileWindowStart)) : null;
      const fertileEnd = p.fertileWindowEnd ? endOfDay(new Date(p.fertileWindowEnd)) : null;
      const periodStart = p.nextPeriodStart ? startOfDay(new Date(p.nextPeriodStart)) : null;
      
      if (cDay >= 1 && cDay <= 6) return 'menstrual';
      if (fertileStart && fertileEnd && isWithinInterval(date, { start: fertileStart, end: fertileEnd })) return 'ovulatory';
      if (fertileEnd && periodStart && date >= fertileEnd && date < periodStart) return 'luteal';
      return 'follicular';
    };

    const phaseMoods: Record<string, Record<string, number>> = { menstrual: {}, ovulatory: {}, luteal: {}, follicular: {} };
    const phaseSymptoms: Record<string, Record<string, number>> = { menstrual: {}, ovulatory: {}, luteal: {}, follicular: {} };

    checkIns.forEach(ci => {
      const phase = getPhase(ci.date);
      if (!phase) return;
      
      if (ci.moodString) {
        try {
          const moods: string[] = JSON.parse(ci.moodString);
          moods.forEach(m => {
             phaseMoods[phase][m] = (phaseMoods[phase][m] || 0) + 1;
          });
        } catch(e) {}
      }
      
      if (ci.symptoms) {
        try {
          const symptoms: string[] = JSON.parse(ci.symptoms);
          symptoms.forEach(s => {
             if (s !== 'nothing_new') {
               phaseSymptoms[phase][s] = (phaseSymptoms[phase][s] || 0) + 1;
             }
          });
        } catch(e) {}
      }
    });

    let topMoodPhase = null;
    let topMoodPhaseCount = 0;
    
    if (topMood) {
      Object.entries(phaseMoods).forEach(([phase, counts]) => {
        if (counts[topMood] > topMoodPhaseCount) {
          topMoodPhaseCount = counts[topMood];
          topMoodPhase = phase;
        }
      });
    }

    let topSymptomPhase = null;
    let topSymptomPhaseCount = 0;
    
    if (topSymptom) {
      Object.entries(phaseSymptoms).forEach(([phase, counts]) => {
        if (counts[topSymptom] > topSymptomPhaseCount) {
          topSymptomPhaseCount = counts[topSymptom];
          topSymptomPhase = phase;
        }
      });
    }

    let correlationText = "";
    const timeRef = windowDays === 7 ? 'week' : 'period';
    
    if (topSymptomPhase && topSymptom) {
       correlationText += `You logged ${topSymptom.replace('_', ' ')} mostly during your ${topSymptomPhase} phase this ${timeRef}. `;
    }
    
    if (topMoodPhase && topMood) {
       if (topMoodPhase === topSymptomPhase && topSymptomPhase !== null) {
         correlationText += `Your ${topMood.replace('_', ' ')} mood was also most prominent during this phase. `;
       } else {
         correlationText += `Your ${topMood.replace('_', ' ')} mood was most prominent in your ${topMoodPhase} phase. `;
       }
    }
    
    if (!correlationText) {
       correlationText = `Your moods and symptoms were distributed across your cycle without a single dominant phase correlation. `;
    }
    
    phaseText = correlationText;

    // 3. Is it normal? (Personalized Comparison)
    if (topSymptomPhase && topSymptom) {
      normalcyText = `It is a clear pattern for you to experience ${topSymptom.replace('_', ' ')} during your ${topSymptomPhase} phase. Based on your logged data over the last ${windowDays} days, this is consistent with your own natural hormonal shifts.`;
    } else if (topMoodPhase && topMood) {
      normalcyText = `Your tendency to feel ${topMood.replace('_', ' ')} during your ${topMoodPhase} phase is a distinct personal pattern for you over the last ${windowDays} days. This kind of consistency is a great sign of self-awareness.`;
    } else {
      normalcyText = `Based on your logs over the last ${windowDays} days, your symptoms and moods don't cluster heavily in one specific phase. This steady pattern is completely normal and shows good overall balance.`;
    }
  }

  sections.push({
    title: "How Your Cycle Phase Affected You",
    content: phaseText
  });

  sections.push({
    title: "Is This Normal?",
    content: normalcyText
  });

  return sections;
}
