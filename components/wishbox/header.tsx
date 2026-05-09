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
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from "lucide-react";

interface HeaderProps {
  isConnected: boolean;
  walletAddress: string;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

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

export function Header({ isConnected, walletAddress, onConnect, onDisconnect }: HeaderProps) {
  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleConnect = () => {
    // Mock wallet connection
    const mockAddress = "7xKXtJqF4j9sM2kLpN8vR3wE5uY6hG1cD";
    onConnect(mockAddress);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
  };

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

        {/* Connect Wallet Button / Account Dropdown */}
        {!isConnected ? (
          <Button
            onClick={handleConnect}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_var(--glow-primary)] transition-all hover:shadow-[0_0_30px_var(--glow-primary)]"
          >
            <Wallet className="mr-2 size-4" />
            Connect Wallet
          </Button>
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
              className="w-56 border-glass-border bg-popover backdrop-blur-xl"
            >
              <DropdownMenuLabel className="text-muted-foreground">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem onClick={handleCopyAddress} className="cursor-pointer focus:bg-primary/10">
                <Copy className="mr-2 size-4 text-muted-foreground" />
                Copy Address
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10">
                <a
                  href={`https://solscan.io/account/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 size-4 text-muted-foreground" />
                  View on Solscan
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={onDisconnect}
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
