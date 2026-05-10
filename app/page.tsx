"use client";

import React, { useState } from "react";
import { Header } from "@/components/wishbox/header";
import { RecentWishes } from "@/components/wishbox/recent-wishes";
import { WishDetailDialog } from "@/components/wishbox/wish-detail-dialog";
import { CreateWishSheet } from "@/components/wishbox/create-wish-sheet";
import { TrendingProjects } from "@/components/wishbox/trending-projects";
import type { Wish } from "@/components/wishbox/wish-card";
import { Plus, Search, Coins, Users, Clock, FileText, HandHeart, Wallet, CheckCircle2, Lock, Send, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

// Demo addresses — pre-seed My Claims and My Funded for demonstration
const DEMO_CLAIMER   = "DEMO_CLAIMER_ADDRESS";
const DEMO_REQUESTER = "DEMO_REQUESTER_ADDRESS";

// Mock data — 30 tasks across varied categories, statuses, and urgencies
// Deadlines are relative to 2026-05-10
const initialWishes: Wish[] = [
  // ── Existing showcase tasks ──────────────────────────────────────────────
  {
    id: "1",
    title: "Write unit tests for my Rust smart contract",
    description: "Need comprehensive unit tests for my Solana smart contract covering all critical paths including transfer, staking, and withdrawal functions.",
    category: "Development",
    bounty: 2.5,
    contributors: 3,
    walletAddress: "7xKXtJqF4j9sM2kLpN8vR3wE5uY6hG1cD",
    timestamp: "2 min ago",
    deadline: "2026-06-09",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "2",
    title: "Translate my whitepaper from English to Spanish",
    description: "A 15-page DeFi project whitepaper needs professional Spanish translation while maintaining technical terminology accuracy.",
    category: "Translation",
    bounty: 1.8,
    contributors: 5,
    walletAddress: "9mNbVcXzAsD2fGhJkL1qWeRtYuIoP5pO",
    builder: "HnKr3zXpM2sF9bLqWeRtYuIoP1asDfGj",
    timestamp: "15 min ago",
    deadline: "2026-05-25",
    isAnonymous: true,
    status: "Submitted",
  },
  {
    id: "3",
    title: "Design 5 cyberpunk NFT avatar concepts",
    description: "Need 5 different cyberpunk-themed NFT avatar concept designs for AI generation reference. High quality artwork required.",
    category: "Design",
    bounty: 3.2,
    contributors: 8,
    walletAddress: DEMO_REQUESTER,
    timestamp: "1 hour ago",
    deadline: "2026-05-20",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "4",
    title: "Compile data on 100 Solana ecosystem projects",
    description: "Collect and organize basic info on 100 Solana projects including name, website, Twitter, TVL, and other key metrics.",
    category: "Data",
    bounty: 0.8,
    contributors: 2,
    walletAddress: "5tYuIoPaSdFgHjKlZxCvBnM8qWeRtYu",
    timestamp: "2 hours ago",
    deadline: "2026-06-09",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "5",
    title: "Write an in-depth analysis on Solana MEV",
    description: "Need a ~3000 word technical article analyzing the current state of MEV on Solana, major players, and future trends.",
    category: "Writing",
    bounty: 5.0,
    contributors: 2,
    walletAddress: "2wErTyUiOpAsDfGhJkLzXcVbNm9qWeR",
    timestamp: "3 hours ago",
    deadline: "2026-05-15",
    isAnonymous: true,
    status: "Open",
  },
  {
    id: "6",
    title: "UX research on 10 Solana wallets",
    description: "Compare and analyze 10 popular Solana wallets for features, UI/UX, security, etc. Deliver a detailed research report.",
    category: "Research",
    bounty: 1.2,
    contributors: 4,
    walletAddress: "8iOpAsDfGhJkLzXcVbNm1qWeRtYuIoP",
    timestamp: "5 hours ago",
    deadline: "2026-04-30",
    isAnonymous: false,
    status: "Settled",
  },
  {
    id: "7",
    title: "Debug CPI error in my Anchor project",
    description: "My Anchor project throws an error when calling CPI. Need an experienced developer to help troubleshoot and fix the issue.",
    category: "Development",
    bounty: 1.5,
    contributors: 1,
    walletAddress: "4rTyUiOpAsDfGhJkLzXcVbNm2qWeRtY",
    timestamp: "6 hours ago",
    deadline: "2026-05-12",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "8",
    title: "Design a landing page for my dApp",
    description: "Need a modern Web3-style landing page design including Hero, Features, Tokenomics, and other sections.",
    category: "Design",
    bounty: 1.0,
    contributors: 19,
    walletAddress: DEMO_REQUESTER,
    timestamp: "8 hours ago",
    deadline: "2026-06-09",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "9",
    title: "Proofread a DAO governance proposal",
    description: "Need grammar and logic proofreading for a DAO governance proposal to ensure clear and professional expression.",
    category: "Writing",
    bounty: 0.5,
    contributors: 1,
    walletAddress: "1pAsDfGhJkLzXcVbNm4qWeRtYuIoPaS",
    timestamp: "10 hours ago",
    deadline: "2026-05-17",
    isAnonymous: true,
    status: "Open",
  },

  // ── New tasks ────────────────────────────────────────────────────────────
  {
    id: "10",
    title: "Audit smart contract for reentrancy vulnerabilities",
    description: "Full security audit of a Solana token vesting contract — check for reentrancy, integer overflow, and unauthorized signer access.",
    category: "Security",
    bounty: 4.0,
    contributors: 6,
    walletAddress: "BkR7mPaT3nWsX1eVqLzYcDfGhJuIoN2p",
    timestamp: "12 hours ago",
    deadline: "2026-05-14",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "11",
    title: "Design tokenomics model for a new DeFi protocol",
    description: "Create a detailed tokenomics model covering emission schedule, staking incentives, governance allocation, and treasury management.",
    category: "Research",
    bounty: 2.0,
    contributors: 3,
    walletAddress: "CvN8sQrLpM4xT2bFgHjKzXeWaYuIoDf1",
    timestamp: "14 hours ago",
    deadline: "2026-06-09",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "12",
    title: "Build a Discord bot for DAO governance notifications",
    description: "Bot should listen to on-chain proposal events and post formatted summaries in a Discord channel with vote deadlines and links.",
    category: "Development",
    bounty: 1.8,
    contributors: 7,
    walletAddress: "DqM5tXwP9nVrS3aFhJkLzYcGbNuIeO6p",
    timestamp: "16 hours ago",
    deadline: "2026-05-28",
    isAnonymous: true,
    status: "Open",
  },
  {
    id: "13",
    title: "Translate Solana core docs sections to Mandarin",
    description: "Translate the Program Derived Addresses and Cross-Program Invocations sections of the Solana developer docs into Mandarin Chinese.",
    category: "Translation",
    bounty: 0.8,
    contributors: 2,
    walletAddress: "ErL6uYwQ1mWsT4bGiJkNzXcFhPaVoDe7",
    timestamp: "18 hours ago",
    deadline: "2026-07-10",
    isAnonymous: false,
    status: "Open",
  },
  {
    // DEMO claimed — In Progress
    id: "14",
    title: "Write a beginner's guide to Solana staking",
    description: "Comprehensive beginner guide covering what staking is, how to choose validators, risks, and step-by-step instructions with screenshots.",
    category: "Writing",
    bounty: 1.5,
    contributors: 4,
    walletAddress: "FsN7vZxR2nYtU5cHjKoMzAeGbWaPiDf8",
    builder: DEMO_CLAIMER,
    timestamp: "20 hours ago",
    deadline: "2026-05-30",
    isAnonymous: false,
    status: "Accepted",
  },
  {
    id: "15",
    title: "Design animated sticker pack for Telegram community",
    description: "Create 12 unique animated stickers for a Solana project community Telegram group. Delivery in Webp and TGS formats.",
    category: "Design",
    bounty: 2.5,
    contributors: 5,
    walletAddress: "GtO8wAxS3oZuV6dIkLpNzBeHcXbQjEg9",
    timestamp: "22 hours ago",
    deadline: "2026-06-15",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "16",
    title: "Research top 20 Solana DeFi yield strategies",
    description: "Analyze and compare the top 20 yield strategies on Solana DeFi protocols. Include APY, risks, TVL, and sustainability assessment.",
    category: "Research",
    bounty: 1.2,
    contributors: 3,
    walletAddress: "HuP9xByT4pAuW7eJlMqOzCfIdYcRkFh1",
    timestamp: "1 day ago",
    deadline: "2026-06-01",
    isAnonymous: true,
    status: "Open",
  },
  {
    id: "17",
    title: "Plan a Twitter thread strategy for NFT launch",
    description: "Create a 4-week Twitter content calendar and 3 sample threads targeting collectors, traders, and builders in the Solana NFT space.",
    category: "Marketing",
    bounty: 0.6,
    contributors: 2,
    walletAddress: "IvQ1yCzU5qBvX8fKmNrPzDgJeZdSlGi2",
    timestamp: "1 day ago",
    deadline: "2026-05-20",
    isAnonymous: false,
    status: "Open",
  },
  {
    // DEMO claimed — In Progress
    id: "18",
    title: "Fix responsive layout bugs in React dApp frontend",
    description: "Multiple responsive breakpoint issues across mobile and tablet. Requires Tailwind CSS fixes and cross-browser QA. ~20 bug tickets.",
    category: "Development",
    bounty: 2.0,
    contributors: 9,
    walletAddress: "JwR2zDaV6rCwY9gLnOsPzEhKfAeMtHj3",
    builder: DEMO_CLAIMER,
    timestamp: "1 day ago",
    deadline: "2026-05-22",
    isAnonymous: false,
    status: "Accepted",
  },
  {
    id: "19",
    title: "Write API documentation for an on-chain program",
    description: "Produce structured API docs covering all instructions, accounts, errors, and example code snippets for a Solana lending protocol.",
    category: "Writing",
    bounty: 1.5,
    contributors: 2,
    walletAddress: "KxS3aEbW7sDxZ1hMoTqPzFiLgBfNuIk4",
    timestamp: "1 day ago",
    deadline: "2026-06-09",
    isAnonymous: true,
    status: "Open",
  },
  {
    id: "20",
    title: "Compile list of active Solana ecosystem grant programs",
    description: "Identify and document all active grant programs in the Solana ecosystem — Solana Foundation, ecosystem DAOs, and protocol-specific grants.",
    category: "Data",
    bounty: 0.5,
    contributors: 1,
    walletAddress: "LyT4bFcX8tEyA2iNpUrQzGjMhCgOvJl5",
    timestamp: "2 days ago",
    deadline: "2026-07-10",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "21",
    title: "Design banner set for NFT collection launch event",
    description: "Create 6 promotional banners in multiple sizes (Twitter, Discord, website hero) for an upcoming NFT collection mint event.",
    category: "Design",
    bounty: 1.8,
    contributors: 6,
    walletAddress: DEMO_REQUESTER,
    timestamp: "2 days ago",
    deadline: "2026-05-18",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "22",
    title: "Build a CLI tool for batch SPL token management",
    description: "Rust-based CLI for bulk operations: create, mint, freeze, burn, and transfer SPL tokens across multiple wallets via CSV input.",
    category: "Development",
    bounty: 3.5,
    contributors: 4,
    walletAddress: "NaV6dHeZ1vGaC4kPqWtSzIlOjEiQxLn7",
    timestamp: "2 days ago",
    deadline: "2026-06-20",
    isAnonymous: true,
    status: "Open",
  },
  {
    id: "23",
    title: "Proofread and edit VC pitch deck for Web3 startup",
    description: "15-slide pitch deck needs editing for clarity, grammar, and persuasive tone. Industry knowledge of DeFi and token models helpful.",
    category: "Writing",
    bounty: 0.8,
    contributors: 1,
    walletAddress: "ObW7eIfA2wHbD5lQrXuTzJmPkFjRyMo8",
    timestamp: "2 days ago",
    deadline: "2026-05-16",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "24",
    title: "Translate project blog posts to Japanese and Korean",
    description: "Translate 3 existing blog posts (total ~5,000 words) into both Japanese and Korean for community outreach in East Asian markets.",
    category: "Translation",
    bounty: 1.2,
    contributors: 3,
    walletAddress: "PcX8fJgB3xIcE6mRsYvUzKnQlGkStNp9",
    builder: "QdY9gKhC4yJdF7nStZwVaLoRmHlTuOq1",
    timestamp: "3 days ago",
    deadline: "2026-06-05",
    isAnonymous: false,
    status: "Accepted",
  },
  {
    id: "25",
    title: "Create educational video script on DeFi basics",
    description: "Write a 10-minute YouTube explainer script covering liquidity pools, AMMs, yield farming, and impermanent loss — aimed at beginners.",
    category: "Writing",
    bounty: 0.9,
    contributors: 2,
    walletAddress: "ReZ1hLiD5zKeFa8oTuAwMpSsNjIvPbr2",
    timestamp: "3 days ago",
    deadline: "2026-06-01",
    isAnonymous: true,
    status: "Open",
  },
  {
    id: "26",
    title: "Audit Anchor program PDA derivation and signer authority",
    description: "Review a staking program's PDA seeds, bump storage, and signer checks for potential privilege escalation or account substitution attacks.",
    category: "Security",
    bounty: 3.0,
    contributors: 5,
    walletAddress: "SfA2iMjE6aLfGb9pUvBxNqTtOkJwQcs3",
    timestamp: "3 days ago",
    deadline: "2026-05-14",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "27",
    title: "Design 3D avatar concepts for metaverse integration",
    description: "Concept designs for 4 unique 3D avatars suitable for Solana metaverse platforms. Provide reference sheets with front, side, and back views.",
    category: "Design",
    bounty: 4.0,
    contributors: 7,
    walletAddress: "TgB3jNkF7bMgHc1qVwCyOpUuPlKxRdt4",
    timestamp: "4 days ago",
    deadline: "2026-07-01",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "28",
    title: "Research institutional adoption trends on Solana",
    description: "Survey recent institutional investments, custody solutions, and enterprise deployments on Solana. Deliver a 2,000-word analytical report.",
    category: "Research",
    bounty: 1.5,
    contributors: 2,
    walletAddress: "UhC4kOlG8cNhId2rWxDzPqVvQmLySetF",
    timestamp: "4 days ago",
    deadline: "2026-06-30",
    isAnonymous: true,
    status: "Open",
  },
  {
    // DEMO completed — Delivered (shows in My Claims as "Completed")
    id: "29",
    title: "Build a token swap UI component with wallet integration",
    description: "React component for token swaps via Jupiter aggregator — token selector, slippage control, price impact display, and wallet sign flow.",
    category: "Development",
    bounty: 2.5,
    contributors: 12,
    walletAddress: "ViD5lPmH9dOiJe3sXyEaPrWwRnMzTfuG",
    builder: DEMO_CLAIMER,
    timestamp: "5 days ago",
    deadline: "2026-04-15",
    isAnonymous: false,
    status: "Settled",
  },
  {
    id: "30",
    title: "Compile validator performance benchmarks report",
    description: "Gather and present block production rates, skip rates, and hardware specs for the top 50 Solana validators over the past 3 months.",
    category: "Data",
    bounty: 0.7,
    contributors: 1,
    walletAddress: "WjE6mQnI1ePjKf4tYzFbQsXxSoNaUgvH",
    timestamp: "5 days ago",
    deadline: "2026-07-10",
    isAnonymous: false,
    status: "Open",
  },

  // ── My Claims demo tasks — 3 distinct statuses ────────────────────────────
  {
    // DEMO claimed — In Progress (just started)
    id: "31",
    title: "Implement a real-time Solana validator monitoring dashboard",
    description: "React dashboard showing live validator stats: uptime, skip rate, APY, and stake distribution. Uses Solana RPC and auto-refreshes every 30s.",
    category: "Development",
    bounty: 3.0,
    contributors: 8,
    walletAddress: "XaF7nPqT2oVrS5bGkLmNzYcEhJiDuKw1",
    builder: DEMO_CLAIMER,
    timestamp: "3 days ago",
    deadline: "2026-06-01",
    isAnonymous: false,
    status: "Accepted",
  },
  {
    // DEMO claimed — In Progress (near deadline, urgent)
    id: "32",
    title: "Design a dark-mode icon set for a DeFi protocol",
    description: "20 SVG icons for core DeFi concepts: swap, pool, stake, vault, governance, etc. Deliver in 24×24 and 48×48 sizes with a Figma source file.",
    category: "Design",
    bounty: 1.8,
    contributors: 5,
    walletAddress: "YbG8oQrU3pWsT6cHlMnOzZdFiKjEvLx2",
    builder: DEMO_CLAIMER,
    timestamp: "6 days ago",
    deadline: "2026-05-13",
    isAnonymous: true,
    status: "Accepted",
  },
  {
    // DEMO completed — Delivered & paid
    id: "33",
    title: "Record a 5-minute intro to Solana wallets video",
    description: "Short tutorial video covering wallet creation, funding, and first transaction on Solana. Deliverable: MP4 + captions + thumbnail.",
    category: "Writing",
    bounty: 1.2,
    contributors: 3,
    walletAddress: "ZcH9pRsV4qXtU7dImNoAaEgJlLfMwCy3",
    builder: DEMO_CLAIMER,
    timestamp: "12 days ago",
    deadline: "2026-04-28",
    isAnonymous: false,
    status: "Settled",
  },

  // ── My Funded demo tasks — open / claimed / completed ────────────────────
  {
    // DEMO requester — open, receiving applicants
    id: "34",
    title: "Write a comprehensive Anchor framework tutorial series",
    description: "A 4-part blog series covering Anchor setup, account modeling, CPIs, and testing. Each part ~1,500 words with working code examples.",
    category: "Writing",
    bounty: 4.5,
    contributors: 11,
    walletAddress: DEMO_REQUESTER,
    timestamp: "1 day ago",
    deadline: "2026-06-20",
    isAnonymous: false,
    status: "Open",
  },
  {
    // DEMO requester — claimed, someone is working on it
    id: "35",
    title: "Build a Solana wallet connect component for React",
    description: "Reusable React component supporting Phantom, Backpack, and Solflare with auto-reconnect and network switching. TypeScript + full test coverage.",
    category: "Development",
    bounty: 2.8,
    contributors: 14,
    walletAddress: DEMO_REQUESTER,
    builder: "AdB1cEfG2hIjK3lMnO4pQrS5tUvW6xYz",
    timestamp: "4 days ago",
    deadline: "2026-05-26",
    isAnonymous: false,
    status: "Accepted",
  },
  {
    // DEMO requester — completed, successfully delivered
    id: "36",
    title: "Create a Solana ecosystem overview slide deck",
    description: "30-slide presentation covering Solana architecture, ecosystem projects, DeFi TVL, NFT volumes, and developer metrics. Suitable for investor pitches.",
    category: "Research",
    bounty: 1.6,
    contributors: 6,
    walletAddress: DEMO_REQUESTER,
    builder: "BeC2dFgH3iJkL4mNpO5qRsT6uVwX7yZa",
    timestamp: "10 days ago",
    deadline: "2026-04-20",
    isAnonymous: false,
    status: "Settled",
  },
];

type TabType = "implementer" | "requester" | "claims" | "funded";
type SortType = "bounty" | "time" | "contributors";

export default function WishboxPage() {
  const [wishes, setWishes] = useState<Wish[]>(initialWishes);
  const [selectedWish, setSelectedWish] = useState<Wish | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("implementer");
  const [sortBy, setSortBy] = useState<SortType>("bounty");
  const [userRole, setUserRole] = useState<"implementer" | "requester">("implementer");

  // Real wallet connection
  const { publicKey, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const walletAddress = publicKey?.toBase58() || "";

  const handleWishClick = (wish: Wish) => {
    setUserRole("implementer");
    setSelectedWish(wish);
    setIsDetailOpen(true);
  };

  const handleFundedWishClick = (wish: Wish) => {
    setUserRole("requester");
    setSelectedWish(wish);
    setIsDetailOpen(true);
  };

  const handleCreateWish = (data: {
    title: string;
    description: string;
    category: string;
    bounty: number;
    isAnonymous: boolean;
    deadline: string;
  }) => {
    const newWish: Wish = {
      id: Date.now().toString(),
      ...data,
      contributors: 1,
      walletAddress: walletAddress || "Anonymous",
      creatorAddress: walletAddress || undefined,
      timestamp: "Just now",
      status: "Open",
    };
    setWishes([newWish, ...wishes]);
  };

  const handleContribute = (wishId: string, amount: number) => {
    setWishes(
      wishes.map((w) =>
        w.id === wishId
          ? { ...w, bounty: w.bounty + amount, contributors: w.contributors + 1 }
          : w
      )
    );
    setSelectedWish((prev) =>
      prev && prev.id === wishId
        ? { ...prev, bounty: prev.bounty + amount, contributors: prev.contributors + 1 }
        : prev
    );
  };

  const handleClaim = (wishId: string) => {
    const builderAddress = publicKey?.toBase58() || "anonymous";
    setWishes(wishes.map((w) =>
      w.id === wishId ? { ...w, status: "Accepted", builder: builderAddress } : w
    ));
    setSelectedWish((prev) =>
      prev && prev.id === wishId
        ? { ...prev, status: "Accepted", builder: builderAddress }
        : prev
    );
  };

  const handleConnectWallet = () => {
    setVisible(true);
  };

  // Sort wishes based on selected criteria
  const sortedWishes = [...wishes].sort((a, b) => {
    switch (sortBy) {
      case "bounty":
        return b.bounty - a.bounty;
      case "contributors":
        return b.contributors - a.contributors;
      case "time":
      default:
        return 0;
    }
  });

  // ── Platform-wide stats ───────────────────────────────────────────────────
  // Baseline = 6-month historical data minus live tasks, so totals land on
  // round targets: active≈200, activeBounty≈3800 SOL, claimed≈400, delivered≈310
  const BASE = { active: 176, bounty: 3768.5, claimed: 396, delivered: 308 };
  const liveActive    = wishes.filter((w) => w.status === "Open").length;
  const liveBounty    = wishes.filter((w) => w.status === "Open").reduce((s, w) => s + w.bounty, 0);
  const liveClaimed   = wishes.filter((w) => w.status === "Accepted").length;
  const liveDelivered = wishes.filter((w) => w.status === "Settled").length;

  const stats = {
    active:    BASE.active    + liveActive,
    bounty:    BASE.bounty    + liveBounty,
    claimed:   BASE.claimed   + liveClaimed,
    delivered: BASE.delivered + liveDelivered,
  };

  // DEMO tasks always show regardless of wallet connection (for demo purposes).
  // Real-wallet tasks only appear when connected.
  const myClaimedTasks = wishes.filter(
    (w) => w.builder === DEMO_CLAIMER || (connected && w.builder === walletAddress)
  );
  // Count in-progress as Accepted OR Submitted

  const myFundedTasks = wishes.filter(
    (w) => w.walletAddress === DEMO_REQUESTER || (connected && w.walletAddress === walletAddress)
  );

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
        myClaimedCount={myClaimedTasks.length}
        myClaimedInProgress={myClaimedTasks.filter((w) => w.status === "Accepted" || w.status === "Submitted").length}
        myClaimedEarned={myClaimedTasks.filter((w) => w.status === "Settled").reduce((s, w) => s + w.bounty, 0)}
        myFundedCount={myFundedTasks.length}
        myFundedActive={myFundedTasks.filter((w) => w.status === "Open").length}
        myFundedBounty={myFundedTasks.filter((w) => w.status === "Open").reduce((s, w) => s + w.bounty, 0)}
        onGoToClaims={() => { setUserRole("implementer"); setActiveTab("claims"); }}
        onGoToFunded={() => { setUserRole("requester"); setActiveTab("funded"); }}
      />

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-6">
        {/* ── Platform Stats Banner ──────────────────────────────────────── */}
        <div className="mb-4 overflow-hidden rounded-xl border border-glass-border bg-glass-bg/50 backdrop-blur-md">
          <div className="grid grid-cols-4 divide-x divide-glass-border">
            <StatCell
              icon={<FileText className="size-4 text-primary" />}
              value={stats.active.toLocaleString()}
              label="Active Tasks"
              accent="text-primary"
            />
            <StatCell
              icon={<Coins className="size-4 text-yellow-400" />}
              value={`${stats.bounty.toLocaleString(undefined, { maximumFractionDigits: 0 })} SOL`}
              label="Active Bounty"
              accent="text-yellow-400"
            />
            <StatCell
              icon={<HandHeart className="size-4 text-accent" />}
              value={stats.claimed.toLocaleString()}
              label="Tasks Claimed"
              accent="text-accent"
            />
            <StatCell
              icon={<CheckCircle2 className="size-4 text-green-400" />}
              value={stats.delivered.toLocaleString()}
              label="Delivered"
              accent="text-green-400"
            />
          </div>
        </div>

        {/* Trending Projects - Compact */}
        <div className="mb-4">
          <TrendingProjects wishes={wishes} onWishClick={handleWishClick} />
        </div>

        {/* ── Navigation bar ────────────────────────────────────────────── */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

          {/* Role toggle — primary mode selector; drives the tab set */}
          <div className="flex rounded-xl border border-glass-border bg-glass-bg/50 p-1 backdrop-blur-md">
            <button
              onClick={() => { setUserRole("implementer"); setActiveTab("implementer"); }}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                userRole === "implementer"
                  ? "bg-accent text-accent-foreground shadow-[0_0_15px_var(--glow-accent)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <HandHeart className="size-4" />
              Claim Tasks
            </button>
            <button
              onClick={() => { setUserRole("requester"); setActiveTab("requester"); }}
              className={`flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                userRole === "requester"
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_var(--glow-primary)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Coins className="size-4" />
              Fund Tasks
            </button>
          </div>

          {/* Context tabs — set changes based on active role */}
          <div className="flex rounded-xl border border-glass-border bg-glass-bg/50 p-1 backdrop-blur-md">
            {userRole === "implementer" ? (
              <>
                {/* Claim Tasks mode: Find → My Claims → Post */}
                <button
                  onClick={() => setActiveTab("implementer")}
                  className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                    activeTab === "implementer"
                      ? "bg-secondary text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Search className="size-3.5" />
                    Find Tasks
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("claims")}
                  className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                    activeTab === "claims"
                      ? "bg-secondary text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <HandHeart className="size-3.5" />
                    My Claims
                    {myClaimedTasks.length > 0 && (
                      <span className="flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                        {myClaimedTasks.length}
                      </span>
                    )}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("requester")}
                  className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                    activeTab === "requester"
                      ? "bg-secondary text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Plus className="size-3.5" />
                    Post Tasks
                  </span>
                </button>
              </>
            ) : (
              <>
                {/* Fund Tasks mode: Post → Find → My Funded */}
                <button
                  onClick={() => setActiveTab("requester")}
                  className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                    activeTab === "requester"
                      ? "bg-secondary text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Plus className="size-3.5" />
                    Post Tasks
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("implementer")}
                  className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                    activeTab === "implementer"
                      ? "bg-secondary text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Search className="size-3.5" />
                    Find Tasks
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("funded")}
                  className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${
                    activeTab === "funded"
                      ? "bg-secondary text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Coins className="size-3.5" />
                    My Funded
                    {myFundedTasks.length > 0 && (
                      <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {myFundedTasks.length}
                      </span>
                    )}
                  </span>
                </button>
              </>
            )}
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
        ) : activeTab === "claims" ? (
          <ClaimedTasksView
            wishes={myClaimedTasks}
            isConnected={connected || myClaimedTasks.length > 0}
            onConnectWallet={handleConnectWallet}
            onWishClick={handleWishClick}
          />
        ) : activeTab === "funded" ? (
          <FundedTasksView
            wishes={myFundedTasks}
            isConnected={connected || myFundedTasks.length > 0}
            onConnectWallet={handleConnectWallet}
            onWishClick={handleFundedWishClick}
            onPostClick={() => setIsCreateSheetOpen(true)}
          />
        ) : (
          <RequesterView 
            onCreateClick={() => setIsCreateSheetOpen(true)} 
            wishes={wishes} 
            walletAddress={walletAddress}
          />
        )}
      </main>

      {/* Wish Detail Dialog */}
      <WishDetailDialog
        wish={selectedWish}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        isWalletConnected={connected}
        onConnectWallet={handleConnectWallet}
        onContribute={handleContribute}
        onClaim={handleClaim}
        userRole={userRole}
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

// ─── Stat Cell ──────────────────────────────────────────────────────────────
function StatCell({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary/50">
        {icon}
      </div>
      <div>
        <p className={`font-mono text-xl font-bold leading-tight ${accent}`}>{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      {/* Live pulse dot */}
      <span className="ml-auto flex size-1.5 rounded-full bg-green-400 shadow-[0_0_6px_theme(colors.green.400)]" />
    </div>
  );
}

// ─── My Claims View ────────────────────────────────────────────────────────────
function ClaimedTasksView({
  wishes,
  isConnected,
  onConnectWallet,
  onWishClick,
}: {
  wishes: Wish[];
  isConnected: boolean;
  onConnectWallet: () => void;
  onWishClick: (wish: Wish) => void;
}) {
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [submitUrl, setSubmitUrl] = useState("");
  const [submitNote, setSubmitNote] = useState("");
  if (!isConnected) {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-16 text-center backdrop-blur-md">
        <Wallet className="mx-auto mb-4 size-12 text-primary" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">Connect Your Wallet</h3>
        <p className="mb-6 text-sm text-muted-foreground">Connect your wallet to see tasks you&apos;ve claimed</p>
        <Button onClick={onConnectWallet} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Wallet className="mr-2 size-4" />
          Connect Wallet
        </Button>
      </div>
    );
  }

  const inProgress = wishes.filter((w) => w.status === "Accepted" || w.status === "Submitted");
  const completed   = wishes.filter((w) => w.status === "Settled");
  const totalEarned = completed.reduce((acc, w) => acc + w.bounty, 0);

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-glass-border bg-glass-bg/50 p-4 text-center backdrop-blur-md">
          <p className="text-2xl font-bold text-accent">{wishes.length}</p>
          <p className="text-sm text-muted-foreground">Total Claimed</p>
        </div>
        <div className="rounded-xl border border-glass-border bg-glass-bg/50 p-4 text-center backdrop-blur-md">
          <p className="text-2xl font-bold text-yellow-400">{inProgress.length}</p>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>
        <div className="rounded-xl border border-glass-border bg-glass-bg/50 p-4 text-center backdrop-blur-md">
          <p className="text-2xl font-bold text-green-400">{totalEarned.toFixed(1)}</p>
          <p className="text-sm text-muted-foreground">SOL Earned</p>
        </div>
      </div>

      {wishes.length === 0 ? (
        <div className="rounded-xl border border-glass-border bg-glass-bg/50 p-16 text-center backdrop-blur-md">
          <HandHeart className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold text-foreground">No Claimed Tasks Yet</h3>
          <p className="text-sm text-muted-foreground">
            Browse available tasks and claim one to start earning SOL
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <HandHeart className="size-5 text-accent" />
            My Work
          </h3>

          {wishes.map((wish) => (
            <div key={wish.id} className="group rounded-xl border border-glass-border bg-glass-bg/50 p-5 backdrop-blur-md transition-all hover:border-accent/40">
              {/* Card row */}
              <div className="flex items-start gap-4">
                {/* Status indicator */}
                <div className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full ${
                  wish.status === "Settled" ? "bg-green-500/20" : wish.status === "Submitted" ? "bg-blue-500/20" : "bg-yellow-500/20"
                }`}>
                  {wish.status === "Settled" ? (
                    <CheckCircle2 className="size-5 text-green-400" />
                  ) : wish.status === "Submitted" ? (
                    <Send className="size-5 text-blue-400" />
                  ) : (
                    <HandHeart className="size-5 text-yellow-400" />
                  )}
                </div>

                {/* Task info */}
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent text-xs">
                      {wish.category}
                    </Badge>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      wish.status === "Settled"
                        ? "bg-green-500/20 text-green-400"
                        : wish.status === "Submitted"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {wish.status === "Settled" ? "Settled" : wish.status === "Submitted" ? "Submitted" : "In Progress"}
                    </span>
                  </div>

                  <h4 className="mb-2 font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                    {wish.title}
                  </h4>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 font-mono font-medium text-primary">
                      <Coins className="size-3.5" />
                      {wish.bounty} SOL
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" />
                      {wish.contributors} contributors
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {wish.timestamp}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onWishClick(wish)}
                    className="border-glass-border bg-secondary/30 text-muted-foreground hover:border-accent/50 hover:text-accent"
                  >
                    View
                  </Button>
                  {wish.status === "Accepted" && submittingId !== wish.id && (
                    <Button
                      size="sm"
                      onClick={() => { setSubmittingId(wish.id); setSubmitUrl(""); setSubmitNote(""); }}
                      className="bg-accent text-accent-foreground hover:bg-accent/90 whitespace-nowrap"
                      style={{ boxShadow: "0 0 12px var(--glow-accent)" }}
                    >
                      <Send className="mr-1.5 size-3.5" />
                      Submit Work
                    </Button>
                  )}
                  {wish.status === "Settled" && (
                    <div className="flex items-center gap-1 rounded-md bg-green-500/10 px-2 py-1 text-xs text-green-400">
                      <Lock className="size-3" />
                      Paid
                    </div>
                  )}
                </div>
              </div>

              {/* Inline submit form — expands below the card row */}
              {wish.status === "Accepted" && submittingId === wish.id && (
              <div className="mt-4 space-y-3 rounded-xl border border-accent/30 bg-accent/5 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-accent">
                    <Send className="size-4" />
                    Submit Your Work
                  </h4>
                  <button
                    onClick={() => setSubmittingId(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="size-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Submission Link</label>
                  <Input
                    placeholder="https://github.com/your-repo / Google Drive / etc."
                    value={submitUrl}
                    onChange={(e) => setSubmitUrl(e.target.value)}
                    className="border-glass-border bg-secondary/50 text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-foreground">Work Summary</label>
                  <Textarea
                    placeholder="Briefly describe what you completed and any notes for the task creator..."
                    value={submitNote}
                    onChange={(e) => setSubmitNote(e.target.value)}
                    className="min-h-[80px] resize-none border-glass-border bg-secondary/50 text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmittingId(null)}
                    className="border-glass-border bg-secondary/30 text-muted-foreground"
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    disabled={!submitUrl.trim() && !submitNote.trim()}
                    onClick={() => {
                      onWishClick(wish); // Open detail dialog for Submit Delivery flow
                      setSubmittingId(null);
                      setSubmitUrl("");
                      setSubmitNote("");
                    }}
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                    style={{ boxShadow: "0 0 15px var(--glow-accent)" }}
                  >
                    <Send className="mr-2 size-4" />
                    Submit &amp; Mark as Complete
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Submitting will mark the task as complete and notify the task creator for review.
                </p>
              </div>
            )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── My Funded Tasks View ────────────────────────────────────────────────────
function FundedTasksView({
  wishes,
  isConnected,
  onConnectWallet,
  onWishClick,
  onPostClick,
}: {
  wishes: Wish[];
  isConnected: boolean;
  onConnectWallet: () => void;
  onWishClick: (wish: Wish) => void;
  onPostClick: () => void;
}) {
  if (!isConnected) {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-16 text-center backdrop-blur-md">
        <Wallet className="mx-auto mb-4 size-12 text-primary" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">Connect Your Wallet</h3>
        <p className="mb-6 text-sm text-muted-foreground">Connect your wallet to see tasks you&apos;ve funded</p>
        <Button onClick={onConnectWallet} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Wallet className="mr-2 size-4" />
          Connect Wallet
        </Button>
      </div>
    );
  }

  const activeCount    = wishes.filter((w) => w.status === "Open").length;
  const claimedCount   = wishes.filter((w) => w.status === "Accepted").length;
  const completedCount = wishes.filter((w) => w.status === "Settled").length;
  const totalBounty    = wishes.reduce((s, w) => s + w.bounty, 0);

  const statusStyle = (status: Wish["status"]) =>
    status === "Open"      ? "bg-green-500/20 text-green-400" :
    status === "Accepted"  ? "bg-yellow-500/20 text-yellow-400" :
    status === "Submitted" ? "bg-blue-500/20 text-blue-400" :
                             "bg-primary/20 text-primary";
  const statusLabel = (status: Wish["status"]) =>
    status === "Open" ? "Open" : status === "Accepted" ? "In Progress" : status === "Submitted" ? "Submitted" : "Settled";

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl border border-glass-border bg-glass-bg/50 p-4 text-center backdrop-blur-md">
          <p className="text-2xl font-bold text-primary">{wishes.length}</p>
          <p className="text-sm text-muted-foreground">Tasks Posted</p>
        </div>
        <div className="rounded-xl border border-glass-border bg-glass-bg/50 p-4 text-center backdrop-blur-md">
          <p className="text-2xl font-bold text-green-400">{activeCount}</p>
          <p className="text-sm text-muted-foreground">Active</p>
        </div>
        <div className="rounded-xl border border-glass-border bg-glass-bg/50 p-4 text-center backdrop-blur-md">
          <p className="text-2xl font-bold text-yellow-400">{claimedCount}</p>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>
        <div className="rounded-xl border border-glass-border bg-glass-bg/50 p-4 text-center backdrop-blur-md">
          <p className="font-mono text-2xl font-bold text-accent">{totalBounty.toFixed(1)}</p>
          <p className="text-sm text-muted-foreground">SOL Funded</p>
        </div>
      </div>

      {wishes.length === 0 ? (
        <div className="rounded-xl border border-glass-border bg-glass-bg/50 p-16 text-center backdrop-blur-md">
          <Coins className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold text-foreground">No Funded Tasks Yet</h3>
          <p className="mb-6 text-sm text-muted-foreground">Post a task with a bounty to attract skilled contributors</p>
          <Button onClick={onPostClick} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 size-4" />
            Post Your First Task
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Coins className="size-5 text-primary" />
              My Funded Tasks
            </h3>
            <Button size="sm" onClick={onPostClick}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              style={{ boxShadow: "0 0 12px var(--glow-primary)" }}
            >
              <Plus className="mr-1.5 size-3.5" />
              Post New Task
            </Button>
          </div>

          {wishes.map((wish) => (
            <div key={wish.id}
              className="group flex cursor-pointer items-start gap-4 rounded-xl border border-glass-border bg-glass-bg/50 p-5 backdrop-blur-md transition-all hover:border-primary/40"
              onClick={() => onWishClick(wish)}
            >
              {/* Status indicator */}
              <div className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full ${
                wish.status === "Settled"   ? "bg-primary/20" :
                wish.status === "Submitted" ? "bg-blue-500/20" :
                wish.status === "Accepted"  ? "bg-yellow-500/20" : "bg-green-500/20"
              }`}>
                {wish.status === "Settled"   ? <CheckCircle2 className="size-5 text-primary" /> :
                 wish.status === "Submitted" ? <Send className="size-5 text-blue-400" /> :
                 wish.status === "Accepted"  ? <Users className="size-5 text-yellow-400" /> :
                                              <FileText className="size-5 text-green-400" />}
              </div>

              {/* Task info */}
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle(wish.status)}`}>
                    {statusLabel(wish.status)}
                  </span>
                  <span className="rounded-full border border-glass-border bg-secondary/30 px-2 py-0.5 text-xs text-muted-foreground">
                    {wish.category}
                  </span>
                </div>
                <h4 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {wish.title}
                </h4>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1 font-mono font-medium text-primary">
                    <Coins className="size-3.5" />
                    {wish.bounty} SOL
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="size-3.5" />
                    {wish.contributors} contributors
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5" />
                    {wish.timestamp}
                  </span>
                </div>
              </div>

              {/* Delivery badge */}
              {wish.status === "Settled" && (
                <div className="flex shrink-0 items-center gap-1 rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <CheckCircle2 className="size-3" />
                  Settled
                </div>
              )}
            </div>
          ))}

          <p className="text-center text-xs text-muted-foreground pt-2">
            {completedCount} of {wishes.length} tasks delivered
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Requester View Component ───────────────────────────────────────────────
function RequesterView({ 
  onCreateClick, 
  wishes,
  walletAddress 
}: { 
  onCreateClick: () => void; 
  wishes: Wish[];
  walletAddress: string;
}) {
  const myTasks = wishes.filter((w) => w.walletAddress === walletAddress);

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
                      {task.bounty} SOL
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3" />
                      {task.contributors} contributed
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        task.status === "Open"
                          ? "bg-green-500/20 text-green-400"
                          : task.status === "Accepted"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : task.status === "Submitted"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-primary/20 text-primary"
                      }`}
                    >
                      {task.status}
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
            {myTasks.reduce((acc, w) => acc + w.bounty, 0).toFixed(1)}
          </p>
          <p className="text-sm text-muted-foreground">SOL Funded</p>
        </div>
        <div className="rounded-xl border border-glass-border bg-glass-bg/50 p-4 text-center backdrop-blur-md">
          <p className="text-2xl font-bold text-accent">
            {myTasks.filter((w) => w.status === "Settled").length}
          </p>
          <p className="text-sm text-muted-foreground">Completed</p>
        </div>
      </div>
    </div>
  );
}
