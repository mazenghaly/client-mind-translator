"use client";

import React, { useMemo } from "react";
import { FormData } from "@/lib/types";
import { estimatePrice, formatCurrency, PriceBreakdownItem } from "@/lib/priceEstimator";

interface PriceEstimatorProps {
  formData: FormData;
}

export default function PriceEstimator({ formData }: PriceEstimatorProps) {
  const estimate = useMemo(() => estimatePrice(formData), [formData]);

  if (!estimate.hasEnoughData) {
    return (
      <div className="glass-card p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[180px]">
        <div className="w-12 h-12 rounded-full bg-[var(--color-bg-elevated)] flex items-center justify-center text-xl">
          💰
        </div>
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            Price Estimator
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-1 leading-relaxed">
            Complete Steps 2 & 3 to see your estimated budget range.
          </p>
        </div>
      </div>
    );
  }

  const confidenceLevel = getConfidenceLevel(formData);

  return (
    <div className="glass-card overflow-hidden fade-in">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-[var(--color-border-default)]">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <span className="text-base">💰</span>
            <span className="text-sm font-semibold text-[var(--color-text-primary)] uppercase tracking-architectural">
              Price Estimator
            </span>
          </div>
          <ConfidenceBadge level={confidenceLevel} />
        </div>
        <p className="text-[10px] uppercase tracking-architectural text-[var(--color-text-muted)]">
          Updates live as you fill in steps
        </p>
      </div>

      {/* Total range — hero block */}
      <div className="px-5 py-6 bg-gradient-to-br from-[var(--color-bg-elevated)] to-[var(--color-bg-card)]">
        <p className="text-xs uppercase tracking-architectural text-[var(--color-accent)] font-semibold mb-3">
          Estimated Total
        </p>
        <div className="flex items-end gap-2 flex-wrap">
          <span className="text-4xl font-heading tracking-wider text-white leading-none">
            {formatCurrency(estimate.minTotal)}
          </span>
          <span className="text-[var(--color-text-muted)] text-xl font-light mb-0.5">—</span>
          <span className="text-4xl font-heading tracking-wider text-white leading-none">
            {formatCurrency(estimate.maxTotal)}
          </span>
        </div>
        <p className="text-[10px] uppercase tracking-architectural text-[var(--color-text-muted)] mt-4 block">
          For {estimate.area} m² booth · All prices in USD
        </p>

        {/* Mini range bar */}
        <div className="mt-6">
          <RangeBar
            min={estimate.minTotal}
            max={estimate.maxTotal}
            budget={formData.budget}
          />
        </div>
      </div>

      {/* Breakdown */}
      <div className="px-5 pb-5 pt-4 space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-architectural text-[var(--color-text-muted)] mb-4">
          Cost Breakdown
        </p>
        {estimate.breakdown.map((item, i) => (
          <BreakdownRow key={i} item={item} index={i} />
        ))}

        {/* Total row */}
        <div className="pt-3 mt-2 border-t border-[var(--color-border-default)] flex items-center justify-between">
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            Total estimate
          </span>
          <span className="text-sm font-bold text-[var(--color-text-primary)]">
            {formatCurrency(estimate.minTotal)} – {formatCurrency(estimate.maxTotal)}
          </span>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="px-5 pb-4">
        <p className="text-[10px] text-[var(--color-text-muted)] leading-relaxed italic">
          * Indicative range only. Actual costs vary by region, contractor, and
          market conditions. Always request a formal quote.
        </p>
      </div>
    </div>
  );
}

/* ─── Breakdown Row ─────────────────────────────────────────────────────────── */
function BreakdownRow({
  item,
  index,
}: {
  item: PriceBreakdownItem;
  index: number;
}) {
  return (
    <div
      className="flex items-start gap-4 py-3 px-3 rounded-sm hover:bg-[var(--color-bg-elevated)] transition-colors duration-200 group border border-transparent hover:border-[var(--color-border-default)]"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <span className="text-lg mt-0.5 flex-shrink-0 opacity-80">{item.icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs uppercase tracking-architectural font-medium text-[var(--color-text-primary)] truncate mb-0.5">
          {item.label}
        </p>
        <p className="text-[10px] text-[var(--color-text-muted)] truncate">
          {item.description}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-semibold text-[var(--color-text-primary)] tabular-nums font-mono">
          {formatCurrency(item.minAmount)}
        </p>
        <p className="text-[10px] text-[var(--color-text-muted)] tabular-nums font-mono">
          – {formatCurrency(item.maxAmount)}
        </p>
      </div>
    </div>
  );
}

/* ─── Range Bar ──────────────────────────────────────────────────────────────── */
function RangeBar({
  min,
  max,
  budget,
}: {
  min: number;
  max: number;
  budget: string;
}) {
  // Show position within a broader scale
  const scales: Record<string, number> = {
    low:    100_000,
    medium: 300_000,
    high:   1_000_000,
  };
  const scale = scales[budget] ?? 300_000;
  const minPct = Math.min((min / scale) * 100, 95);
  const maxPct = Math.min((max / scale) * 100, 98);

  return (
    <div>
      <div className="relative h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
        {/* filled range */}
        <div
          className="absolute top-0 h-full rounded-full"
          style={{
            left:  `${minPct}%`,
            width: `${maxPct - minPct}%`,
            background: "linear-gradient(90deg, var(--color-gradient-start), var(--color-gradient-end))",
            boxShadow: "0 0 8px var(--color-accent-glow)",
            transition: "left 0.6s cubic-bezier(0.4,0,0.2,1), width 0.6s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] text-[var(--color-text-muted)]">
        <span>$0</span>
        <span>{formatCurrency(scale / 2)}</span>
        <span>{formatCurrency(scale)}+</span>
      </div>
    </div>
  );
}

/* ─── Confidence Badge ───────────────────────────────────────────────────────── */
type ConfidenceLevel = "low" | "medium" | "high";

function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const config = {
    low:    { label: "Rough",    color: "text-[var(--color-warning)]",  bg: "bg-[rgba(245,158,11,0.12)]",  dot: "bg-[var(--color-warning)]"  },
    medium: { label: "Moderate", color: "text-[var(--color-accent)]",   bg: "bg-[var(--color-accent-glow)]", dot: "bg-[var(--color-accent)]"   },
    high:   { label: "Detailed", color: "text-[var(--color-success)]",  bg: "bg-[var(--color-success-glow)]", dot: "bg-[var(--color-success)]" },
  };
  const c = config[level];
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${c.bg}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      <span className={`text-[10px] font-semibold uppercase tracking-wider ${c.color}`}>
        {c.label}
      </span>
    </div>
  );
}

/* ─── Confidence logic ───────────────────────────────────────────────────────── */
function getConfidenceLevel(data: FormData): ConfidenceLevel {
  let score = 0;
  if (data.style)   score++;
  if (data.budget)  score++;
  if (data.width && data.depth) score++;
  if (data.mustHave.length > 0 || data.niceToHave.length > 0) score++;
  if (data.personality.tone) score++;
  if (score <= 2) return "low";
  if (score <= 3) return "medium";
  return "high";
}
