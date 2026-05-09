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
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, Sparkles } from "lucide-react";

interface HeaderProps {
  isConnected: boolean;
  walletAddress: string;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
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
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary/20 shadow-[0_0_20px_var(--glow-primary)]">
            <Sparkles className="size-5 text-primary" />
          </div>
          <span className="text-xl font-bold text-foreground">Wishbox</span>
        </div>

        {/* Connect Wallet Button / Account Dropdown */}
        {!isConnected ? (
          <Button
            onClick={handleConnect}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_var(--glow-primary)] transition-all hover:shadow-[0_0_30px_var(--glow-primary)]"
          >
            <Wallet className="mr-2 size-4" />
            连接钱包
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
                我的账户
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem onClick={handleCopyAddress} className="cursor-pointer focus:bg-primary/10">
                <Copy className="mr-2 size-4 text-muted-foreground" />
                复制地址
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/10">
                <a
                  href={`https://solscan.io/account/${walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 size-4 text-muted-foreground" />
                  在 Solscan 查看
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={onDisconnect}
                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <LogOut className="mr-2 size-4" />
                断开连接
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
