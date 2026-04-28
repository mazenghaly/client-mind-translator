"use client";

import React, { useState } from "react";
import { ConceptResult } from "@/lib/types";

interface OutputScreenProps {
  result: ConceptResult;
  onReset: () => void;
}

export default function OutputScreen({ result, onReset }: OutputScreenProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const sections = [
    {
      key: "conceptName",
      title: "Concept Name",
      content: result.conceptName,
      icon: "✦",
    },
    {
      key: "conceptStory",
      title: "Concept Story",
      content: result.conceptStory,
      icon: "📖",
    },
    {
      key: "designDirection",
      title: "Design Direction",
      content: result.designDirection,
      icon: "🧭",
    },
    {
      key: "aiPrompt",
      title: "AI Prompt",
      content: result.aiPrompt,
      icon: "🤖",
    },
  ];

  return (
    <div className="slide-up space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-success-glow)] border border-[var(--color-success)]/30 mb-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="text-[var(--color-success)]"
          >
            <path
              d="M3 8L6.5 11.5L13 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-sm font-medium text-[var(--color-success)]">
            Concept Generated
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
          {result.conceptName}
        </h1>
        <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto">
          Your personalized booth concept is ready. Copy any section or the full
          AI prompt below.
        </p>
      </div>

      {/* Result Cards */}
      <div className="space-y-4">
        {sections.map((section, index) => (
          <div
            key={section.key}
            className="glass-card p-6 fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">{section.icon}</span>
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                  {section.title}
                </h3>
              </div>
              <button
                id={`copy-${section.key}`}
                onClick={() =>
                  copyToClipboard(section.content, section.key)
                }
                className={`
                  flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer border
                  ${
                    copiedField === section.key
                      ? "bg-[var(--color-success-glow)] border-[var(--color-success)]/30 text-[var(--color-success)]"
                      : "bg-[var(--color-bg-elevated)] border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-muted)]"
                  }
                `}
              >
                {copiedField === section.key ? (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M2.5 7L5.5 10L11.5 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <rect
                        x="4"
                        y="4"
                        width="8"
                        height="8"
                        rx="1.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M10 4V2.5A1.5 1.5 0 008.5 1H2.5A1.5 1.5 0 001 2.5v6A1.5 1.5 0 002.5 10H4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                    Copy
                  </>
                )}
              </button>
            </div>
            <div
              className={`text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line ${
                section.key === "conceptName"
                  ? "text-xl font-semibold text-[var(--color-text-primary)]"
                  : "text-sm"
              }`}
            >
              {section.content}
            </div>
          </div>
        ))}
      </div>

      {/* Copy All / Start Over */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
        <button
          id="copy-all"
          onClick={() => {
            const allText = sections
              .map((s) => `## ${s.title}\n${s.content}`)
              .join("\n\n---\n\n");
            copyToClipboard(allText, "all");
          }}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect
              x="5"
              y="5"
              width="9"
              height="9"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M11 5V3a2 2 0 00-2-2H3a2 2 0 00-2 2v6a2 2 0 002 2h2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
          {copiedField === "all" ? "Copied Everything!" : "Copy All Sections"}
        </button>
        <button id="start-over" onClick={onReset} className="btn-secondary">
          Start Over
        </button>
      </div>
    </div>
  );
}
