"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Award, Shield, Zap, Star, HandHeart, Coins, CheckCircle2, ArrowRight } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useCallback, useEffect, useState } from "react";

// Mock NFT Badges data
const nftBadges = [
  { id: "1", name: "Pioneer", icon: Star, color: "text-yellow-400", description: "Early adopter" },
  { id: "2", name: "Top Solver", icon: Zap, color: "text-primary", description: "10+ tasks completed" },
  { id: "3", name: "Trusted", icon: Shield, color: "text-green-400", description: "Verified contributor" },
];

// Pandora's Box Logo Component
function PandoraLogo() {
  return (
    <div className="relative flex size-10 items-center justify-center">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-xl bg-primary/30 blur-md" />
      
      {/* Box shape */}
      <svg
        viewBox="0 0 40 40"
        className="relative size-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Box base with gradient */}
        <defs>
          <linearGradient id="boxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.7 0.2 240)" />
            <stop offset="100%" stopColor="oklch(0.6 0.18 280)" />
          </linearGradient>
          <linearGradient id="lidGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.6 0.18 280)" />
            <stop offset="100%" stopColor="oklch(0.7 0.2 240)" />
          </linearGradient>
        </defs>
        
        {/* Box body */}
        <path
          d="M6 18L6 32C6 33.1 6.9 34 8 34H32C33.1 34 34 33.1 34 32V18"
          stroke="url(#boxGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="oklch(0.18 0.03 280 / 0.6)"
        />
        
        {/* Box lid - slightly open */}
        <path
          d="M4 16L8 8C8.5 7 9.5 6 11 6H29C30.5 6 31.5 7 32 8L36 16"
          stroke="url(#lidGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Lid top line */}
        <path
          d="M4 16H36"
          stroke="url(#boxGradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Magic sparkles escaping */}
        <circle cx="16" cy="12" r="1.5" fill="oklch(0.7 0.2 240)" className="animate-pulse" />
        <circle cx="24" cy="10" r="1" fill="oklch(0.6 0.18 280)" className="animate-pulse" style={{ animationDelay: "0.2s" }} />
        <circle cx="20" cy="8" r="1.2" fill="oklch(0.7 0.2 240)" className="animate-pulse" style={{ animationDelay: "0.4s" }} />
        
        {/* Lock/clasp detail */}
        <rect x="17" y="22" width="6" height="4" rx="1" fill="url(#boxGradient)" />
        <circle cx="20" cy="24" r="1" fill="oklch(0.18 0.03 280)" />
      </svg>
    </div>
  );
}

interface HeaderProps {
  myClaimedCount?: number;
  myClaimedInProgress?: number;
  myClaimedEarned?: number;
  myFundedCount?: number;
  myFundedActive?: number;
  myFundedBounty?: number;
  onGoToClaims?: () => void;
  onGoToFunded?: () => void;
}

