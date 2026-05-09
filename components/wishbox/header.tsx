"use client";

import { useState } from "react";
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

export function Header() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress] = useState("7xKXt...F4j9");

  const handleConnect = () => {
    setIsConnected(true);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
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
                <span className="font-mono">{walletAddress}</span>
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
              <DropdownMenuItem className="cursor-pointer focus:bg-primary/10">
                <Copy className="mr-2 size-4 text-muted-foreground" />
                复制地址
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer focus:bg-primary/10">
                <ExternalLink className="mr-2 size-4 text-muted-foreground" />
                在 Solscan 查看
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem
                onClick={handleDisconnect}
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
