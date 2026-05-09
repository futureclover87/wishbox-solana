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
import { Sparkles, Loader2, Eye, EyeOff, Coins, PenLine } from "lucide-react";

interface CreateWishSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    description: string;
    category: string;
    reward: number;
    isAnonymous: boolean;
  }) => void;
}

const categories = [
  "开发",
  "设计",
  "翻译",
  "写作",
  "数据",
  "调研",
  "其他",
];

export function CreateWishSheet({ open, onOpenChange, onSubmit }: CreateWishSheetProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("开发");
  const [reward, setReward] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !reward) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    onSubmit({
      title,
      description,
      category,
      reward: parseFloat(reward),
      isAnonymous,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setCategory("开发");
    setReward("");
    setIsAnonymous(false);
    setIsLoading(false);
    onOpenChange(false);
  };

  const isValid = title.trim() && description.trim() && reward && parseFloat(reward) > 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-glass-border bg-background/95 backdrop-blur-xl sm:max-w-md overflow-y-auto"
      >
        <SheetHeader className="pb-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20 shadow-[0_0_15px_var(--glow-primary)]">
              <PenLine className="size-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-lg text-foreground">发布新任务</SheetTitle>
              <SheetDescription>创建一个新的任务，等待他人认领完成</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6 px-1">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">任务标题</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：帮我设计一个 Logo"
              className="border-glass-border bg-secondary/50"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">任务分类</label>
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
            <label className="text-sm font-medium text-foreground">任务描述</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="详细描述你需要完成的任务..."
              className="min-h-[120px] resize-none border-glass-border bg-secondary/50"
            />
          </div>

          {/* Reward */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">初始奖励</label>
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
              其他用户可以在你的任务上加注更多 SOL
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
                  {isAnonymous ? "匿名发布" : "公开发布"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isAnonymous ? "你的钱包地址将被隐藏" : "你的钱包地址将公开显示"}
                </p>
              </div>
            </div>
            <Switch
              checked={isAnonymous}
              onCheckedChange={setIsAnonymous}
              className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-primary/30"
            />
          </div>

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
                发布中...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 size-4" />
                发布任务
              </>
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
