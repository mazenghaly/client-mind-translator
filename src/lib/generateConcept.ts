import { FormData, ConceptResult } from "./types";

export function generateClientConcept(data: FormData): ConceptResult {
  const conceptName      = buildConceptName(data);
  const conceptIdea      = buildConceptIdea(data);
  const designDirection  = buildDesignDirection(data);
  const layoutLogic      = buildLayoutLogic(data);
  const keyFeatures      = buildKeyFeatures(data);
  const estimatedBudget  = buildEstimatedBudget(data);
  const aiPrompt         = buildAiPrompt(data);

  return {
    conceptName,
    conceptIdea,
    designDirection,
    layoutLogic,
    keyFeatures,
    estimatedBudget,
    aiPrompt,
  };
}

// ─── Concept Name ──────────────────────────────────────────────────────────────
function buildConceptName(data: FormData): string {
  const styleNames: Record<string, string[]> = {
    "modern-minimal": ["Clarity", "Essence", "Pureform", "Axis"],
    luxury:           ["Opulence", "Prestige", "Aurum", "The Crown"],
    tech:             ["Nexus", "Circuitry", "Pulse", "Synaptic"],
    "warm-natural":   ["Haven", "Terra", "Bloomfield", "Root"],
    futuristic:       ["Horizon", "Prism", "Quantum", "Helix"],
  };

  const budgetMod: Record<string, string[]> = {
    low:    ["Core", "Lite"],
    medium: ["Pro", "Select"],
    high:   ["Elite", "Grand"],
  };

  const industryPrefix: Record<string, string> = {
    technology:      "Tech",
    healthcare:      "Health",
    automotive:      "Auto",
    "food-beverage": "Culinary",
    "fashion-retail":"Style",
    architecture:    "Arch",
    finance:         "Capital",
    energy:          "Power",
    education:       "Academy",
    entertainment:   "Stage",
  };

  const names   = styleNames[data.style] || ["Concept"];
  const mods    = budgetMod[data.budget]  || [""];
  const prefix  = industryPrefix[data.industry] || "";

  const baseName = names[Math.floor(Math.random() * names.length)];
  const mod      = mods[Math.floor(Math.random() * mods.length)];
  const playful  = data.personality.tone === "playful" ? "Vivid " : "";

  return prefix
    ? `${playful}${prefix} ${baseName} ${mod}`.trim()
    : `${playful}${baseName} ${mod}`.trim();
}

// ─── Concept Idea ──────────────────────────────────────────────────────────────
function buildConceptIdea(data: FormData): string {
  const styleStories: Record<string, string> = {
    "modern-minimal":
      "A refined space where every element speaks with purpose. The booth strips away the unnecessary, letting the brand breathe through clean geometry and intentional negative space.",
    luxury:
      "An immersive sanctuary of sophistication. Rich materials and seamless finishes create an atmosphere that elevates the brand to an aspirational experience visitors won't forget.",
    tech:
      "A dynamic digital ecosystem where innovation meets interaction. The booth pulses with energy, drawing visitors into a technology-forward narrative that positions the brand at the cutting edge.",
    "warm-natural":
      "A welcoming retreat that grounds visitors in authenticity. Natural textures and organic forms create a space that feels like a conversation, not a pitch — building trust through warmth.",
    futuristic:
      "A bold statement from the future. Striking geometry and unexpected materials challenge convention, creating a booth that doesn't just attract attention — it demands it.",
  };

  const boothTypeContext: Record<string, string> = {
    island:    "As a fully open island configuration, every angle is an invitation.",
    peninsula: "With three open sides, the booth commands its corner of the floor.",
    corner:    "Positioned at the intersection of two aisles, the booth captures dual traffic flows.",
    inline:    "Facing the main aisle with focused directness.",
    custom:    "Its unique footprint becomes part of the story itself.",
  };

  let story = styleStories[data.style] || "A thoughtfully designed exhibition space.";

  if (data.boothType) {
    story += " " + (boothTypeContext[data.boothType] || "");
  }

  if (data.brandName) {
    story += ` Every touchpoint carries the identity of ${data.brandName} — unmistakable, considered, and confident.`;
  }

  if (data.personality.tone === "playful") {
    story += " The design carries an approachable energy that invites exploration and discovery.";
  } else if (data.personality.tone === "serious") {
    story += " Every detail reflects professionalism and authority.";
  }

  if (data.mustHave.includes("meeting-area")) {
    story += " A dedicated meeting zone creates moments for meaningful business conversations.";
  }

  if (data.budget === "high") {
    story += " Premium materials and bespoke craftsmanship ensure an unforgettable impression.";
  }

  if (data.restrictions.includes("too-dark")) {
    story += " The palette remains open and luminous, ensuring the space feels inviting.";
  }

  return story;
}

