"use client";

import React, { useState, useRef } from "react";
import { analyzeClientBrief, BriefAnalysis } from "@/lib/briefAnalyzer";
import { FormData } from "@/lib/types";

interface BriefAnalyzerProps {
  onApply: (data: Partial<FormData>) => void;
}

const EXAMPLE_BRIEF = `We are a premium technology company launching a new AI product at the Dubai AI Summit. We need a 6x4 meter booth, open on two sides. The design should be futuristic and high-tech with LED screens and an interactive display. We need a reception area and a private meeting room for VIP clients. Budget is high-end — no compromises. Avoid anything that looks too dark or crowded.`;

export default function BriefAnalyzer({ onApply }: BriefAnalyzerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [brief, setBrief] = useState("");
  const [analysis, setAnalysis] = useState<BriefAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [applied, setApplied] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!brief.trim()) return;
    setIsAnalyzing(true);
    setAnalysis(null);
    setApplied(false);
    // Tiny delay for perceived processing
    await new Promise((r) => setTimeout(r, 800));
    const result = analyzeClientBrief(brief);
    setAnalysis(result);
    setIsAnalyzing(false);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  const handleApply = () => {
    if (!analysis) return;
    onApply(analysis.suggestedFormData);
    setApplied(true);
    setTimeout(() => {
      document.getElementById("wizard-section")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  const handleExample = () => {
    setBrief(EXAMPLE_BRIEF);
    setAnalysis(null);
    setApplied(false);
  };

  return (
    <section className="border-b border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]">
      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* Collapsed toggle bar */}
        <button
          id="brief-analyzer-toggle"
          onClick={() => setIsOpen((o) => !o)}
          className="w-full flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-warning)] to-[#f97316] flex items-center justify-center flex-shrink-0 shadow shadow-[rgba(245,158,11,0.3)]">
              <span className="text-sm">🧠</span>
            </div>
            <div className="text-left">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                Client Brief Analyzer
              </span>
              <span className="ml-2 text-xs text-[var(--color-text-muted)]">
                Paste a brief → auto-fill the wizard
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {analysis && (
              <span className="text-xs text-[var(--color-success)] font-medium px-2 py-0.5 rounded-full bg-[var(--color-success-glow)] border border-[var(--color-success)]/20">
                Analyzed
              </span>
            )}
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              className={`text-[var(--color-text-muted)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            >
              <path
                d="M4 6.5L9 11.5L14 6.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>

        {/* Expanded content */}
        {isOpen && (
          <div className="mt-4 space-y-5 fade-in">
            {/* Textarea */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="client-brief"
                  className="text-sm font-medium text-[var(--color-text-secondary)]"
                >
                  Paste Client Brief
                </label>
                <button
                  onClick={handleExample}
                  className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
                >
                  Load example brief →
                </button>
              </div>
              <textarea
                id="client-brief"
                value={brief}
                onChange={(e) => {
                  setBrief(e.target.value);
                  setAnalysis(null);
                  setApplied(false);
                }}
                placeholder="Paste the client's brief here — any format works. The analyzer will extract booth size, style, required elements, budget, and more..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] text-sm leading-relaxed focus:border-[var(--color-border-active)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-glow)] transition-all duration-200 resize-none"
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--color-text-muted)]">
                  {brief.length} characters
                </span>
                <button
                  id="analyze-brief-btn"
                  onClick={handleAnalyze}
                  disabled={!brief.trim() || isAnalyzing}
                  className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      Analyze Brief
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            {analysis && (
              <div ref={resultsRef} className="space-y-4 pb-2 slide-up">
                {/* Confidence banner */}
                <ConfidenceBanner confidence={analysis.confidence} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Extracted Data */}
                  <ResultCard
                    icon="📋"
                    title="Extracted Data"
                    accent="indigo"
                  >
                    <ExtractedDataList extracted={analysis.extracted} />
                  </ResultCard>

                  {/* Client Intent */}
                  <ResultCard icon="💡" title="Client Intent" accent="amber">
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {analysis.clientIntent}
                    </p>
                    {analysis.missingInfo.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[var(--color-border-default)]">
                        <p className="text-xs font-semibold text-[var(--color-warning)] uppercase tracking-wider mb-2">
                          Missing Info
                        </p>
                        <ul className="space-y-1">
                          {analysis.missingInfo.map((item) => (
                            <li
                              key={item}
                              className="text-xs text-[var(--color-text-muted)] flex items-start gap-2"
                            >
                              <span className="text-[var(--color-warning)] mt-0.5 flex-shrink-0">⚠</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </ResultCard>

                  {/* Design Direction */}
                  <ResultCard
                    icon="🧭"
                    title="Suggested Design Direction"
                    accent="purple"
                    className="md:col-span-2"
                  >
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {analysis.designDirection}
                    </p>
                  </ResultCard>
                </div>

                {/* Use This Data CTA */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[rgba(99,102,241,0.1)] to-[rgba(168,85,247,0.07)] border border-[var(--color-border-active)]/40">
                  <div>
                    <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                      Ready to use this data?
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      Pre-fills the wizard with everything we extracted from the brief.
                    </p>
                  </div>
                  <button
                    id="use-brief-data-btn"
                    onClick={handleApply}
                    disabled={applied}
                    className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer border ${
                      applied
                        ? "bg-[var(--color-success-glow)] border-[var(--color-success)]/30 text-[var(--color-success)]"
                        : "btn-primary"
                    }`}
                  >
                    {applied ? (
                      <>✓ Applied to Wizard</>
                    ) : (
                      <>
                        Use This Data
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path
                            d="M2 7H12M7 2L12 7L7 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────────────────── */

function ConfidenceBanner({ confidence }: { confidence: number }) {
  const level =
    confidence >= 70 ? "high" : confidence >= 40 ? "medium" : "low";
  const config = {
    low: {
      label: "Low confidence",
      hint: "Only a few signals were found. Provide more details for a better analysis.",
      barColor: "bg-[var(--color-warning)]",
      textColor: "text-[var(--color-warning)]",
    },
    medium: {
      label: "Moderate confidence",
      hint: "Key details were found. Fill in the wizard to complete any gaps.",
      barColor: "bg-[var(--color-accent)]",
      textColor: "text-[var(--color-accent)]",
    },
    high: {
      label: "High confidence",
      hint: "Most details were extracted successfully. Review and apply.",
      barColor: "bg-[var(--color-success)]",
      textColor: "text-[var(--color-success)]",
    },
  };
  const cfg = config[level];

  return (
    <div className="glass-card p-4">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <span className={`text-xs font-bold uppercase tracking-wider ${cfg.textColor}`}>
            {cfg.label}
          </span>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{cfg.hint}</p>
        </div>
        <span className={`text-lg font-bold ${cfg.textColor}`}>{confidence}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--color-bg-elevated)] overflow-hidden">
        <div
          className={`h-full rounded-full ${cfg.barColor} transition-all duration-700 ease-out`}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
}

function ResultCard({
  icon,
  title,
  children,
  accent = "indigo",
  className = "",
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
  accent?: "indigo" | "amber" | "purple";
  className?: string;
}) {
  const accentColors = {
    indigo: "text-[var(--color-accent)]",
    amber: "text-[var(--color-warning)]",
    purple: "text-[#a855f7]",
  };
  return (
    <div className={`glass-card p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{icon}</span>
        <h3 className={`text-sm font-semibold ${accentColors[accent]}`}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function ExtractedDataList({
  extracted,
}: {
  extracted: BriefAnalysis["extracted"];
}) {
  const STYLE_LABEL: Record<string, string> = {
    "modern-minimal": "Modern Minimal",
    luxury: "Luxury",
    tech: "Tech",
    "warm-natural": "Warm Natural",
    futuristic: "Futuristic",
  };
  const BUDGET_LABEL: Record<string, string> = {
    low: "Low",
    medium: "Medium",
    high: "High",
  };

  const rows = [
    {
      label: "Booth Size",
      value: extracted.boothSize
        ? `${extracted.boothSize.width}m × ${extracted.boothSize.depth}m`
        : null,
      icon: "📐",
    },
    {
      label: "Industry",
      value: extracted.industry,
      icon: "🏢",
    },
    {
      label: "Style",
      value: extracted.style ? STYLE_LABEL[extracted.style] : null,
      icon: "🎨",
    },
    {
      label: "Budget",
      value: extracted.budget ? BUDGET_LABEL[extracted.budget] : null,
      icon: "💰",
    },
    {
      label: "Open Sides",
      value: extracted.openSides ? `${extracted.openSides} side(s)` : null,
      icon: "🚪",
    },
    {
      label: "Elements",
      value:
        extracted.elements.length > 0
          ? extracted.elements
              .map((e) =>
                e
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase())
              )
              .join(", ")
          : null,
      icon: "🧩",
    },
    {
      label: "Style Keywords",
      value:
        extracted.styleKeywords.length > 0
          ? extracted.styleKeywords.join(", ")
          : null,
      icon: "🏷️",
    },
  ];

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.label} className="flex items-start gap-2.5">
          <span className="text-sm flex-shrink-0 mt-0.5">{row.icon}</span>
          <div className="flex-1 min-w-0">
            <span className="text-xs text-[var(--color-text-muted)]">
              {row.label}:{" "}
            </span>
            {row.value ? (
              <span className="text-xs font-medium text-[var(--color-text-primary)]">
                {row.value}
              </span>
            ) : (
              <span className="text-xs text-[var(--color-text-muted)] italic">
                Not found
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
