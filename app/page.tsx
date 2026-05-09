"use client";

import { useState } from "react";
import { Header } from "@/components/wishbox/header";
import { RecentWishes } from "@/components/wishbox/recent-wishes";
import { WishDetailDialog } from "@/components/wishbox/wish-detail-dialog";
import { CreateWishSheet } from "@/components/wishbox/create-wish-sheet";
import { CreateWishTab } from "@/components/wishbox/create-wish-tab";
import type { Wish } from "@/components/wishbox/wish-card";

// Mock data - specific tasks
const initialWishes: Wish[] = [
  {
    id: "1",
    title: "帮我写一个 Rust 智能合约的单元测试",
    description: "需要为我的 Solana 智能合约编写完整的单元测试，覆盖所有关键功能路径，包括转账、质押和取款功能。",
    category: "开发",
    reward: 2.5,
    contributors: 3,
    walletAddress: "7xKXtJqF4j9sM2kLpN8vR3wE5uY6hG1cD",
    timestamp: "2 分钟前",
    isAnonymous: false,
    status: "open",
  },
  {
    id: "2",
    title: "将我的白皮书从英文翻译成中文",
    description: "一份 15 页的 DeFi 项目白皮书，需要专业的中文翻译，保持技术术语的准确性。",
    category: "翻译",
    reward: 1.8,
    contributors: 5,
    walletAddress: "9mNbVcXzAsD2fGhJkL1qWeRtYuIoP5pO",
    timestamp: "15 分钟前",
    isAnonymous: true,
    status: "claimed",
  },
  {
    id: "3",
    title: "设计一套 NFT 头像系列的概念图",
    description: "需要设计 5 张不同风格的赛博朋克主题 NFT 头像概念图，用于后续的 AI 生成参考。",
    category: "设计",
    reward: 3.2,
    contributors: 8,
    walletAddress: "3pQwErTyUiOpAsDfGhJkLzXcVbNm4rS",
    timestamp: "1 小时前",
    isAnonymous: false,
    status: "open",
  },
  {
    id: "4",
    title: "整理 100 个 Solana 生态项目的数据",
    description: "收集并整理 Solana 生态中 100 个项目的基本信息，包括名称、官网、Twitter、TVL 等数据。",
    category: "数据",
    reward: 0.8,
    contributors: 2,
    walletAddress: "5tYuIoPaSdFgHjKlZxCvBnM8qWeRtYu",
    timestamp: "2 小时前",
    isAnonymous: false,
    status: "open",
  },
  {
    id: "5",
    title: "撰写一篇关于 Solana MEV 的深度分析文章",
    description: "需要一篇 3000 字左右的技术文章，深入分析 Solana 上的 MEV 现状、主要参与者和未来趋势。",
    category: "写作",
    reward: 4.5,
    contributors: 12,
    walletAddress: "2wErTyUiOpAsDfGhJkLzXcVbNm9qWeR",
    timestamp: "3 小时前",
    isAnonymous: true,
    status: "open",
  },
  {
    id: "6",
    title: "调研 10 个 Solana 钱包的用户体验",
    description: "对比分析 10 个主流 Solana 钱包的功能、UI/UX、安全性等方面，输出一份详细的调研报告。",
    category: "调研",
    reward: 1.2,
    contributors: 4,
    walletAddress: "8iOpAsDfGhJkLzXcVbNm1qWeRtYuIoP",
    timestamp: "5 小时前",
    isAnonymous: false,
    status: "completed",
  },
  {
    id: "7",
    title: "帮我 Debug 一个 Anchor 项目的错误",
    description: "我的 Anchor 项目在调用 CPI 时报错，需要有经验的开发者帮忙排查和修复问题。",
    category: "开发",
    reward: 1.5,
    contributors: 1,
    walletAddress: "4rTyUiOpAsDfGhJkLzXcVbNm2qWeRtY",
    timestamp: "6 小时前",
    isAnonymous: false,
    status: "open",
  },
  {
    id: "8",
    title: "为我的 dApp 设计一个 Landing Page",
    description: "需要一个现代感的 Web3 风格 Landing Page 设计稿，包含 Hero、Features、Tokenomics 等板块。",
    category: "设计",
    reward: 2.0,
    contributors: 6,
    walletAddress: "6uIoPasDfGhJkLzXcVbNm3qWeRtYuIo",
    timestamp: "8 小时前",
    isAnonymous: false,
    status: "open",
  },
  {
    id: "9",
    title: "帮我校对一份 DAO 治理提案",
    description: "需要对一份 DAO 治理提案进行语法和逻辑校对，确保表达清晰、专业。",
    category: "写作",
    reward: 0.5,
    contributors: 0,
    walletAddress: "1pAsDfGhJkLzXcVbNm4qWeRtYuIoPaS",
    timestamp: "10 小时前",
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
      timestamp: "刚刚",
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
            发布你的任务，让全球社区帮你完成。支持加注、认领，所有操作链上透明可追溯。
          </p>
        </div>

        {/* Stats */}
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-glass-border bg-glass-bg p-4 text-center backdrop-blur-md">
            <p className="text-2xl font-bold text-primary">{wishes.length}</p>
            <p className="text-sm text-muted-foreground">活跃任务</p>
          </div>
          <div className="rounded-xl border border-glass-border bg-glass-bg p-4 text-center backdrop-blur-md">
            <p className="text-2xl font-bold text-foreground">
              {wishes.reduce((acc, w) => acc + w.reward, 0).toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground">SOL 总奖励</p>
          </div>
          <div className="rounded-xl border border-glass-border bg-glass-bg p-4 text-center backdrop-blur-md">
            <p className="text-2xl font-bold text-foreground">
              {wishes.reduce((acc, w) => acc + w.contributors, 0)}
            </p>
            <p className="text-sm text-muted-foreground">加注次数</p>
          </div>
          <div className="rounded-xl border border-glass-border bg-glass-bg p-4 text-center backdrop-blur-md">
            <p className="text-2xl font-bold text-accent">
              {wishes.filter((w) => w.status === "completed").length}
            </p>
            <p className="text-sm text-muted-foreground">已完成</p>
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
              © 2026 Wishbox. 构建于 Solana 区块链
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
