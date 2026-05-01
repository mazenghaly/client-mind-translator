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

// ─── Base rates per sqm (USD) ────────────────────────────────────────────────
const BASE_RATE: Record<string, { min: number; max: number }> = {
  low:    { min: 200,  max: 350  },
  medium: { min: 450,  max: 700  },
  high:   { min: 900,  max: 1400 },
};

// ─── Style multipliers ────────────────────────────────────────────────────────
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

// ─── Booth type multipliers ───────────────────────────────────────────────────
const BOOTH_TYPE_MULTIPLIER: Record<string, number> = {
  inline:    1.00,
  corner:    1.05,
  peninsula: 1.10,
  island:    1.20,
  custom:    1.15,
};

const BOOTH_TYPE_LABEL: Record<string, string> = {
  inline:    "Inline booth",
  corner:    "Corner booth",
  peninsula: "Peninsula booth",
  island:    "Island booth",
  custom:    "Custom configuration",
};

// ─── Element additions (% increase on running subtotal) ──────────────────────
const ELEMENT_ADDITIONS: Record<string, { pct: number; label: string; icon: string }> = {
  // Must-have elements
  "reception":            { pct: 0.05,  label: "Reception desk",          icon: "🏷️" },
  "led-screen":           { pct: 0.15,  label: "LED screen wall",         icon: "📺" },
  "storage":              { pct: 0.03,  label: "Storage unit",            icon: "📦" },
  "meeting-area":         { pct: 0.10,  label: "Meeting area",            icon: "🤝" },
  "product-display":      { pct: 0.06,  label: "Product display system",  icon: "🧪" },
  "branding-wall":        { pct: 0.08,  label: "Branding wall",           icon: "🖼️" },
  // Engagement elements
  "coffee-bar":           { pct: 0.08,  label: "Coffee bar",              icon: "☕" },
  "shelves":              { pct: 0.03,  label: "Display shelves",         icon: "📚" },
  "interactive-display":  { pct: 0.12,  label: "Interactive display",     icon: "🖥️" },
  "demo-station":         { pct: 0.07,  label: "Demo station",            icon: "🎮" },
  "photo-spot":           { pct: 0.04,  label: "Branded photo spot",      icon: "📸" },
  // Premium add-ons
  "vip-lounge":           { pct: 0.18,  label: "VIP lounge",              icon: "👑" },
  "augmented-reality":    { pct: 0.20,  label: "AR experience",           icon: "🥽" },
  "live-streaming":       { pct: 0.12,  label: "Live streaming setup",    icon: "🎙️" },
  "custom-flooring":      { pct: 0.09,  label: "Custom flooring",         icon: "🔲" },
  "hologram":             { pct: 0.25,  label: "Hologram display",        icon: "✨" },
};

// ─── Main estimator ───────────────────────────────────────────────────────────
export function estimatePrice(data: FormData): PriceEstimate {
  const width  = parseFloat(data.width);
  const depth  = parseFloat(data.depth);
  const budget = data.budget;

  const hasEnoughData =
    !isNaN(width)  && width  > 0 &&
    !isNaN(depth)  && depth  > 0 &&
    budget !== "";

  if (!hasEnoughData) {
    return { minTotal: 0, maxTotal: 0, breakdown: [], area: 0, hasEnoughData: false };
  }

  const area     = width * depth;
  const baseRate = BASE_RATE[budget] ?? BASE_RATE["medium"];
  const styleMult    = STYLE_MULTIPLIER[data.style]    ?? 1.0;
  const boothTypeMult = BOOTH_TYPE_MULTIPLIER[data.boothType] ?? 1.0;

  // 1. Base construction cost
  const baseMin = area * baseRate.min;
  const baseMax = area * baseRate.max;

  const breakdown: PriceBreakdownItem[] = [];

  breakdown.push({
    label:       "Base construction",
    description: `${area} m² × ${data.budget} budget rate`,
    minAmount:   baseMin,
    maxAmount:   baseMax,
    icon:        "🏗️",
  });

  // 2. Style premium
  let runningMin = baseMin * styleMult;
  let runningMax = baseMax * styleMult;

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

  // 3. Booth type multiplier
  if (boothTypeMult !== 1.0 && data.boothType) {
    const btMin = runningMin * boothTypeMult - runningMin;
    const btMax = runningMax * boothTypeMult - runningMax;
    breakdown.push({
      label:       `${BOOTH_TYPE_LABEL[data.boothType] ?? "Booth type"} uplift`,
      description: `${((boothTypeMult - 1) * 100).toFixed(0)}% configuration premium`,
      minAmount:   btMin,
      maxAmount:   btMax,
      icon:        "🏛️",
    });
    runningMin *= boothTypeMult;
    runningMax *= boothTypeMult;
  }

  // 4. Elements
  const allElements = [...data.mustHave, ...data.engagement, ...data.premiumAddOns];
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
    minTotal:      Math.round(runningMin),
    maxTotal:      Math.round(runningMax),
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
