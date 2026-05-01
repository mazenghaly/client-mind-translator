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
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyBtn = ({ field, content }: { field: string; content: string }) => (
    <button
      id={`copy-${field}`}
      onClick={() => copyToClipboard(content, field)}
      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 cursor-pointer border ${
        copiedField === field
          ? "bg-[var(--color-success-glow)] border-[var(--color-success)]/30 text-[var(--color-success)]"
          : "bg-[var(--color-bg-elevated)] border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-muted)]"
      }`}
    >
      {copiedField === field ? "✓ Copied" : "Copy"}
    </button>
  );

  const SectionCard = ({
    keyName, title, icon, children, delay = 0,
  }: {
    keyName: string; title: string; icon: string; children: React.ReactNode; delay?: number;
  }) => (
    <div className="glass-card p-6 fade-in" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
        </div>
        <CopyBtn field={keyName} content={typeof children === "string" ? children : result[keyName as keyof ConceptResult]?.toString() ?? ""} />
      </div>
      {children}
    </div>
  );

  const allText = [
    `## Concept Name\n${result.conceptName}`,
    `## Concept Idea\n${result.conceptIdea}`,
    `## Design Direction\n${result.designDirection}`,
    `## Layout Logic\n${result.layoutLogic}`,
    `## Key Features\n${result.keyFeatures.map((f) => `• ${f}`).join("\n")}`,
    `## Estimated Budget\n${result.estimatedBudget}`,
    `## AI Prompt\n${result.aiPrompt}`,
  ].join("\n\n---\n\n");

  return (
    <div className="slide-up space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-success-glow)] border border-[var(--color-success)]/30 mb-2">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[var(--color-success)]">
            <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-medium text-[var(--color-success)]">Concept Generated</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold gradient-text">{result.conceptName}</h2>
        <p className="text-[var(--color-text-secondary)] max-w-lg mx-auto text-sm">
          Your personalised 3D booth design concept is ready.
        </p>
      </div>

      {/* Concept Idea */}
      <SectionCard keyName="conceptIdea" title="Concept Idea" icon="💡" delay={0}>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{result.conceptIdea}</p>
      </SectionCard>

      {/* Design Direction */}
      <SectionCard keyName="designDirection" title="Design Direction" icon="🧭" delay={80}>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{result.designDirection}</p>
      </SectionCard>

      {/* Layout Logic */}
      <SectionCard keyName="layoutLogic" title="Layout Logic" icon="📐" delay={160}>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{result.layoutLogic}</p>
      </SectionCard>

      {/* Key Features */}
      <SectionCard
        keyName="keyFeatures"
        title="Key Features"
        icon="✦"
        delay={240}
      >
        <ul className="space-y-2">
          {result.keyFeatures.map((f, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
              <span className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{f}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Estimated Budget */}
      <SectionCard keyName="estimatedBudget" title="Estimated Budget" icon="💰" delay={320}>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{result.estimatedBudget}</p>
      </SectionCard>

      {/* AI Prompt */}
      <SectionCard keyName="aiPrompt" title="AI Image Prompt" icon="🤖" delay={400}>
        <div className="bg-[var(--color-bg-elevated)] rounded-lg p-4 border border-[var(--color-border-default)]">
          <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed font-mono">{result.aiPrompt}</p>
        </div>
      </SectionCard>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
        <button
          id="copy-all"
          onClick={() => copyToClipboard(allText, "all")}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="4" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 4V2.5A1.5 1.5 0 008.5 1H2.5A1.5 1.5 0 001 2.5v6A1.5 1.5 0 002.5 10H4" stroke="currentColor" strokeWidth="1.5" />
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
