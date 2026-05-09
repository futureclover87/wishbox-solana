"use client";

import { WishCard, type Wish } from "./wish-card";
import { Sparkles, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface RecentWishesProps {
  wishes: Wish[];
  onWishClick: (wish: Wish) => void;
}

const categoryFilters = ["全部", "开发", "设计", "翻译", "写作", "数据", "调研", "其他"];

export function RecentWishes({ wishes, onWishClick }: RecentWishesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部");

  const filteredWishes = wishes.filter((wish) => {
    const matchesSearch =
      wish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wish.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "全部" || wish.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="flex items-center gap-2 text-muted-foreground">
          <Sparkles className="size-4 text-primary" />
          <span className="text-sm font-medium">任务列表</span>
          <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
            {wishes.length}
          </span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-transparent" />
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索任务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-glass-border bg-secondary/50 pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categoryFilters.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                activeCategory === cat
                  ? "border-primary bg-primary/20 text-primary"
                  : "border-glass-border bg-secondary/30 text-muted-foreground hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredWishes.length === 0 ? (
        <div className="mx-auto max-w-2xl py-12 text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-glass-border bg-secondary/50">
              <Sparkles className="size-8 text-muted-foreground" />
            </div>
          </div>
          <h3 className="mb-2 text-lg font-medium text-foreground">
            {searchQuery || activeCategory !== "全部" ? "没有找到匹配的任务" : "还没有任务"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery || activeCategory !== "全部"
              ? "尝试调整搜索条件或筛选器"
              : "成为第一个发布任务的人吧！"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredWishes.map((wish) => (
            <WishCard key={wish.id} wish={wish} onClick={() => onWishClick(wish)} />
          ))}
        </div>
      )}
    </div>
  );
}
