export interface FormData {
  // Step 1: Booth Type & Industry
  boothType: string;
  industry: string;

  // Step 2: Style & Visual Direction
  style: string;
  subStyle: string;
  lighting: string;

  // Step 3: Structure & Layout
  width: string;
  depth: string;
  openSides: string;
  layoutType: string;

  // Step 4: Elements
  mustHave: string[];
  engagement: string[];
  premiumAddOns: string[];

  // Step 5: Brand & Message
  brandName: string;
  tagline: string;
  personality: {
    tone: string;
    aesthetic: string;
    feel: string;
  };

  // Step 6: Budget
  budget: string;

  // Step 7: Constraints
  restrictions: string[];
  additionalNotes: string;
}

export interface ConceptResult {
  conceptName: string;
  conceptIdea: string;
  designDirection: string;
  layoutLogic: string;
  keyFeatures: string[];
  estimatedBudget: string;
  aiPrompt: string;
}

export const INITIAL_FORM_DATA: FormData = {
  boothType: "",
  industry: "",
  style: "",
  subStyle: "",
  lighting: "",
  width: "",
  depth: "",
  openSides: "",
  layoutType: "",
  mustHave: [],
  engagement: [],
  premiumAddOns: [],
  brandName: "",
  tagline: "",
  personality: {
    tone: "",
    aesthetic: "",
    feel: "",
  },
  budget: "",
  restrictions: [],
  additionalNotes: "",
};

export const STEP_TITLES = [
  "Booth Type & Industry",
  "Style & Visual Direction",
  "Structure & Layout",
  "Elements",
  "Brand & Message",
  "Budget",
  "Constraints",
];

// ─── Step 1: Booth Types ─────────────────────────────────────────────────────
export const BOOTH_TYPES = [
  {
    id: "island",
    label: "Island",
    icon: "◈",
    description: "Open on all 4 sides — maximum visibility",
    recommended: true,
  },
  {
    id: "peninsula",
    label: "Peninsula",
    icon: "◧",
    description: "Open on 3 sides — strong presence",
    recommended: false,
  },
  {
    id: "corner",
    label: "Corner",
    icon: "◩",
    description: "Open on 2 adjacent sides — efficient",
    recommended: false,
  },
  {
    id: "inline",
    label: "Inline",
    icon: "▭",
    description: "Single open front — focused display",
    recommended: false,
  },
  {
    id: "custom",
    label: "Custom",
    icon: "✦",
    description: "Unique or irregular configuration",
    recommended: false,
  },
];

// ─── Step 1: Industries ──────────────────────────────────────────────────────
export const INDUSTRIES = [
  { id: "technology", label: "Technology", icon: "💻" },
  { id: "healthcare", label: "Healthcare", icon: "⚕️" },
  { id: "automotive", label: "Automotive", icon: "🚗" },
  { id: "food-beverage", label: "Food & Beverage", icon: "🍽️" },
  { id: "fashion-retail", label: "Fashion & Retail", icon: "👗" },
  { id: "architecture", label: "Architecture", icon: "🏛️" },
  { id: "finance", label: "Finance", icon: "📈" },
  { id: "energy", label: "Energy", icon: "⚡" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "entertainment", label: "Entertainment", icon: "🎬" },
];

// ─── Step 2: Main Styles ─────────────────────────────────────────────────────
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

// ─── Step 2: Sub-Styles ──────────────────────────────────────────────────────
export const SUB_STYLES = [
  {
    id: "industrial",
    label: "Industrial",
    icon: "⚙",
    description: "Raw steel, exposed structure, concrete",
  },
  {
    id: "scandinavian",
    label: "Scandinavian",
    icon: "❄",
    description: "Light wood, soft whites, hygge warmth",
    recommended: true,
  },
  {
    id: "art-deco",
    label: "Art Deco",
    icon: "◐",
    description: "Geometric glamour, gold lines, bold symmetry",
  },
  {
    id: "biophilic",
    label: "Biophilic",
    icon: "🌿",
    description: "Living walls, organic curves, nature-first",
  },
  {
    id: "brutalist",
    label: "Brutalist",
    icon: "▪",
    description: "Monolithic forms, raw power, architectural drama",
  },
];

// ─── Step 2: Lighting ────────────────────────────────────────────────────────
export const LIGHTING_OPTIONS = [
  {
    id: "ambient",
    label: "Ambient",
    icon: "☀",
    description: "Soft, even, inviting — all-around glow",
    recommended: true,
  },
  {
    id: "dramatic",
    label: "Dramatic",
    icon: "🎭",
    description: "High contrast, moody, sculptural shadows",
  },
  {
    id: "natural",
    label: "Natural",
    icon: "🌤",
    description: "Daylight-mimicking, warm, airy",
  },
  {
    id: "neon",
    label: "Neon / RGB",
    icon: "🌈",
    description: "Bold color washes, electric atmosphere",
  },
  {
    id: "spotlit",
    label: "Spotlit",
    icon: "💡",
    description: "Focused beams, product-first, retail-precise",
  },
];

