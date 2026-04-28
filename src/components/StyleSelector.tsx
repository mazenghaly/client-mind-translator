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
      <div>
        <h2 className="text-2xl font-semibold text-[var(--color-text-primary)] mb-2">
          Choose Your Style
        </h2>
        <p className="text-[var(--color-text-secondary)] text-base">
          Select the aesthetic direction that best represents your brand.
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
                group relative text-left p-6 rounded-xl border transition-all duration-300 cursor-pointer
                ${
                  isActive
                    ? "glass-card-active scale-[1.02]"
                    : "glass-card hover:border-[var(--color-text-muted)] hover:scale-[1.01]"
                }
              `}
            >
              {isActive && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[var(--color-accent)] flex items-center justify-center fade-in">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="text-white"
                  >
                    <path
                      d="M2.5 7L5.5 10L11.5 4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              <div
                className={`
                text-3xl mb-4 w-14 h-14 rounded-xl flex items-center justify-center
                bg-gradient-to-br ${style.gradient}
                ${isActive ? "shadow-lg" : "opacity-70 group-hover:opacity-100"}
                transition-all duration-300
              `}
              >
                <span className="text-white text-xl">{style.icon}</span>
              </div>

              <h3
                className={`text-lg font-semibold mb-1 transition-colors duration-300 ${
                  isActive
                    ? "text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]"
                }`}
              >
                {style.label}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                {style.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
