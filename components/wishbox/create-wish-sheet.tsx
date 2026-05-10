"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Sparkles,
  Loader2,
  Eye,
  EyeOff,
  Coins,
  PenLine,
  AlertCircle,
  CheckCircle2,
  Timer,
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { WISHBOX_TREASURY } from "@/lib/wishbox-constants";

interface CreateWishSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    description: string;
    category: string;
    reward: number;
    isAnonymous: boolean;
    deadline: string;
  }) => void;
}

const categories = [
  "Development",
  "Design",
  "Translation",
  "Writing",
  "Data",
  "Research",
  "Other",
];

export function CreateWishSheet({ open, onOpenChange, onSubmit }: CreateWishSheetProps) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Development");
  const [reward, setReward] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [txError, setTxError] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !reward || !publicKey) return;

    const rewardAmount = parseFloat(reward);
    if (isNaN(rewardAmount) || rewardAmount <= 0) return;

    setIsLoading(true);
    setTxError(null);

    try {
      const lamports = Math.round(rewardAmount * LAMPORTS_PER_SOL);

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: WISHBOX_TREASURY,
          lamports,
        })
      );

      const { blockhash, lastValidBlockHeight } =
        await connection.getLatestBlockhash("confirmed");
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        "confirmed"
      );

      console.log("[Wishbox] Post task tx:", signature);

      setTxSuccess(true);

      const days = parseInt(deadlineDays) || 30;
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + days);
      const deadline = deadlineDate.toISOString().split("T")[0];

      onSubmit({ title, description, category, reward: rewardAmount, isAnonymous, deadline });

      setTimeout(() => {
        setTitle("");
        setDescription("");
        setCategory("Development");
        setReward("");
        setDeadlineDays("");
        setIsAnonymous(false);
        setTxSuccess(false);
        setIsLoading(false);
        onOpenChange(false);
      }, 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("rejected") || msg.toLowerCase().includes("cancelled")) {
        setTxError("Transaction cancelled — your task was not posted.");
      } else {
        setTxError("Transaction failed. Please check your balance and try again.");
      }
      console.error("[Wishbox] Post task error:", err);
      setIsLoading(false);
    }
  };

  const isValid =
    !!publicKey &&
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    !!reward &&
    parseFloat(reward) > 0;

  const rewardNum = parseFloat(reward) || 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-glass-border bg-background/95 backdrop-blur-xl sm:max-w-md"
      >
        {/* Sticky header — never scrolls away */}
        <SheetHeader className="flex-shrink-0 border-b border-glass-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20 shadow-[0_0_15px_var(--glow-primary)]">
              <PenLine className="size-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-lg text-foreground">Post New Task</SheetTitle>
              <SheetDescription>Create a new task for others to claim and complete</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          {txSuccess ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle2 className="size-10 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-green-400">Task Posted!</p>
              <p className="text-muted-foreground">
                Your task is live and {rewardNum} SOL has been locked in escrow.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Wallet guard */}
              {!publicKey && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center text-sm text-muted-foreground">
                  Connect your wallet to post a task.
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Task Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Design a logo for my project"
                  className="border-glass-border bg-secondary/50"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                        category === cat
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-glass-border bg-secondary/30 text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Task Description</label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your task in detail..."
                  className="min-h-[120px] resize-none border-glass-border bg-secondary/50"
                />
              </div>

              {/* Reward */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Initial Reward</label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={reward}
                    onChange={(e) => setReward(e.target.value)}
                    placeholder="0.00"
                    className="border-glass-border bg-secondary/50 pl-10 pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    SOL
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This amount will be deducted from your wallet and locked in escrow.
                  Others can contribute more SOL to increase the reward.
                </p>
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Task Deadline
                </label>
                <div className="relative">
                  <Timer className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={deadlineDays}
                    onChange={(e) => setDeadlineDays(e.target.value)}
                    placeholder="30"
                    className="border-glass-border bg-secondary/50 pl-10 pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                    days
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  If unclaimed within this period, the task will be taken down.
                  Leave blank to use the default <span className="font-medium text-foreground">30-day</span> deadline.
                </p>
              </div>

              {/* Anonymous Toggle */}
              <div className="flex items-center justify-between rounded-lg border border-glass-border bg-secondary/30 p-4">
                <div className="flex items-center gap-3">
                  {isAnonymous ? (
                    <EyeOff className="size-5 text-accent" />
                  ) : (
                    <Eye className="size-5 text-primary" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {isAnonymous ? "Post Anonymously" : "Post Publicly"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {isAnonymous
                        ? "Your wallet address will be hidden"
                        : "Your wallet address will be visible"}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={isAnonymous}
                  onCheckedChange={setIsAnonymous}
                  className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-primary/30"
                />
              </div>

              {/* Error banner */}
              {txError && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="size-4 shrink-0" />
                  {txError}
                </div>
              )}

              {/* Payment summary */}
              {rewardNum > 0 && (
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Reward locked in escrow</span>
                    <span className="font-mono font-semibold text-primary">{rewardNum} SOL</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-muted-foreground">
                    <span>Network fee (est.)</span>
                    <span className="font-mono">~0.000005 SOL</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!isValid || isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                style={{
                  boxShadow: isValid && !isLoading ? "0 0 25px var(--glow-primary)" : "none",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Waiting for signature…
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 size-4" />
                    Post Task &amp; Lock {rewardNum > 0 ? `${rewardNum} SOL` : "Reward"}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
