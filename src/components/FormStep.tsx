"use client";

import React, { useState } from "react";
import {
  FormData,
  BOOTH_TYPES, INDUSTRIES,
  STYLES, SUB_STYLES, LIGHTING_OPTIONS,
  LAYOUT_TYPES,
  MUST_HAVE_ELEMENTS, ENGAGEMENT_ELEMENTS, PREMIUM_ADDONS,
  PERSONALITY_OPTIONS,
  BUDGET_OPTIONS,
  RESTRICTIONS,
} from "@/lib/types";

interface FormStepProps {
  step: number;
  formData: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

export default function FormStep({ step, formData, onChange }: FormStepProps) {
  switch (step) {
    case 1: return <BoothTypeIndustryStep formData={formData} onChange={onChange} />;
    case 2: return <StyleVisualStep formData={formData} onChange={onChange} />;
    case 3: return <StructureLayoutStep formData={formData} onChange={onChange} />;
    case 4: return <ElementsStep formData={formData} onChange={onChange} />;
    case 5: return <BrandMessageStep formData={formData} onChange={onChange} />;
    case 6: return <BudgetStep formData={formData} onChange={onChange} />;
    case 7: return <ConstraintsStep formData={formData} onChange={onChange} />;
    default: return null;
  }
}

/* ─── Tooltip ─────────────────────────────────────────────────────────────── */
function Tooltip({ text }: { text: string }) {
  return (
    <span className="tooltip-wrapper ml-1.5">
      <span className="tooltip-icon">i</span>
      <span className="tooltip-popup">{text}</span>
    </span>
  );
}

/* ─── Step Header ─────────────────────────────────────────────────────────── */
function StepHeader({ title, subtitle, tooltip }: { title: string; subtitle: string; tooltip?: string }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-1 mb-1">
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)]">{title}</h2>
        {tooltip && <Tooltip text={tooltip} />}
      </div>
      <p className="text-[var(--color-text-secondary)] text-base">{subtitle}</p>
    </div>
  );
}

/* ─── Visual Card ─────────────────────────────────────────────────────────── */
function VisualCard({
  id, icon, label, description, isActive, recommended, onClick,
}: {
  id: string; icon: string; label: string; description?: string;
  isActive: boolean; recommended?: boolean; onClick: () => void;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      className={`group relative text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer w-full ${
        isActive ? "glass-card-active scale-[1.02]" : "glass-card hover:border-[var(--color-text-muted)] hover:scale-[1.01]"
      }`}
    >
      {recommended && !isActive && (
        <span className="badge-recommended absolute top-3 right-3">✦ Default</span>
      )}
      {isActive && (
        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--color-accent)] flex items-center justify-center fade-in">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-sm font-semibold text-[var(--color-text-primary)] mb-0.5">{label}</div>
      {description && <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{description}</p>}
    </button>
  );
}

