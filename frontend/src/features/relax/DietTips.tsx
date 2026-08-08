import React, { useState } from 'react';
import { Apple, Droplets, Utensils, ChevronDown, CheckCircle, Leaf, Coffee, Fish, Flame, Carrot, Heart } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { differenceInCalendarDays } from 'date-fns';
import { getPredictionsFn } from '../../api/cycles.api';
import { getPeriodsFn } from '../../api/period.api';
import { cn } from '../../lib/utils';

type Tip = {
  day: number;
  icon: React.ElementType;
  title: string;
  detail: string;
};

// 28-Day Cycle Diet Tips based on clinical/hormonal changes
const CYCLE_DIET_TIPS: Tip[] = [
  // Menstrual Phase (Days 1-5): Focus on iron, hydration, anti-inflammatory, warmth
  { day: 1, icon: Droplets, title: 'Intense Hydration & Warm Teas', detail: 'On day 1, warm liquids like ginger or chamomile tea can relax uterine muscles, while hydration combats bloating.' },
  { day: 2, icon: Heart, title: 'Boost Iron Intake', detail: 'Replenish iron lost during heavy bleeding with spinach, lentils, or lean red meat paired with Vitamin C (like bell peppers) for absorption.' },
  { day: 3, icon: Flame, title: 'Anti-inflammatory Spices', detail: 'Add turmeric, ginger, or cinnamon to your meals to naturally reduce prostaglandin levels and ease cramps.' },
  { day: 4, icon: Coffee, title: 'Magnesium-Rich Snacks', detail: 'Dark chocolate (70%+) or pumpkin seeds can help ease muscle tension and improve mood as bleeding continues.' },
  { day: 5, icon: Apple, title: 'Warm, Easily Digestible Foods', detail: 'Soups and stews are gentle on the digestive tract, which can be sensitive at the end of menstruation.' },
  
  // Follicular Phase (Days 6-12): Focus on light, fresh, energizing foods as estrogen rises
  { day: 6, icon: Leaf, title: 'Fresh Greens & Salads', detail: 'As energy returns, fresh greens provide folate and Vitamin K to support rising estrogen levels.' },
  { day: 7, icon: Carrot, title: 'Fermented Foods', detail: 'Support gut health with kimchi, yogurt, or sauerkraut. A healthy gut helps metabolize hormones effectively.' },
  { day: 8, icon: Utensils, title: 'Lean Proteins', detail: 'Chicken, tofu, or beans provide amino acids necessary for building the uterine lining and supporting energy.' },
  { day: 9, icon: Fish, title: 'Omega-3 Fatty Acids', detail: 'Flaxseeds, chia seeds, or salmon help keep cell membranes healthy and reduce underlying inflammation.' },
  { day: 10, icon: Apple, title: 'Complex Carbohydrates', detail: 'Oats, quinoa, and sweet potatoes provide sustained energy for your increasingly active body.' },
  { day: 11, icon: Carrot, title: 'Cruciferous Vegetables', detail: 'Broccoli, cauliflower, and Brussels sprouts contain DIM, a compound that helps the liver process excess estrogen.' },
  { day: 12, icon: Droplets, title: 'Hydrating Fruits', detail: 'Watermelon, cucumber, and berries provide hydration and antioxidants right before ovulation.' },
  
  // Ovulatory Phase (Days 13-15): Support the egg release, focus on zinc and antioxidants
  { day: 13, icon: Heart, title: 'Zinc for Ovulation Support', detail: 'Oysters, hemp seeds, and lentils are rich in zinc, which is crucial for healthy egg maturation and release.' },
  { day: 14, icon: Leaf, title: 'Antioxidant Powerhouse', detail: 'Berries and dark leafy greens protect the egg from oxidative stress during ovulation.' },
  { day: 15, icon: Utensils, title: 'Lighter Meals', detail: 'Body temperature spikes slightly. Lighter, raw, or gently steamed meals can feel better on the digestive system now.' },
  
  // Luteal Phase (Days 16-28): Progesterone rises. Focus on stabilizing blood sugar, combating PMS
  { day: 16, icon: Fish, title: 'Healthy Fats for Progesterone', detail: 'Avocados, nuts, and olive oil provide the cholesterol building blocks needed to produce progesterone.' },
  { day: 17, icon: Carrot, title: 'Root Vegetables', detail: 'Roasted carrots, sweet potatoes, and squash satisfy natural carb cravings while keeping blood sugar stable.' },
  { day: 18, icon: Apple, title: 'Fiber-Rich Foods', detail: 'Progesterone can slow digestion. Beans, whole grains, and apples help prevent constipation.' },
  { day: 19, icon: Coffee, title: 'Limit Caffeine', detail: 'As you enter the mid-luteal phase, reducing caffeine can help prevent breast tenderness and anxiety.' },
  { day: 20, icon: Utensils, title: 'Vitamin B6', detail: 'Bananas, chickpeas, and poultry contain B6, which helps synthesize serotonin and ease mood swings.' },
  { day: 21, icon: Droplets, title: 'Reduce Sodium', detail: 'Cut back on highly processed foods and salt to prevent the water retention that typically starts now.' },
  { day: 22, icon: Heart, title: 'Calcium & Vitamin D', detail: 'Dairy, fortified milks, and leafy greens. Calcium has been shown in studies to reduce PMS severity.' },
  { day: 23, icon: Flame, title: 'Warm Grounding Meals', detail: 'Shift from raw salads to cooked, warm meals (like curries or roasted veg) to comfort the body.' },
  { day: 24, icon: Apple, title: 'Complex Carbs over Sugar', detail: 'Sugar cravings peak! Reach for fruit, dates, or dark chocolate instead of refined sweets to avoid a crash.' },
  { day: 25, icon: Coffee, title: 'Magnesium for Cramp Prep', detail: 'Load up on spinach, almonds, and black beans to relax the uterus before bleeding starts.' },
  { day: 26, icon: Leaf, title: 'Dandelion or Peppermint Tea', detail: 'Herbal teas can act as mild, natural diuretics to help flush out pre-period bloating.' },
  { day: 27, icon: Fish, title: 'Omega-3s for Pain Prevention', detail: 'High doses of Omega-3s now can block prostaglandin production, reducing the severity of upcoming cramps.' },
  { day: 28, icon: Heart, title: 'Iron Preparation', detail: 'Start loading up on iron-rich foods today so your stores are high before your period begins tomorrow.' }
];

