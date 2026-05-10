"use client";

import { Sparkles, Flame, Users, Coins, Timer } from "lucide-react";
import type { Wish } from "./wish-card";

interface TrendingProjectsProps {
  wishes: Wish[];
  onWishClick: (wish: Wish) => void;
}

function normalize(value: number, max: number, min: number = 0): number {
  if (max === min) return 100;
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

function daysLeft(deadline: string): number {
  const diffMs = new Date(deadline + "T23:59:59").getTime() - Date.now();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

function computeTop3(wishes: Wish[]) {
  if (wishes.length === 0) return [];

  const openWishes = wishes.filter((w) => w.status === "open");
  const pool = openWishes.length > 0 ? openWishes : wishes;

  const maxReward  = Math.max(...pool.map((w) => w.reward));
  const maxContrib = Math.max(...pool.map((w) => w.contributors));
  const allDays    = pool.map((w) => daysLeft(w.deadline));
  const maxDays    = Math.max(...allDays);

  return pool
    .map((w) => {
      const nReward   = normalize(w.reward, maxReward);
      const nContrib  = normalize(w.contributors, maxContrib);
      // Tasks expiring sooner → higher urgency score
      const days      = daysLeft(w.deadline);
      const nUrgency  = normalize(maxDays - days, maxDays);
      const score = Math.round(nReward * 0.40 + nContrib * 0.35 + nUrgency * 0.25);
      return { ...w, score, days };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

type UrgencyLevel = "expired" | "critical" | "warning" | "normal";

function urgencyLevel(days: number): UrgencyLevel {
  if (days === 0) return "expired";
  if (days <= 2)  return "critical";
  if (days <= 7)  return "warning";
  return "normal";
}

const urgencyColor: Record<UrgencyLevel, string> = {
  expired:  "text-muted-foreground/50",
  critical: "text-red-400",
  warning:  "text-amber-400",
  normal:   "text-muted-foreground",
};

const urgencyBg: Record<UrgencyLevel, string> = {
  expired:  "bg-secondary/30",
  critical: "bg-red-500/10 border border-red-500/20",
  warning:  "bg-amber-500/10 border border-amber-500/20",
  normal:   "bg-secondary/30",
};

function ScoreBar({ value }: { value: number }) {
  const colorClass =
    value >= 80 ? "bg-orange-400 shadow-[0_0_8px_theme(colors.orange.400/60%)]" :
    value >= 60 ? "bg-primary shadow-[0_0_6px_var(--glow-primary)]" :
    value >= 40 ? "bg-accent/80" :
    "bg-muted-foreground/50";
  return (
    <div className="h-1 w-full rounded-full bg-secondary/60">
      <div className={`h-1 rounded-full transition-all ${colorClass}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function TrendingProjects({ wishes, onWishClick }: TrendingProjectsProps) {
  const top3 = computeTop3(wishes);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-glass-border bg-glass-bg/50 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-glass-border bg-secondary/30 px-4 py-2">
        <Sparkles className="size-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Worth Watching</span>
        <span className="ml-1 text-[10px] text-muted-foreground">Bounty · People · Urgency</span>
        <Flame className="ml-auto size-3.5 text-orange-400" />
      </div>

      {/* Top-3 cards */}
      <div className="grid grid-cols-3">
        {top3.map((wish, index) => {
          const level = urgencyLevel(wish.days);
          const countdownLabel =
            wish.days === 0 ? "Expired" :
            wish.days === 1 ? "1d" :
            `${wish.days}d`;

          return (
            <button
              key={wish.id}
              onClick={() => onWishClick(wish)}
              className="group flex flex-col gap-2 border-r border-glass-border px-3 py-3 text-left last:border-r-0 transition-colors hover:bg-primary/5"
            >
              {/* Top row: rank badge + countdown */}
              <div className="flex items-center justify-between gap-1">
                <span className="shrink-0 text-[10px] font-bold text-muted-foreground">
                  #{index + 1}
                </span>
                {/* Countdown — right, enlarged */}
                <div className={`shrink-0 rounded-lg px-2.5 py-1.5 text-center ${urgencyBg[level]}`}>
                  <p className={`font-mono text-xl font-extrabold leading-none ${urgencyColor[level]}`}>
                    {countdownLabel}
                  </p>
                  <p className="mt-0.5 text-[9px] text-muted-foreground leading-none">
                    {wish.days === 0 ? "—" : "left"}
                  </p>
                </div>
              </div>

              {/* Title — full width, 2 lines allowed */}
              <p className="min-w-0 w-full line-clamp-2 text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                {wish.title}
              </p>

              {/* Score bar */}
              <ScoreBar value={wish.score} />

              {/* Stats row */}
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Coins className="size-2.5 text-primary" />
                  <span className="font-mono font-medium text-primary">{wish.reward} SOL</span>
                </span>
                <span className="flex items-center gap-0.5">
                  <Users className="size-2.5" />
                  {wish.contributors} people
                </span>
                <span className="flex items-center gap-0.5">
                  <Timer className="size-2.5" />
                  {new Date(wish.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
