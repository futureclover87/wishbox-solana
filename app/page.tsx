"use client";

import { useState } from "react";
import { Header } from "@/components/wishbox/header";
import { RecentWishes } from "@/components/wishbox/recent-wishes";
import { WishDetailDialog } from "@/components/wishbox/wish-detail-dialog";
import { CreateWishSheet } from "@/components/wishbox/create-wish-sheet";
import { TrendingProjects } from "@/components/wishbox/trending-projects";
import type { Wish } from "@/components/wishbox/wish-card";
import { Plus, Search, Code, Palette, Languages, FileText, Database, Microscope, ArrowUpDown, Clock, Coins, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data - specific tasks in English
const initialWishes: Wish[] = [
  {
    id: "1",
    title: "Write unit tests for my Rust smart contract",
    description: "Need comprehensive unit tests for my Solana smart contract covering all critical paths including transfer, staking, and withdrawal functions.",
    category: "Development",
    reward: 2.5,
    contributors: 3,
    walletAddress: "7xKXtJqF4j9sM2kLpN8vR3wE5uY6hG1cD",
    timestamp: "2 min ago",
    isAnonymous: false,
    status: "open",
  },
  {
    id: "2",
    title: "Translate my whitepaper from English to Spanish",
    description: "A 15-page DeFi project whitepaper needs professional Spanish translation while maintaining technical terminology accuracy.",
    category: "Translation",
    reward: 1.8,
    contributors: 5,
    walletAddress: "9mNbVcXzAsD2fGhJkL1qWeRtYuIoP5pO",
    timestamp: "15 min ago",
    isAnonymous: true,
    status: "claimed",
  },
  {
    id: "3",
    title: "Design 5 cyberpunk NFT avatar concepts",
    description: "Need 5 different cyberpunk-themed NFT avatar concept designs for AI generation reference. High quality artwork required.",
    category: "Design",
    reward: 3.2,
    contributors: 8,
    walletAddress: "3pQwErTyUiOpAsDfGhJkLzXcVbNm4rS",
    timestamp: "1 hour ago",
    isAnonymous: false,
    status: "open",
  },
  {
    id: "4",
    title: "Compile data on 100 Solana ecosystem projects",
    description: "Collect and organize basic info on 100 Solana projects including name, website, Twitter, TVL, and other key metrics.",
    category: "Data",
    reward: 0.8,
    contributors: 2,
    walletAddress: "5tYuIoPaSdFgHjKlZxCvBnM8qWeRtYu",
    timestamp: "2 hours ago",
    isAnonymous: false,
    status: "open",
  },
  {
    id: "5",
    title: "Write an in-depth analysis on Solana MEV",
    description: "Need a ~3000 word technical article analyzing the current state of MEV on Solana, major players, and future trends.",
    category: "Writing",
    reward: 4.5,
    contributors: 12,
    walletAddress: "2wErTyUiOpAsDfGhJkLzXcVbNm9qWeR",
    timestamp: "3 hours ago",
    isAnonymous: true,
    status: "open",
  },
  {
    id: "6",
    title: "UX research on 10 Solana wallets",
    description: "Compare and analyze 10 popular Solana wallets for features, UI/UX, security, etc. Deliver a detailed research report.",
    category: "Research",
    reward: 1.2,
    contributors: 4,
    walletAddress: "8iOpAsDfGhJkLzXcVbNm1qWeRtYuIoP",
    timestamp: "5 hours ago",
    isAnonymous: false,
    status: "completed",
  },
  {
    id: "7",
    title: "Debug CPI error in my Anchor project",
    description: "My Anchor project throws an error when calling CPI. Need an experienced developer to help troubleshoot and fix the issue.",
    category: "Development",
    reward: 1.5,
    contributors: 1,
    walletAddress: "4rTyUiOpAsDfGhJkLzXcVbNm2qWeRtY",
    timestamp: "6 hours ago",
    isAnonymous: false,
    status: "open",
  },
  {
    id: "8",
    title: "Design a landing page for my dApp",
    description: "Need a modern Web3-style landing page design including Hero, Features, Tokenomics, and other sections.",
    category: "Design",
    reward: 2.0,
    contributors: 6,
    walletAddress: "6uIoPasDfGhJkLzXcVbNm3qWeRtYuIo",
    timestamp: "8 hours ago",
    isAnonymous: false,
    status: "open",
  },
  {
    id: "9",
    title: "Proofread a DAO governance proposal",
    description: "Need grammar and logic proofreading for a DAO governance proposal to ensure clear and professional expression.",
    category: "Writing",
    reward: 0.5,
    contributors: 0,
    walletAddress: "1pAsDfGhJkLzXcVbNm4qWeRtYuIoPaS",
    timestamp: "10 hours ago",
    isAnonymous: true,
    status: "open",
  },
];

type TabType = "implementer" | "requester";
type SortType = "reward" | "time" | "contributors";

const categoryIcons: Record<string, React.ElementType> = {
  Development: Code,
  Design: Palette,
  Translation: Languages,
  Writing: FileText,
  Data: Database,
  Research: Microscope,
};

export default function WishboxPage() {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("implementer");
  const [sortBy, setSortBy] = useState<SortType>("reward");

  const handleWishClick = (wish: Wish) => {
    setSelectedWish(wish);
    setIsDetailOpen(true);
  };

  const handleCreateWish = (data: {
    title: string;
    description: string;
    category: string;
    reward: number;
    isAnonymous: boolean;
  }) => {
    const newWish: Wish = {
      id: Date.now().toString(),
      ...data,
      contributors: 0,
      walletAddress: walletAddress || "7xKXtJqF4j9sM2kLpN8vR3wE5uY6hG1cD",
      timestamp: "Just now",
      status: "open",
    };
    setWishes([newWish, ...wishes]);
  };

  const handleContribute = (wishId: string, amount: number) => {
    setWishes(
      wishes.map((w) =>
        w.id === wishId
          ? { ...w, reward: w.reward + amount, contributors: w.contributors + 1 }
          : w
      )
    );
    setSelectedWish((prev) =>
      prev && prev.id === wishId
        ? { ...prev, reward: prev.reward + amount, contributors: prev.contributors + 1 }
        : prev
    );
  };

  const handleClaim = (wishId: string) => {
    setWishes(wishes.map((w) => (w.id === wishId ? { ...w, status: "claimed" } : w)));
    setSelectedWish((prev) =>
      prev && prev.id === wishId ? { ...prev, status: "claimed" } : prev
    );
  };

  const handleWalletConnect = (address: string) => {
    setIsWalletConnected(true);
    setWalletAddress(address);
  };

  const handleWalletDisconnect = () => {
    setIsWalletConnected(false);
    setWalletAddress("");
  };

  // Sort wishes based on selected criteria
  const sortedWishes = [...wishes].sort((a, b) => {
    switch (sortBy) {
      case "reward":
        return b.reward - a.reward;
      case "contributors":
        return b.contributors - a.contributors;
      case "time":
      default:
        return 0; // Keep original order (already sorted by time in mock data)
    }
  });

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-96 rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-accent/20 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[150px]" />
      </div>

      {/* Header */}
      <Header
        isConnected={isWalletConnected}
        walletAddress={walletAddress}
        onConnect={handleWalletConnect}
        onDisconnect={handleWalletDisconnect}
      />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-6">
        {/* Trending Projects - Compact */}
        <div className="mb-4">
          <TrendingProjects />
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex rounded-xl border border-glass-border bg-glass-bg/50 p-1 backdrop-blur-md">
            <button
              onClick={() => setActiveTab("implementer")}
              className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${
                activeTab === "implementer"
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_var(--glow-primary)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <Search className="size-4" />
                Find Tasks
              </span>
            </button>
            <button
              onClick={() => setActiveTab("requester")}
              className={`rounded-lg px-6 py-2.5 text-sm font-medium transition-all ${
                activeTab === "requester"
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_var(--glow-primary)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className="flex items-center gap-2">
                <Plus className="size-4" />
                Post Tasks
              </span>
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "implementer" ? (
          <RecentWishes 
            wishes={sortedWishes} 
            onWishClick={handleWishClick}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        ) : (
          <RequesterView onCreateClick={() => setIsCreateSheetOpen(true)} wishes={wishes} />
        )}
      </main>

      {/* Wish Detail Dialog */}
      <WishDetailDialog
        wish={selectedWish}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        isWalletConnected={isWalletConnected}
        onConnectWallet={() => handleWalletConnect("7xKXtJqF4j9sM2kLpN8vR3wE5uY6hG1cD")}
        onContribute={handleContribute}
        onClaim={handleClaim}
      />

      {/* Create Wish Sheet */}
      <CreateWishSheet
        open={isCreateSheetOpen}
        onOpenChange={setIsCreateSheetOpen}
        onSubmit={handleCreateWish}
      />

      {/* Footer */}
      <footer className="relative z-10 border-t border-glass-border bg-glass-bg/30 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              2026 Wishbox. Built on Solana Blockchain
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="transition-colors hover:text-primary">
                GitHub
              </a>
              <a href="#" className="transition-colors hover:text-primary">
                Twitter
              </a>
              <a href="#" className="transition-colors hover:text-primary">
                Discord
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Requester View Component
function RequesterView({ onCreateClick, wishes }: { onCreateClick: () => void; wishes: Wish[] }) {
  const myTasks = wishes.filter((w) => w.walletAddress === "7xKXtJqF4j9sM2kLpN8vR3wE5uY6hG1cD");

  return (
    <div className="space-y-6">
      {/* Prominent Create Button */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-primary/50 bg-gradient-to-br from-primary/10 via-glass-bg to-accent/10 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5" />
        <div className="relative flex flex-col items-center gap-4 text-center">
          <div className="flex size-20 items-center justify-center rounded-full bg-primary/20 shadow-[0_0_40px_var(--glow-primary)]">
            <Plus className="size-10 text-primary" />
          </div>
          <div>
            <h2 className="mb-2 text-2xl font-bold text-foreground">Post a New Task</h2>
            <p className="text-muted-foreground max-w-md">
              Describe your task, set a bounty, and let the community help you complete it
            </p>
          </div>
          <Button
            onClick={onCreateClick}
            size="lg"
            className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_var(--glow-primary)] transition-all hover:shadow-[0_0_50px_var(--glow-primary)] px-8 py-6 text-lg"
          >
            <Plus className="mr-2 size-5" />
            Create Task
          </Button>
        </div>
      </div>

      {/* My Posted Tasks */}
      <div className="rounded-xl border border-glass-border bg-glass-bg/50 p-6 backdrop-blur-md">
        <h3 className="mb-4 text-lg font-semibold text-foreground flex items-center gap-2">
          <FileText className="size-5 text-primary" />
          My Posted Tasks
        </h3>
        {myTasks.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>{"You haven't posted any tasks yet"}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border border-glass-border bg-secondary/30 p-4"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{task.title}</h4>
                  <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Coins className="size-3 text-primary" />
                      {task.reward} SOL
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3" />
                      {task.contributors} contributed
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        task.status === "open"
                          ? "bg-green-500/20 text-green-400"
                          : task.status === "claimed"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-primary/20 text-primary"
                      }`}
                    >
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </div>
                </div>
                <Clock className="size-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-glass-border bg-glass-bg/50 p-4 text-center backdrop-blur-md">
          <p className="text-2xl font-bold text-primary">{myTasks.length}</p>
          <p className="text-sm text-muted-foreground">Tasks Posted</p>
        </div>
        <div className="rounded-xl border border-glass-border bg-glass-bg/50 p-4 text-center backdrop-blur-md">
          <p className="text-2xl font-bold text-foreground">
            {myTasks.reduce((acc, w) => acc + w.reward, 0).toFixed(1)}
          </p>
          <p className="text-sm text-muted-foreground">Total Bounty</p>
        </div>
        <div className="rounded-xl border border-glass-border bg-glass-bg/50 p-4 text-center backdrop-blur-md">
          <p className="text-2xl font-bold text-accent">
            {myTasks.filter((w) => w.status === "completed").length}
          </p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
      </div>
    </div>
  );
}