// ─── Design Direction ──────────────────────────────────────────────────────────
function buildDesignDirection(data: FormData): string {
  const directions: string[] = [];

  const styleMaterials: Record<string, string> = {
    "modern-minimal": "Materials: Matte white surfaces, brushed aluminum accents, tempered glass partitions. Palette: Monochrome with a single brand accent color.",
    luxury:           "Materials: Marble or stone-look panels, brushed gold or brass accents, velvet texturing. Palette: Deep navy, charcoal, champagne gold.",
    tech:             "Materials: Backlit acrylic panels, LED-integrated surfaces, carbon-fiber textures. Palette: Deep black base with electric blue and cyan accents.",
    "warm-natural":   "Materials: Light oak or birch wood, linen fabrics, terracotta or stone accents. Palette: Warm whites, sage green, earthy terracotta.",
    futuristic:       "Materials: Corian surfaces, holographic films, parametric 3D-printed elements. Palette: Matte black, iridescent highlights, neon accent pops.",
  };
  directions.push(styleMaterials[data.style] || "Materials: To be defined.");

  const subStyleInfluence: Record<string, string> = {
    industrial:    "Sub-style inflection: Exposed metal joints, raw concrete accents, Edison-style lighting.",
    scandinavian:  "Sub-style inflection: Light birch tones, soft textiles, abundant negative space.",
    "art-deco":    "Sub-style inflection: Geometric gold inlays, bold symmetry, stepped fascia profiles.",
    biophilic:     "Sub-style inflection: Living wall feature, organic material accents, indoor planting.",
    brutalist:     "Sub-style inflection: Monolithic concrete-look fascia, oversized structural members, raw power.",
  };
  if (data.subStyle && subStyleInfluence[data.subStyle]) {
    directions.push(subStyleInfluence[data.subStyle]);
  }

  const lightingDesign: Record<string, string> = {
    ambient:   "Lighting: Even, warm ambient wash — inviting and comfortable for long dwell time.",
    dramatic:  "Lighting: High-contrast spotlighting with deep shadows to sculpt the structure.",
    natural:   "Lighting: Daylight-temperature LEDs, diffused coves, biophilic sky panels.",
    neon:      "Lighting: Dynamic RGB wash lighting with programmable scenes and brand-color accents.",
    spotlit:   "Lighting: Precision spotlights on products and brand moments. Retail-grade precision.",
  };
  if (data.lighting && lightingDesign[data.lighting]) {
    directions.push(lightingDesign[data.lighting]);
  }

  if (data.personality.aesthetic === "bold") {
    directions.push("Expression: Strong graphic statements, oversized typography, high-contrast visual hierarchy.");
  } else {
    directions.push("Expression: Understated elegance, refined typography, generous white space.");
  }

  const elements = [...data.mustHave, ...data.engagement, ...data.premiumAddOns];
  if (elements.length > 0) {
    const labels = elements
      .map((e) => e.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
      .join(", ");
    directions.push(`Integrated zones: ${labels}.`);
  }

  return directions.join("\n\n");
}

// ─── Layout Logic ──────────────────────────────────────────────────────────────
function buildLayoutLogic(data: FormData): string {
  const parts: string[] = [];

  const sides = parseInt(data.openSides) || 1;
  const width  = data.width  || "?";
  const depth  = data.depth  || "?";

  if (width !== "?" && depth !== "?") {
    parts.push(`Footprint: ${width}m × ${depth}m (${parseFloat(width) * parseFloat(depth)} m² total floor area).`);
  }

  if (sides >= 3) {
    parts.push("Configuration: Island — 360° visibility. Place a hero feature at center (e.g., feature product or installation) with functional zones radiating outward.");
  } else if (sides === 2) {
    parts.push("Configuration: Corner or peninsula — hero brand wall on the two closed sides, with open flow directing visitors across both open edges.");
  } else {
    parts.push("Configuration: Linear / inline — strong back wall as the hero moment. Layer depth from reception at front to private zones at rear.");
  }

  const layoutLogicMap: Record<string, string> = {
    "open-flow": "Flow: No internal barriers — visitors self-navigate. Use floor treatments and lighting to suggest pathways without restricting movement.",
    zoned:       "Flow: Clearly delineated zones with visual differentiation (material, ceiling height, lighting) — Demo zone, Meeting zone, Display zone.",
    linear:      "Flow: A single curated journey from entry to CTA moment. Each zone builds on the last narratively.",
    lounge:      "Flow: Seating-primary layout. Create a hospitality anchor at center, product displays at periphery. Encourage dwell time.",
    theater:     "Flow: Presentation stage with tiered audience area. Secondary demo tables on flanks for post-presentation engagement.",
  };
  if (data.layoutType && layoutLogicMap[data.layoutType]) {
    parts.push(layoutLogicMap[data.layoutType]);
  }

  const boothTypeLogic: Record<string, string> = {
    island:    "Sightlines: All four elevations are visible. Design every face of the structure — no dead backs.",
    peninsula: "Sightlines: Three faces visible. Back wall becomes the privacy anchor for meetings.",
    corner:    "Sightlines: Two open faces at 90°. Design an eye-catching corner element to attract from both aisles.",
    inline:    "Sightlines: Single face. Maximize the back wall — make it the defining brand moment.",
    custom:    "Sightlines: Unique footprint — design all visible elevations intentionally.",
  };
  if (data.boothType && boothTypeLogic[data.boothType]) {
    parts.push(boothTypeLogic[data.boothType]);
  }

  return parts.join("\n\n");
}

// ─── Key Features ──────────────────────────────────────────────────────────────
function buildKeyFeatures(data: FormData): string[] {
  const features: string[] = [];

  const styleFeature: Record<string, string> = {
    "modern-minimal": "Architectural-grade matte finish — clean, confident, zero distraction",
    luxury:           "Bespoke material palette with gold-toned metalwork and stone-effect panels",
    tech:             "Backlit LED surface system with dynamic brand-color programmability",
    "warm-natural":   "Organic material storytelling — wood, linen, and stone in harmony",
    futuristic:       "Parametric 3D-fabricated structures with iridescent material moments",
  };
  if (data.style && styleFeature[data.style]) features.push(styleFeature[data.style]);

  const subStyleFeature: Record<string, string> = {
    industrial:   "Exposed steel framework as a structural design feature",
    scandinavian: "Hygge-inspired soft furnishings and birch wood warmth",
    "art-deco":   "Stepped geometric fascia with gold inlay detailing",
    biophilic:    "Living wall installation as the brand's centrepiece",
    brutalist:    "Monolithic poured-concrete-look fascia with raw power",
  };
  if (data.subStyle && subStyleFeature[data.subStyle]) features.push(subStyleFeature[data.subStyle]);

  const lightingFeature: Record<string, string> = {
    ambient:  "Warm ambient cove lighting for maximum dwell time comfort",
    dramatic: "High-contrast theatrical spotlighting to sculpt architecture",
    natural:  "Daylight-temperature lighting system for natural feel",
    neon:     "Programmable RGB wash system with live brand-color scenes",
    spotlit:  "Precision retail-grade spot lighting on all key display moments",
  };
  if (data.lighting && lightingFeature[data.lighting]) features.push(lightingFeature[data.lighting]);

  const elementFeatures: Record<string, string> = {
    "reception":           "Branded reception desk as the first touchpoint",
    "led-screen":          "Large-format LED screen for dynamic content delivery",
    "storage":             "Integrated hidden storage maintaining clean sightlines",
    "meeting-area":        "Private or semi-private meeting area for qualified conversations",
    "product-display":     "Bespoke product display system with feature lighting",
    "branding-wall":       "Full-height branded back wall as the hero visual moment",
    "coffee-bar":          "Hospitality coffee bar to increase dwell time and warmth",
    "shelves":             "Custom display shelving integrated into the structure",
    "interactive-display": "Touch-screen interactive display for product engagement",
    "demo-station":        "Dedicated live demo station with ergonomic setup",
    "photo-spot":          "Branded photo opportunity zone for social media amplification",
    "vip-lounge":          "VIP private lounge for executive-level client conversations",
    "augmented-reality":   "AR experience station — bringing products to life digitally",
    "live-streaming":      "Live streaming studio setup for remote audience reach",
    "custom-flooring":     "Custom printed or tactile flooring as an immersive brand canvas",
    "hologram":            "Holographic display installation as a show-stopping centrepiece",
  };
  const allElements = [...data.mustHave, ...data.engagement, ...data.premiumAddOns];
  for (const el of allElements) {
    if (elementFeatures[el]) features.push(elementFeatures[el]);
  }

  return features.slice(0, 8);
}

// ─── Estimated Budget ──────────────────────────────────────────────────────────
function buildEstimatedBudget(data: FormData): string {
  const width  = parseFloat(data.width)  || 0;
  const depth  = parseFloat(data.depth)  || 0;
  const area   = width * depth;

  const baseRates: Record<string, { min: number; max: number; label: string }> = {
    low:    { min: 200,  max: 350,  label: "Essential" },
    medium: { min: 450,  max: 700,  label: "Professional" },
    high:   { min: 900,  max: 1400, label: "Premium" },
  };

  if (!data.budget || area === 0) {
    return "Complete Steps 3 & 6 to generate a budget estimate.";
  }

  const rate   = baseRates[data.budget] || baseRates.medium;
  const minVal = Math.round(area * rate.min);
  const maxVal = Math.round(area * rate.max);

  const fmt = (n: number) =>
    n >= 1_000_000
      ? `$${(n / 1_000_000).toFixed(2)}M`
      : `$${(n / 1_000).toFixed(0)}K`;

  const premiumCount = data.premiumAddOns.length;
  const addOnNote    = premiumCount > 0
    ? ` Premium add-ons (×${premiumCount}) will increase this estimate by 15–30%.`
    : "";

  return (
    `${rate.label} budget tier for ${area} m² booth.\n` +
    `Estimated range: ${fmt(minVal)} – ${fmt(maxVal)} USD (before add-ons).` +
    addOnNote +
    `\n\nThis is an indicative range only. Actual costs vary by region, contractor, and market conditions. Request a formal quote for accuracy.`
  );
}

// ─── AI Prompt ─────────────────────────────────────────────────────────────────
function buildAiPrompt(data: FormData): string {
  const styleDescriptors: Record<string, string> = {
    "modern-minimal": "modern minimalist style with clean lines, white and neutral tones, matte finishes, and geometric precision",
    luxury:           "luxury exhibition style with premium marble textures, gold accents, velvet elements, deep rich colors, and sophisticated ambient lighting",
    tech:             "high-tech futuristic exhibition style with LED panels, digital screens, backlit surfaces, sleek carbon-fiber textures, and dynamic blue-cyan lighting",
    "warm-natural":   "warm organic exhibition style with natural wood, stone textures, soft linen fabrics, indoor plants, warm earthy color palette, and soft diffused lighting",
    futuristic:       "avant-garde futuristic exhibition style with parametric forms, holographic elements, iridescent surfaces, dramatic geometry, and neon accent lighting",
  };

  const subStyleDescriptors: Record<string, string> = {
    industrial:   "with industrial raw steel and concrete detailing",
    scandinavian: "with Scandinavian birch wood tones and minimalist hygge warmth",
    "art-deco":   "with Art Deco geometric gold inlays and symmetrical stepped profiles",
    biophilic:    "featuring a living wall and organic biophilic material accents",
    brutalist:    "with brutalist monolithic concrete-look fascia elements",
  };

  const lightingDescriptors: Record<string, string> = {
    ambient:  "even warm ambient cove lighting",
    dramatic: "dramatic high-contrast theatrical spotlighting with deep shadows",
    natural:  "natural daylight-temperature diffused lighting",
    neon:     "dynamic RGB neon wash lighting with programmed brand-color scenes",
    spotlit:  "precision retail-grade spotlight beams on product display moments",
  };

  const boothTypeDescriptors: Record<string, string> = {
    island:    "island configuration open on all 4 sides",
    peninsula: "peninsula configuration open on 3 sides",
    corner:    "corner configuration open on 2 adjacent sides",
    inline:    "inline configuration with a single open front face",
    custom:    "custom irregular configuration",
  };

  const budgetDetail: Record<string, string> = {
    low:    "efficient and clean design with smart use of standard modular components",
    medium: "polished mid-range design with select custom elements and quality finishes",
    high:   "ultra-premium bespoke design with custom fabrication, high-end materials, and architectural lighting",
  };

  const width = data.width || "4";
  const depth = data.depth || "3";
  const sides = data.openSides || "1";
  const boothType = boothTypeDescriptors[data.boothType] || "exhibition booth";

  let prompt = `Design a photorealistic 3D rendering of an exhibition booth — ${boothType}, ${width}m wide × ${depth}m deep, open on ${sides} side(s). `;

  prompt += `Style: ${styleDescriptors[data.style] || "modern exhibition style"}`;
  if (data.subStyle && subStyleDescriptors[data.subStyle]) {
    prompt += `, ${subStyleDescriptors[data.subStyle]}`;
  }
  prompt += `. `;

  if (data.lighting && lightingDescriptors[data.lighting]) {
    prompt += `Lighting: ${lightingDescriptors[data.lighting]}. `;
  }

  prompt += `${budgetDetail[data.budget] || "balanced design quality"}. `;

  if (data.industry) {
    prompt += `Industry context: ${data.industry.replace(/-/g, " ")} sector. `;
  }

  if (data.layoutType) {
    const layoutContext: Record<string, string> = {
      "open-flow": "Open flow layout — no internal barriers, free visitor movement.",
      zoned:       "Zoned layout — clearly defined demo, meeting, and display areas.",
      linear:      "Linear guided journey from entry to CTA point.",
      lounge:      "Lounge-first layout — hospitality seating as the central anchor.",
      theater:     "Theater layout — presentation stage with audience seating.",
    };
    prompt += `Layout: ${layoutContext[data.layoutType] || ""} `;
  }

  const allElements = [...data.mustHave, ...data.engagement, ...data.premiumAddOns];
  if (allElements.length > 0) {
    const labels = allElements
      .map((e) => e.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
      .join(", ");
    prompt += `Include: ${labels}. `;
  }

  if (data.brandName) {
    prompt += `Brand identity: "${data.brandName}"${data.tagline ? ` — "${data.tagline}"` : ""}. Apply brand name prominently on the structure. `;
  }

  if (data.personality.tone === "playful") {
    prompt += "Mood: approachable, vibrant, and energetic. ";
  } else if (data.personality.tone === "serious") {
    prompt += "Mood: professional, authoritative, and refined. ";
  }

  if (data.personality.aesthetic === "bold") {
    prompt += "Use bold typography and high-contrast visual elements. ";
  } else if (data.personality.aesthetic === "minimal") {
    prompt += "Use minimal typography and generous negative space. ";
  }

  if (data.personality.feel === "luxury") {
    prompt += "Overall feel: exclusive and premium. ";
  } else if (data.personality.feel === "practical") {
    prompt += "Overall feel: functional and visitor-friendly. ";
  }

  if (data.restrictions.length > 0) {
    const restrictionText = data.restrictions.map((r) => r.replace(/-/g, " ")).join(", ");
    prompt += `Avoid: ${restrictionText}. `;
  }

  if (data.additionalNotes?.trim()) {
    prompt += `Additional notes: ${data.additionalNotes.trim()}. `;
  }

  prompt += "Render with realistic materials, soft shadows, warm exhibition hall lighting, slight depth of field, and people silhouettes for scale. Isometric 3/4 view angle.";

  return prompt;
}
