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

  const formatDirectionAsBullets = (text: string) => {
    // Basic heuristic to turn paragraphs into bullet points
    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.trim().length > 0);
    return (
      <ul className="space-y-4">
        {sentences.map((sentence, idx) => (
          <li key={idx} className="flex items-start gap-4">
            <span className="w-1.5 h-1.5 mt-2 rounded bg-[var(--color-accent)] flex-shrink-0" />
            <span className="text-base text-[var(--color-text-secondary)] leading-relaxed">
              {sentence}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="slide-up">
      {/* Top action bar */}
      <div className="flex items-center justify-between mb-16 border-b border-[var(--color-border-default)] pb-6">
        <div className="inline-flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-[var(--color-accent)] flex items-center justify-center">
             <span className="text-white font-heading tracking-architectural text-sm">RG</span>
          </div>
          <span className="text-sm font-medium tracking-architectural uppercase text-[var(--color-text-secondary)]">
            Approved Concept
          </span>
        </div>
        <button id="start-over" onClick={onReset} className="uppercase tracking-architectural text-xs font-semibold text-[var(--color-text-muted)] hover:text-white transition-colors cursor-pointer">
          Start Over
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-24">
        {/* Concept Title & Hero Block */}
        <div className="space-y-12">
          <div className="space-y-6">
             <p className="text-xs uppercase tracking-architectural text-[var(--color-accent)] font-semibold">
                Project Code: {Math.random().toString(36).substring(2, 6).toUpperCase()}-{Math.floor(Math.random() * 1000)}
             </p>
             <h1 className="text-6xl sm:text-7xl lg:text-8xl font-heading text-white leading-[0.85] tracking-tight">
               {result.conceptName.toUpperCase()}
             </h1>
          </div>

          {/* Large Architectural Wireframe Hero Placeholder */}
          <div className="w-full aspect-video bg-[var(--color-bg-card)] border border-[var(--color-border-default)] relative overflow-hidden flex items-center justify-center group">
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10"
                 style={{ backgroundImage: "linear-gradient(#52555a 1px, transparent 1px), linear-gradient(90deg, #52555a 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            <div className="relative text-center space-y-4">
              <span className="text-[var(--color-text-muted)] font-heading text-4xl block opacity-50">CONCEPT RENDER PENDING</span>
              <p className="text-[var(--color-text-muted)] text-sm tracking-architectural uppercase">Use AI Prompt to generate 3D visualization</p>
            </div>
            {/* Architectural accent lines */}
            <div className="absolute top-0 left-10 w-px h-full bg-[var(--color-border-default)] opacity-30" />
            <div className="absolute top-10 left-0 w-full h-px bg-[var(--color-border-default)] opacity-30" />
          </div>
        </div>

        {/* Narrative & Direction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
           {/* Left Col: Story */}
           <div className="space-y-6">
              <h3 className="text-xl font-heading tracking-architectural uppercase text-white pb-4 border-b border-[var(--color-border-default)]">
                 The Story
              </h3>
              <p className="text-lg text-[var(--color-text-primary)] leading-relaxed font-light">
                 {result.conceptStory}
              </p>
              <CopyButton 
                 field="conceptStory" 
                 content={result.conceptStory} 
                 copied={copiedField === "conceptStory"}
                 onCopy={copyToClipboard} 
              />
           </div>

           {/* Right Col: Direction */}
           <div className="space-y-6">
              <h3 className="text-xl font-heading tracking-architectural uppercase text-white pb-4 border-b border-[var(--color-border-default)]">
                 Design Direction
              </h3>
              <div>
                 {formatDirectionAsBullets(result.designDirection)}
              </div>
              <div className="pt-2">
                <CopyButton 
                  field="designDirection" 
                  content={result.designDirection} 
                  copied={copiedField === "designDirection"}
                  onCopy={copyToClipboard} 
                />
              </div>
           </div>
        </div>

        {/* AI Prompt Block (Code styling) */}
        <div className="space-y-6 pt-12 border-t border-[var(--color-border-default)]">
           <div className="flex items-center justify-between">
              <h3 className="text-xl font-heading tracking-architectural uppercase text-white">
                Visualization Prompt
              </h3>
              <CopyButton 
                  field="aiPrompt" 
                  content={result.aiPrompt} 
                  copied={copiedField === "aiPrompt"}
                  onCopy={copyToClipboard} 
                  label="Copy Prompt"
              />
           </div>
           
           <div className="relative group">
              <div className="absolute inset-0 bg-[var(--color-accent)] opacity-5 rounded-lg" />
              <pre className="relative p-8 rounded-sm bg-[#050505] border border-[var(--color-border-default)] overflow-x-auto text-[var(--color-text-primary)] font-mono text-sm leading-relaxed decoration-clone">
                <code>
                  {result.aiPrompt}
                </code>
              </pre>
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-accent)]" />
           </div>
        </div>

        {/* Master Output Control */}
        <div className="pt-24 pb-12 flex justify-center">
            <button
            id="copy-all"
            onClick={() => {
              const allText = `# ${result.conceptName}\n\n## Story\n${result.conceptStory}\n\n## Direction\n${result.designDirection}\n\n## Prompt\n${result.aiPrompt}`;
              copyToClipboard(allText, "all");
            }}
            className="btn-primary"
          >
            {copiedField === "all" ? "✓ DOCUMENT COPIED" : "COPY FULL CONCEPT"}
          </button>
        </div>

      </div>
    </div>
  );
}

function CopyButton({ field, content, copied, onCopy, label = "Copy text" }: any) {
  return (
    <button
      onClick={() => onCopy(content, field)}
      className={`
        inline-flex items-center gap-2 text-xs uppercase tracking-architectural font-medium transition-colors cursor-pointer
        ${
          copied
            ? "text-[var(--color-accent)]"
            : "text-[var(--color-text-muted)] hover:text-white"
        }
      `}
    >
      {copied ? (
        <>
          <span className="text-base font-sans">✓</span> COPIED
        </>
      ) : (
        <>
          <span className="text-base font-sans">⎘</span> {label}
        </>
      )}
    </button>
  );
}
