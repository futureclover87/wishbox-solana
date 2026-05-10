"use client";

import {
  ShieldCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  FileCheck,
  ListChecks,
  Sparkles,
  Wand2,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ScopingReport } from "@/app/api/scoping/route";

interface AuditCardProps {
  report: ScopingReport;
  onApplyRefined: (refined: string) => void;
}

function ScoreRing({ score }: { score: number }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const color =
    score >= 81 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex size-14 items-center justify-center">
      <svg width="56" height="56" className="-rotate-90">
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          className="text-secondary/60"
        />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={`${filled} ${circumference}`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
        />
      </svg>
      <span
        className="absolute text-xs font-bold"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

export function AuditCard({ report, onApplyRefined }: AuditCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const isReady = report.status === "READY";

  const statusColors = isReady
    ? {
        border: "border-green-500/40",
        bg: "bg-green-500/5",
        badge: "bg-green-500/20 text-green-400 border-green-500/30",
        icon: "text-green-400",
      }
    : {
        border: "border-amber-500/40",
        bg: "bg-amber-500/5",
        badge: "bg-amber-500/20 text-amber-400 border-amber-500/30",
        icon: "text-amber-400",
      };

  return (
    <div
      className={`rounded-xl border ${statusColors.border} ${statusColors.bg} overflow-hidden transition-all duration-300`}
    >
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {isReady ? (
          <ShieldCheck className={`size-5 shrink-0 ${statusColors.icon}`} />
        ) : (
          <ShieldAlert className={`size-5 shrink-0 ${statusColors.icon}`} />
        )}

        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">AI Audit Report</p>
          <span
            className={`mt-0.5 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wider ${statusColors.badge}`}
          >
            {isReady ? "READY FOR CONTRACT" : "NEEDS REVISION"}
          </span>
        </div>

        <ScoreRing score={report.clarity_score} />

        <button
          onClick={() => setShowDetails((v) => !v)}
          className="ml-1 rounded-md p-1 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle details"
        >
          {showDetails ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </button>
      </div>

      {/* Analysis summary — always visible */}
      <div className="border-t border-white/5 px-4 py-3">
        <p className="text-xs text-muted-foreground leading-relaxed">{report.analysis}</p>
      </div>

      {/* Expanded details */}
      {showDetails && (
        <div className="space-y-4 border-t border-white/5 px-4 pb-4 pt-3">
          {/* Verifiable Evidence */}
          {report.verifiable_evidence.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <FileCheck className="size-3.5 text-primary" />
                Verifiable Evidence Required
              </div>
              <ul className="space-y-1">
                {report.verifiable_evidence.map((ev, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-md bg-secondary/30 px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    <ClipboardList className="mt-0.5 size-3 shrink-0 text-primary" />
                    {ev}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Milestones */}
          {report.milestones.length > 0 && (
            <div>
              <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                <ListChecks className="size-3.5 text-accent" />
                Suggested Milestones
              </div>
              <ol className="space-y-2">
                {report.milestones.map((m, i) => (
                  <li key={i} className="rounded-md border border-glass-border bg-secondary/20 px-3 py-2">
                    <p className="text-xs font-medium text-foreground">
                      <span className="mr-1.5 font-mono text-[10px] text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {m.title}
                    </p>
                    <p className="mt-0.5 pl-5 text-[11px] text-muted-foreground">{m.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Apply refined description CTA — only when revision needed */}
      {!isReady && report.refined_description && (
        <div className="border-t border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <Wand2 className="size-3.5" />
            AI's Optimized Version
          </div>
          <p className="mb-3 rounded-md border border-amber-500/20 bg-secondary/30 px-3 py-2 text-xs text-muted-foreground leading-relaxed">
            {report.refined_description}
          </p>
          <Button
            size="sm"
            onClick={() => onApplyRefined(report.refined_description)}
            className="w-full gap-2 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30"
          >
            <Sparkles className="size-3.5" />
            Apply AI's optimized version?
          </Button>
        </div>
      )}
    </div>
  );
}
