import { FormData } from "./types";

export interface ExtractedData {
  boothSize: { width: string; depth: string } | null;
  industry: string | null;
  styleKeywords: string[];
  style: string | null;
  elements: string[];
  budget: string | null;
  openSides: string | null;
}

export interface BriefAnalysis {
  extracted: ExtractedData;
  suggestedFormData: Partial<FormData>;
  clientIntent: string;
  missingInfo: string[];
  designDirection: string;
  confidence: number; // 0–100
}

// ─── Keyword maps ──────────────────────────────────────────────────────────────

const STYLE_KEYWORDS: Record<string, string[]> = {
  "modern-minimal": [
    "minimal", "minimalist", "clean", "simple", "white", "open", "airy",
    "sleek", "neat", "uncluttered", "monochrome", "crisp",
  ],
  luxury: [
    "luxury", "luxurious", "premium", "high-end", "elegant", "elegant",
    "gold", "marble", "exclusive", "prestigious", "opulent", "sophisticated",
    "bespoke", "refined",
  ],
  tech: [
    "tech", "technology", "digital", "innovative", "cutting-edge",
    "modern technology", "hi-tech", "high-tech", "smart", "connected",
    "data", "software", "saas", "startup", "it company",
  ],
  "warm-natural": [
    "natural", "wood", "organic", "sustainable", "eco", "warm", "earthy",
    "timber", "bamboo", "linen", "cozy", "welcoming", "green", "plant",
    "biophilic",
  ],
  futuristic: [
    "futuristic", "avant-garde", "bold", "dynamic", "space-age", "sci-fi",
    "next-generation", "visionary", "geometric", "parametric", "immersive",
  ],
};

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  "Technology":   ["tech", "software", "it", "saas", "ai", "digital", "cloud", "startup", "app", "cybersecurity", "data", "automation"],
  "F&B":          ["food", "beverage", "restaurant", "café", "coffee", "catering", "drink", "cuisine", "gourmet", "snack"],
  "Fashion":      ["fashion", "clothing", "apparel", "garment", "textile", "wear", "accessories", "shoes", "jewelry"],
  "Healthcare":   ["health", "medical", "pharma", "pharmaceutical", "wellness", "hospital", "clinic", "biotech", "lab"],
  "Retail":       ["retail", "consumer", "shopping", "store", "brand", "product", "e-commerce"],
  "Finance":      ["finance", "banking", "insurance", "investment", "fintech", "wealth", "bank"],
  "Real Estate":  ["real estate", "property", "construction", "architecture", "interior", "developer", "building"],
  "Education":    ["education", "university", "school", "learning", "academic", "training", "edtech"],
  "Automotive":   ["automotive", "car", "vehicle", "motor", "auto", "electric vehicle", "ev", "transport"],
  "Government":   ["government", "public sector", "ministry", "municipality", "state", "authority"],
};

const ELEMENT_KEYWORDS: Record<string, string[]> = {
  "reception":           ["reception", "welcome desk", "front desk", "reception area", "receptionist", "check-in"],
  "led-screen":          ["led", "screen", "display", "video wall", "digital display", "monitor", "tv", "presentation screen"],
  "storage":             ["storage", "storeroom", "back room", "stock", "storage unit", "cabinet"],
  "meeting-area":        ["meeting", "meeting room", "meeting area", "private area", "vip", "lounge", "discussion", "consultation"],
  "coffee-bar":          ["coffee", "café", "barista", "beverage station", "coffee bar", "refreshments"],
  "shelves":             ["shelf", "shelves", "product display", "showcase", "product wall", "display shelves"],
  "interactive-display": ["interactive", "touchscreen", "touch screen", "kiosk", "interactive display", "digital interaction"],
};

const BUDGET_KEYWORDS: Record<string, string[]> = {
  low:    ["budget", "affordable", "cost-effective", "economy", "cheap", "low cost", "limited budget", "tight budget", "basic"],
  medium: ["moderate", "mid-range", "standard", "reasonable", "average budget", "medium budget", "mid budget"],
  high:   ["premium", "high-end", "luxury", "no compromise", "top budget", "large budget", "high budget", "unlimited", "flagship", "grand"],
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function detectInText(text: string, keywords: string[]): boolean {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw.toLowerCase()));
}

