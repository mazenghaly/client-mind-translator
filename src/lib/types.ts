export interface FormData {
  style: string;
  width: string;
  depth: string;
  openSides: string;
  budget: string;
  mustHave: string[];
  niceToHave: string[];
  personality: {
    tone: string;
    aesthetic: string;
    feel: string;
  };
  restrictions: string[];
}

export interface ConceptResult {
  conceptName: string;
  conceptStory: string;
  designDirection: string;
  aiPrompt: string;
}

export const INITIAL_FORM_DATA: FormData = {
  style: "",
  width: "",
  depth: "",
  openSides: "",
  budget: "",
  mustHave: [],
  niceToHave: [],
  personality: {
    tone: "",
    aesthetic: "",
    feel: "",
  },
  restrictions: [],
};

export const STYLES = [
  {
    id: "modern-minimal",
    label: "Modern Minimal",
    icon: "◻",
    description: "Clean lines, open spaces, less is more",
    gradient: "from-slate-400 to-zinc-500",
  },
  {
    id: "luxury",
    label: "Luxury",
    icon: "◆",
    description: "Premium finishes, rich textures, exclusivity",
    gradient: "from-amber-400 to-yellow-600",
  },
  {
    id: "tech",
    label: "Tech",
    icon: "⬡",
    description: "Digital-first, innovative, cutting-edge",
    gradient: "from-cyan-400 to-blue-600",
  },
  {
    id: "warm-natural",
    label: "Warm Natural",
    icon: "○",
    description: "Organic materials, earthy tones, welcoming",
    gradient: "from-emerald-400 to-teal-600",
  },
  {
    id: "futuristic",
    label: "Futuristic",
    icon: "△",
    description: "Avant-garde, bold geometry, next-gen design",
    gradient: "from-violet-400 to-purple-600",
  },
];

export const BUDGET_OPTIONS = [
  {
    id: "low",
    label: "Low",
    description: "Essential & functional",
    icon: "$",
  },
  {
    id: "medium",
    label: "Medium",
    description: "Balanced quality & impact",
    icon: "$$",
  },
  {
    id: "high",
    label: "High",
    description: "Premium & no compromises",
    icon: "$$$",
  },
];

export const MUST_HAVE_ELEMENTS = [
  { id: "reception", label: "Reception", icon: "🏷️" },
  { id: "led-screen", label: "LED Screen", icon: "📺" },
  { id: "storage", label: "Storage", icon: "📦" },
  { id: "meeting-area", label: "Meeting Area", icon: "🤝" },
];

export const NICE_TO_HAVE_ELEMENTS = [
  { id: "coffee-bar", label: "Coffee Bar", icon: "☕" },
  { id: "shelves", label: "Shelves", icon: "📚" },
  { id: "interactive-display", label: "Interactive Display", icon: "🖥️" },
];

export const PERSONALITY_OPTIONS = {
  tone: [
    { id: "serious", label: "Serious" },
    { id: "playful", label: "Playful" },
  ],
  aesthetic: [
    { id: "minimal", label: "Minimal" },
    { id: "bold", label: "Bold" },
  ],
  feel: [
    { id: "luxury", label: "Luxury" },
    { id: "practical", label: "Practical" },
  ],
};

export const RESTRICTIONS = [
  { id: "too-dark", label: "Too Dark", icon: "🌑" },
  { id: "too-crowded", label: "Too Crowded", icon: "👥" },
  { id: "too-simple", label: "Too Simple", icon: "📄" },
  { id: "too-complex", label: "Too Complex", icon: "🧩" },
];

export const STEP_TITLES = [
  "Style Selection",
  "Booth Basics",
  "Budget",
  "Required Elements",
  "Brand Personality",
  "Restrictions",
];
