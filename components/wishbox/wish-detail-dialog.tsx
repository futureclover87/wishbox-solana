"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Wallet,
  Clock,
  Coins,
  Users,
  EyeOff,
  HandHeart,
  CheckCircle2,
  Loader2,
  Plus,
  ExternalLink,
} from "lucide-react";
import type { Wish } from "./wish-card";

interface WishDetailDialogProps {
  wish: Wish | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isWalletConnected: boolean;
  onContribute: (wishId: string, amount: number) => void;
  onClaim: (wishId: string) => void;
}

export function WishDetailDialog({
  wish,
  open,
  onOpenChange,
  isWalletConnected,
  onContribute,
  onClaim,
}: WishDetailDialogProps) {
  const [contributeAmount, setContributeAmount] = useState("");
  const [isContributing, setIsContributing] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showContributeInput, setShowContributeInput] = useState(false);

  if (!wish) return null;

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const statusColors = {
    open: "bg-green-500/20 text-green-400 border-green-500/30",
    claimed: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    completed: "bg-primary/20 text-primary border-primary/30",
  };

  const statusText = {
    open: "开放中",
    claimed: "已认领",
    completed: "已完成",
  };

  const handleContribute = async () => {
    const amount = parseFloat(contributeAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsContributing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    onContribute(wish.id, amount);
    setIsContributing(false);
    setShowContributeInput(false);
    setContributeAmount("");
  };

  const handleClaim = async () => {
    setIsClaiming(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    onClaim(wish.id);
    setIsClaiming(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-glass-border bg-background/95 backdrop-blur-xl sm:max-w-lg">
        <DialogHeader>
          <div className="mb-2 flex items-center gap-2">
            <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent">
              {wish.category}
            </Badge>
            <Badge className={`${statusColors[wish.status]} border`}>
              {statusText[wish.status]}
            </Badge>
          </div>
          <DialogTitle className="text-xl text-foreground">{wish.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground leading-relaxed">
            {wish.description}
          </DialogDescription>
        </DialogHeader>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="rounded-lg border border-glass-border bg-secondary/30 p-4">
            <div className="mb-1 flex items-center gap-2 text-muted-foreground">
              <Coins className="size-4 text-primary" />
              <span className="text-sm">当前奖励</span>
            </div>
            <p className="font-mono text-2xl font-bold text-primary">{wish.reward} SOL</p>
          </div>
          <div className="rounded-lg border border-glass-border bg-secondary/30 p-4">
            <div className="mb-1 flex items-center gap-2 text-muted-foreground">
              <Users className="size-4" />
              <span className="text-sm">加注人数</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{wish.contributors}</p>
          </div>
        </div>

        {/* Creator Info */}
        <div className="flex items-center justify-between rounded-lg border border-glass-border bg-secondary/20 p-3">
          <div className="flex items-center gap-2">
            {wish.isAnonymous ? (
              <>
                <EyeOff className="size-4 text-accent" />
                <span className="text-sm text-accent">匿名发布</span>
              </>
            ) : (
              <>
                <Wallet className="size-4 text-primary" />
                <span className="font-mono text-sm">{formatAddress(wish.walletAddress)}</span>
                <a
                  href={`https://solscan.io/account/${wish.walletAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3" />
            <span>{wish.timestamp}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 space-y-3">
          {/* Contribute Section */}
          {showContributeInput ? (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="输入 SOL 数量"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  className="border-glass-border bg-secondary/50 pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  SOL
                </span>
              </div>
              <Button
                onClick={handleContribute}
                disabled={!contributeAmount || parseFloat(contributeAmount) <= 0 || isContributing}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                style={{ boxShadow: "0 0 15px var(--glow-primary)" }}
              >
                {isContributing ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "确认"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowContributeInput(false)}
                className="border-glass-border"
              >
                取消
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setShowContributeInput(true)}
              disabled={!isWalletConnected || wish.status === "completed"}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              style={{ boxShadow: "0 0 20px var(--glow-primary)" }}
            >
              <Plus className="mr-2 size-4" />
              加注 Contribute
            </Button>
          )}

          {/* Claim Button */}
          <Button
            onClick={handleClaim}
            disabled={!isWalletConnected || wish.status !== "open" || isClaiming}
            variant="outline"
            className="w-full border-accent/50 bg-accent/10 text-accent hover:bg-accent/20 hover:border-accent"
          >
            {isClaiming ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                认领中...
              </>
            ) : wish.status === "claimed" ? (
              <>
                <CheckCircle2 className="mr-2 size-4" />
                已被认领
              </>
            ) : (
              <>
                <HandHeart className="mr-2 size-4" />
                认领任务 Claim
              </>
            )}
          </Button>

          {!isWalletConnected && (
            <p className="text-center text-xs text-muted-foreground">
              请先连接钱包以进行加注或认领操作
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
