import React from 'react';

export type ArticleType = 'OFFICIAL' | 'INTERNAL';

export interface Article {
  id: string;
  type: ArticleType;
  title: string;
  category: string;
  section: 'Understand' | 'Manage' | 'Hygiene';
  teaser: string;
  icon: string;
  tags: string[];
  
  // For OFFICIAL (Type 1)
  url?: string;
  sourceName?: string;
  
  // For INTERNAL (Type 2)
  content?: React.ReactNode;
  time?: string;
}

export const CATEGORIES = {
  Understand: [
    "All Understand",
    "Cycle basics", 
    "Reproductive health basics",
    "Conditions to know about",
    "Life stages",
    "Contraception basics",
    "Myths & facts"
  ],
  Manage: [
    "All Manage",
    "Relief & Remedies",
    "Nutrition & Diet",
    "Ayurvedic & Traditional"
  ],
  Hygiene: [
    "All Hygiene",
    "Hygiene"
  ]
};

export const SAMPLE_ARTICLES: Article[] = [
  // SECTION A: UNDERSTAND
  {
    id: 'und-1',
    type: 'OFFICIAL',
    section: 'Understand',
    title: "What is a Normal Menstrual Cycle?",
    category: "Cycle basics",
    teaser: "Learn what constitutes a typical cycle, including length, flow, and common variations.",
    icon: "📅",
    tags: ["normal", "length", "flow", "basics", "typical"],
    url: "https://www.acog.org/womens-health/faqs/your-first-period",
    sourceName: "ACOG"
  },
  {
    id: 'und-2',
    type: 'OFFICIAL',
    section: 'Understand',
    title: "Understanding the Four Phases of Your Cycle",
    category: "Cycle basics",
    teaser: "A breakdown of the menstrual, follicular, ovulatory, and luteal phases.",
    icon: "🔄",
    tags: ["phases", "follicular", "luteal", "ovulation", "menstrual"],
    url: "https://www.womenshealth.gov/menstrual-cycle/your-menstrual-cycle",
    sourceName: "WomensHealth.gov"
  },
  {
    id: 'und-3',
    type: 'OFFICIAL',
    section: 'Understand',
    title: "PMS vs. PMDD: Knowing the Difference",
    category: "Conditions to know about",
    teaser: "Understand the symptoms that differentiate premenstrual syndrome from its more severe counterpart.",
    icon: "🧠",
    tags: ["pms", "pmdd", "mood", "severe", "symptoms"],
    url: "https://www.hopkinsmedicine.org/health/conditions-and-diseases/premenstrual-dysphoric-disorder-pmdd",
    sourceName: "Johns Hopkins Medicine"
  },

  // SECTION B: MANAGE - AYURVEDIC & NATURAL REMEDIES
  {
    id: 'ayr-1',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Jeera (Cumin) Water for Bloating",
    category: "Relief & Remedies",
    teaser: "How a simple glass of cumin water can drastically reduce period bloating and improve digestion.",
    icon: "🌱",
    tags: ["ayurveda", "jeera", "cumin", "bloating", "digestion", "water"],
    time: "2 min read",
    content: (
      <>
        <p>In Ayurveda, Jeera (cumin seeds) is highly regarded for its digestive properties. During your period, hormonal shifts often slow down digestion, leading to uncomfortable gas and bloating.</p>
        <p><strong>How to use it:</strong> Boil 1 teaspoon of jeera in a glass of water for 5 minutes. Let it cool slightly and drink it warm in the morning on an empty stomach. It helps stimulate digestive enzymes and acts as a mild, natural diuretic to flush out excess water retention.</p>
      </>
    )
  },
  {
    id: 'ayr-2',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Ajwain (Carom Seeds) for Severe Cramps",
    category: "Relief & Remedies",
    teaser: "A traditional remedy to relax the uterus and instantly relieve spasmodic period pain.",
    icon: "🌿",
    tags: ["ayurveda", "ajwain", "cramps", "pain", "spasms"],
    time: "2 min read",
    content: (
      <>
        <p>Ajwain contains a compound called thymol, which has strong antispasmodic properties. This makes it incredibly effective at relaxing the contracting uterine muscles that cause period cramps.</p>
        <p><strong>How to use it:</strong> Dry roast a pinch of ajwain seeds, add them to a cup of hot water, and let it steep. You can also chew a small pinch of raw seeds with warm water for immediate relief from sharp, stabbing cramps.</p>
      </>
    )
  },
  {
    id: 'ayr-3',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Ginger Tea for Inflammation",
    category: "Relief & Remedies",
    teaser: "Why ginger is scientifically comparable to ibuprofen for reducing menstrual pain.",
    icon: "🫚",
    tags: ["ginger", "anti-inflammatory", "cramps", "tea", "pain"],
    time: "3 min read",
    content: (
      <>
        <p>Clinical studies have shown that consuming ginger during the first few days of your period can be as effective as over-the-counter painkillers. It works by inhibiting the production of prostaglandins—the chemicals that cause inflammation and uterine contractions.</p>
        <p><strong>How to use it:</strong> Grate an inch of fresh ginger root into boiling water. Let it simmer for 10 minutes, strain, and sip slowly. Add a touch of honey if desired.</p>
      </>
    )
  },
  {
    id: 'ayr-4',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Turmeric (Golden) Milk",
    category: "Relief & Remedies",
    teaser: "A grounding, warm drink to reduce systemic inflammation and promote deep sleep.",
    icon: "🥛",
    tags: ["ayurveda", "turmeric", "milk", "sleep", "inflammation"],
    time: "2 min read",
    content: (
      <>
        <p>Haldi Doodh (Turmeric Milk) is a staple in Ayurvedic healing. Curcumin, the active ingredient in turmeric, is a potent anti-inflammatory. Combined with the tryptophan in warm milk, it's the perfect pre-bedtime remedy for period-induced insomnia.</p>
        <p><strong>How to use it:</strong> Warm a cup of milk (dairy or plant-based), add ½ tsp of turmeric powder, a pinch of black pepper (crucial for absorption), and a pinch of cinnamon. Drink 30 minutes before bed.</p>
      </>
    )
  },
  {
    id: 'ayr-5',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Fennel Seed (Saunf) Water for Cooling",
    category: "Relief & Remedies",
    teaser: "Balance excess body heat and soothe an upset stomach with fennel seeds.",
    icon: "🌱",
    tags: ["fennel", "saunf", "cooling", "digestion", "heat"],
    time: "2 min read",
    content: (
      <>
        <p>If you experience hot flashes, excessive sweating, or acid reflux during your period, Ayurveda categorizes this as an excess of 'Pitta' (heat) in the body. Fennel seeds are incredibly cooling and soothing.</p>
        <p><strong>How to use it:</strong> Soak 1 teaspoon of fennel seeds in a glass of water overnight. Strain and drink the water the next morning. It will cool the digestive tract and reduce nausea.</p>
      </>
    )
  },
  {
    id: 'ayr-6',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Ashwagandha for PMS Stress",
    category: "Relief & Remedies",
    teaser: "An adaptogenic herb that lowers cortisol and stabilizes mood swings before your period.",
    icon: "🪴",
    tags: ["ashwagandha", "stress", "cortisol", "pms", "mood"],
    time: "3 min read",
    content: (
      <>
        <p>Ashwagandha is an adaptogen, meaning it helps your body manage and adapt to stress. During the luteal phase (the week before your period), cortisol levels can spike, leading to anxiety and irritability.</p>
        <p><strong>How to use it:</strong> Taking Ashwagandha powder (usually ½ tsp) mixed in warm water or milk daily during your luteal phase can help stabilize your mood and improve resilience to stress.</p>
      </>
    )
  },
  {
    id: 'ayr-7',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Shatavari for Hormonal Balance",
    category: "Relief & Remedies",
    teaser: "The ultimate female tonic in Ayurveda for regulating cycles and reducing PMS.",
    icon: "🌿",
    tags: ["shatavari", "hormones", "balance", "tonic", "ayurveda"],
    time: "3 min read",
    content: (
      <>
        <p>Shatavari translates to "she who possesses a hundred husbands," referencing its powerful ability to support female reproductive health. It contains phytoestrogens that help balance hormonal fluctuations.</p>
        <p><strong>How to use it:</strong> It is traditionally taken as a powder mixed with warm milk and ghee, acting as a deeply nourishing tonic for the reproductive system.</p>
      </>
    )
  },
  {
    id: 'ayr-8',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Fenugreek (Methi) for Cramps & Cravings",
    category: "Relief & Remedies",
    teaser: "Improve insulin sensitivity to stop sugar cravings and reduce pelvic pain.",
    icon: "🫘",
    tags: ["fenugreek", "methi", "cravings", "sugar", "insulin"],
    time: "2 min read",
    content: (
      <>
        <p>Fenugreek seeds are excellent for stabilizing blood sugar. If you suffer from intense sugar cravings before your period, methi water can help prevent the blood sugar spikes and crashes that cause them.</p>
        <p><strong>How to use it:</strong> Soak a teaspoon of fenugreek seeds in water overnight. Drink the water and chew the seeds in the morning.</p>
      </>
    )
  },
  {
    id: 'ayr-9',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Aloe Vera Juice for Liver Support",
    category: "Relief & Remedies",
    teaser: "Support your liver in clearing out excess estrogen to reduce heavy bleeding.",
    icon: "🌵",
    tags: ["aloe vera", "liver", "estrogen", "heavy bleeding", "cooling"],
    time: "2 min read",
    content: (
      <>
        <p>Your liver is responsible for filtering out excess hormones (like estrogen) from your bloodstream. When estrogen is too high, periods can be heavy and painful. Aloe vera juice supports liver function and cools the body.</p>
        <p><strong>How to use it:</strong> Drink 2 tablespoons of pure, food-grade aloe vera juice mixed with water on an empty stomach a few days before your cycle begins.</p>
      </>
    )
  },
  {
    id: 'ayr-10',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Sesame Oil Massage (Abhyanga)",
    category: "Relief & Remedies",
    teaser: "A grounding practice to calm the nervous system and relieve pelvic tension.",
    icon: "💆‍♀️",
    tags: ["massage", "sesame oil", "abhyanga", "grounding", "tension"],
    time: "3 min read",
    content: (
      <>
        <p>In Ayurveda, menstruation is a downward-moving energy (Apana Vata). When this energy is blocked, cramps occur. Massaging the body with warm oil grounds the nervous system and encourages healthy downward flow.</p>
        <p><strong>How to use it:</strong> Gently massage warm, unrefined sesame oil onto your lower abdomen and lower back using clockwise circular motions. Follow with a warm shower or heating pad.</p>
      </>
    )
  },
  {
    id: 'ayr-11',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Castor Oil Packs for Pelvic Congestion",
    category: "Relief & Remedies",
    teaser: "Improve blood flow to the uterus and reduce stagnation.",
    icon: "💧",
    tags: ["castor oil", "pelvic", "congestion", "blood flow"],
    time: "3 min read",
    content: (
      <>
        <p>Castor oil packs are incredible for drawing circulation to the pelvic area and reducing inflammation. They are especially helpful for those with endometriosis or very painful cramps.</p>
        <p><strong>How to use it:</strong> Apply castor oil to a piece of flannel, place it over your lower abdomen, cover it with a towel, and place a heating pad on top. Do this for 30 minutes. *Note: Do this BEFORE your period starts, not during heavy bleeding.*</p>
      </>
    )
  },
  {
    id: 'ayr-12',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Hibiscus Tea for Heavy Flow",
    category: "Relief & Remedies",
    teaser: "A tart, cooling tea that helps regulate heavy menstrual bleeding.",
    icon: "🌺",
    tags: ["hibiscus", "tea", "heavy flow", "cooling", "bleeding"],
    time: "2 min read",
    content: (
      <>
        <p>Hibiscus is a cooling herb that helps regulate blood flow. If your periods are excessively heavy and accompanied by feelings of heat or irritability, hibiscus can help soothe the system.</p>
        <p><strong>How to use it:</strong> Steep dried hibiscus petals in hot water for 5-7 minutes. Drink it warm or iced. It has a tart flavor, similar to cranberry juice.</p>
      </>
    )
  },
  {
    id: 'ayr-13',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Amla (Indian Gooseberry) for Iron Absorption",
    category: "Relief & Remedies",
    teaser: "Packed with Vitamin C to help your body absorb the iron it needs during blood loss.",
    icon: "🍏",
    tags: ["amla", "vitamin c", "iron", "absorption", "gooseberry"],
    time: "2 min read",
    content: (
      <>
        <p>Amla is one of the richest natural sources of Vitamin C. While eating iron-rich foods is important during your period, your body cannot absorb that iron efficiently without Vitamin C.</p>
        <p><strong>How to use it:</strong> Consume fresh amla juice, or take amla powder mixed with honey, alongside your iron-rich meals (like spinach or lentils) to maximize absorption and prevent fatigue.</p>
      </>
    )
  },
  {
    id: 'ayr-14',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Jaggery and Ghee for Energy",
    category: "Relief & Remedies",
    teaser: "A traditional post-lunch bite to boost iron, energy, and warmth.",
    icon: "🍯",
    tags: ["jaggery", "ghee", "energy", "iron", "sweet"],
    time: "2 min read",
    content: (
      <>
        <p>Craving something sweet after lunch? Refined sugar will spike your insulin and worsen cramps, but a small piece of Jaggery (Gur) mixed with half a teaspoon of Ghee is a traditional Ayurvedic remedy.</p>
        <p><strong>How to use it:</strong> Jaggery is naturally rich in iron and minerals, while ghee provides healthy fats that lubricate the digestive tract and stabilize blood sugar. Eat a small piece together when cravings hit.</p>
      </>
    )
  },
  {
    id: 'ayr-15',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Coriander Seed Water for Excessive Heat",
    category: "Relief & Remedies",
    teaser: "The ultimate cooling drink for acne, hot flashes, and irritability.",
    icon: "🌿",
    tags: ["coriander", "dhaniya", "cooling", "acne", "heat"],
    time: "2 min read",
    content: (
      <>
        <p>If you experience hormonal breakouts, hot flashes, or a burning sensation during urination right before your period, coriander (dhaniya) seeds are incredibly effective at pulling heat out of the body.</p>
        <p><strong>How to use it:</strong> Crush 1 tablespoon of coriander seeds, steep them in boiling water, let it cool, strain, and drink. It has a mild, earthy taste.</p>
      </>
    )
  },
  {
    id: 'ayr-16',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Nutmeg (Jaiphal) for Deep Sleep",
    category: "Relief & Remedies",
    teaser: "A potent spice that acts as a natural sedative for restless nights.",
    icon: "🌰",
    tags: ["nutmeg", "jaiphal", "sleep", "insomnia", "sedative"],
    time: "2 min read",
    content: (
      <>
        <p>If period pain or anxiety is keeping you awake, nutmeg is a powerful natural sleep aid used in Ayurveda. It relaxes the nervous system and induces deep, restful sleep.</p>
        <p><strong>How to use it:</strong> Nutmeg is very potent, so you only need a tiny amount. Grate just a pinch (about 1/8th of a teaspoon) into a small cup of warm milk 30 minutes before bed.</p>
      </>
    )
  },
  {
    id: 'ayr-17',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Tulsi (Holy Basil) Tea for Immunity",
    category: "Relief & Remedies",
    teaser: "Protect your body when your immune system naturally dips.",
    icon: "🌱",
    tags: ["tulsi", "holy basil", "immunity", "tea", "stress"],
    time: "2 min read",
    content: (
      <>
        <p>Right before your period starts, your immune system naturally dips slightly to ensure your body doesn't attack the changing uterine lining. Tulsi is a powerful immunomodulator and adaptogen.</p>
        <p><strong>How to use it:</strong> Boil 5-6 fresh Tulsi leaves in water, or use high-quality dried Tulsi tea. It helps ward off pre-period colds and lowers stress hormones simultaneously.</p>
      </>
    )
  },
  {
    id: 'ayr-18',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Saffron (Kesar) for Mood Elevation",
    category: "Relief & Remedies",
    teaser: "A luxurious spice proven to increase serotonin and combat PMDD symptoms.",
    icon: "🌸",
    tags: ["saffron", "kesar", "mood", "serotonin", "depression"],
    time: "3 min read",
    content: (
      <>
        <p>Saffron is not just for flavor—clinical trials have shown that 30mg of saffron extract daily is as effective as some antidepressants in treating severe PMS and PMDD. It naturally boosts serotonin levels in the brain.</p>
        <p><strong>How to use it:</strong> Soak 2-3 strands of high-quality saffron in a tablespoon of warm water for 10 minutes, then add it to warm milk or tea.</p>
      </>
    )
  },
  {
    id: 'ayr-19',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Triphala for Pre-Period Constipation",
    category: "Relief & Remedies",
    teaser: "A gentle, non-habit-forming herbal blend to keep digestion moving.",
    icon: "🌿",
    tags: ["triphala", "digestion", "constipation", "detox"],
    time: "2 min read",
    content: (
      <>
        <p>High progesterone levels in the week before your period often slow down the digestive tract, causing constipation. Triphala (a blend of three fruits: Amla, Bibhitaki, and Haritaki) gently tones the bowel without causing cramping.</p>
        <p><strong>How to use it:</strong> Take 1/2 teaspoon of Triphala powder with warm water right before bed to encourage a healthy bowel movement the next morning.</p>
      </>
    )
  },
  {
    id: 'ayr-20',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Cinnamon Tea for Blood Sugar Balance",
    category: "Relief & Remedies",
    teaser: "A sweet, warming spice that stops cravings and reduces heavy bleeding.",
    icon: "🪵",
    tags: ["cinnamon", "blood sugar", "cravings", "heavy bleeding"],
    time: "2 min read",
    content: (
      <>
        <p>Ceylon cinnamon is excellent for improving insulin sensitivity, which stops the blood sugar rollercoaster that leads to PMS cravings. Some studies also show it can significantly reduce heavy menstrual bleeding over time.</p>
        <p><strong>How to use it:</strong> Steep a cinnamon stick in hot water for 10 minutes. Drink it after meals to keep blood sugar stable.</p>
      </>
    )
  },
  // --- BATCH 1 CONTENT EXPANSION ---
  
  // TOPIC: Stress & Periods
  {
    id: 'b1-stress-1',
    type: 'OFFICIAL',
    section: 'Understand',
    title: "How Stress Delays Your Period",
    category: "Cycle basics",
    teaser: "The science of cortisol, GnRH suppression, and why stress can cause late or missed periods.",
    icon: "😰",
    tags: ["stress", "delayed", "late period", "cortisol", "missed"],
    url: "https://my.clevelandclinic.org/health/articles/10132-normal-menstruation",
    sourceName: "Cleveland Clinic"
  },
  {
    id: 'b1-stress-2',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Grounding Techniques for High Cortisol",
    category: "Relief & Remedies",
    teaser: "Practical deep breathing and nervous system regulation to lower stress levels.",
    icon: "🧘‍♀️",
    tags: ["stress", "cortisol", "breathing", "grounding", "anxiety", "nervous system"],
    time: "3 min read",
    content: (
      <>
        <p>When you're highly stressed, your body produces excess cortisol, which can disrupt your menstrual cycle by pausing the reproductive hormones needed for ovulation.</p>
        <p><strong>How to use it:</strong> Practice the 4-7-8 breathing technique (inhale for 4 seconds, hold for 7, exhale for 8) or try placing your legs up the wall for 10 minutes before bed. These actions physically signal to your nervous system that you are safe, helping to lower cortisol and encourage hormonal balance.</p>
        <p><em>Disclaimer: This content is for informational purposes only. Chronic severe stress or prolonged missed periods should be evaluated by a healthcare professional.</em></p>
      </>
    )
  },
  {
    id: 'b1-stress-3',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Managing Stress-Induced Missed Periods",
    category: "Relief & Remedies",
    teaser: "What to do when stress delays your cycle, and when to wait it out.",
    icon: "📅",
    tags: ["stress", "missed period", "late", "irregular", "delay", "irregular periods"],
    time: "2 min read",
    content: (
      <>
        <p>A period that is late by a few days during a highly stressful month (like moving, exams, or illness) is very common. The body prioritizes survival over reproduction under stress.</p>
        <p><strong>What to do:</strong> Focus on restorative rest, adequate nutrition (especially complex carbohydrates and healthy fats), and gentle movement rather than high-intensity workouts. If your period is more than 6 weeks late, or you miss three in a row, consult a doctor to rule out other conditions like thyroid issues or PCOS.</p>
        <p><em>Disclaimer: Always rule out pregnancy if your period is late. This content is not medical advice.</em></p>
      </>
    )
  },

  // TOPIC: PMS
  {
    id: 'b1-pms-1',
    type: 'OFFICIAL',
    section: 'Understand',
    title: "What is Premenstrual Syndrome (PMS)?",
    category: "Conditions to know about",
    teaser: "Common symptoms, typical timing before the period starts, and when it's worth discussing with a doctor.",
    icon: "🌩️",
    tags: ["pms", "symptoms", "mood swings", "cramps", "bloating", "premenstrual"],
    url: "https://www.acog.org/womens-health/faqs/premenstrual-syndrome-pms",
    sourceName: "ACOG"
  },
  {
    id: 'b1-pms-2',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Easing Breast Tenderness",
    category: "Relief & Remedies",
    teaser: "Natural relief for PMS breast pain, including warm compresses and limiting caffeine.",
    icon: "🤲",
    tags: ["pms", "breast tenderness", "pain", "swelling", "caffeine"],
    time: "2 min read",
    content: (
      <>
        <p>Cyclical breast tenderness (mastalgia) is incredibly common in the luteal phase due to rising progesterone and estrogen levels, which cause the milk ducts and glands to swell and retain fluid.</p>
        <p><strong>How to use it:</strong> Switch to a supportive, wire-free bra during this week. Limit caffeine and high-sodium foods, which can exacerbate fluid retention. Applying a warm compress can also help soothe aching tissue. Some studies suggest Vitamin E or Evening Primrose Oil supplements may help, but discuss these with your doctor first.</p>
        <p><em>Disclaimer: If breast pain is severe, one-sided, accompanied by a lump, or persists after your period, see a healthcare provider.</em></p>
      </>
    )
  },

  // TOPIC: Cycle Phases in Depth
  {
    id: 'b1-phase-1',
    type: 'OFFICIAL',
    section: 'Understand',
    title: "The Menstrual Phase: What's Happening?",
    category: "Cycle basics",
    teaser: "Detailed look at what's physically and hormonally happening while you bleed.",
    icon: "🩸",
    tags: ["phases", "menstrual", "bleeding", "hormones", "estrogen"],
    url: "https://my.clevelandclinic.org/health/articles/10132-normal-menstruation",
    sourceName: "Cleveland Clinic"
  },
  {
    id: 'b1-phase-2',
    type: 'OFFICIAL',
    section: 'Understand',
    title: "The Follicular Phase: The Energy Boost",
    category: "Cycle basics",
    teaser: "Estrogen rising, follicle development, and why energy levels typically peak.",
    icon: "🌱",
    tags: ["phases", "follicular", "estrogen", "energy", "follicle"],
    url: "https://www.endocrine.org/patient-engagement/endocrine-library/menstrual-cycle",
    sourceName: "Endocrine Society"
  },
  {
    id: 'b1-phase-3',
    type: 'OFFICIAL',
    section: 'Understand',
    title: "The Ovulatory Phase: Peak Fertility",
    category: "Cycle basics",
    teaser: "The LH surge, the release of the egg, and the physical signs of ovulation.",
    icon: "🥚",
    tags: ["phases", "ovulation", "ovulatory", "lh surge", "fertility"],
    url: "https://www.mayoclinic.org/healthy-lifestyle/getting-pregnant/in-depth/menstrual-cycle/art-20047186",
    sourceName: "Mayo Clinic"
  },
  {
    id: 'b1-phase-4',
    type: 'OFFICIAL',
    section: 'Understand',
    title: "The Luteal Phase: The PMS Window",
    category: "Cycle basics",
    teaser: "Progesterone dominance, the uterine lining prep, and why PMS symptoms occur.",
    icon: "🍂",
    tags: ["phases", "luteal", "progesterone", "pms", "mood"],
    url: "https://my.clevelandclinic.org/health/articles/10132-normal-menstruation",
    sourceName: "Cleveland Clinic"
  },

  // TOPIC: Diet Across the Cycle
  {
    id: 'b1-diet-1',
    type: 'INTERNAL',
    section: 'Manage',
    title: "What to Eat During Your Menstrual Phase",
    category: "Nutrition & Diet",
    teaser: "Focus on iron-rich foods, Vitamin C for absorption, and warm meals.",
    icon: "🍲",
    tags: ["diet", "nutrition", "menstrual phase", "iron", "food"],
    time: "3 min read",
    content: (
      <>
        <p>While you are bleeding, your estrogen and progesterone are at their lowest, and you are losing iron. This is a time to focus on remineralizing and warming the body.</p>
        <p><strong>What to eat:</strong> Focus on iron-rich foods like spinach, lentils, kidney beans, grass-fed beef, or pumpkin seeds. Always pair these with Vitamin C (like a squeeze of lemon or bell peppers) to boost iron absorption. In Traditional Chinese Medicine, warm, easily digestible foods like stews, soups, and cooked root vegetables are recommended over raw salads to preserve the body's energy.</p>
      </>
    )
  },
  {
    id: 'b1-diet-2',
    type: 'INTERNAL',
    section: 'Manage',
    title: "Fueling Your Luteal Phase",
    category: "Nutrition & Diet",
    teaser: "Eating complex carbs and magnesium-rich foods to combat cravings and PMS.",
    icon: "🥑",
    tags: ["diet", "nutrition", "luteal phase", "magnesium", "cravings", "pms"],
    time: "3 min read",
    content: (
      <>
        <p>In the luteal phase (the week or two before your period), your resting metabolic rate actually increases slightly. Your body requires more calories, which is why cravings spike.</p>
        <p><strong>What to eat:</strong> To prevent the blood sugar crashes that lead to mood swings and intense sugar cravings, focus on complex carbohydrates like sweet potatoes, brown rice, and oats. Foods high in magnesium (like dark chocolate, avocados, and dark leafy greens) can significantly help reduce PMS cramps and anxiety. Make sure every meal has a solid source of protein to keep blood sugar stable.</p>
      </>
    )
  },

  // TOPIC: General Feminine Health Essentials
  {
    id: 'b1-health-1',
    type: 'OFFICIAL',
    section: 'Understand',
    title: "What Counts as a \"Normal\" Period?",
    category: "Cycle basics",
    teaser: "Volume of blood, color variations, typical pain levels, and red flags.",
    icon: "✅",
    tags: ["normal", "heavy", "pain", "blood", "color", "irregular", "clots"],
    url: "https://www.acog.org/womens-health/faqs/abnormal-uterine-bleeding",
    sourceName: "ACOG"
  },
  {
    id: 'b1-health-2',
    type: 'OFFICIAL',
    section: 'Understand',
    title: "Endometriosis Basics",
    category: "Conditions to know about",
    teaser: "Recognizing the signs of abnormal pelvic pain—it's not just \"bad cramps.\"",
    icon: "🎗️",
    tags: ["endometriosis", "pelvic pain", "chronic", "severe cramps", "conditions"],
    url: "https://www.who.int/news-room/fact-sheets/detail/endometriosis",
    sourceName: "WHO"
  },
  {
    id: 'b1-health-3',
    type: 'OFFICIAL',
    section: 'Understand',
    title: "PCOS Overview",
    category: "Conditions to know about",
    teaser: "Understanding Polycystic Ovary Syndrome and its impact on irregular cycles.",
    icon: "🔍",
    tags: ["pcos", "polycystic", "irregular", "syndrome", "conditions", "testosterone", "irregular periods"],
    url: "https://www.cdc.gov/pcos/about/index.html",
    sourceName: "CDC"
  },
  {
    id: 'b1-health-4',
    type: 'OFFICIAL',
    section: 'Understand',
    title: "Hygiene Basics & pH Balance",
    category: "Reproductive health basics",
    teaser: "Foundational knowledge on maintaining healthy flora and avoiding disruption.",
    icon: "🧼",
    tags: ["hygiene", "ph balance", "washing", "flora", "health", "basics"],
    url: "https://my.clevelandclinic.org/health/articles/4976-vulvar-care",
    sourceName: "Cleveland Clinic"
  },
  // TOPIC: Hygiene (Gentle tips for girls)
  {
    id: 'b1-hygiene-1',
    type: 'INTERNAL',
    section: 'Hygiene',
    title: "How to properly wash during your period",
    category: "Hygiene",
    teaser: "A gentle guide on keeping clean without disrupting your natural pH balance.",
    icon: "🚿",
    tags: ["hygiene", "washing", "clean", "ph balance", "shower", "vulva"],
    time: "2 min read",
    content: (
      <>
        <p>It's completely normal to feel unsure about how to clean yourself during your period, especially if you're shy to ask! The most important rule: <strong>only wash the outside (the vulva)</strong>, never the inside (the vagina).</p>
        <p><strong>How to do it:</strong> Use plain, warm water to gently rinse the area. You do not need scented soaps, douches, or special intimate washes—these can actually disrupt your natural bacteria and lead to infections or irritation. If you prefer to use soap, choose a mild, unscented, pH-balanced cleanser and only use it on the outer skin.</p>
        <p>Make sure to gently pat the area dry with a clean towel afterward, as excess moisture can cause discomfort.</p>
      </>
    )
  },
  {
    id: 'b1-hygiene-2',
    type: 'INTERNAL',
    section: 'Hygiene',
    title: "How often should you change your pad or tampon?",
    category: "Hygiene",
    teaser: "Simple guidelines for staying fresh, avoiding leaks, and staying safe.",
    icon: "⏰",
    tags: ["hygiene", "pads", "tampons", "change", "leaks", "fresh"],
    time: "3 min read",
    content: (
      <>
        <p>Knowing when to change your menstrual products is key to feeling fresh and avoiding infections (like Toxic Shock Syndrome for tampons).</p>
        <p><strong>Pads:</strong> Change your pad every 4 to 6 hours, or sooner if it feels wet or heavy. Even if your flow is light, changing it regularly prevents odor and skin irritation from bacteria build-up.</p>
        <p><strong>Tampons:</strong> Change your tampon every 4 to 8 hours. <strong>Never</strong> leave a tampon in for more than 8 hours. If you sleep longer than 8 hours, it's safer to wear a pad at night.</p>
        <p><em>Pro tip: Always wash your hands before and after changing your product!</em></p>
      </>
    )
  },
  {
    id: 'b1-hygiene-3',
    type: 'INTERNAL',
    section: 'Hygiene',
    title: "Dealing with period odor: What's normal?",
    category: "Hygiene",
    teaser: "Don't panic! A slight metallic smell is completely natural.",
    icon: "🌸",
    tags: ["hygiene", "odor", "smell", "normal", "blood"],
    time: "2 min read",
    content: (
      <>
        <p>Many girls worry that others can smell their period, but usually, it's only noticeable to you. Period blood has a natural, slightly metallic or earthy smell because it contains iron and vaginal bacteria.</p>
        <p><strong>What to do:</strong> To minimize odor, simply change your pad or tampon regularly and wear breathable cotton underwear. Avoid scented pads or perfumes \"down there\"—they can irritate your skin and make odor worse by throwing off your natural pH.</p>
        <p><em>When to check with a doctor:</em> If you notice a very strong, fishy smell, or if you have itching or unusual burning, it might be an infection (like bacterial vaginosis), and it's best to ask a doctor—they see this all the time!</p>
      </>
    )
  },
  {
    id: 'b1-hygiene-4',
    type: 'INTERNAL',
    section: 'Hygiene',
    title: "How to manage period acne and breakouts",
    category: "Hygiene",
    teaser: "Hormonal acne is frustrating but very common. Here is how to keep it under control.",
    icon: "🧴",
    tags: ["hygiene", "acne", "breakouts", "skin", "hormones", "face"],
    time: "3 min read",
    content: (
      <>
        <p>It's incredibly common to experience skin breakouts right before or during your period. This happens because hormone levels (like progesterone and testosterone) fluctuate, increasing oil production in your skin.</p>
        <p><strong>What to do:</strong> Keep your skincare routine gentle. Wash your face twice a day with a mild cleanser. Avoid scrubbing or picking at your pimples, as this can cause scarring or spread bacteria. Using a spot treatment with salicylic acid or benzoyl peroxide can help dry out stubborn spots.</p>
        <p>If your acne is severe and affecting your confidence, a dermatologist or doctor can recommend stronger topical treatments or even birth control pills to help regulate your hormones.</p>
      </>
    )
  },
  {
    id: 'b1-hygiene-5',
    type: 'INTERNAL',
    section: 'Hygiene',
    title: "Dealing with breast tenderness",
    category: "Hygiene",
    teaser: "Why your chest feels sore and what you can do to find relief.",
    icon: "🤲",
    tags: ["hygiene", "breasts", "tenderness", "sore", "pain", "hormones"],
    time: "2 min read",
    content: (
      <>
        <p>Many girls notice their breasts feel swollen, heavy, or sensitive to the touch leading up to their period. This is another completely normal symptom caused by hormonal changes, specifically rising estrogen levels.</p>
        <p><strong>Finding relief:</strong> Wearing a supportive, well-fitting bra (like a soft sports bra) during the day and even while sleeping can significantly reduce discomfort. A warm compress or heating pad on your chest can also soothe the soreness.</p>
        <p>Some people find that cutting back on caffeine and salty foods a week before their period helps reduce swelling and tenderness.</p>
      </>
    )
  },
  {
    id: 'b1-hygiene-6',
    type: 'INTERNAL',
    section: 'Hygiene',
    title: "Managing lower back aches",
    category: "Hygiene",
    teaser: "Period cramps don't just happen in your stomach.",
    icon: "🦴",
    tags: ["hygiene", "back ache", "pain", "cramps", "relief"],
    time: "3 min read",
    content: (
      <>
        <p>While stomach cramps are talked about often, many people experience deep, aching pain in their lower back during their period. This happens because the chemicals (prostaglandins) that make your uterus contract can also affect the muscles in your lower back.</p>
        <p><strong>What to do:</strong> Applying a heating pad or hot water bottle to your lower back increases blood flow and relaxes the muscles. Gentle stretches, like child's pose in yoga, can also relieve pressure.</p>
        <p>Over-the-counter pain relievers like ibuprofen or naproxen are very effective for this kind of pain, especially if taken as soon as the aches start.</p>
      </>
    )
  },
  {
    id: 'b1-hygiene-7',
    type: 'INTERNAL',
    section: 'Hygiene',
    title: "What to do about period bloating",
    category: "Hygiene",
    teaser: "Feeling puffy? Here is why it happens and how to deflate.",
    icon: "🎈",
    tags: ["hygiene", "bloating", "stomach", "water weight", "puffy"],
    time: "2 min read",
    content: (
      <>
        <p>Feeling bloated, heavy, or like your clothes are suddenly too tight is a classic period symptom. Hormonal shifts cause your body to hold onto excess water and salt.</p>
        <p><strong>How to help:</strong> Drink plenty of water! It sounds backwards, but staying hydrated actually helps your body flush out excess fluids. Try to avoid highly salty or processed foods, which make water retention worse.</p>
        <p>Light exercise, like a brisk walk, can also get your digestive system moving and relieve the heavy feeling.</p>
      </>
    )
  },
  {
    id: 'b1-hygiene-8',
    type: 'INTERNAL',
    section: 'Hygiene',
    title: "Navigating period fatigue and exhaustion",
    category: "Hygiene",
    teaser: "Why you feel so tired and how to safely boost your energy.",
    icon: "🥱",
    tags: ["hygiene", "fatigue", "tired", "sleep", "energy", "iron"],
    time: "3 min read",
    content: (
      <>
        <p>If you feel like you could sleep all day during your period, you are not alone. The drop in hormones right before your period starts can leave you feeling drained, and losing blood (and iron) can add to the exhaustion.</p>
        <p><strong>What to do:</strong> Listen to your body and prioritize rest. Go to bed earlier than usual and don't feel guilty about taking a nap. Make sure you are eating iron-rich foods like spinach, lentils, or red meat to replenish what you lose during your period.</p>
        <p>Avoid relying heavily on caffeine to stay awake, as it can disrupt your sleep cycle and make you feel more tired the next day.</p>
      </>
    )
  },
  {
    id: 'b1-hygiene-9',
    type: 'INTERNAL',
    section: 'Hygiene',
    title: "Showering and bathing during your period",
    category: "Hygiene",
    teaser: "Yes, you can (and should) take baths and showers!",
    icon: "🛁",
    tags: ["hygiene", "shower", "bath", "clean", "water"],
    time: "2 min read",
    content: (
      <>
        <p>There is an old myth that you shouldn't wash your hair or take a bath while on your period. This is completely false! In fact, warm water can be incredibly soothing for cramps and muscle aches.</p>
        <p><strong>Showering:</strong> Showering daily helps you feel fresh. The water pressure temporarily stops or slows your flow, making it easy to wash your vulva with warm water.</p>
        <p><strong>Bathing:</strong> Taking a bath is perfectly safe. If you're worried about bleeding in the tub, you can wear a tampon or menstrual cup while bathing, or simply relax and know that a small amount of blood in bathwater is harmless and easily washes down the drain.</p>
      </>
    )
  },
  {
    id: 'b1-hygiene-10',
    type: 'INTERNAL',
    section: 'Hygiene',
    title: "How to handle unexpected leaks",
    category: "Hygiene",
    teaser: "Leaks happen to everyone. Here is how to clean up and stay prepared.",
    icon: "🚨",
    tags: ["hygiene", "leaks", "stains", "underwear", "blood"],
    time: "2 min read",
    content: (
      <>
        <p>Every person who has a period has experienced a leak at some point. It can feel embarrassing, but it is a normal part of life!</p>
        <p><strong>Removing stains:</strong> The golden rule for blood stains is to use <strong>cold water</strong>. Hot water will set the stain permanently into the fabric. Rinse the underwear in cold water as soon as possible, and rub a little soap or hydrogen peroxide into the stain before washing it in the machine.</p>
        <p><strong>Staying prepared:</strong> Keep a \"period emergency kit\" in your backpack or locker. Include a spare pair of underwear, a few pads or tampons, and maybe a small dark-colored sweater to tie around your waist if a leak happens at school.</p>
      </>
    )
  },
  {
    id: 'b1-hygiene-11',
    type: 'INTERNAL',
    section: 'Hygiene',
    title: "Choosing the right underwear for your period",
    category: "Hygiene",
    teaser: "Comfort and breathability are key to staying healthy down there.",
    icon: "🩲",
    tags: ["hygiene", "underwear", "cotton", "comfort", "health"],
    time: "2 min read",
    content: (
      <>
        <p>During your period, the area around your vulva is exposed to more moisture than usual due to blood and wearing pads. This makes it important to choose the right underwear to prevent irritation or yeast infections.</p>
        <p><strong>What to wear:</strong> 100% cotton underwear is the best choice. Cotton is highly breathable, meaning it allows air to circulate and prevents trapped moisture and heat (which bacteria love). Avoid tight, synthetic materials like nylon or polyester during this time.</p>
        <p>Many girls also prefer to have a dedicated set of \"period underwear\"—usually darker colors and fuller coverage styles that they don't mind getting stained.</p>
      </>
    )
  },
  {
    id: 'b1-hygiene-12',
    type: 'INTERNAL',
    section: 'Hygiene',
    title: "Understanding vaginal discharge",
    category: "Hygiene",
    teaser: "Not all moisture is period blood. Here is what different textures and colors indicate medically.",
    icon: "💧",
    tags: ["hygiene", "discharge", "normal", "fluids", "health", "leukorrhea"],
    time: "3 min read",
    content: (
      <>
        <p>Throughout your cycle, you will notice different types of fluid in your underwear. This is called vaginal discharge (medically known as <em>leukorrhea</em>), and it is your body's natural way of cleaning and protecting the vagina.</p>
        <p><strong>What textures indicate:</strong></p>
        <ul>
          <li><strong>Clear and stretchy (like raw egg whites):</strong> This usually happens right before and during ovulation. It indicates high estrogen levels and means your body is at its most fertile phase.</li>
          <li><strong>Thick, sticky, or pasty white:</strong> This is common in the days leading up to your period (the luteal phase) due to rising progesterone. It is completely normal.</li>
          <li><strong>Watery and clear:</strong> This can happen at various times in your cycle, especially after exercise.</li>
        </ul>
        <p><strong>When to see a doctor:</strong></p>
        <ul>
          <li><strong>Thick, white, clumpy (like cottage cheese):</strong> Accompanied by severe itching or redness, this is a classic sign of a yeast infection (Candidiasis).</li>
          <li><strong>Grey or green, frothy, with a strong fishy odor:</strong> This often indicates Bacterial Vaginosis (BV) or an infection like Trichomoniasis. Both are very common and easily treatable with a doctor's help.</li>
        </ul>
      </>
    )
  },
  {
    id: 'b2-hormones-1',
    type: 'INTERNAL',
    section: 'Understand',
    title: "The Role of Hormones in Your Cycle",
    category: "Cycle basics",
    teaser: "Estrogen, progesterone, FSH, and LH: who they are and what they do.",
    icon: "🧬",
    tags: ["hormones", "estrogen", "progesterone", "fsh", "lh", "cycle"],
    time: "4 min read",
    content: (
      <>
        <p>Your menstrual cycle is entirely controlled by a delicate dance of hormones. When these hormones are balanced, you feel great. When they're off, you experience symptoms.</p>
        <p><strong>The Main Players:</strong></p>
        <ul>
          <li><strong>Estrogen:</strong> This is the "feel-good" hormone that rises during the first half of your cycle. It gives you energy, thickens the uterine lining, and makes you feel social and confident.</li>
          <li><strong>Progesterone:</strong> This is the "calming" hormone that takes over in the second half of your cycle (after ovulation). It helps maintain the uterine lining. When it drops right before your period, it triggers bleeding and PMS symptoms.</li>
          <li><strong>FSH (Follicle-Stimulating Hormone):</strong> Produced by your brain, this tells your ovaries to prepare a follicle (which contains an egg) for ovulation.</li>
          <li><strong>LH (Luteinizing Hormone):</strong> A sudden spike in LH is what actually causes the ovary to release the egg (ovulation).</li>
        </ul>
        <p><em>When any of these are out of sync—for example, if estrogen is too high relative to progesterone—you might experience heavier periods, worse cramps, or more intense mood swings.</em></p>
      </>
    )
  },
  {
    id: 'b2-irregular-1',
    type: 'INTERNAL',
    section: 'Understand',
    title: "Understanding Irregular Periods",
    category: "Conditions to know about",
    teaser: "Why your period might be late, early, or skipping months altogether.",
    icon: "📅",
    tags: ["irregular", "late", "missed", "pcos", "stress", "cycle"],
    time: "3 min read",
    content: (
      <>
        <p>A "regular" period comes every 21 to 35 days. If your cycle is constantly changing lengths, skipping months, or if you bleed between periods, it is considered irregular.</p>
        <p><strong>Common Causes of Irregularity:</strong></p>
        <ul>
          <li><strong>High Stress:</strong> Chronic stress produces cortisol, which can literally tell your brain to stop producing reproductive hormones.</li>
          <li><strong>PCOS (Polycystic Ovary Syndrome):</strong> A very common hormonal imbalance that prevents regular ovulation.</li>
          <li><strong>Weight Changes:</strong> Gaining or losing a significant amount of weight quickly can halt your period.</li>
          <li><strong>Thyroid Issues:</strong> An underactive or overactive thyroid gland can disrupt your entire metabolic and reproductive system.</li>
        </ul>
        <p><em>Occasional irregularity is normal (especially during stressful months or when you first start menstruating), but if it persists, it's a good idea to speak with a healthcare provider.</em></p>
      </>
    )
  },
  {
    id: 'b2-workouts-1',
    type: 'INTERNAL',
    section: 'Manage',
    title: "How Exercise Affects Your Period",
    category: "Relief & Remedies",
    teaser: "The difference between staying active, being sedentary, and overtraining.",
    icon: "🏃‍♀️",
    tags: ["workout", "exercise", "sedentary", "intense", "overtraining", "cramps"],
    time: "4 min read",
    content: (
      <>
        <p>Movement is medicine for your cycle, but it's all about balance. Both ends of the spectrum—doing absolutely nothing and overtraining—can negatively impact your period.</p>
        <p><strong>Being Too Sedentary:</strong></p>
        <p>If you sit all day and rarely exercise, blood flow to your pelvic region decreases. This can lead to stagnation, making cramps much worse when your period does arrive. Light to moderate exercise releases endorphins (natural painkillers) and improves circulation, easing pain.</p>
        <p><strong>Intense Workouts & Overtraining:</strong></p>
        <p>On the flip side, extremely intense, grueling workouts—especially if you aren't eating enough calories to fuel them—can stress the body. This condition, called Hypothalamic Amenorrhea, causes your brain to shut down ovulation to conserve energy, leading to missed periods and bone density loss.</p>
        <p><em>The Sweet Spot:</em> Aim for moderate exercise (like brisk walking, yoga, or moderate weightlifting). During your actual period, it's perfectly fine to switch to gentle movement like stretching or walking if your energy is low.</p>
      </>
    )
  },
  {
    id: 'b2-mental-1',
    type: 'INTERNAL',
    section: 'Understand',
    title: "The Mental Effects of Your Cycle",
    category: "Cycle basics",
    teaser: "Why you feel anxious, depressed, or irritable before your period.",
    icon: "🧠",
    tags: ["mental", "mood", "anxiety", "depression", "pms", "pmdd"],
    time: "3 min read",
    content: (
      <>
        <p>Your mental health is deeply intertwined with your hormonal health. The days leading up to your period (the luteal phase) are notorious for causing mood swings, but why does this happen?</p>
        <p><strong>The Serotonin Drop:</strong> As estrogen drops right before your period, so does serotonin—your brain's "happy chemical." This sudden drop can trigger feelings of sadness, depression, or intense cravings for carbohydrates (which temporarily boost serotonin).</p>
        <p><strong>Progesterone Sensitivity:</strong> While progesterone is supposed to be a calming hormone, some people's brains react negatively to the breakdown of this hormone, leading to severe anxiety or irritability.</p>
        <p><em>If your pre-period depression or anger is so severe that it ruins relationships or makes you unable to function, you may have PMDD (Premenstrual Dysphoric Disorder). This is a treatable medical condition, and you should talk to a doctor.</em></p>
      </>
    )
  },
  {
    id: 'b2-screentime-1',
    type: 'INTERNAL',
    section: 'Manage',
    title: "How Screen Time Affects Your Period",
    category: "Relief & Remedies",
    teaser: "Blue light, melatonin, and how scrolling in bed impacts your cycle.",
    icon: "📱",
    tags: ["screen time", "sleep", "melatonin", "blue light", "hormones", "rest"],
    time: "3 min read",
    content: (
      <>
        <p>It might seem unrelated, but your phone habits can directly impact your menstrual cycle. It all comes down to sleep and a hormone called melatonin.</p>
        <p><strong>The Blue Light Effect:</strong> The blue light emitted by phones and laptops tricks your brain into thinking it's daytime. This suppresses the production of melatonin, the hormone that makes you sleepy.</p>
        <p><strong>Why This Matters for Your Period:</strong> Melatonin doesn't just help you sleep; it also helps regulate your reproductive hormones (FSH and LH). Chronic sleep deprivation from late-night scrolling increases cortisol (stress) and can disrupt your ovulation, leading to irregular or more painful periods.</p>
        <p><em>The Fix:</em> Try to put devices away at least 1 hour before bed. If you must use a screen, use blue-light-blocking glasses or turn on "Night Shift" mode. Quality sleep is one of the best things you can do for a healthy cycle.</p>
      </>
    )
  }
];
