"use client";

import { PenLine } from "lucide-react";

interface CreateWishTabProps {
  onClick: () => void;
}

export function CreateWishTab({ onClick }: CreateWishTabProps) {
  return (
    <button
      onClick={onClick}
      className="fixed right-0 top-1/2 z-40 -translate-y-1/2 flex items-center gap-2 rounded-l-xl border border-r-0 border-primary/50 bg-primary/20 px-3 py-4 text-primary backdrop-blur-md transition-all hover:bg-primary/30 hover:px-4 hover:shadow-[0_0_30px_var(--glow-primary)] group"
    >
      <PenLine className="size-5" />
      <span className="hidden text-sm font-medium group-hover:inline whitespace-nowrap">
        发布任务
      </span>
    </button>
  );
}
