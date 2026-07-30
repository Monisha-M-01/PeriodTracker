import React from 'react';

export type ArticleType = 'OFFICIAL' | 'INTERNAL';

export interface Article {
  id: string;
  type: ArticleType;
  title: string;
  category: string;
  section: 'Understand' | 'Manage';
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
    "Movement & Exercise",
    "Mental wellbeing"
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
  }
];
