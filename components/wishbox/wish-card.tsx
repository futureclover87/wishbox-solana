"use client";

import { Clock, Wallet, EyeOff, Coins, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Wish {
  id: string;
  title: string;
  description: string;
  category: string;
  reward: number;
  contributors: number;
  walletAddress: string;
  timestamp: string;
  isAnonymous: boolean;
  status: "open" | "claimed" | "completed";
}

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
          {/* Wallet Address */}
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

          {/* Timestamp */}
          <div className="flex items-center gap-1.5">
            <Clock className="size-3" />
            <span>{wish.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute -right-6 -top-6 size-12 rounded-full bg-primary/10 blur-2xl transition-all duration-300 group-hover:bg-primary/20" />
    </button>
  );
}
