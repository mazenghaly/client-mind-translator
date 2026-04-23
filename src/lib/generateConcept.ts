import { FormData, ConceptResult } from "./types";

export function generateClientConcept(data: FormData): ConceptResult {
  const conceptName = buildConceptName(data);
  const conceptStory = buildConceptStory(data);
  const designDirection = buildDesignDirection(data);
  const aiPrompt = buildAiPrompt(data);

  return { conceptName, conceptStory, designDirection, aiPrompt };
}

function buildConceptName(data: FormData): string {
  const styleNames: Record<string, string[]> = {
    "modern-minimal": ["Clarity", "Essence", "Pureform", "The Void"],
    luxury: ["Opulence", "Prestige", "Aurum", "The Crown"],
    tech: ["Nexus", "Circuitry", "Pulse", "Synaptic"],
    "warm-natural": ["Haven", "Terra", "Bloomfield", "Root"],
    futuristic: ["Horizon", "Prism", "Quantum", "Helix"],
  };

  const budgetMod: Record<string, string[]> = {
    low: ["Lite", "Core"],
    medium: ["Pro", "Select"],
    high: ["Elite", "Grand"],
  };

  const names = styleNames[data.style] || ["Concept"];
  const mods = budgetMod[data.budget] || [""];

  const baseName = names[Math.floor(Math.random() * names.length)];
  const mod = mods[Math.floor(Math.random() * mods.length)];

  const personalityPrefix =
    data.personality.tone === "playful" ? "Vivid " : "";

  return `${personalityPrefix}${baseName} ${mod}`.trim();
}

