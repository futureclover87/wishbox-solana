"use client";

import { TrendingUp, Flame, ExternalLink } from "lucide-react";

interface TrendingProject {
  id: string;
  name: string;
  ticker: string;
  hotness: number;
  change: number;
  logo: string;
}

const trendingProjects: TrendingProject[] = [
  {
    id: "1",
    name: "Jupiter",
    ticker: "JUP",
    hotness: 98,
    change: 12.5,
    logo: "J",
  },
  {
    id: "2",
    name: "Marinade",
    ticker: "MNDE",
    hotness: 87,
    change: 8.3,
    logo: "M",
  },
  {
    id: "3",
    name: "Raydium",
    ticker: "RAY",
    hotness: 82,
    change: -2.1,
    logo: "R",
  },
];

export function TrendingProjects() {
  return (
    <div className="w-full overflow-hidden rounded-xl border border-glass-border bg-glass-bg/50 backdrop-blur-md">
      <div className="flex items-center gap-2 border-b border-glass-border bg-secondary/30 px-4 py-2">
        <Flame className="size-4 text-orange-400" />
        <span className="text-sm font-medium text-foreground">Trending Projects</span>
        <TrendingUp className="ml-auto size-3.5 text-green-400" />
      </div>
      <div className="flex divide-x divide-glass-border">
        {trendingProjects.map((project, index) => (
          <a
            key={project.id}
            href="#"
            className="group flex flex-1 items-center gap-3 px-4 py-3 transition-colors hover:bg-primary/5"
          >
            {/* Rank */}
            <span className="flex size-5 items-center justify-center rounded text-xs font-bold text-muted-foreground">
              #{index + 1}
            </span>
            
            {/* Logo */}
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary/30 to-accent/30 text-sm font-bold text-foreground">
              {project.logo}
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                  {project.name}
                </span>
                <ExternalLink className="size-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-xs text-muted-foreground">{project.ticker}</span>
            </div>
            
            {/* Hotness */}
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Flame className={`size-3 ${project.hotness >= 90 ? "text-orange-400" : "text-muted-foreground"}`} />
                <span className={`text-sm font-mono font-medium ${project.hotness >= 90 ? "text-orange-400" : "text-foreground"}`}>
                  {project.hotness}
                </span>
              </div>
              <span className={`text-xs ${project.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                {project.change >= 0 ? "+" : ""}{project.change}%
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