function extractBoothSize(text: string): { width: string; depth: string } | null {
  // Patterns: "6x4", "6 x 4", "6m x 4m", "6 by 4", "6×4", "width 6, depth 4"
  const patterns = [
    /(\d+(?:\.\d+)?)\s*[mx×]\s*(\d+(?:\.\d+)?)\s*(?:m|meter|meters)?/i,
    /(\d+(?:\.\d+)?)\s*(?:m|meter|meters)?\s*(?:by|x|×)\s*(\d+(?:\.\d+)?)\s*(?:m|meter|meters)?/i,
    /width[:\s]+(\d+(?:\.\d+)?)[,\s]+depth[:\s]+(\d+(?:\.\d+)?)/i,
    /(\d+(?:\.\d+)?)\s*(?:m|meters)?\s*wide[,\s]+(\d+(?:\.\d+)?)\s*(?:m|meters)?\s*deep/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const w = parseFloat(match[1]);
      const d = parseFloat(match[2]);
      if (w > 0 && w <= 100 && d > 0 && d <= 100) {
        return { width: String(w), depth: String(d) };
      }
    }
  }

  // Try to extract area and guess dimensions
  const areaMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:sqm|sq\.?m|square meters?|m²)/i);
  if (areaMatch) {
    const area = parseFloat(areaMatch[1]);
    if (area > 0 && area <= 5000) {
      const side = Math.round(Math.sqrt(area));
      return { width: String(side), depth: String(side) };
    }
  }
  return null;
}

function extractOpenSides(text: string): string | null {
  const lower = text.toLowerCase();
  if (/island|open on (all|4|four) sides/.test(lower)) return "4";
  if (/peninsula|3 open|three open|open on 3/.test(lower)) return "3";
  if (/corner|2 open|two open|open on 2/.test(lower)) return "2";
  if (/linear|inline|one open|1 open|open on 1/.test(lower)) return "1";
  return null;
}

function detectStyle(text: string): { style: string | null; keywords: string[] } {
  const scores: Record<string, number> = {};
  const found: string[] = [];

  for (const [styleId, keywords] of Object.entries(STYLE_KEYWORDS)) {
    for (const kw of keywords) {
      if (text.toLowerCase().includes(kw.toLowerCase())) {
        scores[styleId] = (scores[styleId] ?? 0) + 1;
        if (!found.includes(kw)) found.push(kw);
      }
    }
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return {
    style: best ? best[0] : null,
    keywords: found.slice(0, 6),
  };
}

function detectIndustry(text: string): string | null {
  const scores: Record<string, number> = {};
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    for (const kw of keywords) {
      if (text.toLowerCase().includes(kw.toLowerCase())) {
        scores[industry] = (scores[industry] ?? 0) + 1;
      }
    }
  }
  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return best ? best[0] : null;
}

function detectElements(text: string): string[] {
  const found: string[] = [];
  for (const [elementId, keywords] of Object.entries(ELEMENT_KEYWORDS)) {
    if (detectInText(text, keywords)) found.push(elementId);
  }
  return found;
}

function detectBudget(text: string): string | null {
  for (const [level, keywords] of Object.entries(BUDGET_KEYWORDS)) {
    if (detectInText(text, keywords)) return level;
  }
  return null;
}

// ─── Intent & direction generators ────────────────────────────────────────────

