"use client";

import { CheckCircle2 } from "lucide-react";
import type { WishStatus } from "./wish-card";

const STEPS = ["Created", "Bounty Added", "Accepted", "Submitted", "Settled"] as const;
type Step = (typeof STEPS)[number];

const statusToLevel: Record<WishStatus, number> = {
  Open:      2,
  Accepted:  3,
  Submitted: 4,
  Settled:   5,
};

type StepStatus = "completed" | "current" | "pending";

function getStepStatus(stepIndex: number, wishStatus: WishStatus): StepStatus {
  const currentLevel = statusToLevel[wishStatus];
  const stepLevel = stepIndex + 1; // 1-based
  if (stepLevel < currentLevel) return "completed";
  if (stepLevel === currentLevel) return "current";
  return "pending";
}

const circleStyles: Record<StepStatus, string> = {
  completed: "border-primary bg-primary text-primary-foreground",
  current:   "border-primary bg-primary/20 text-primary",
  pending:   "border-border bg-muted text-muted-foreground",
};

const labelStyles: Record<StepStatus, string> = {
  completed: "text-primary font-medium",
  current:   "text-primary font-medium",
  pending:   "text-muted-foreground",
};

const lineStyles: Record<StepStatus, string> = {
  completed: "bg-primary",
  current:   "bg-border",
  pending:   "bg-border",
};

interface ChainProgressProps {
  status: WishStatus;
}

export function ChainProgress({ status }: ChainProgressProps) {
  return (
    <div className="rounded-lg border border-glass-border bg-secondary/20 px-4 py-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Chain Progress
      </p>
      <div className="flex items-start">
        {STEPS.map((step, i) => {
          const ss = getStepStatus(i, status);
          return (
            <div key={step} className="flex flex-1 flex-col items-center gap-1.5">
              {/* Circle + connector line row */}
              <div className="flex w-full items-center">
                {/* Left connector — invisible for first step to keep circle centred */}
                <div
                  className={`h-px flex-1 transition-colors ${
                    i === 0 ? "opacity-0" : lineStyles[getStepStatus(i - 1, status)]
                  }`}
                />

                {/* Circle */}
                <div
                  className={`relative flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-all ${circleStyles[ss]} ${ss === "current" ? "animate-pulse" : ""}`}
                >
                  {ss === "completed" ? (
                    <CheckCircle2 className="size-4" />
                  ) : (
                    <span className="text-[10px] font-bold">{i + 1}</span>
                  )}
                </div>

                {/* Right connector — invisible for last step to keep circle centred */}
                <div
                  className={`h-px flex-1 transition-colors ${
                    i === STEPS.length - 1 ? "opacity-0" : lineStyles[ss]
                  }`}
                />
              </div>

              {/* Label */}
              <span className={`text-center text-[10px] leading-tight transition-colors ${labelStyles[ss]}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
