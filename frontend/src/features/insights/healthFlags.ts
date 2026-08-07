import { differenceInDays, parseISO } from 'date-fns';

export interface HealthFlag {
  id: string;
  message: string;
}

export function getHealthAwarenessFlags(checkIns: any[], predictionsData: any): { flags: HealthFlag[], hasEnoughData: boolean } {
  const flags: HealthFlag[] = [];
  const today = new Date();

  // If there are no check-ins or predictions, we don't have enough data
  if (!checkIns || checkIns.length === 0 || !predictionsData?.data?.predictions) {
    return { flags, hasEnoughData: false };
  }

  const p = predictionsData.data.predictions;
  const history = predictionsData.data.history || {};
  const avgCycleLength = history.avgCycleLength || 28;

  // We need to parse checkIns to find period days
  // Sort check-ins by date ascending
  const sortedCheckIns = [...checkIns].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Calculate period duration and heavy bleeding for the most recent period block
  let currentPeriodStreak = 0;
  let heavyDaysCount = 0;
  
  // To handle multiple periods in a wide window, we'll just look for the longest streak
  // or the latest streak. Let's look at the latest contiguous block of bleeding.
  
  let maxPeriodStreak = 0;
  let maxHeavyRatio = 0;

  let tempStreak = 0;
  let tempHeavy = 0;

  sortedCheckIns.forEach(ci => {
    if (ci.flowIntensity && ci.flowIntensity !== 'none') {
      tempStreak++;
      if (ci.flowIntensity === 'heavy') {
        tempHeavy++;
      }
    } else {
      // Streak broken
      if (tempStreak > maxPeriodStreak) {
        maxPeriodStreak = tempStreak;
        maxHeavyRatio = tempHeavy / tempStreak;
      }
      tempStreak = 0;
      tempHeavy = 0;
    }
  });
  
  // Check the final streak if the period hasn't ended yet
  if (tempStreak > maxPeriodStreak) {
    maxPeriodStreak = tempStreak;
    maxHeavyRatio = tempHeavy / tempStreak;
  }

  // FLAG 1: Period Duration (> 7 days)
  if (maxPeriodStreak > 7) {
    flags.push({
      id: 'long-period',
      message: `Your period lasted ${maxPeriodStreak} days this cycle. Periods lasting longer than 7 days are generally worth discussing with a doctor.`
    });
  }

  // FLAG 2: Heavy Bleeding Pattern (> 50% of days were heavy, and at least 2 days of heavy flow)
  if (maxPeriodStreak > 0 && maxHeavyRatio > 0.5 && (maxHeavyRatio * maxPeriodStreak) >= 2) {
    flags.push({
      id: 'heavy-bleeding',
      message: `You logged heavy flow for most of this period. Consistently heavy bleeding is worth mentioning to a doctor.`
    });
  }

  // FLAG 3: Cycle Length Irregularity
  // We can look at the average cycle length vs the guidelines (21-35)
  if (history.avgCycleLength) {
    if (avgCycleLength < 21) {
      flags.push({
        id: 'short-cycle',
        message: `Your recent average cycle length is ${Math.round(avgCycleLength)} days. Cycles shorter than 21 days are generally worth discussing with a doctor.`
      });
    } else if (avgCycleLength > 35) {
      flags.push({
        id: 'long-cycle',
        message: `Your recent average cycle length is ${Math.round(avgCycleLength)} days. Cycles longer than 35 days are generally worth discussing with a doctor.`
      });
    }
  }

  // FLAG 4: Delayed Period
  if (p.lastPeriodStartDate) {
    const daysSinceLastPeriod = differenceInDays(today, parseISO(p.lastPeriodStartDate));
    // If it's been significantly longer than their average + 7 days
    if (daysSinceLastPeriod > (avgCycleLength + 7)) {
      flags.push({
        id: 'delayed-period',
        message: `It has been ${daysSinceLastPeriod} days since your last logged period, which is longer than your usual cycle length.`
      });
    }
  }

  // We have data, so hasEnoughData is true
  return { flags, hasEnoughData: true };
}
