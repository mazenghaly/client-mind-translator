"use client";

import React from "react";
import { STYLES } from "@/lib/types";

interface StyleSelectorProps {
  selected: string;
  onSelect: (styleId: string) => void;
}

export default function StyleSelector({
  selected,
  onSelect,
}: StyleSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="mb-10 text-center">
        <h2 className="text-4xl md:text-5xl font-heading text-[var(--color-text-primary)] mb-3">
          CHOOSE YOUR STYLE
        </h2>
        <p className="text-[var(--color-text-secondary)] text-sm uppercase tracking-architectural">
          Select the aesthetic direction that best represents the brand.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STYLES.map((style) => {
          const isActive = selected === style.id;
          return (
            <button
              key={style.id}
              id={`style-${style.id}`}
              onClick={() => onSelect(style.id)}
              className={`
                group relative text-left p-8 rounded-sm transition-all duration-300 cursor-pointer border flex flex-col justify-end min-h-[220px]
                ${
                  isActive
                    ? "bg-[var(--color-bg-elevated)] border-transparent"
                    : "bg-transparent border-[var(--color-border-default)] hover:border-[var(--color-text-muted)]"
                }
              `}
            >
              {/* Active Accent Bar */}
              <div
                className={`absolute top-0 left-0 w-1 h-full bg-[var(--color-accent)] transition-transform origin-top duration-300 ${
                  isActive ? "scale-y-100" : "scale-y-0"
                }`}
              />

              {isActive && (
                <div className="absolute top-4 right-4 text-[var(--color-accent)] fade-in">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M4 10L8 14L16 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="square"
                      strokeLinejoin="miter"
                    />
                  </svg>
                </div>
              )}

              <div className="mt-auto">
                <span className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-architectural mb-2 block font-medium">
                  Concept 0{STYLES.indexOf(style) + 1}
                </span>
                <h3
                  className={`text-2xl font-heading mb-3 transition-colors duration-300 ${
                    isActive
                      ? "text-white"
                      : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {style.label}
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  {style.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
