"use client";

import React from "react";
import {
  FormData,
  BUDGET_OPTIONS,
  MUST_HAVE_ELEMENTS,
  NICE_TO_HAVE_ELEMENTS,
  PERSONALITY_OPTIONS,
  RESTRICTIONS,
} from "@/lib/types";

interface FormStepProps {
  step: number;
  formData: FormData;
  onChange: (updates: Partial<FormData>) => void;
}

export default function FormStep({ step, formData, onChange }: FormStepProps) {
  switch (step) {
    case 2:
      return <BoothBasics formData={formData} onChange={onChange} />;
    case 3:
      return <BudgetStep formData={formData} onChange={onChange} />;
    case 4:
      return <ElementsStep formData={formData} onChange={onChange} />;
    case 5:
      return <PersonalityStep formData={formData} onChange={onChange} />;
    case 6:
      return <RestrictionsStep formData={formData} onChange={onChange} />;
    default:
      return null;
  }
}

/* ─── Step 2: Booth Basics ─── */
function BoothBasics({
  formData,
  onChange,
}: {
  formData: FormData;
  onChange: (u: Partial<FormData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl md:text-4xl font-heading uppercase text-[var(--color-text-primary)] mb-2">
          Booth Basics
        </h2>
        <p className="text-[var(--color-text-secondary)] text-sm tracking-architectural uppercase">
          Tell us about your booth dimensions and configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label
            htmlFor="width"
            className="block text-xs font-semibold uppercase tracking-architectural text-[var(--color-text-secondary)]"
          >
            Width (meters)
          </label>
          <input
            id="width"
            type="number"
            min="1"
            max="50"
            value={formData.width}
            onChange={(e) => onChange({ width: e.target.value })}
            placeholder="e.g. 6"
            className="w-full px-4 py-3 rounded-sm bg-transparent border border-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none transition-all duration-200"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="depth"
            className="block text-xs font-semibold uppercase tracking-architectural text-[var(--color-text-secondary)]"
          >
            Depth (meters)
          </label>
          <input
            id="depth"
            type="number"
            min="1"
            max="50"
            value={formData.depth}
            onChange={(e) => onChange({ depth: e.target.value })}
            placeholder="e.g. 4"
            className="w-full px-4 py-3 rounded-sm bg-transparent border border-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)] focus:outline-none transition-all duration-200"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <label className="block text-xs font-semibold uppercase tracking-architectural text-[var(--color-text-secondary)]">
          Open Sides
        </label>
        <div className="grid grid-cols-4 gap-3">
          {["1", "2", "3", "4"].map((num) => (
            <button
              key={num}
              id={`open-sides-${num}`}
              onClick={() => onChange({ openSides: num })}
              className={`
                py-4 rounded-sm text-center font-heading text-2xl transition-all duration-300 cursor-pointer border
                ${
                  formData.openSides === num
                    ? "glass-card-active text-[var(--color-text-primary)]"
                    : "glass-card text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-muted)]"
                }
              `}
            >
              {num}
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          Number of sides open to visitor traffic
        </p>
      </div>
    </div>
  );
}

/* ─── Step 3: Budget ─── */
function BudgetStep({
  formData,
  onChange,
}: {
  formData: FormData;
  onChange: (u: Partial<FormData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl md:text-4xl font-heading uppercase text-[var(--color-text-primary)] mb-2">
          Budget Range
        </h2>
        <p className="text-[var(--color-text-secondary)] text-sm tracking-architectural uppercase">
          This helps us tailor the complexity and materials of your concept.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {BUDGET_OPTIONS.map((opt) => {
          const isActive = formData.budget === opt.id;
          return (
            <button
              key={opt.id}
              id={`budget-${opt.id}`}
              onClick={() => onChange({ budget: opt.id })}
              className={`
                group relative p-8 rounded-sm border text-left transition-all duration-300 cursor-pointer
                ${
                  isActive
                    ? "glass-card-active"
                    : "glass-card hover:border-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)]"
                }
              `}
            >
              <div
                className={`text-sm tracking-architectural uppercase mb-4 transition-colors duration-300 block font-semibold ${
                  isActive
                    ? "gradient-text"
                    : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]"
                }`}
              >
              </div>
              <h3
                className={`text-2xl font-heading mb-2 ${
                  isActive
                    ? "text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)]"
                }`}
              >
                {opt.label}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)]">
                {opt.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step 4: Elements ─── */
function ElementsStep({
  formData,
  onChange,
}: {
  formData: FormData;
  onChange: (u: Partial<FormData>) => void;
}) {
  const toggleItem = (
    list: string[],
    id: string,
    field: "mustHave" | "niceToHave"
  ) => {
    const updated = list.includes(id)
      ? list.filter((i) => i !== id)
      : [...list, id];
    onChange({ [field]: updated });
  };

  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-heading uppercase text-[var(--color-text-primary)] mb-2">
          Required Elements
        </h2>
        <p className="text-[var(--color-text-secondary)] text-sm tracking-architectural uppercase">
          Select everything you need in your booth.
        </p>
      </div>

      {/* Must Have */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-accent)]">
          Must Have
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MUST_HAVE_ELEMENTS.map((el) => {
            const isActive = formData.mustHave.includes(el.id);
            return (
              <button
                key={el.id}
                id={`must-have-${el.id}`}
                onClick={() =>
                  toggleItem(formData.mustHave, el.id, "mustHave")
                }
                className={`
                  p-4 rounded-xl border text-center transition-all duration-300 cursor-pointer
                  ${
                    isActive
                      ? "glass-card-active"
                      : "glass-card hover:border-[var(--color-text-muted)]"
                  }
                `}
              >
                <span className="text-2xl block mb-2">{el.icon}</span>
                <span
                  className={`text-sm tracking-architectural uppercase font-semibold ${
                    isActive
                      ? "text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-secondary)]"
                  }`}
                >
                  {el.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nice to Have */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          Nice to Have
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {NICE_TO_HAVE_ELEMENTS.map((el) => {
            const isActive = formData.niceToHave.includes(el.id);
            return (
              <button
                key={el.id}
                id={`nice-to-have-${el.id}`}
                onClick={() =>
                  toggleItem(formData.niceToHave, el.id, "niceToHave")
                }
                className={`
                  p-4 rounded-xl border text-center transition-all duration-300 cursor-pointer
                  ${
                    isActive
                      ? "glass-card-active"
                      : "glass-card hover:border-[var(--color-text-muted)]"
                  }
                `}
              >
                <span className="text-2xl block mb-2">{el.icon}</span>
                <span
                  className={`text-sm tracking-architectural uppercase font-semibold ${
                    isActive
                      ? "text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-secondary)]"
                  }`}
                >
                  {el.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 5: Brand Personality ─── */
function PersonalityStep({
  formData,
  onChange,
}: {
  formData: FormData;
  onChange: (u: Partial<FormData>) => void;
}) {
  const pairs = [
    {
      key: "tone" as const,
      label: "Tone",
      options: PERSONALITY_OPTIONS.tone,
    },
    {
      key: "aesthetic" as const,
      label: "Aesthetic",
      options: PERSONALITY_OPTIONS.aesthetic,
    },
    {
      key: "feel" as const,
      label: "Feel",
      options: PERSONALITY_OPTIONS.feel,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-heading uppercase text-[var(--color-text-primary)] mb-2">
          Brand Personality
        </h2>
        <p className="text-[var(--color-text-secondary)] text-sm tracking-architectural uppercase">
          Define the character and mood of your booth.
        </p>
      </div>

      <div className="space-y-5">
        {pairs.map((pair) => (
          <div key={pair.key} className="space-y-2">
            <label className="block text-xs font-semibold tracking-architectural text-[var(--color-text-muted)] uppercase mb-3 border-b border-[var(--color-border-default)] pb-2">
              {pair.label}
            </label>
            <div className="grid grid-cols-2 gap-3">
              {pair.options.map((opt) => {
                const isActive =
                  formData.personality[pair.key] === opt.id;
                return (
                  <button
                    key={opt.id}
                    id={`personality-${pair.key}-${opt.id}`}
                    onClick={() =>
                      onChange({
                        personality: {
                          ...formData.personality,
                          [pair.key]: opt.id,
                        },
                      })
                    }
                    className={`
                      py-4 px-6 rounded-sm border text-center font-heading text-xl transition-all duration-300 cursor-pointer tracking-wider
                      ${
                        isActive
                          ? "glass-card-active text-[var(--color-text-primary)]"
                          : "glass-card text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                      }
                    `}
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

/* ─── Step 6: Restrictions ─── */
function RestrictionsStep({
  formData,
  onChange,
}: {
  formData: FormData;
  onChange: (u: Partial<FormData>) => void;
}) {
  const toggle = (id: string) => {
    const updated = formData.restrictions.includes(id)
      ? formData.restrictions.filter((r) => r !== id)
      : [...formData.restrictions, id];
    onChange({ restrictions: updated });
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-heading uppercase text-[var(--color-text-primary)] mb-2">
          What Should We Avoid?
        </h2>
        <p className="text-[var(--color-text-secondary)] text-sm tracking-architectural uppercase">
          Select anything you don&apos;t want in the final design.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {RESTRICTIONS.map((r) => {
          const isActive = formData.restrictions.includes(r.id);
          return (
            <button
              key={r.id}
              id={`restriction-${r.id}`}
              onClick={() => toggle(r.id)}
              className={`
                p-6 rounded-sm border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[120px]
                ${
                  isActive
                    ? "glass-card-active"
                    : "glass-card hover:border-[var(--color-text-muted)] hover:bg-[var(--color-bg-elevated)]"
                }
              `}
            >
              <span className="text-3xl block mb-3">{r.icon}</span>
              <span
                className={`text-sm tracking-architectural uppercase font-semibold mt-auto ${
                  isActive
                    ? "text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)]"
                }`}
              >
                {r.label}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-sm text-[var(--color-text-muted)] italic">
        This is optional — skip if nothing applies.
      </p>
    </div>
  );
}
