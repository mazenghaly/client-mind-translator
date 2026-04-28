"use client";

import React, { useState, useRef, useCallback } from "react";
import { analyzeClientBrief, BriefAnalysis } from "@/lib/briefAnalyzer";
import {
  extractTextFromFile,
  detectFileType,
  FILE_TYPE_LABELS,
  ACCEPTED_EXTENSIONS,
  ACCEPTED_MIME_TYPES,
} from "@/lib/fileExtractor";
import { FormData } from "@/lib/types";

interface BriefAnalyzerProps {
  onApply: (data: Partial<FormData>) => void;
}

export default function BriefAnalyzer({ onApply }: BriefAnalyzerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const [analysis, setAnalysis] = useState<BriefAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const processFile = useCallback(async (uploadedFile: File) => {
    setFile(uploadedFile);
    setError(null);
    setAnalysis(null);
    setApplied(false);
    setIsProcessing(true);

    try {
      // Stage 1: Extract text
      setProcessingStage("Extracting text from file...");
      const text = await extractTextFromFile(uploadedFile);

      if (!text.trim()) {
        throw new Error(
          "No text could be extracted from this file. The file might be empty, image-based, or password-protected."
        );
      }

      setExtractedText(text);

      // Stage 2: Analyze content
      setProcessingStage("Analyzing client brief...");
      await new Promise((r) => setTimeout(r, 600));
      const result = analyzeClientBrief(text);

      setAnalysis(result);
      setProcessingStage("");
      setTimeout(
        () =>
          resultsRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        100
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while processing the file."
      );
    } finally {
      setIsProcessing(false);
      setProcessingStage("");
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) processFile(selected);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) processFile(dropped);
    },
    [processFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleApply = () => {
    if (!analysis) return;
    onApply(analysis.suggestedFormData);
    setApplied(true);
    setTimeout(() => {
      document
        .getElementById("wizard-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setExtractedText("");
    setAnalysis(null);
    setError(null);
    setApplied(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <section className="border-b border-[var(--color-border-default)] bg-[var(--color-bg-secondary)]">
      <div className="max-w-5xl mx-auto px-4 py-4">
        {/* Toggle bar */}
        <button
          id="brief-analyzer-toggle"
          onClick={() => setIsOpen((o) => !o)}
          className="w-full flex items-center justify-between group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-warning)] to-[#f97316] flex items-center justify-center flex-shrink-0 shadow shadow-[rgba(245,158,11,0.3)]">
              <span className="text-sm">📄</span>
            </div>
            <div className="text-left">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                Client Brief Analyzer
              </span>
              <span className="ml-2 text-xs text-[var(--color-text-muted)]">
                Upload a brief file → auto-fill the wizard
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
              className={`text-[var(--color-text-muted)] transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
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
            {/* File upload area */}
            {!file && !isProcessing && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  relative rounded-sm border-2 border-dashed transition-all duration-300 cursor-pointer
                  flex flex-col items-center justify-center py-12 px-6 text-center
                  ${
                    isDragging
                      ? "border-[var(--color-border-active)] bg-[rgba(99,102,241,0.08)] scale-[1.01]"
                      : "border-[var(--color-border-default)] bg-[var(--color-bg-card)] hover:border-[var(--color-text-muted)] hover:bg-[var(--color-bg-card-hover)]"
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={`${ACCEPTED_EXTENSIONS},${ACCEPTED_MIME_TYPES}`}
                  onChange={handleFileSelect}
                  className="hidden"
                  id="brief-file-input"
                />

                <div
                  className={`w-16 h-16 rounded-sm flex items-center justify-center mb-4 transition-all duration-300 ${
                    isDragging
                      ? "bg-[var(--color-accent-glow)] scale-110"
                      : "bg-[var(--color-bg-elevated)]"
                  }`}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    className={`transition-colors duration-300 ${
                      isDragging
                        ? "text-[var(--color-accent)]"
                        : "text-[var(--color-text-muted)]"
                    }`}
                  >
                    <path
                      d="M16 4L16 20M16 4L10 10M16 4L22 10"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 22V26C4 27.1 4.9 28 6 28H26C27.1 28 28 27.1 28 26V22"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p className="text-sm uppercase tracking-architectural font-medium text-[var(--color-text-primary)] mb-1">
                  {isDragging
                    ? "Drop your file here"
                    : "Drop your client brief here, or click to browse"}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Supports PDF, Word (.doc/.docx), Excel (.xlsx/.xls/.csv), and
                  Text files
                </p>
              </div>
            )}

            {/* Processing state */}
            {isProcessing && (
              <div className="rounded-sm border border-[var(--color-border-default)] bg-[var(--color-bg-card)] py-12 px-6 flex flex-col items-center justify-center text-center fade-in">
                <div className="relative w-14 h-14 mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-[var(--color-border-default)]" />
                  <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[var(--color-accent)] animate-spin" />
                  <div
                    className="absolute inset-3 rounded-full border-2 border-transparent border-t-[var(--color-gradient-end)] animate-spin"
                    style={{
                      animationDirection: "reverse",
                      animationDuration: "1.5s",
                    }}
                  />
                </div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {processingStage || "Processing..."}
                </p>
                {file && (
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    {file.name}
                  </p>
                )}
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="rounded-sm border border-red-500/30 bg-red-500/8 p-4 flex items-start gap-3 fade-in">
                <span className="text-lg flex-shrink-0 mt-0.5">⚠️</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-400">{error}</p>
                  <button
                    onClick={handleRemoveFile}
                    className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] mt-2 underline cursor-pointer"
                  >
                    Try another file
                  </button>
                </div>
              </div>
            )}

            {/* File info bar (shown when file is loaded) */}
            {file && !isProcessing && !error && (
              <div className="flex items-center gap-3 p-3 rounded-sm bg-[var(--color-bg-card)] border border-[var(--color-border-default)] fade-in">
                <FileIcon type={detectFileType(file)} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {FILE_TYPE_LABELS[detectFileType(file)]} ·{" "}
                    {formatFileSize(file.size)} ·{" "}
                    {extractedText.split(/\s+/).length} words extracted
                  </p>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-bg-elevated)] border border-[var(--color-border-default)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-muted)] transition-all cursor-pointer"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Extracted preview (collapsible) */}
            {extractedText && !isProcessing && (
              <ExtractedPreview text={extractedText} />
            )}

            {/* Analysis results */}
            {analysis && (
              <div ref={resultsRef} className="space-y-4 pb-2 slide-up">
                {/* Confidence banner */}
                <ConfidenceBanner confidence={analysis.confidence} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Extracted Data */}
                  <ResultCard icon="📋" title="Extracted Data" accent="indigo">
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
                              <span className="text-[var(--color-warning)] mt-0.5 flex-shrink-0">
                                ⚠
                              </span>
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
                <div className="flex items-center justify-between p-6 rounded-sm bg-[var(--color-bg-card)] border border-[var(--color-border-default)]">
                  <div>
                    <p className="text-sm font-semibold text-white uppercase tracking-architectural">
                      Ready to use this data?
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                      Pre-fills the wizard with everything extracted from the
                      brief.
                    </p>
                  </div>
                  <button
                    id="use-brief-data-btn"
                    onClick={handleApply}
                    disabled={applied}
                    className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-sm font-semibold text-sm transition-all duration-300 cursor-pointer border ${
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
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                        >
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

/* ─── Extracted text preview ─────────────────────────────────────────────────── */
function ExtractedPreview({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const preview = text.slice(0, 400);
  const isLong = text.length > 400;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">📝</span>
          <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
            Extracted Text Preview
          </span>
        </div>
        {isLong && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] cursor-pointer"
          >
            {expanded ? "Show less" : "Show all"}
          </button>
        )}
      </div>
      <p className="text-xs text-[var(--color-text-muted)] leading-relaxed whitespace-pre-wrap font-mono">
        {expanded ? text : preview}
        {isLong && !expanded && "..."}
      </p>
    </div>
  );
}

/* ─── File icon ──────────────────────────────────────────────────────────────── */
function FileIcon({ type }: { type: string }) {
  const config: Record<string, { bg: string; label: string }> = {
    pdf: { bg: "from-red-500 to-red-600", label: "PDF" },
    docx: { bg: "from-blue-500 to-blue-600", label: "DOC" },
    xlsx: { bg: "from-emerald-500 to-emerald-600", label: "XLS" },
    txt: { bg: "from-gray-400 to-gray-500", label: "TXT" },
    unknown: { bg: "from-gray-400 to-gray-500", label: "FILE" },
  };
  const c = config[type] || config.unknown;
  return (
    <div
      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.bg} flex items-center justify-center flex-shrink-0`}
    >
      <span className="text-[10px] font-bold text-white uppercase">
        {c.label}
      </span>
    </div>
  );
}

/* ─── Sub-components (same as before) ────────────────────────────────────────── */

function ConfidenceBanner({ confidence }: { confidence: number }) {
  const level =
    confidence >= 70 ? "high" : confidence >= 40 ? "medium" : "low";
  const config = {
    low: {
      label: "Low confidence",
      hint: "Only a few signals were found. The brief may need more detail.",
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
          <span
            className={`text-xs font-bold uppercase tracking-wider ${cfg.textColor}`}
          >
            {cfg.label}
          </span>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            {cfg.hint}
          </p>
        </div>
        <span className={`text-lg font-bold ${cfg.textColor}`}>
          {confidence}%
        </span>
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
        <h3 className={`text-base font-semibold uppercase tracking-architectural ${accentColors[accent]}`}>
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
    { label: "Industry", value: extracted.industry, icon: "🏢" },
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

/* ─── Helpers ────────────────────────────────────────────────────────────────── */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