// ─── Step 3: Layout Types ────────────────────────────────────────────────────
export const LAYOUT_TYPES = [
  {
    id: "open-flow",
    label: "Open Flow",
    icon: "⟷",
    description: "Unobstructed, visitors move freely",
    recommended: true,
  },
  {
    id: "zoned",
    label: "Zoned",
    icon: "⊞",
    description: "Distinct areas — demo, meet, display",
  },
  {
    id: "linear",
    label: "Linear",
    icon: "—",
    description: "Guided journey along a single path",
  },
  {
    id: "lounge",
    label: "Lounge",
    icon: "⊡",
    description: "Seating-focused, relationship-building",
  },
  {
    id: "theater",
    label: "Theater",
    icon: "▷",
    description: "Presentation-first, stage & audience",
  },
];

// ─── Step 4: Must-Have Elements ──────────────────────────────────────────────
export const MUST_HAVE_ELEMENTS = [
  { id: "reception", label: "Reception Desk", icon: "🏷️" },
  { id: "led-screen", label: "LED Screen", icon: "📺" },
  { id: "storage", label: "Storage Unit", icon: "📦" },
  { id: "meeting-area", label: "Meeting Area", icon: "🤝" },
  { id: "product-display", label: "Product Display", icon: "🧪" },
  { id: "branding-wall", label: "Branding Wall", icon: "🖼️" },
];

// ─── Step 4: Engagement Elements ─────────────────────────────────────────────
export const ENGAGEMENT_ELEMENTS = [
  { id: "coffee-bar", label: "Coffee Bar", icon: "☕" },
  { id: "shelves", label: "Display Shelves", icon: "📚" },
  { id: "interactive-display", label: "Interactive Display", icon: "🖥️" },
  { id: "demo-station", label: "Demo Station", icon: "🎮" },
  { id: "photo-spot", label: "Photo Spot", icon: "📸" },
];

// ─── Step 4: Premium Add-Ons ─────────────────────────────────────────────────
export const PREMIUM_ADDONS = [
  { id: "vip-lounge", label: "VIP Lounge", icon: "👑" },
  { id: "augmented-reality", label: "AR Experience", icon: "🥽" },
  { id: "live-streaming", label: "Live Streaming Setup", icon: "🎙️" },
  { id: "custom-flooring", label: "Custom Flooring", icon: "🔲" },
  { id: "hologram", label: "Hologram Display", icon: "✨" },
];

// ─── Step 6: Budget Options ──────────────────────────────────────────────────
export const BUDGET_OPTIONS = [
  {
    id: "low",
    label: "Essential",
    description: "Functional & impactful — smart use of budget",
    icon: "$",
    range: "$15K – $50K",
  },
  {
    id: "medium",
    label: "Professional",
    description: "Balanced quality — standout without excess",
    icon: "$$",
    range: "$50K – $150K",
  },
  {
    id: "high",
    label: "Premium",
    description: "No compromises — bespoke, architectural-grade",
    icon: "$$$",
    range: "$150K+",
  },
];

// ─── Step 7: Restrictions ────────────────────────────────────────────────────
export const RESTRICTIONS = [
  { id: "too-dark", label: "Avoid Dark Tones", icon: "🌑" },
  { id: "too-crowded", label: "Avoid Crowded Feel", icon: "👥" },
  { id: "too-simple", label: "Avoid Too Simple", icon: "📄" },
  { id: "too-complex", label: "Avoid Too Complex", icon: "🧩" },
  { id: "no-screens", label: "Avoid Screens", icon: "🚫" },
  { id: "no-bright-colors", label: "Avoid Bright Colors", icon: "🎨" },
];

// ─── Personality (Step 5) ─────────────────────────────────────────────────────
export const PERSONALITY_OPTIONS = {
  tone: [
    { id: "serious", label: "Serious & Professional" },
    { id: "playful", label: "Playful & Approachable" },
  ],
  aesthetic: [
    { id: "minimal", label: "Minimal & Refined" },
    { id: "bold", label: "Bold & Expressive" },
  ],
  feel: [
    { id: "luxury", label: "Exclusive & Luxurious" },
    { id: "practical", label: "Functional & Visitor-Friendly" },
  ],
};