export function Header({
  myClaimedCount = 0,
  myClaimedInProgress = 0,
  myClaimedEarned = 0,
  myFundedCount = 0,
  myFundedActive = 0,
  myFundedBounty = 0,
  onGoToClaims,
  onGoToFunded,
}: HeaderProps) {
  const { publicKey, disconnect, connected } = useWallet();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const walletAddress = publicKey?.toBase58() || "";

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const handleCopyAddress = useCallback(() => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
    }
  }, [walletAddress]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-glass-border bg-glass-bg backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <PandoraLogo />
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Wishbox
            </span>
            <span className="text-[10px] tracking-wider text-muted-foreground uppercase">
              Pandora&apos;s Bounty
            </span>
          </div>
        </div>

        {/* Connect Wallet Button / Account Dropdown
            `mounted` guard prevents SSR/client hydration mismatch:
            WalletMultiButton injects its own <i> start icon on the client
            which differs from what the server renders if we pass children.
            Before mount both server and client agree on the static placeholder. */}
        {!mounted ? (
          <button
            className="wallet-adapter-button wallet-adapter-button-trigger"
            disabled
            aria-label="Connect Wallet"
          >
            Connect Wallet
          </button>
        ) : !connected ? (
          <div className="wishbox-wallet-btn">
            <WalletMultiButton />
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-primary/50 bg-primary/10 text-foreground hover:bg-primary/20 shadow-[0_0_15px_var(--glow-primary)] transition-all"
              >
                <div className="flex size-5 items-center justify-center rounded-full bg-primary/30 mr-2">
                  <Wallet className="size-3 text-primary" />
                </div>
                <span className="font-mono">{formatAddress(walletAddress)}</span>
                <ChevronDown className="ml-2 size-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-80 border-glass-border bg-popover backdrop-blur-xl"
            >
              {/* Account header */}
              <div className="px-3 pt-3 pb-2">
                <p className="text-xs font-medium text-muted-foreground mb-1">My Account</p>
                <p className="font-mono text-sm text-foreground">{formatAddress(walletAddress)}</p>
              </div>

              <DropdownMenuSeparator className="bg-border" />

              {/* ── My Claims ─────────────────────────────────────────────── */}
              <div className="px-2 py-2">
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-1.5">
                    <HandHeart className="size-3.5 text-accent" />
                    <span className="text-xs font-semibold text-foreground">My Claims</span>
                  </div>
                  {myClaimedCount > 0 && (
                    <span className="flex size-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
                      {myClaimedCount}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="rounded-lg bg-secondary/50 p-2 text-center">
                    <p className="font-mono text-base font-bold text-accent">{myClaimedCount}</p>
                    <p className="text-[10px] text-muted-foreground">Total</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2 text-center">
                    <p className="font-mono text-base font-bold text-yellow-400">{myClaimedInProgress}</p>
                    <p className="text-[10px] text-muted-foreground">In Progress</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2 text-center">
                    <p className="font-mono text-base font-bold text-green-400">{myClaimedEarned.toFixed(1)}</p>
                    <p className="text-[10px] text-muted-foreground">SOL Earned</p>
                  </div>
                </div>
                <button
                  onClick={() => { onGoToClaims?.(); }}
                  className="flex w-full items-center justify-between rounded-lg border border-accent/30 bg-accent/5 px-3 py-2 text-sm text-accent transition-colors hover:bg-accent/10"
                >
                  <span className="flex items-center gap-1.5">
                    <HandHeart className="size-3.5" />
                    View My Claims
                  </span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>

              <DropdownMenuSeparator className="bg-border" />

              {/* ── My Funded Tasks ───────────────────────────────────────── */}
              <div className="px-2 py-2">
                <div className="flex items-center justify-between mb-2 px-1">
                  <div className="flex items-center gap-1.5">
                    <Coins className="size-3.5 text-primary" />
                    <span className="text-xs font-semibold text-foreground">My Funded Tasks</span>
                  </div>
                  {myFundedCount > 0 && (
                    <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                      {myFundedCount}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <div className="rounded-lg bg-secondary/50 p-2 text-center">
                    <p className="font-mono text-base font-bold text-primary">{myFundedCount}</p>
                    <p className="text-[10px] text-muted-foreground">Posted</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2 text-center">
                    <p className="font-mono text-base font-bold text-green-400">{myFundedActive}</p>
                    <p className="text-[10px] text-muted-foreground">Active</p>
                  </div>
                  <div className="rounded-lg bg-secondary/50 p-2 text-center">
                    <p className="font-mono text-base font-bold text-yellow-400">{myFundedBounty.toFixed(1)}</p>
                    <p className="text-[10px] text-muted-foreground">SOL Funded</p>
                  </div>
                </div>
                <button
                  onClick={() => { onGoToFunded?.(); }}
                  className="flex w-full items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-primary transition-colors hover:bg-primary/10"
                >
                  <span className="flex items-center gap-1.5">
                    <Coins className="size-3.5" />
                    View My Funded
                  </span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>

              <DropdownMenuSeparator className="bg-border" />

              {/* ── NFT Badges ────────────────────────────────────────────── */}
              <div className="px-2 py-2">
                <div className="flex items-center gap-1.5 mb-2 px-1">
                  <Award className="size-3.5 text-yellow-400" />
                  <span className="text-xs font-semibold text-foreground">Badges</span>
                </div>
                <div className="flex gap-2">
                  {nftBadges.map((badge) => {
                    const BadgeIcon = badge.icon;
                    return (
                      <div key={badge.id} title={badge.description}
                        className="flex flex-1 flex-col items-center gap-1 rounded-lg bg-secondary/50 py-2"
                      >
                        <BadgeIcon className={`size-4 ${badge.color}`} />
                        <span className="text-[10px] text-muted-foreground">{badge.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <DropdownMenuSeparator className="bg-border" />

              <DropdownMenuItem onClick={handleCopyAddress} className="cursor-pointer focus:bg-secondary/50">
                <Copy className="mr-2 size-4 text-muted-foreground" />
                Copy Address
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-secondary/50">
                <a href={`https://solscan.io/account/${walletAddress}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 size-4 text-muted-foreground" />
                  View on Solscan
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={handleDisconnect}
                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="mr-2 size-4" />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