function buildConceptStory(data: FormData): string {
  const styleStories: Record<string, string> = {
    "modern-minimal":
      "A refined space where every element speaks with purpose. The booth strips away the unnecessary, letting the brand breathe through clean geometry and intentional negative space.",
    luxury:
      "An immersive sanctuary of sophistication. Rich materials and seamless finishes create an atmosphere that elevates the brand to an aspirational experience visitors won't forget.",
    tech: "A dynamic digital ecosystem where innovation meets interaction. The booth pulses with energy, drawing visitors into a technology-forward narrative that positions the brand at the cutting edge.",
    "warm-natural":
      "A welcoming retreat that grounds visitors in authenticity. Natural textures and organic forms create a space that feels like a conversation, not a pitch — building trust through warmth.",
    futuristic:
      "A bold statement from the future. Striking geometry and unexpected materials challenge convention, creating a booth that doesn't just attract attention — it demands it.",
  };

  let story = styleStories[data.style] || "A thoughtfully designed exhibition space.";

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

function buildDesignDirection(data: FormData): string {
  const directions: string[] = [];

  // Style-driven direction
  const styleMaterials: Record<string, string> = {
    "modern-minimal": "Materials: Matte white surfaces, brushed aluminum accents, tempered glass partitions. Palette: Monochrome with a single brand accent color.",
    luxury: "Materials: Marble or stone-look panels, brushed gold or brass accents, velvet texturing. Palette: Deep navy, charcoal, champagne gold.",
    tech: "Materials: Backlit acrylic panels, LED-integrated surfaces, carbon-fiber textures. Palette: Deep black base with electric blue and cyan accents.",
    "warm-natural": "Materials: Light oak or birch wood, linen fabrics, terracotta or stone accents. Palette: Warm whites, sage green, earthy terracotta.",
    futuristic: "Materials: Corian surfaces, holographic films, parametric 3D-printed elements. Palette: Matte black, iridescent highlights, neon accent pops.",
  };

  directions.push(styleMaterials[data.style] || "Materials: To be determined based on style.");

  // Layout direction based on dimensions and open sides
  const sides = parseInt(data.openSides) || 1;
  if (sides >= 3) {
    directions.push("Layout: Island configuration with 360° visual access. Central feature element with satellite zones radiating outward.");
  } else if (sides === 2) {
    directions.push("Layout: Corner or peninsula layout. Primary brand wall on closed sides with open flow on visitor-facing edges.");
  } else {
    directions.push("Layout: Linear flow with a strong back wall as the hero moment. Layered depth from entrance to private zones.");
  }

  // Budget-driven complexity
  if (data.budget === "high") {
    directions.push("Finish: Custom-fabricated elements, integrated AV systems, architectural lighting design with multiple scenes.");
  } else if (data.budget === "medium") {
    directions.push("Finish: Quality modular system with select custom elements. Focused lighting design on key areas.");
  } else {
    directions.push("Finish: Smart use of standard modular components with strategic graphic applications for maximum impact.");
  }

  // Personality-driven mood
  if (data.personality.aesthetic === "bold") {
    directions.push("Expression: Strong graphic statements, oversized typography, high-contrast visual hierarchy.");
  } else {
    directions.push("Expression: Understated elegance, refined typography, generous white space.");
  }

  // Elements integration
  const elements = [...data.mustHave, ...data.niceToHave];
  if (elements.length > 0) {
    const elementLabels = elements
      .map((e) =>
        e
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      )
      .join(", ");
    directions.push(`Zones: Integrate ${elementLabels} into the spatial flow.`);
  }

  return directions.join("\n\n");
}

function buildAiPrompt(data: FormData): string {
  const styleDescriptors: Record<string, string> = {
    "modern-minimal": "modern minimalist style with clean lines, white and neutral tones, matte finishes, and geometric precision",
    luxury: "luxury exhibition style with premium marble textures, gold accents, velvet elements, deep rich colors, and sophisticated ambient lighting",
    tech: "high-tech futuristic exhibition style with LED panels, digital screens, backlit surfaces, sleek carbon-fiber textures, and dynamic blue-cyan lighting",
    "warm-natural": "warm organic exhibition style with natural wood, stone textures, soft linen fabrics, indoor plants, warm earthy color palette, and soft diffused lighting",
    futuristic: "avant-garde futuristic exhibition style with parametric forms, holographic elements, iridescent surfaces, dramatic geometry, and neon accent lighting",
  };

  const budgetDetail: Record<string, string> = {
    low: "efficient and clean design with smart use of standard modular components",
    medium: "polished mid-range design with select custom elements and quality finishes",
    high: "ultra-premium bespoke design with custom fabrication, high-end materials, and architectural lighting",
  };

  const width = data.width || "4";
  const depth = data.depth || "3";
  const sides = data.openSides || "1";

  let prompt = `Design a photorealistic 3D rendering of an exhibition booth, ${width}m wide × ${depth}m deep, open on ${sides} side(s). `;
  prompt += `${styleDescriptors[data.style] || "modern exhibition style"}. `;
  prompt += `${budgetDetail[data.budget] || "balanced design quality"}. `;

  // Add elements
  const allElements = [...data.mustHave, ...data.niceToHave];
  if (allElements.length > 0) {
    const labels = allElements
      .map((e) =>
        e
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      )
      .join(", ");
    prompt += `Include: ${labels}. `;
  }

  // Personality
  if (data.personality.tone === "playful") {
    prompt += "The mood should be approachable, vibrant, and energetic. ";
  } else if (data.personality.tone === "serious") {
    prompt += "The mood should be professional, authoritative, and refined. ";
  }

  if (data.personality.aesthetic === "bold") {
    prompt += "Use bold typography and high-contrast visual elements. ";
  } else if (data.personality.aesthetic === "minimal") {
    prompt += "Use minimal typography and generous negative space. ";
  }

  if (data.personality.feel === "luxury") {
    prompt += "The overall feel should be exclusive and premium. ";
  } else if (data.personality.feel === "practical") {
    prompt += "The overall feel should be functional and visitor-friendly. ";
  }

  // Restrictions
  if (data.restrictions.length > 0) {
    const restrictionText = data.restrictions
      .map((r) => r.replace(/-/g, " "))
      .join(", ");
    prompt += `Avoid anything that feels ${restrictionText}. `;
  }

  prompt += "Render with realistic materials, soft shadows, warm exhibition hall lighting, slight depth of field, and people silhouettes for scale. Isometric 3/4 view angle.";

  return prompt;
}
