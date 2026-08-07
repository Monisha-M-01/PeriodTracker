export type CyclePhase = 'period' | 'follicular' | 'luteal' | 'late_luteal';

export function getCyclePhase(cycleDay: number, avgCycleLength: number = 28): CyclePhase {
  if (cycleDay >= 1 && cycleDay <= 5) return 'period';
  if (cycleDay > 5 && cycleDay <= 14) return 'follicular'; // broadly grouping follicular and ovulation
  if (cycleDay > 14 && cycleDay <= avgCycleLength - 5) return 'luteal';
  return 'late_luteal'; // PMS window
}

export function getSymptomTip(symptomId: string, cycleDay: number, avgCycleLength: number = 28): { label: string; text: string } {
  const phase = getCyclePhase(cycleDay, avgCycleLength);
  
  const TIPS: Record<string, { label: string; phaseTips: Record<CyclePhase, string>; defaultTip: string }> = {
    cramps: {
      label: "Cramps",
      defaultTip: "A warm compress, magnesium-rich foods, or gentle stretching can help relax the muscles.",
      phaseTips: {
        period: "Prostaglandins trigger uterine contractions to shed the lining. A warm compress and ibuprofen can provide immediate relief.",
        follicular: "Cramps now are less common, but gentle stretching and hydration can ease muscle tension.",
        luteal: "Mild cramping can occur as progesterone rises. Magnesium-rich foods like dark chocolate or spinach can help.",
        late_luteal: "Pre-menstrual cramps are starting. Try a warm bath and some restorative yoga to relax the pelvic floor."
      }
    },
    nausea: {
      label: "Nausea",
      defaultTip: "Ginger tea, eating small frequent meals, and staying hydrated can soothe nausea.",
      phaseTips: {
        period: "Prostaglandins can affect your stomach. Ginger tea and small, frequent meals are your best bet today.",
        follicular: "Nausea now might be unrelated to your cycle, but staying hydrated and eating plain crackers can settle your stomach.",
        luteal: "Hormonal shifts are kicking in. Peppermint tea and avoiding overly greasy foods can help.",
        late_luteal: "Estrogen drops can trigger nausea. Stick to easy-to-digest foods and keep ginger candies handy."
      }
    },
    fatigue: {
      label: "Fatigue",
      defaultTip: "Prioritize rest, stay hydrated, and listen to your body's need to slow down.",
      phaseTips: {
        period: "Iron loss and low hormones drain your energy. Prioritize rest, early bedtimes, and iron-rich foods like lentils.",
        follicular: "You should have rising energy now. If you're fatigued, ensure you're getting enough B-vitamins and sleep.",
        luteal: "Rising progesterone has a natural sedative effect. It's completely normal to feel sleepier—honor that by resting.",
        late_luteal: "The hormone crash before your period is exhausting. Don't push yourself; light walks are better than intense cardio right now."
      }
    },
    headache: {
      label: "Headache",
      defaultTip: "Staying hydrated, maintaining stable blood sugar, and getting enough sleep can help.",
      phaseTips: {
        period: "Menstrual migraines are triggered by low estrogen. Stay very hydrated and ask your doctor about targeted pain relief.",
        follicular: "Make sure you're drinking enough water and not skipping meals, as blood sugar dips can cause headaches.",
        luteal: "Progesterone fluctuations might be the culprit. Limit caffeine and try a cool compress on your forehead.",
        late_luteal: "Estrogen withdrawal headaches are common now. Magnesium supplements (if approved by a doctor) and rest are key."
      }
    },
    bloating: {
      label: "Bloating",
      defaultTip: "Reducing sodium intake and drinking peppermint tea can help.",
      phaseTips: {
        period: "Your body is holding onto water. Keep drinking water to flush it out, and avoid super salty snacks today.",
        follicular: "Bloating is usually minimal now. If it happens, try adding probiotic-rich foods to your diet.",
        luteal: "Progesterone slows down digestion. Eat plenty of fiber and drink warm lemon water.",
        late_luteal: "Peak water retention time! Dandelion root tea or peppermint tea can provide natural, gentle relief."
      }
    },
    cravings: {
      label: "Cravings",
      defaultTip: "Pair complex carbs with protein to satisfy cravings while keeping your energy stable.",
      phaseTips: {
        period: "You're losing blood and energy. It's okay to indulge a bit, but pair sweets with protein to avoid a crash.",
        follicular: "Cravings are usually lower, but if you have them, listen to what your body is asking for—maybe it needs more carbs for energy.",
        luteal: "Your metabolism actually speeds up slightly now! You need more calories. Honor your hunger with nutrient-dense meals.",
        late_luteal: "Dropping serotonin makes you crave sugar and carbs. Try dark chocolate or sweet potatoes to boost serotonin naturally."
      }
    },
    back_pain: {
      label: "Back Pain",
      defaultTip: "Gentle stretching, heat therapy, or child's pose can provide relief.",
      phaseTips: {
        period: "Uterine contractions are radiating to your lower back. A heating pad and the 'Child's Pose' stretch work wonders.",
        follicular: "Make sure your posture is good, especially if you're working at a desk all day.",
        luteal: "Core and back strengthening exercises can help support your spine as hormones shift.",
        late_luteal: "The pelvic area is feeling heavy. Warm baths with Epsom salts can soothe achy lower back muscles."
      }
    },
    tender_breasts: {
      label: "Tender Breasts",
      defaultTip: "Wearing a supportive bra and reducing caffeine intake may ease discomfort.",
      phaseTips: {
        period: "Tenderness usually subsides a few days into your period as hormones level out.",
        follicular: "Your breasts should feel their lightest now. A good time for high-impact workouts!",
        luteal: "Progesterone is enlarging milk ducts. Switch to a soft, wire-free bralette for comfort.",
        late_luteal: "Breasts can feel heavy and sore. Limiting caffeine and salt can slightly reduce the swelling."
      }
    },
    insomnia: {
      label: "Insomnia",
      defaultTip: "A cool room and a wind-down routine can support better sleep.",
      phaseTips: {
        period: "Cramps might be keeping you awake. Try taking a pain reliever right before bed if needed.",
        follicular: "High energy might make it hard to wind down. Try reading a book instead of scrolling on your phone.",
        luteal: "Your core body temperature is higher now, making sleep harder. Keep your bedroom extra cool tonight.",
        late_luteal: "Progesterone (the sleepy hormone) is dropping. Magnesium and a warm bath before bed can help."
      }
    },
    acne: {
      label: "Acne",
      defaultTip: "Focus on gentle cleansing and avoid heavy products.",
      phaseTips: {
        period: "Skin is sensitive right now. Avoid harsh exfoliants and stick to a gentle, hydrating routine.",
        follicular: "Rising estrogen gives you a natural glow! Keep up your standard skincare.",
        luteal: "Sebum production increases as progesterone rises. Make sure you are double-cleansing at night.",
        late_luteal: "Testosterone is relatively high, leading to breakouts. Use a salicylic acid spot treatment."
      }
    },
    digestive: {
      label: "Digestive Issues",
      defaultTip: "Fiber and hydration are key to balancing digestion.",
      phaseTips: {
        period: "Prostaglandins can cause 'period poops' (diarrhea). Eat binding foods like bananas and rice.",
        follicular: "Digestion is usually stable. Keep up a balanced diet of veggies and lean proteins.",
        luteal: "Progesterone slows everything down, leading to constipation. Increase your fiber and water intake drastically.",
        late_luteal: "Your gut is sensitive to the hormone drop. Avoid spicy or highly processed foods for a few days."
      }
    },
    sore_joints: {
      label: "Sore Joints",
      defaultTip: "Light movement, omega-3 rich foods, and warm baths can help soothe joint stiffness.",
      phaseTips: {
        period: "Low estrogen can make joints feel stiff. Gentle yoga and staying warm will help.",
        follicular: "Joints should feel lubricated and strong as estrogen rises.",
        luteal: "Mild inflammation can occur. Try adding turmeric or omega-3s (like salmon) to your meals.",
        late_luteal: "Water retention can put pressure on joints. Elevating your legs and reducing salt can bring relief."
      }
    }
  };

  const symptom = TIPS[symptomId];
  if (!symptom) {
    // For unknown symptoms just return a generic
    return {
      label: symptomId.replace('_', ' '),
      text: "Listen to your body, rest, and stay hydrated."
    };
  }

  return {
    label: symptom.label,
    text: symptom.phaseTips[phase] || symptom.defaultTip
  };
}
