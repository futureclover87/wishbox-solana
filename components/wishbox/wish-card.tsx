"use client";

import { Clock, Wallet, EyeOff, Coins, Users, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export interface Wish {
  id: string;
  title: string;
  description: string;
  category: string;
  reward: number;
  contributors: number;
  walletAddress: string;
  /** Wallet address of whoever claimed this task */
  claimerAddress?: string;
  timestamp: string;
  /** ISO date string (YYYY-MM-DD) — task goes offline if unclaimed by this date */
  deadline: string;
  isAnonymous: boolean;
  status: "open" | "claimed" | "completed";
}

type CountdownLevel = "normal" | "warning" | "critical" | "expired";

interface Countdown {
  label: string;
  level: CountdownLevel;
}

export function getCountdown(deadline: string): Countdown {
  const now = new Date();
  // Count to end of deadline day
  const end = new Date(deadline + "T23:59:59");
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) return { label: "Expired", level: "expired" };

  const totalMinutes = Math.floor(diffMs / 60000);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days === 0 && totalHours === 0) return { label: `${totalMinutes}m left`, level: "critical" };
  if (days === 0) return { label: `${totalHours}h left`, level: "critical" };
  if (days <= 2) return { label: `${days}d ${hours}h left`, level: "critical" };
  if (days <= 7) return { label: `${days} days left`, level: "warning" };
  return { label: `${days} days left`, level: "normal" };
}

const countdownStyles: Record<CountdownLevel, string> = {
  normal:   "text-muted-foreground",
  warning:  "text-amber-400",
  critical: "text-red-400",
  expired:  "text-muted-foreground/50",
};

const countdownBarStyles: Record<CountdownLevel, string> = {
  normal:   "bg-primary/50",
  warning:  "bg-amber-400/70",
  critical: "bg-red-400 shadow-[0_0_6px_theme(colors.red.400/50%)]",
  expired:  "bg-muted-foreground/30",
};

interface WishCardProps {
  wish: Wish;
  onClick?: () => void;
}

export function WishCard({ wish, onClick }: WishCardProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const statusColors = {
    open: "bg-green-500/20 text-green-400 border-green-500/30",
    claimed: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    completed: "bg-primary/20 text-primary border-primary/30",
  };

  const statusText = {
    open: "Open",
    claimed: "Claimed",
    completed: "Completed",
  };

  const countdown = wish.status === "open" ? getCountdown(wish.deadline) : null;

  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-xl border border-glass-border bg-glass-bg p-4 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_var(--glow-primary)] text-left"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content */}
      <div className="relative">
        {/* Header with category and status */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent text-xs">
            {wish.category}
          </Badge>
          <Badge className={`${statusColors[wish.status]} border text-xs`}>
            {statusText[wish.status]}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="mb-2 text-base font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {wish.title}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
          {wish.description}
        </p>

        {/* Reward and Contributors */}
        <div className="mb-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-primary">
            <Coins className="size-4" />
            <span className="font-mono text-sm font-medium">{wish.reward} SOL</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="size-3.5" />
            <span className="text-xs">{wish.contributors} contributed</span>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-1">
            {wish.isAnonymous ? (
              <>
                <EyeOff className="size-3 text-accent" />
                <span className="font-mono text-accent">Anonymous</span>
              </>
            ) : (
              <>
                <Wallet className="size-3 text-primary" />
                <span className="font-mono">{formatAddress(wish.walletAddress)}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="size-3" />
            <span>{wish.timestamp}</span>
          </div>
        </div>

        {/* Countdown bar — only for open tasks */}
        {countdown && (
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between">
              <div className={`flex items-center gap-1 text-[10px] font-medium ${countdownStyles[countdown.level]}`}>
                <Timer className="size-3" />
                {countdown.level === "expired" ? "Task expired" : `Expires: ${countdown.label}`}
              </div>
              <span className="text-[10px] text-muted-foreground/60">
                {new Date(wish.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            </div>
            {/* progress bar: full = just posted, empty = deadline reached */}
            <div className="h-0.5 w-full rounded-full bg-secondary/60">
              <DeadlineBar deadline={wish.deadline} level={countdown.level} />
            </div>
          </div>
        )}
      </div>

      {/* Corner accent */}
      <div className="absolute -right-6 -top-6 size-12 rounded-full bg-primary/10 blur-2xl transition-all duration-300 group-hover:bg-primary/20" />
    </button>
  );
}

/** Visual progress bar showing remaining time — client-only to avoid SSR/client mismatch */
function DeadlineBar({ deadline, level }: { deadline: string; level: CountdownLevel }) {
  const [pct, setPct] = useState(100); // start full; updated after mount

  useEffect(() => {
    const end = new Date(deadline + "T23:59:59").getTime();
    const daysTotal = 30 * 24 * 60 * 60 * 1000;
    const start = end - daysTotal;
    const computed = Math.round(Math.max(0, Math.min(100, ((end - Date.now()) / (end - start)) * 100)));
    setPct(computed);
  }, [deadline]);

  return (
    <div
      className={`h-0.5 rounded-full transition-all ${countdownBarStyles[level]}`}
      style={{ width: `${pct}%` }}
    />
  );
}
