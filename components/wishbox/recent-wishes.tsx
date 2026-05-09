"use client";

import { WishCard, type Wish } from "./wish-card";
import { Sparkles } from "lucide-react";

interface RecentWishesProps {
  wishes: Wish[];
}

export function RecentWishes({ wishes }: RecentWishesProps) {
  if (wishes.length === 0) {
    return (
      <div className="mx-auto max-w-2xl text-center py-12">
        <div className="mb-4 flex justify-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-secondary/50 border border-glass-border">
            <Sparkles className="size-8 text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">还没有愿望</h3>
        <p className="text-sm text-muted-foreground">
          成为第一个许愿的人吧！
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sparkles className="size-4 text-primary" />
          <span className="text-sm font-medium">最近的愿望</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-transparent" />
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wishes.map((wish) => (
          <WishCard key={wish.id} wish={wish} />
        ))}
      </div>
    </div>
  );
}
