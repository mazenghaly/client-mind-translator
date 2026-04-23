import { FormData } from "./types";

export interface PriceBreakdownItem {
  label: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  icon: string;
}

export interface PriceEstimate {
  minTotal: number;
  maxTotal: number;
  breakdown: PriceBreakdownItem[];
  area: number;
  hasEnoughData: boolean;
}

// ─── Base rates per sqm (USD) ───────────────────────────────────────────────
const BASE_RATE: Record<string, { min: number; max: number }> = {
  low:    { min: 200,  max: 350  },
  medium: { min: 450,  max: 700  },
  high:   { min: 900,  max: 1400 },
};

// ─── Style multipliers (applied to base sqm cost) ───────────────────────────
const STYLE_MULTIPLIER: Record<string, number> = {
  "modern-minimal": 1.00,
  "warm-natural":   1.10,
  "tech":           1.25,
  "futuristic":     1.35,
  "luxury":         1.50,
};

const STYLE_LABEL: Record<string, string> = {
  "modern-minimal": "Modern Minimal",
  "warm-natural":   "Warm Natural",
  "tech":           "Tech",
  "futuristic":     "Futuristic",
  "luxury":         "Luxury",
};

// ─── Element additions (% increase on base subtotal) ─────────────────────────
const ELEMENT_ADDITIONS: Record<string, { pct: number; label: string; icon: string }> = {
  "reception":           { pct: 0.05,  label: "Reception desk",       icon: "🏷️" },
  "led-screen":          { pct: 0.15,  label: "LED screen wall",      icon: "📺" },
  "storage":             { pct: 0.03,  label: "Storage unit",         icon: "📦" },
  "meeting-area":        { pct: 0.10,  label: "Meeting area",         icon: "🤝" },
  "coffee-bar":          { pct: 0.08,  label: "Coffee bar",           icon: "☕" },
  "shelves":             { pct: 0.03,  label: "Display shelves",      icon: "📚" },
  "interactive-display": { pct: 0.12,  label: "Interactive display",  icon: "🖥️" },
};

// ─── Main estimator ───────────────────────────────────────────────────────────
export function estimatePrice(data: FormData): PriceEstimate {
  const width  = parseFloat(data.width);
  const depth  = parseFloat(data.depth);
  const budget = data.budget;

  const hasEnoughData =
    !isNaN(width) && width > 0 &&
    !isNaN(depth) && depth > 0 &&
    budget !== "";

  if (!hasEnoughData) {
    return { minTotal: 0, maxTotal: 0, breakdown: [], area: 0, hasEnoughData: false };
  }

  const area        = width * depth;
  const baseRate    = BASE_RATE[budget] ?? BASE_RATE["medium"];
  const styleMult   = STYLE_MULTIPLIER[data.style] ?? 1.0;

  // 1. Base construction cost
  const baseMin = area * baseRate.min;
  const baseMax = area * baseRate.max;

  const breakdown: PriceBreakdownItem[] = [];

  // Base area
  breakdown.push({
    label:       "Base construction",
    description: `${area} m² × ${data.budget} budget rate`,
    minAmount:   baseMin,
    maxAmount:   baseMax,
    icon:        "🏗️",
  });

  // Style uplift (only show if not neutral)
  const styleMin = baseMin * styleMult - baseMin;
  const styleMax = baseMax * styleMult - baseMax;
  if (styleMult !== 1.0 && data.style) {
    breakdown.push({
      label:       `${STYLE_LABEL[data.style] ?? "Style"} premium`,
      description: `${((styleMult - 1) * 100).toFixed(0)}% style uplift`,
      minAmount:   styleMin,
      maxAmount:   styleMax,
      icon:        "✦",
    });
  }

  // Running subtotal after base + style
  let runningMin = baseMin * styleMult;
  let runningMax = baseMax * styleMult;

  // Elements
  const allElements = [...data.mustHave, ...data.niceToHave];
  for (const elId of allElements) {
    const el = ELEMENT_ADDITIONS[elId];
    if (!el) continue;
    const elMin = runningMin * el.pct;
    const elMax = runningMax * el.pct;
    breakdown.push({
      label:       el.label,
      description: `+${(el.pct * 100).toFixed(0)}% of current subtotal`,
      minAmount:   elMin,
      maxAmount:   elMax,
      icon:        el.icon,
    });
    runningMin += elMin;
    runningMax += elMax;
  }

  return {
    minTotal:     Math.round(runningMin),
    maxTotal:     Math.round(runningMax),
    breakdown,
    area,
    hasEnoughData: true,
  };
}

export function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
}