/* ─── Step 1: Booth Type & Industry ──────────────────────────────────────── */
function BoothTypeIndustryStep({ formData, onChange }: { formData: FormData; onChange: (u: Partial<FormData>) => void }) {
  return (
    <div className="space-y-8">
      <StepHeader
        title="Booth Type & Industry"
        subtitle="Define the physical configuration and your sector."
        tooltip="The booth type determines how visitors approach and navigate your space. Industry context shapes the concept language."
      />
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-3">Booth Configuration</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {BOOTH_TYPES.map((bt) => (
            <VisualCard
              key={bt.id} id={`booth-type-${bt.id}`}
              icon={bt.icon} label={bt.label} description={bt.description}
              isActive={formData.boothType === bt.id}
              recommended={bt.recommended}
              onClick={() => onChange({ boothType: bt.id })}
            />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Industry</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {INDUSTRIES.map((ind) => (
            <VisualCard
              key={ind.id} id={`industry-${ind.id}`}
              icon={ind.icon} label={ind.label}
              isActive={formData.industry === ind.id}
              onClick={() => onChange({ industry: ind.id })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 2: Style & Visual Direction ───────────────────────────────────── */
function StyleVisualStep({ formData, onChange }: { formData: FormData; onChange: (u: Partial<FormData>) => void }) {
  return (
    <div className="space-y-8">
      <StepHeader
        title="Style & Visual Direction"
        subtitle="Set the aesthetic language that will define every detail."
        tooltip="These three choices — main style, sub-style, and lighting — combine to create a unique visual fingerprint for your booth."
      />
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-3">Main Style</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {STYLES.map((s) => (
            <button
              key={s.id} id={`style-${s.id}`}
              onClick={() => onChange({ style: s.id })}
              className={`group relative text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                formData.style === s.id ? "glass-card-active scale-[1.02]" : "glass-card hover:border-[var(--color-text-muted)] hover:scale-[1.01]"
              }`}
            >
              {formData.style === s.id && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[var(--color-accent)] flex items-center justify-center fade-in">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
              <div className={`w-10 h-10 rounded-lg mb-3 flex items-center justify-center bg-gradient-to-br ${s.gradient} ${formData.style === s.id ? "" : "opacity-70 group-hover:opacity-100"} transition-all duration-300`}>
                <span className="text-white text-lg">{s.icon}</span>
              </div>
              <div className="text-sm font-semibold text-[var(--color-text-primary)] mb-0.5">{s.label}</div>
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{s.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">
          Sub-Style <span className="text-[var(--color-text-muted)] normal-case font-normal tracking-normal">(optional refinement)</span>
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
          {SUB_STYLES.map((ss) => (
            <VisualCard
              key={ss.id} id={`substyle-${ss.id}`}
              icon={ss.icon} label={ss.label} description={ss.description}
              isActive={formData.subStyle === ss.id}
              recommended={(ss as { recommended?: boolean }).recommended}
              onClick={() => onChange({ subStyle: formData.subStyle === ss.id ? "" : ss.id })}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Lighting Atmosphere</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {LIGHTING_OPTIONS.map((l) => (
            <VisualCard
              key={l.id} id={`lighting-${l.id}`}
              icon={l.icon} label={l.label} description={l.description}
              isActive={formData.lighting === l.id}
              recommended={l.recommended}
              onClick={() => onChange({ lighting: l.id })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 3: Structure & Layout ─────────────────────────────────────────── */
function StructureLayoutStep({ formData, onChange }: { formData: FormData; onChange: (u: Partial<FormData>) => void }) {
  return (
    <div className="space-y-8">
      <StepHeader
        title="Structure & Layout"
        subtitle="Define the physical footprint and internal flow pattern."
        tooltip="Dimensions and open sides directly impact the construction cost estimate on the right."
      />

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-3">Booth Dimensions</h3>
        <div className="grid grid-cols-2 gap-4">
          {(["width", "depth"] as const).map((dim) => (
            <div key={dim} className="space-y-2">
              <label htmlFor={dim} className="block text-sm font-medium text-[var(--color-text-secondary)] capitalize">
                {dim} (meters)
              </label>
              <input
                id={dim} type="number" min="1" max="50"
                value={formData[dim]}
                onChange={(e) => onChange({ [dim]: e.target.value })}
                placeholder={dim === "width" ? "e.g. 6" : "e.g. 4"}
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-active)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-glow)] transition-all duration-200"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">
          Open Sides
          <Tooltip text="How many sides of your booth face the exhibition aisle. Island = 4, Peninsula = 3, Corner = 2, Inline = 1." />
        </h3>
        <div className="grid grid-cols-4 gap-3 mt-3">
          {["1", "2", "3", "4"].map((num) => (
            <button
              key={num} id={`open-sides-${num}`}
              onClick={() => onChange({ openSides: num })}
              className={`py-4 rounded-xl text-center font-bold text-xl transition-all duration-300 cursor-pointer border ${
                formData.openSides === num ? "glass-card-active text-[var(--color-text-primary)]" : "glass-card text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-2">Number of sides open to visitor traffic</p>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Layout Type</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {LAYOUT_TYPES.map((lt) => (
            <VisualCard
              key={lt.id} id={`layout-${lt.id}`}
              icon={lt.icon} label={lt.label} description={lt.description}
              isActive={formData.layoutType === lt.id}
              recommended={lt.recommended}
              onClick={() => onChange({ layoutType: lt.id })}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 4: Elements ───────────────────────────────────────────────────── */
function ElementsStep({ formData, onChange }: { formData: FormData; onChange: (u: Partial<FormData>) => void }) {
  const toggle = (list: string[], id: string, field: "mustHave" | "engagement" | "premiumAddOns") => {
    onChange({ [field]: list.includes(id) ? list.filter((i) => i !== id) : [...list, id] });
  };

  return (
    <div className="space-y-8">
      <StepHeader
        title="Elements"
        subtitle="Select what your booth needs to function and impress."
        tooltip="Elements are grouped by priority. Must-haves are functional essentials. Engagement drives interaction. Premium add-ons create show-stopping moments."
      />

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-3">Must-Have</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {MUST_HAVE_ELEMENTS.map((el) => (
            <VisualCard
              key={el.id} id={`must-${el.id}`}
              icon={el.icon} label={el.label}
              isActive={formData.mustHave.includes(el.id)}
              onClick={() => toggle(formData.mustHave, el.id, "mustHave")}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">
          Engagement
          <Tooltip text="Elements that increase visitor interaction and dwell time." />
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {ENGAGEMENT_ELEMENTS.map((el) => (
            <VisualCard
              key={el.id} id={`engage-${el.id}`}
              icon={el.icon} label={el.label}
              isActive={formData.engagement.includes(el.id)}
              onClick={() => toggle(formData.engagement, el.id, "engagement")}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">
          Premium Add-Ons
          <Tooltip text="High-impact features that elevate the experience. Each adds significantly to the budget estimate." />
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {PREMIUM_ADDONS.map((el) => (
            <VisualCard
              key={el.id} id={`premium-${el.id}`}
              icon={el.icon} label={el.label}
              isActive={formData.premiumAddOns.includes(el.id)}
              onClick={() => toggle(formData.premiumAddOns, el.id, "premiumAddOns")}
            />
          ))}
        </div>
      </div>

      <p className="text-xs text-[var(--color-text-muted)] italic">All sections are optional — skip if not applicable.</p>
    </div>
  );
}

/* ─── Step 5: Brand & Message ────────────────────────────────────────────── */
function BrandMessageStep({ formData, onChange }: { formData: FormData; onChange: (u: Partial<FormData>) => void }) {
  const pairs = [
    { key: "tone" as const, label: "Tone", options: PERSONALITY_OPTIONS.tone },
    { key: "aesthetic" as const, label: "Aesthetic", options: PERSONALITY_OPTIONS.aesthetic },
    { key: "feel" as const, label: "Feel", options: PERSONALITY_OPTIONS.feel },
  ];

  return (
    <div className="space-y-7">
      <StepHeader
        title="Brand & Message"
        subtitle="Tell us who you are and what you want visitors to feel."
        tooltip="Brand name and tagline are used directly in the AI image prompt to personalise your concept."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="brand-name" className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Brand Name <span className="text-[var(--color-text-muted)] font-normal">(optional)</span>
          </label>
          <input
            id="brand-name" type="text"
            value={formData.brandName}
            onChange={(e) => onChange({ brandName: e.target.value })}
            placeholder="e.g. Acme Corp"
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-active)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-glow)] transition-all duration-200"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="tagline" className="block text-sm font-medium text-[var(--color-text-secondary)]">
            Tagline / Key Message <span className="text-[var(--color-text-muted)] font-normal">(optional)</span>
          </label>
          <input
            id="tagline" type="text"
            value={formData.tagline}
            onChange={(e) => onChange({ tagline: e.target.value })}
            placeholder="e.g. Built for the future"
            className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-border-active)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-glow)] transition-all duration-200"
          />
        </div>
      </div>

      <div className="space-y-5">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">Brand Personality</h3>
        {pairs.map((pair) => (
          <div key={pair.key} className="space-y-2">
            <label className="block text-sm font-medium text-[var(--color-text-secondary)]">{pair.label}</label>
            <div className="grid grid-cols-2 gap-3">
              {pair.options.map((opt) => {
                const isActive = formData.personality[pair.key] === opt.id;
                return (
                  <button
                    key={opt.id} id={`personality-${pair.key}-${opt.id}`}
                    onClick={() => onChange({ personality: { ...formData.personality, [pair.key]: opt.id } })}
                    className={`py-3 px-4 rounded-xl border text-sm font-medium text-center transition-all duration-300 cursor-pointer ${
                      isActive ? "glass-card-active text-[var(--color-text-primary)]" : "glass-card text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Step 6: Budget ─────────────────────────────────────────────────────── */
function BudgetStep({ formData, onChange }: { formData: FormData; onChange: (u: Partial<FormData>) => void }) {
  return (
    <div className="space-y-6">
      <StepHeader
        title="Budget"
        subtitle="Choose the investment tier that aligns with your goals."
        tooltip="Budget directly affects the complexity, materials, and fabrication quality of the design concept."
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {BUDGET_OPTIONS.map((opt) => {
          const isActive = formData.budget === opt.id;
          return (
            <button
              key={opt.id} id={`budget-${opt.id}`}
              onClick={() => onChange({ budget: opt.id })}
              className={`group relative p-6 rounded-xl border text-center transition-all duration-300 cursor-pointer ${
                isActive ? "glass-card-active scale-[1.02]" : "glass-card hover:border-[var(--color-text-muted)] hover:scale-[1.01]"
              }`}
            >
              <div className={`text-2xl font-bold mb-1 transition-colors duration-300 ${isActive ? "gradient-text" : "text-[var(--color-text-muted)]"}`}>
                {opt.icon}
              </div>
              <h3 className={`text-lg font-semibold mb-1 ${isActive ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"}`}>
                {opt.label}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)] mb-3">{opt.description}</p>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isActive ? "bg-[var(--color-accent-glow)] text-[var(--color-accent)]" : "bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]"}`}>
                {opt.range}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 7: Constraints ────────────────────────────────────────────────── */
function ConstraintsStep({ formData, onChange }: { formData: FormData; onChange: (u: Partial<FormData>) => void }) {
  const toggle = (id: string) => {
    onChange({
      restrictions: formData.restrictions.includes(id)
        ? formData.restrictions.filter((r) => r !== id)
        : [...formData.restrictions, id],
    });
  };

  return (
    <div className="space-y-7">
      <StepHeader
        title="Constraints"
        subtitle="Tell us what to avoid. We'll respect every boundary."
        tooltip="These constraints are passed directly into the design concept and AI prompt to steer the output away from anything you don't want."
      />
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">Avoid These</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {RESTRICTIONS.map((r) => (
            <VisualCard
              key={r.id} id={`restriction-${r.id}`}
              icon={r.icon} label={r.label}
              isActive={formData.restrictions.includes(r.id)}
              onClick={() => toggle(r.id)}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="additional-notes" className="block text-sm font-medium text-[var(--color-text-secondary)]">
          Additional Notes <span className="text-[var(--color-text-muted)] font-normal">(optional)</span>
        </label>
        <textarea
          id="additional-notes"
          value={formData.additionalNotes}
          onChange={(e) => onChange({ additionalNotes: e.target.value })}
          placeholder="Any specific requirements, venue constraints, or client notes..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-sm leading-relaxed focus:border-[var(--color-border-active)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-glow)] transition-all duration-200 resize-none"
        />
      </div>

      <p className="text-xs text-[var(--color-text-muted)] italic">Both sections are optional — skip if nothing applies.</p>
    </div>
  );
}