export default function DietTips() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: predictionsData } = useQuery({
    queryKey: ['predictions'],
    queryFn: getPredictionsFn,
  });

  const { data: periodsData } = useQuery({
    queryKey: ['periods'],
    queryFn: getPeriodsFn,
  });

  const today = new Date();
  const predictions = predictionsData?.data?.predictions;
  const periodLogs = periodsData?.data || [];
  
  // Calculate Cycle Day (1-28) based on most recent period start date
  let currentCycleDay = 1;
  const mostRecentPeriod = [...periodLogs].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())[0];

  if (mostRecentPeriod) {
    const diff = differenceInCalendarDays(today, new Date(mostRecentPeriod.startDate)) + 1;
    currentCycleDay = Math.max(1, Math.min(diff, 28)); // Cap at 28 for tips array
  } else if (predictionsData?.data?.history?.lastPeriodStartDate) {
    const diff = differenceInCalendarDays(today, new Date(predictionsData.data.history.lastPeriodStartDate)) + 1;
    currentCycleDay = Math.max(1, Math.min(diff, 28)); // Cap at 28 for tips array
  }

  // Get today's specific tip and a few general ones
  const todayTip = CYCLE_DIET_TIPS.find(t => t.day === currentCycleDay) || CYCLE_DIET_TIPS[0];
  
  // Show only today's tip
  const upcomingTips = [todayTip];

  return (
    <div className="space-y-6 animate-in fade-in pb-8">
      
      <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-6 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
        <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-2 flex items-center gap-1">
          Cycle Day {currentCycleDay}
        </h3>
        <p className="text-lg font-serif font-semibold text-foreground leading-tight mb-2">
          Your Daily Nutrition Guide
        </p>
        <p className="text-sm text-muted-foreground">
          Your hormones shift every day. This daily guide recommends foods to support your body's specific phase right now, based on clinical research.
        </p>
      </div>

      <div className="space-y-4 mt-6">
        {upcomingTips.map((tip, idx) => {
          const isExpanded = expandedId === tip.day.toString();
          const isToday = idx === 0;

          return (
            <div 
              key={`${tip.day}-${idx}`}
              onClick={() => setExpandedId(isExpanded ? null : tip.day.toString())}
              className={cn(
                "bg-card border rounded-2xl p-4 cursor-pointer transition-all shadow-sm",
                isToday ? "border-primary/40 ring-1 ring-primary/20" : "border-muted/30 hover:border-primary/30"
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  isToday ? "bg-primary/20" : "bg-muted/20"
                )}>
                  <tip.icon className={cn("w-5 h-5", isToday ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {isToday && (
                      <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">Today</span>
                    )}
                    {!isToday && (
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Day {tip.day}</span>
                    )}
                  </div>
                  <h3 className="text-foreground font-medium pr-6 relative">
                    {tip.title}
                    <ChevronDown 
                      className={cn(
                        "w-4 h-4 text-muted-foreground absolute right-0 top-1 transition-transform",
                        isExpanded && "rotate-180"
                      )} 
                    />
                  </h3>
                  <div 
                    className={cn(
                      "grid transition-all duration-200 ease-in-out",
                      isExpanded ? "grid-rows-[1fr] opacity-100 mt-2" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tip.detail}
                      </p>
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
