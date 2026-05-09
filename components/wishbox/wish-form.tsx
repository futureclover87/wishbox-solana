"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Loader2, Eye, EyeOff } from "lucide-react";

interface WishFormProps {
  onSubmit: (wish: string, isAnonymous: boolean) => void;
}

export function WishForm({ onSubmit }: WishFormProps) {
  const [wish, setWish] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!wish.trim()) return;
    
    setIsLoading(true);
    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 2000));
    onSubmit(wish, isAnonymous);
    setWish("");
    setIsLoading(false);
  };

  return (
    <div className="relative mx-auto w-full max-w-2xl">
      {/* Glow effect behind the card */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 opacity-75 blur-xl" />
      
      {/* Glassmorphism Card */}
      <div className="relative rounded-2xl border border-glass-border bg-glass-bg p-6 backdrop-blur-xl md:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20 shadow-[0_0_15px_var(--glow-primary)]">
            <Sparkles className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">许下你的愿望</h2>
            <p className="text-sm text-muted-foreground">你的愿望将被永久记录在 Solana 区块链上</p>
          </div>
        </div>

        {/* Textarea */}
        <Textarea
          value={wish}
          onChange={(e) => setWish(e.target.value)}
          placeholder="在这里写下你的愿望..."
          className="mb-6 min-h-[140px] resize-none border-glass-border bg-secondary/50 text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30"
        />

        {/* Privacy Toggle & Submit Button */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Anonymous Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-glass-border bg-secondary/30 px-3 py-2">
              {isAnonymous ? (
                <EyeOff className="size-4 text-accent" />
              ) : (
                <Eye className="size-4 text-primary" />
              )}
              <span className="text-sm text-foreground">
                {isAnonymous ? "匿名" : "公开"}
              </span>
              <Switch
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
                className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-primary/30"
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {isAnonymous ? "你的钱包地址将被隐藏" : "你的钱包地址将公开显示"}
            </span>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!wish.trim() || isLoading}
            className="relative overflow-hidden bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
            style={{
              boxShadow: !wish.trim() || isLoading 
                ? "none" 
                : "0 0 25px var(--glow-primary), 0 0 50px var(--glow-primary)"
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                提交中...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 size-4" />
                提交愿望
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
