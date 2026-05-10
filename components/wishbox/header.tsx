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

// WishBox SVG Logo — transparent background, dark-theme ready
function WishboxLogo() {
  return (
    <div className="relative flex size-10 items-center justify-center">
      {/* glow halo */}
      <div className="absolute inset-0 rounded-full bg-[#4f6ef7]/20 blur-md" />
      <svg
        viewBox="0 0 48 48"
        className="relative size-10 drop-shadow-[0_0_6px_rgba(99,130,255,0.7)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lampGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="smokeGrad" x1="0%" y1="100%" x2="30%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* ── Lamp base pedestal ── */}
        <ellipse cx="24" cy="38" rx="8" ry="2" fill="url(#lampGrad)" opacity="0.5" />
        <rect x="21" y="33" width="6" height="5" rx="1" fill="url(#lampGrad)" opacity="0.8" />

        {/* ── Lamp body ── */}
        <path
          d="M10 28 Q8 24 12 22 Q16 20 24 21 Q32 22 36 24 Q39 26 36 29 Q32 33 24 33 Q16 33 10 28 Z"
          fill="url(#lampGrad)"
          opacity="0.95"
        />

        {/* ── Lamp lid / cap ── */}
        <ellipse cx="24" cy="21" rx="6" ry="3" fill="url(#lampGrad)" />
        <ellipse cx="24" cy="19" rx="2.5" ry="2.5" fill="#7dd3fc" />

        {/* ── Handle (left) ── */}
        <path
          d="M10 27 Q4 25 5 20 Q6 15 11 18"
          stroke="url(#lampGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Spout (right) ── */}
        <path
          d="M36 25 Q42 22 40 18"
          stroke="url(#lampGrad)"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Smoke / magic stream ── */}
        <path
          d="M40 17 Q38 12 41 8 Q43 4 40 2"
          stroke="url(#smokeGrad)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* ── Star sparkle ── */}
        <path
          d="M40 2 L40.8 4.5 L43.5 4.5 L41.4 6.2 L42.2 8.8 L40 7.2 L37.8 8.8 L38.6 6.2 L36.5 4.5 L39.2 4.5 Z"
          fill="#93c5fd"
          opacity="0.95"
        />
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
          <WishboxLogo />
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              WishBox
            </span>
            <span className="text-[10px] tracking-wider text-muted-foreground uppercase">
              Connect Wishes, Create Value
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
