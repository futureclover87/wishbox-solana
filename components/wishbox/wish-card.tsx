"use client";

import { Clock, Wallet, EyeOff, Coins, Users, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

export type WishStatus = "Open" | "Accepted" | "Submitted" | "Settled";

export interface Wish {
  id: string;
  title: string;
  description: string;
  category: string;
  bounty: number;
  contributors: number;
  walletAddress: string;
  /** Wallet address of the task creator (for permission checks) */
  creatorAddress?: string;
  /** Wallet address of the builder who accepted this task */
  builder?: string;
  timestamp: string;
  /** ISO date string (YYYY-MM-DD) */
  deadline: string;
  isAnonymous: boolean;
  status: WishStatus;
  /** ISO timestamp when AI approved the delivery */
  submittedAt?: string;
  /** ISO timestamp 7 days after submittedAt — auto-settle date */
  paymentDue?: string;
  /** Builder's delivery link (GitHub PR, Figma, etc.) */
  deliveryUrl?: string;
  /** Builder's delivery summary note */
  deliveryNote?: string;
}

type CountdownLevel = "normal" | "warning" | "critical" | "expired";

interface Countdown {
  label: string;
  level: CountdownLevel;
}

export function getCountdown(deadline: string): Countdown {
  const now = new Date();
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

const statusColors: Record<WishStatus, string> = {
  Open:      "bg-green-500/20 text-green-400 border-green-500/30",
  Accepted:  "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Submitted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Settled:   "bg-primary/20 text-primary border-primary/30",
};

interface WishCardProps {
  wish: Wish;
  onClick?: () => void;
}

export function WishCard({ wish, onClick }: WishCardProps) {
  const formatAddress = (address: string) =>
    `${address.slice(0, 4)}...${address.slice(-4)}`;

  const countdown = wish.status === "Open" ? getCountdown(wish.deadline) : null;

  return (
    <button
      onClick={onClick}
      className="group relative w-full overflow-hidden rounded-xl border border-glass-border bg-glass-bg p-4 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_var(--glow-primary)] text-left"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent text-xs">
            {wish.category}
          </Badge>
          <Badge className={`${statusColors[wish.status]} border text-xs`}>
            {wish.status}
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

        {/* Bounty + Contributors */}
        <div className="mb-3 flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-primary">
            <Coins className="size-4" />
            <span className="font-mono text-sm font-medium">{wish.bounty} SOL</span>
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

        {/* Countdown bar — only for Open tasks */}
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
            <div className="h-0.5 w-full rounded-full bg-secondary/60">
              <DeadlineBar deadline={wish.deadline} level={countdown.level} />
            </div>
          </div>
        )}
      </div>

      <div className="absolute -right-6 -top-6 size-12 rounded-full bg-primary/10 blur-2xl transition-all duration-300 group-hover:bg-primary/20" />
    </button>
  );
}

function DeadlineBar({ deadline, level }: { deadline: string; level: CountdownLevel }) {
  const [pct, setPct] = useState(100);

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
