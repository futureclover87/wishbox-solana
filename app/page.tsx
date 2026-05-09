"use client";

import { useState } from "react";
import { Header } from "@/components/wishbox/header";
import { WishForm } from "@/components/wishbox/wish-form";
import { RecentWishes } from "@/components/wishbox/recent-wishes";
import type { Wish } from "@/components/wishbox/wish-card";

// Mock data for recent wishes
const initialWishes: Wish[] = [
  {
    id: "1",
    content: "希望我的 Web3 项目能够成功上线，帮助更多的人进入加密世界！🚀",
    walletAddress: "7xKXtJqF4j9sM2kLpN8vR3wE5uY6hG1cD",
    timestamp: "2 分钟前",
    isAnonymous: false,
  },
  {
    id: "2",
    content: "愿世界和平，所有人都能过上幸福的生活。",
    walletAddress: "9mNbVcXzAsD2fGhJkL1qWeRtYuIoP5pO",
    timestamp: "15 分钟前",
    isAnonymous: true,
  },
  {
    id: "3",
    content: "希望能找到志同道合的合作伙伴，一起构建去中心化的未来！",
    walletAddress: "3pQwErTyUiOpAsDfGhJkLzXcVbNm4rS",
    timestamp: "1 小时前",
    isAnonymous: false,
  },
  {
    id: "4",
    content: "祝愿家人身体健康，万事如意。",
    walletAddress: "5tYuIoPaSdFgHjKlZxCvBnM8qWeRtYu",
    timestamp: "2 小时前",
    isAnonymous: false,
  },
  {
    id: "5",
    content: "希望能学会 Solana 开发，成为一名优秀的区块链工程师！",
    walletAddress: "2wErTyUiOpAsDfGhJkLzXcVbNm9qWeR",
    timestamp: "3 小时前",
    isAnonymous: true,
  },
  {
    id: "6",
    content: "愿所有的梦想都能实现，所有的努力都有回报。",
    walletAddress: "8iOpAsDfGhJkLzXcVbNm1qWeRtYuIoP",
    timestamp: "5 小时前",
    isAnonymous: false,
  },
];

export default function WishboxPage() {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);

  const handleSubmitWish = (content: string, isAnonymous: boolean) => {
    const newWish: Wish = {
      id: Date.now().toString(),
      content,
      walletAddress: "7xKXtJqF4j9sM2kLpN8vR3wE5uY6hG1cD",
      timestamp: "刚刚",
      isAnonymous,
    };
    setWishes([newWish, ...wishes]);
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Top-left gradient orb */}
        <div className="absolute -left-40 -top-40 size-96 rounded-full bg-primary/20 blur-[120px]" />
        {/* Bottom-right gradient orb */}
        <div className="absolute -bottom-40 -right-40 size-96 rounded-full bg-accent/20 blur-[120px]" />
        {/* Center subtle glow */}
        <div className="absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[150px]" />
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Wishbox
            </span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            在 Solana 区块链上永久记录你的愿望，让梦想成为不可篡改的链上印记
          </p>
        </div>

        {/* Wish Form */}
        <div className="mb-16">
          <WishForm onSubmit={handleSubmitWish} />
        </div>

        {/* Recent Wishes Dashboard */}
        <RecentWishes wishes={wishes} />
      </main>

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
