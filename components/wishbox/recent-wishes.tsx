"use client";

import { WishCard, type Wish } from "./wish-card";
import { Search, Coins, Clock, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface RecentWishesProps {
  wishes: Wish[];
  onWishClick: (wish: Wish) => void;
  sortBy?: "reward" | "time" | "contributors";
  onSortChange?: (sort: "reward" | "time" | "contributors") => void;
}

const categoryFilters = ["All", "Development", "Design", "Translation", "Writing", "Other"];

export function RecentWishes({ wishes, onWishClick, sortBy = "reward", onSortChange }: RecentWishesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredWishes = wishes.filter((wish) => {
    const matchesSearch =
      wish.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wish.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || wish.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full">
      {/* Search and Filter */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-glass-border bg-secondary/50 pl-10"
          />
        </div>

        {/* Category Filters and Sort Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
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

          {/* Sort Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort:</span>
            <div className="flex gap-1">
              <button
                onClick={() => onSortChange?.("reward")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-all ${
                  sortBy === "reward"
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "border border-glass-border bg-secondary/30 text-muted-foreground hover:border-primary/50"
                }`}
              >
                <Coins className="size-4" />
                Bounty
              </button>
              <button
                onClick={() => onSortChange?.("time")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-all ${
                  sortBy === "time"
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "border border-glass-border bg-secondary/30 text-muted-foreground hover:border-primary/50"
                }`}
              >
                <Clock className="size-4" />
                Recent
              </button>
              <button
                onClick={() => onSortChange?.("contributors")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-all ${
                  sortBy === "contributors"
                    ? "bg-primary/20 text-primary border border-primary/50"
                    : "border border-glass-border bg-secondary/30 text-muted-foreground hover:border-primary/50"
                }`}
              >
                <Users className="size-4" />
                Hot
              </button>
            </div>
          </div>
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
            {searchQuery || activeCategory !== "All" ? "No matching tasks found" : "No tasks yet"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery || activeCategory !== "All"
              ? "Try adjusting your search or filters"
              : "Be the first to post a task!"}
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
