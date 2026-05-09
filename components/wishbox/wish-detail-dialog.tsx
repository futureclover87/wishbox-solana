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
  Sparkles,
  X,
  ArrowRight,
} from "lucide-react";
import type { Wish } from "./wish-card";

interface WishDetailDialogProps {
  wish: Wish | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isWalletConnected: boolean;
  onConnectWallet: () => void;
  onContribute: (wishId: string, amount: number) => void;
  onClaim: (wishId: string) => void;
}

export function WishDetailDialog({
  wish,
  open,
  onOpenChange,
  isWalletConnected,
  onConnectWallet,
  onContribute,
  onClaim,
}: WishDetailDialogProps) {
  const [contributeAmount, setContributeAmount] = useState("");
  const [isContributing, setIsContributing] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [showContributeInput, setShowContributeInput] = useState(false);
  const [showClaimConfirm, setShowClaimConfirm] = useState(false);
  const [contributeSuccess, setContributeSuccess] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);

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
    open: "Open",
    claimed: "Claimed",
    completed: "Completed",
  };

  const handleContribute = async () => {
    const amount = parseFloat(contributeAmount);
    if (isNaN(amount) || amount <= 0) return;

    setIsContributing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    onContribute(wish.id, amount);
    setIsContributing(false);
    setContributeSuccess(true);
    setTimeout(() => {
      setShowContributeInput(false);
      setContributeAmount("");
      setContributeSuccess(false);
    }, 2000);
  };

  const handleClaim = async () => {
    setIsClaiming(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    onClaim(wish.id);
    setIsClaiming(false);
    setClaimSuccess(true);
    setTimeout(() => {
      setShowClaimConfirm(false);
      setClaimSuccess(false);
    }, 2000);
  };

  const resetStates = () => {
    setShowContributeInput(false);
    setShowClaimConfirm(false);
    setContributeAmount("");
    setContributeSuccess(false);
    setClaimSuccess(false);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value) resetStates();
      onOpenChange(value);
    }}>
      <DialogContent className="border-glass-border bg-background/95 backdrop-blur-xl sm:max-w-xl">
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
              <span className="text-sm">Current Reward</span>
            </div>
            <p className="font-mono text-2xl font-bold text-primary">{wish.reward} SOL</p>
          </div>
          <div className="rounded-lg border border-glass-border bg-secondary/30 p-4">
            <div className="mb-1 flex items-center gap-2 text-muted-foreground">
              <Users className="size-4" />
              <span className="text-sm">Contributors</span>
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
                <span className="text-sm text-accent">Anonymous</span>
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
        <div className="mt-4 space-y-4">
          {/* Wallet Not Connected State */}
          {!isWalletConnected && (
            <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 text-center">
              <Wallet className="mx-auto mb-3 size-10 text-primary" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">Connect Your Wallet</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Connect your wallet to contribute or claim this task
              </p>
              <Button
                onClick={onConnectWallet}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                style={{ boxShadow: "0 0 20px var(--glow-primary)" }}
              >
                <Wallet className="mr-2 size-4" />
                Connect Wallet
              </Button>
            </div>
          )}

          {/* Contribute Section */}
          {isWalletConnected && (
            <>
              {showContributeInput ? (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-foreground">
                      <Plus className="size-5 text-primary" />
                      Contribute to Task
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setShowContributeInput(false);
                        setContributeAmount("");
                        setContributeSuccess(false);
                      }}
                      className="size-8 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>

                  {contributeSuccess ? (
                    <div className="flex flex-col items-center py-4">
                      <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-green-500/20">
                        <CheckCircle2 className="size-7 text-green-400" />
                      </div>
                      <p className="text-lg font-medium text-green-400">Contribution Successful!</p>
                      <p className="text-sm text-muted-foreground">
                        You contributed {contributeAmount} SOL to this task
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="mb-4 text-sm text-muted-foreground">
                        Add more SOL to increase the reward pool and attract more skilled contributors.
                      </p>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="Enter amount"
                            value={contributeAmount}
                            onChange={(e) => setContributeAmount(e.target.value)}
                            className="border-glass-border bg-secondary/50 pr-12 text-lg"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                            SOL
                          </span>
                        </div>
                        <Button
                          onClick={handleContribute}
                          disabled={!contributeAmount || parseFloat(contributeAmount) <= 0 || isContributing}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
                          style={{ boxShadow: "0 0 15px var(--glow-primary)" }}
                        >
                          {isContributing ? (
                            <Loader2 className="size-5 animate-spin" />
                          ) : (
                            <>
                              Confirm
                              <ArrowRight className="ml-2 size-4" />
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="mt-3 flex gap-2">
                        {[0.1, 0.5, 1, 2].map((amount) => (
                          <button
                            key={amount}
                            onClick={() => setContributeAmount(amount.toString())}
                            className="flex-1 rounded-lg border border-glass-border bg-secondary/30 py-2 text-sm text-muted-foreground transition-all hover:border-primary/50 hover:text-primary"
                          >
                            {amount} SOL
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Button
                  onClick={() => setShowContributeInput(true)}
                  disabled={wish.status === "completed"}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
                  style={{ boxShadow: "0 0 20px var(--glow-primary)" }}
                >
                  <Plus className="mr-2 size-5" />
                  Contribute to This Task
                </Button>
              )}
            </>
          )}

          {/* Claim Section - Much Bigger */}
          {isWalletConnected && wish.status === "open" && (
            <>
              {showClaimConfirm ? (
                <div className="rounded-xl border-2 border-accent/50 bg-accent/5 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-xl font-bold text-accent">
                      <HandHeart className="size-6" />
                      Claim This Task
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setShowClaimConfirm(false);
                        setClaimSuccess(false);
                      }}
                      className="size-8 text-muted-foreground hover:text-foreground"
                    >
                      <X className="size-4" />
                    </Button>
                  </div>

                  {claimSuccess ? (
                    <div className="flex flex-col items-center py-6">
                      <div className="mb-4 flex size-20 items-center justify-center rounded-full bg-accent/20">
                        <Sparkles className="size-10 text-accent" />
                      </div>
                      <p className="text-2xl font-bold text-accent">Task Claimed!</p>
                      <p className="mt-2 text-center text-muted-foreground">
                        You are now responsible for completing this task.<br />
                        Once done, submit your work for review.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="mb-4 rounded-lg border border-glass-border bg-secondary/20 p-4">
                        <h4 className="mb-2 font-medium text-foreground">By claiming this task, you agree to:</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                            Complete the task as described within a reasonable timeframe
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                            Submit your work for the task creator to review
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                            Receive the reward ({wish.reward} SOL) upon approval
                          </li>
                        </ul>
                      </div>
                      <Button
                        onClick={handleClaim}
                        disabled={isClaiming}
                        className="w-full h-14 text-lg bg-accent text-accent-foreground hover:bg-accent/90"
                        style={{ boxShadow: "0 0 25px var(--glow-accent)" }}
                      >
                        {isClaiming ? (
                          <>
                            <Loader2 className="mr-2 size-6 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <HandHeart className="mr-2 size-6" />
                            Confirm Claim - Earn {wish.reward} SOL
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowClaimConfirm(true)}
                  className="group relative w-full overflow-hidden rounded-2xl border-2 border-accent/50 bg-gradient-to-br from-accent/20 via-accent/10 to-accent/5 p-8 text-left transition-all hover:border-accent hover:shadow-[0_0_40px_var(--glow-accent)]"
                >
                  {/* Background glow effect */}
                  <div className="absolute -right-10 -top-10 size-32 rounded-full bg-accent/20 blur-3xl transition-all group-hover:bg-accent/30" />
                  <div className="absolute -bottom-10 -left-10 size-32 rounded-full bg-accent/10 blur-3xl transition-all group-hover:bg-accent/20" />
                  
                  <div className="relative flex items-center gap-6">
                    {/* Icon */}
                    <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-accent/20 shadow-[0_0_30px_var(--glow-accent)] transition-all group-hover:scale-110">
                      <HandHeart className="size-10 text-accent" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="mb-1 text-2xl font-bold text-accent">Claim This Task</h3>
                      <p className="mb-3 text-muted-foreground">
                        Take responsibility for completing this task and earn the reward
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 rounded-lg bg-accent/20 px-4 py-2">
                          <Coins className="size-5 text-accent" />
                          <span className="font-mono text-xl font-bold text-accent">{wish.reward} SOL</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Potential Earnings</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ArrowRight className="size-8 text-accent transition-transform group-hover:translate-x-2" />
                  </div>
                </button>
              )}
            </>
          )}

          {/* Already Claimed State */}
          {isWalletConnected && wish.status === "claimed" && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-6 text-center">
              <CheckCircle2 className="mx-auto mb-3 size-12 text-yellow-400" />
              <h3 className="mb-2 text-xl font-bold text-yellow-400">Task Already Claimed</h3>
              <p className="text-muted-foreground">
                Someone is already working on this task. Check back later for updates.
              </p>
            </div>
          )}

          {/* Completed State */}
          {isWalletConnected && wish.status === "completed" && (
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-6 text-center">
              <Sparkles className="mx-auto mb-3 size-12 text-primary" />
              <h3 className="mb-2 text-xl font-bold text-primary">Task Completed</h3>
              <p className="text-muted-foreground">
                This task has been successfully completed and the reward has been distributed.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