function buildClientIntent(extracted: ExtractedData): string {
  const parts: string[] = [];

  if (extracted.industry) {
    parts.push(`The client operates in the ${extracted.industry} sector`);
  } else {
    parts.push("The client's industry is not clearly specified");
  }

  if (extracted.style) {
    const styleLabels: Record<string, string> = {
      "modern-minimal": "a clean, modern minimal aesthetic",
      luxury: "a luxury and premium look",
      tech: "a tech-forward, digital experience",
      "warm-natural": "a warm, natural and organic feel",
      futuristic: "a bold, futuristic design statement",
    };
    parts.push(`and is seeking ${styleLabels[extracted.style] ?? extracted.style}`);
  }

  if (extracted.boothSize) {
    parts.push(`for a ${extracted.boothSize.width}m × ${extracted.boothSize.depth}m booth`);
  }

  if (extracted.elements.length > 0) {
    const labels = extracted.elements
      .map((e) => e.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
      .join(", ");
    parts.push(`expecting key functional zones including: ${labels}`);
  }

  if (extracted.budget) {
    const budgetLabels: Record<string, string> = {
      low: "working within a conservative budget",
      medium: "expecting mid-range investment and quality",
      high: "prepared to invest heavily for a premium result",
    };
    parts.push(budgetLabels[extracted.budget] ?? "");
  }

  return parts.join(", ") + ".";
}

function buildDesignDirection(extracted: ExtractedData): string {
  const lines: string[] = [];

  if (extracted.style) {
    const directions: Record<string, string> = {
      "modern-minimal": "Focus on an open, uncluttered layout with white or neutral surfaces, generous negative space, and a single strong brand accent color.",
      luxury: "Lead with premium materials — marble surfaces, brushed metal, deep jewel tones. Every touchpoint should feel curated and exclusive.",
      tech: "Prioritize a digitally-immersive environment with LED integration, backlit surfaces, and a dynamic information layer throughout the booth.",
      "warm-natural": "Use tactile natural materials — oak, linen, stone — combined with warm ambient lighting and indoor greenery to create an inviting, authentic space.",
      futuristic: "Design for visual impact — parametric forms, iridescent surfaces, and unexpected geometry that positions the brand ahead of the curve.",
    };
    lines.push(directions[extracted.style]);
  } else {
    lines.push("No clear style direction was detected. Consider aligning the aesthetic with the brand guidelines before proceeding.");
  }

  if (extracted.elements.includes("meeting-area")) {
    lines.push("A meeting zone should be designed for privacy and comfort — consider paneled enclosures or elevated flooring to define the space.");
  }
  if (extracted.elements.includes("led-screen")) {
    lines.push("LED screen placement should anchor the brand story — consider a hero wall at the back or ceiling-mounted canopy for maximum impact.");
  }
  if (extracted.budget === "high") {
    lines.push("With a high budget, custom fabrication and bespoke finishes are recommended rather than modular systems.");
  }
  if (extracted.budget === "low") {
    lines.push("To maximize value within constraints, prioritize strong graphic applications over custom-built elements.");
  }

  return lines.join(" ");
}

function buildMissingInfo(extracted: ExtractedData): string[] {
  const missing: string[] = [];
  if (!extracted.boothSize) missing.push("Booth dimensions (width & depth in meters)");
  if (!extracted.style) missing.push("Visual style direction or brand mood");
  if (!extracted.budget) missing.push("Budget level or approximate spend range");
  if (!extracted.industry) missing.push("Client industry or sector");
  if (extracted.elements.length === 0) missing.push("Required functional elements (reception, screen, etc.)");
  if (!extracted.openSides) missing.push("Booth configuration (number of open sides)");
  return missing;
}

function calcConfidence(extracted: ExtractedData): number {
  let score = 0;
  if (extracted.boothSize) score += 25;
  if (extracted.style) score += 20;
  if (extracted.budget) score += 20;
  if (extracted.industry) score += 15;
  if (extracted.elements.length > 0) score += 15;
  if (extracted.openSides) score += 5;
  return Math.min(score, 100);
}

// ─── Main analyzer ─────────────────────────────────────────────────────────────

export function analyzeClientBrief(text: string): BriefAnalysis {
  const boothSize   = extractBoothSize(text);
  const industry    = detectIndustry(text);
  const budget      = detectBudget(text);
  const openSides   = extractOpenSides(text);
  const { style, keywords: styleKeywords } = detectStyle(text);
  const elements    = detectElements(text);

  const extracted: ExtractedData = {
    boothSize,
    industry,
    styleKeywords,
    style,
    elements,
    budget,
    openSides,
  };

  // Classify elements into must-have vs nice-to-have
  const mustHaveIds  = ["reception", "led-screen", "storage", "meeting-area"];
  const niceToHaveIds = ["coffee-bar", "shelves", "interactive-display"];

  const suggestedFormData: Partial<FormData> = {
    ...(style                    && { style }),
    ...(budget                   && { budget }),
    ...(boothSize                && { width: boothSize.width, depth: boothSize.depth }),
    ...(openSides                && { openSides }),
    mustHave:   elements.filter((e) => mustHaveIds.includes(e)),
    niceToHave: elements.filter((e) => niceToHaveIds.includes(e)),
  };

  return {
    extracted,
    suggestedFormData,
    clientIntent:    buildClientIntent(extracted),
    missingInfo:     buildMissingInfo(extracted),
    designDirection: buildDesignDirection(extracted),
    confidence:      calcConfidence(extracted),
  };
}
