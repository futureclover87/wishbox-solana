"use client";

import { Clock, Wallet, EyeOff } from "lucide-react";

export interface Wish {
  id: string;
  content: string;
  walletAddress: string;
  timestamp: string;
  isAnonymous: boolean;
}

interface WishCardProps {
  wish: Wish;
}

export function WishCard({ wish }: WishCardProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-glass-border bg-glass-bg p-4 backdrop-blur-md transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_var(--glow-primary)]">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Content */}
      <div className="relative">
        <p className="mb-4 line-clamp-3 text-sm text-foreground leading-relaxed">
          {wish.content}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {/* Wallet Address */}
          <div className="flex items-center gap-1.5 rounded-md bg-secondary/50 px-2 py-1">
            {wish.isAnonymous ? (
              <>
                <EyeOff className="size-3 text-accent" />
                <span className="font-mono text-accent">匿名</span>
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
    </div>
  );
}
