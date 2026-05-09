"use client";

import { useState } from "react";
import { Header } from "@/components/wishbox/header";
import { RecentWishes } from "@/components/wishbox/recent-wishes";
import { WishDetailDialog } from "@/components/wishbox/wish-detail-dialog";
import { CreateWishSheet } from "@/components/wishbox/create-wish-sheet";
import { CreateWishTab } from "@/components/wishbox/create-wish-tab";
import type { Wish } from "@/components/wishbox/wish-card";

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

export default function WishboxPage() {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");

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

      {/* Floating Create Tab */}
      <CreateWishTab onClick={() => setIsCreateSheetOpen(true)} />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Wishbox
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground text-balance">
            Post your tasks, let the global community help you complete them. Support contributions, claims, all operations transparent and traceable on-chain.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-glass-border bg-glass-bg p-4 text-center backdrop-blur-md">
            <p className="text-2xl font-bold text-primary">{wishes.length}</p>
            <p className="text-sm text-muted-foreground">Active Tasks</p>
          </div>
          <div className="rounded-xl border border-glass-border bg-glass-bg p-4 text-center backdrop-blur-md">
            <p className="text-2xl font-bold text-foreground">
              {wishes.reduce((acc, w) => acc + w.reward, 0).toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground">Total SOL Rewards</p>
          </div>
          <div className="rounded-xl border border-glass-border bg-glass-bg p-4 text-center backdrop-blur-md">
            <p className="text-2xl font-bold text-foreground">
              {wishes.reduce((acc, w) => acc + w.contributors, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Contributions</p>
          </div>
          <div className="rounded-xl border border-glass-border bg-glass-bg p-4 text-center backdrop-blur-md">
            <p className="text-2xl font-bold text-accent">
              {wishes.filter((w) => w.status === "completed").length}
            </p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </div>

        {/* Wishes Dashboard */}
        <RecentWishes wishes={wishes} onWishClick={handleWishClick} />
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
