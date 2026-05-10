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

// Real-world inspired tasks — modeled after Superteam Earn, Gitcoin, Immunefi,
// DoraHacks, Dework, OnlyDust, Layer3, Galxe, Questbook patterns.
// Deadlines relative to 2026-05-10.
const initialWishes: Wish[] = [

  // ── HIGH-VALUE / TRENDING ─────────────────────────────────────────────────
  {
    id: "1",
    title: "Security audit: token vesting contract (PoC required)",
    description: "Full Immunefi-style audit of our SPL token vesting program. Scope: cliff/linear unlock logic, signer authority checks, PDA bump storage, integer overflow in lamport math. Deliverable: written report + PoC exploit (if found) + severity rating per issue. Acceptance: all Critical/High findings reproduced on Devnet.",
    category: "Security",
    bounty: 8.0,
    contributors: 4,
    walletAddress: "BkR7mPaT3nWsX1eVqLzYcDfGhJuIoN2p",
    timestamp: "2 min ago",
    deadline: "2026-05-24",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "2",
    title: "Build Agent-ready Solana bounty indexer (Superteam-style)",
    description: "Index all WishBox on-chain wish accounts into a queryable REST API so AI agents can autonomously discover, evaluate, and claim tasks. Stack: Helius webhooks + PostgreSQL + Next.js API. Deliverable: deployed endpoint + OpenAPI spec + README. Acceptance: agent demo fetching and submitting a real Devnet wish.",
    category: "Development",
    bounty: 6.5,
    contributors: 7,
    walletAddress: "7xKXtJqF4j9sM2kLpN8vR3wE5uY6hG1cD",
    timestamp: "15 min ago",
    deadline: "2026-06-15",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "3",
    title: "Translate WishBox whitepaper EN → ZH + JA + KO",
    description: "Professional tri-lingual translation of the 18-page WishBox protocol whitepaper. Preserve all technical terminology (PDA, CPI, escrow, milestone). Native speaker QA required. Deliverable: three PDF files + glossary of 50 key terms.",
    category: "Translation",
    bounty: 3.5,
    contributors: 5,
    walletAddress: "9mNbVcXzAsD2fGhJkL1qWeRtYuIoP5pO",
    builder: "HnKr3zXpM2sF9bLqWeRtYuIoP1asDfGj",
    timestamp: "30 min ago",
    deadline: "2026-06-01",
    isAnonymous: true,
    status: "Submitted",
  },
  {
    id: "4",
    title: "DoraHacks-style project showcase page for WishBox",
    description: "Build a public showcase page for each Wish — displays README, demo video embed, Devnet Program ID, builder GitHub handle, and delivery hash. Inspired by DoraHacks BUIDL page. Stack: Next.js App Router + Prisma + Vercel. Acceptance: live URL + passes Lighthouse score > 90.",
    category: "Development",
    bounty: 4.0,
    contributors: 9,
    walletAddress: DEMO_REQUESTER,
    timestamp: "1 hour ago",
    deadline: "2026-06-20",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "5",
    title: "MEV on Solana: deep-dive research report (3,500 words)",
    description: "Gitcoin-style research bounty. Scope: current MEV landscape, sandwich/frontrun patterns, Jito's MEV auction, block-builder centralization risks, and mitigation proposals. Acceptance criteria: peer-reviewed by 2 Solana core contributors, published on Mirror or Paragraph, min 200 claps.",
    category: "Writing",
    bounty: 5.5,
    contributors: 3,
    walletAddress: "2wErTyUiOpAsDfGhJkLzXcVbNm9qWeR",
    timestamp: "2 hours ago",
    deadline: "2026-05-28",
    isAnonymous: true,
    status: "Open",
  },

  // ── DEVELOPMENT ───────────────────────────────────────────────────────────
  {
    id: "6",
    title: "Solana Blink: shareable AddBounty action (/actions/add-bounty/:wishId)",
    description: "Implement a Solana Blink endpoint so anyone can contribute bounty to any Wish directly from Twitter/X. Spec: GET returns ActionGetResponse, POST validates amount + builds transfer tx. Deliverable: deployed route + Blink preview screenshot on mainnet. Acceptance: works in Phantom Blink preview.",
    category: "Development",
    bounty: 3.0,
    contributors: 6,
    walletAddress: "4rTyUiOpAsDfGhJkLzXcVbNm2qWeRtY",
    timestamp: "3 hours ago",
    deadline: "2026-05-26",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "7",
    title: "Fix Anchor CPI signer bug — Devnet reproduction required",
    description: "Our lending program throws ConstraintSigner on a CPI call to the Token program during repay. Need root-cause analysis and fix with test coverage. Deliverable: GitHub PR to private repo + explanation of fix. Acceptance: all existing tests pass + new regression test.",
    category: "Development",
    bounty: 2.0,
    contributors: 2,
    walletAddress: "4rTyUiOpAsDfGhJkLzXcVbNm2qWeRtY",
    timestamp: "4 hours ago",
    deadline: "2026-05-14",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "8",
    title: "Discord governance bot: on-chain proposal → channel alert",
    description: "Dework-style integration task. Bot listens to SPL Governance proposal state changes via Helius webhook and posts formatted embed (title, vote counts, deadline, quorum %) to a Discord channel. Deliverable: open-source repo + hosted bot invite link. Acceptance: works on realms.today Devnet.",
    category: "Development",
    bounty: 2.2,
    contributors: 8,
    walletAddress: "DqM5tXwP9nVrS3aFhJkLzYcGbNuIeO6p",
    timestamp: "5 hours ago",
    deadline: "2026-05-30",
    isAnonymous: true,
    status: "Open",
  },
  {
    id: "9",
    title: "Rust CLI: batch SPL token operations via CSV",
    description: "CLI tool using solana-client and spl-token crates for bulk create/mint/freeze/burn/transfer across wallet lists loaded from CSV. Must handle rate limits and retry on 429. Deliverable: crates.io publish + README with examples. Acceptance: 100-wallet stress test on Devnet passes.",
    category: "Development",
    bounty: 3.5,
    contributors: 4,
    walletAddress: "NaV6dHeZ1vGaC4kPqWtSzIlOjEiQxLn7",
    timestamp: "6 hours ago",
    deadline: "2026-06-25",
    isAnonymous: true,
    status: "Open",
  },
  {
    id: "10",
    title: "Real-time validator dashboard (Solana RPC + React)",
    description: "React SPA showing live validator stats: uptime, skip rate, APY, stake weight, vote credits. Auto-refresh every 30s. OnlyDust-style open contribution — submit PR to public repo. Deliverable: merged PR + live Vercel preview. Acceptance: displays top-100 validators from mainnet RPC.",
    category: "Development",
    bounty: 3.2,
    contributors: 11,
    walletAddress: "XaF7nPqT2oVrS5bGkLmNzYcEhJiDuKw1",
    builder: DEMO_CLAIMER,
    timestamp: "8 hours ago",
    deadline: "2026-06-10",
    isAnonymous: false,
    status: "Accepted",
  },

  // ── SECURITY ──────────────────────────────────────────────────────────────
  {
    id: "11",
    title: "Anchor staking program: PDA derivation & privilege escalation audit",
    description: "Immunefi-grade review of PDA seed uniqueness, bump canonicalization, signer set completeness, and account reuse attacks. Deliverable: markdown report categorized by OWASP-style severity + PoC for any exploitable path. Acceptance criteria: submitted via WishBox delivery hash, reviewed within 5 days.",
    category: "Security",
    bounty: 5.0,
    contributors: 3,
    walletAddress: "SfA2iMjE6aLfGb9pUvBxNqTtOkJwQcs3",
    timestamp: "10 hours ago",
    deadline: "2026-05-22",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "12",
    title: "Fuzz test WishBox escrow program with Trident",
    description: "Use Ackee Blockchain's Trident fuzzer to generate adversarial instruction sequences against the WishBox escrow program. Target: fund/claim/settle/cancel flows. Deliverable: GitHub Actions CI integration + fuzz corpus + findings report. Acceptance: zero critical crashes after 24h run.",
    category: "Security",
    bounty: 4.5,
    contributors: 2,
    walletAddress: "BkR7mPaT3nWsX1eVqLzYcDfGhJuIoN2p",
    timestamp: "12 hours ago",
    deadline: "2026-06-05",
    isAnonymous: false,
    status: "Open",
  },

  // ── DESIGN ────────────────────────────────────────────────────────────────
  {
    id: "13",
    title: "WishBox brand kit: logo variants + Figma design system",
    description: "Full brand identity refresh. Deliverables: SVG logo (light/dark/icon-only), color palette, typography scale, component library in Figma (buttons, cards, badges, modals). Acceptance: Figma Community publish link + exported PNG/SVG assets in all sizes.",
    category: "Design",
    bounty: 4.2,
    contributors: 8,
    walletAddress: DEMO_REQUESTER,
    timestamp: "14 hours ago",
    deadline: "2026-06-08",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "14",
    title: "NFT collection: 10 cyberpunk builder identity cards",
    description: "Generative art concept — 10 unique 'Builder ID' NFT designs representing different skill archetypes (Auditor, Designer, Translator, etc.). Deliver layered PSD + 1024×1024 PNG renders + metadata JSON. Acceptance: Candy Machine v3 test mint on Devnet succeeds.",
    category: "Design",
    bounty: 3.8,
    contributors: 6,
    walletAddress: "GtO8wAxS3oZuV6dIkLpNzBeHcXbQjEg9",
    timestamp: "16 hours ago",
    deadline: "2026-06-18",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "15",
    title: "Dark-mode DeFi icon set — 24 SVGs + Figma source",
    description: "20 SVG icons for core DeFi actions: swap, pool, stake, vault, governance, reward, lock, burn, bridge, etc. Deliver 24×24 and 48×48 pixel-perfect variants + Figma source with auto-layout frames. Acceptance: Figma handoff accepted by product team.",
    category: "Design",
    bounty: 2.0,
    contributors: 5,
    walletAddress: "YbG8oQrU3pWsT6cHlMnOzZdFiKjEvLx2",
    builder: DEMO_CLAIMER,
    timestamp: "18 hours ago",
    deadline: "2026-05-16",
    isAnonymous: true,
    status: "Accepted",
  },
  {
    id: "16",
    title: "Animated Telegram sticker pack (12 stickers, TGS format)",
    description: "Original animated stickers for the WishBox community Telegram. Themes: wishing lamp, bounty coins, builder celebrating, task approved checkmark. Deliver .tgs + .webp + Lottie JSON. Acceptance: uploaded to official Sticker Bot, visible in Telegram search.",
    category: "Design",
    bounty: 1.8,
    contributors: 7,
    walletAddress: "TgB3jNkF7bMgHc1qVwCyOpUuPlKxRdt4",
    timestamp: "20 hours ago",
    deadline: "2026-06-20",
    isAnonymous: false,
    status: "Open",
  },

  // ── WRITING & RESEARCH ────────────────────────────────────────────────────
  {
    id: "17",
    title: "Anchor framework tutorial series (4 parts, Gitcoin-style bounty)",
    description: "Gitcoin-style writing bounty. 4-part blog series: (1) Setup & account model, (2) CPIs & PDAs, (3) Testing with LiteSVM, (4) Deploying to Devnet. Each ~1,500 words with runnable code. Deliverable: 4 published posts on dev.to or Hashnode. Acceptance: 100+ reactions combined.",
    category: "Writing",
    bounty: 4.5,
    contributors: 12,
    walletAddress: DEMO_REQUESTER,
    timestamp: "1 day ago",
    deadline: "2026-06-25",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "18",
    title: "DeFi yield strategy comparison: top 20 Solana protocols",
    description: "Research 20 yield strategies across Kamino, Marginfi, Drift, Save, Raydium, and Orca. For each: current APY, TVL, smart contract risk rating, IL exposure, liquidation risk. Deliverable: Notion database + 2,000-word summary. Acceptance: data verified against DeFiLlama within 48h of submission.",
    category: "Research",
    bounty: 1.8,
    contributors: 4,
    walletAddress: "HuP9xByT4pAuW7eJlMqOzCfIdYcRkFh1",
    timestamp: "1 day ago",
    deadline: "2026-06-05",
    isAnonymous: true,
    status: "Open",
  },
  {
    id: "19",
    title: "Tokenomics model: emission schedule + governance allocation",
    description: "Design a comprehensive tokenomics model for a new DeFi protocol. Scope: initial distribution, team vesting cliff, staking emissions curve, DAO treasury runway (5-year projection), buy-back mechanism. Deliverable: Excel model + 10-slide deck. Acceptance: reviewed by 2 experienced DeFi tokenomics advisors.",
    category: "Research",
    bounty: 2.5,
    contributors: 3,
    walletAddress: "CvN8sQrLpM4xT2bFgHjKzXeWaYuIoDf1",
    timestamp: "1 day ago",
    deadline: "2026-06-15",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "20",
    title: "Beginner's guide to Solana staking (with screenshots)",
    description: "Step-by-step guide covering: what staking is, choosing a validator (APY vs commission vs uptime), native vs liquid staking, risks. Target: non-technical audience. Deliverable: illustrated Notion doc + PDF export. Acceptance: 5 non-developer testers confirm clarity.",
    category: "Writing",
    bounty: 1.5,
    contributors: 5,
    walletAddress: "FsN7vZxR2nYtU5cHjKoMzAeGbWaPiDf8",
    builder: DEMO_CLAIMER,
    timestamp: "2 days ago",
    deadline: "2026-06-01",
    isAnonymous: false,
    status: "Accepted",
  },
  {
    id: "21",
    title: "API docs for Solana lending protocol (Gitbook-ready)",
    description: "Document all program instructions, account schemas, error codes, and TypeScript SDK usage for a Solana lending protocol. Include runnable code examples. Deliverable: Gitbook-compatible MDX files + auto-generated TypeDoc from IDL. Acceptance: technical review pass by protocol team.",
    category: "Writing",
    bounty: 2.0,
    contributors: 2,
    walletAddress: "KxS3aEbW7sDxZ1hMoTqPzFiLgBfNuIk4",
    timestamp: "2 days ago",
    deadline: "2026-06-12",
    isAnonymous: true,
    status: "Open",
  },

  // ── TRANSLATION ───────────────────────────────────────────────────────────
  {
    id: "22",
    title: "Translate Solana PDA + CPI docs → Mandarin (official quality)",
    description: "Translate the PDA and CPI sections of docs.solana.com into Simplified Chinese. Must match tone of existing Mandarin Solana docs. Deliverable: PR to solana-labs/solana-com GitHub repo. Acceptance: approved by Solana Chinese community reviewers.",
    category: "Translation",
    bounty: 1.2,
    contributors: 3,
    walletAddress: "ErL6uYwQ1mWsT4bGiJkNzXcFhPaVoDe7",
    timestamp: "2 days ago",
    deadline: "2026-07-01",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "23",
    title: "Localize WishBox app UI strings: ES + PT + TR",
    description: "Translate all 180 UI strings in /locales/en.json into Spanish, Portuguese (BR), and Turkish. Maintain tone: friendly, concise, Web3-native. Deliverable: 3 JSON files via GitHub PR. Acceptance: reviewed by native speakers in WishBox community Discord.",
    category: "Translation",
    bounty: 1.6,
    contributors: 4,
    walletAddress: "PcX8fJgB3xIcE6mRsYvUzKnQlGkStNp9",
    builder: "QdY9gKhC4yJdF7nStZwVaLoRmHlTuOq1",
    timestamp: "3 days ago",
    deadline: "2026-06-10",
    isAnonymous: false,
    status: "Accepted",
  },

  // ── DATA ──────────────────────────────────────────────────────────────────
  {
    id: "24",
    title: "Solana ecosystem grant map: 40+ active programs (Airtable)",
    description: "Research and document all active grant programs: Solana Foundation, Superteam, Dialect, Metaplex, Marinade, and protocol-specific grants. Fields: deadline, max amount, category, application link, reporting requirements. Deliverable: public Airtable base + CSV export. Acceptance: verified correct as of submission date.",
    category: "Data",
    bounty: 0.9,
    contributors: 2,
    walletAddress: "LyT4bFcX8tEyA2iNpUrQzGjMhCgOvJl5",
    timestamp: "3 days ago",
    deadline: "2026-07-10",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "25",
    title: "Top 50 validator performance benchmarks (3-month data)",
    description: "Gather block production rate, skip rate, vote latency, hardware specs, and geographic location for Solana's top 50 validators over Q1 2026. Source: Solana Beach API + validator websites. Deliverable: Google Sheets with charts + methodology notes. Acceptance: data spot-checked against solanabeach.io.",
    category: "Data",
    bounty: 0.8,
    contributors: 1,
    walletAddress: "WjE6mQnI1ePjKf4tYzFbQsXxSoNaUgvH",
    timestamp: "4 days ago",
    deadline: "2026-07-15",
    isAnonymous: false,
    status: "Open",
  },

  // ── MARKETING ─────────────────────────────────────────────────────────────
  {
    id: "26",
    title: "WishBox launch: Twitter/X 4-week content calendar",
    description: "Create a 4-week content strategy targeting three audiences: task requesters, builders, and Solana investors. Deliverable: calendar spreadsheet + 5 fully written thread drafts + 3 meme templates. Acceptance: approved by WishBox marketing lead before posting.",
    category: "Marketing",
    bounty: 1.0,
    contributors: 3,
    walletAddress: "IvQ1yCzU5qBvX8fKmNrPzDgJeZdSlGi2",
    timestamp: "4 days ago",
    deadline: "2026-05-25",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "27",
    title: "Layer3-style quest design: 5 onboarding tasks for new users",
    description: "Design 5 progressive onboarding quests guiding new users through WishBox: connect wallet → browse wishes → contribute bounty → claim task → submit delivery. Each quest needs title, description, on-chain verification method, and XP reward. Deliverable: quest spec doc + Figma UI mockup.",
    category: "Marketing",
    bounty: 1.4,
    contributors: 5,
    walletAddress: "ObW7eIfA2wHbD5lQrXuTzJmPkFjRyMo8",
    timestamp: "5 days ago",
    deadline: "2026-06-10",
    isAnonymous: false,
    status: "Open",
  },

  // ── MY CLAIMS DEMO ────────────────────────────────────────────────────────
  {
    id: "28",
    title: "Fix responsive Tailwind layout bugs (20 tickets, cross-browser QA)",
    description: "20 documented breakpoint issues across mobile/tablet for a Solana dApp frontend. Stack: Next.js + Tailwind CSS. Bugs tracked in Linear. Deliverable: GitHub PR closing all 20 issues + QA report for Chrome/Firefox/Safari. Acceptance: product owner sign-off.",
    category: "Development",
    bounty: 2.0,
    contributors: 9,
    walletAddress: "JwR2zDaV6rCwY9gLnOsPzEhKfAeMtHj3",
    builder: DEMO_CLAIMER,
    timestamp: "2 days ago",
    deadline: "2026-05-22",
    isAnonymous: false,
    status: "Accepted",
  },
  {
    id: "29",
    title: "Jupiter swap UI component: token selector + slippage + price impact",
    description: "OnlyDust-style open-source contribution. React component for token swaps via Jupiter v6 API — token search selector, slippage tolerance input, price impact warning, wallet sign flow. TypeScript + Storybook stories. Deliverable: merged PR to wishbox-ui repo.",
    category: "Development",
    bounty: 2.5,
    contributors: 13,
    walletAddress: "ViD5lPmH9dOiJe3sXyEaPrWwRnMzTfuG",
    builder: DEMO_CLAIMER,
    timestamp: "10 days ago",
    deadline: "2026-04-15",
    isAnonymous: false,
    status: "Settled",
  },
  {
    id: "30",
    title: "Record Solana wallet intro video (5 min, MP4 + captions)",
    description: "Tutorial video: create Phantom wallet, fund with SOL, send first transaction, explore Solana Explorer. Deliverable: 1080p MP4 + SRT caption file + thumbnail. Acceptance: uploaded to WishBox YouTube channel, reviewed by community manager.",
    category: "Writing",
    bounty: 1.2,
    contributors: 3,
    walletAddress: "ZcH9pRsV4qXtU7dImNoAaEgJlLfMwCy3",
    builder: DEMO_CLAIMER,
    timestamp: "14 days ago",
    deadline: "2026-04-28",
    isAnonymous: false,
    status: "Settled",
  },

  // ── MY FUNDED DEMO ────────────────────────────────────────────────────────
  {
    id: "31",
    title: "React wallet connect component: Phantom + Backpack + Solflare",
    description: "Reusable @solana/wallet-adapter React component with auto-reconnect, network switching, and mobile WalletConnect support. TypeScript + 90%+ test coverage. Deliverable: npm publish (scoped) + storybook demo + migration guide. Acceptance: CI passes + code review by 2 maintainers.",
    category: "Development",
    bounty: 2.8,
    contributors: 15,
    walletAddress: DEMO_REQUESTER,
    builder: "AdB1cEfG2hIjK3lMnO4pQrS5tUvW6xYz",
    timestamp: "4 days ago",
    deadline: "2026-05-28",
    isAnonymous: false,
    status: "Accepted",
  },
  {
    id: "32",
    title: "Galxe-style credential: builder reputation NFT (on-chain proof)",
    description: "Questbook-inspired milestone project. Design and mint a soulbound NFT credential system for WishBox builders — earn badges for: first task completed, 5 SOL earned, security auditor, etc. Deliverable: Anchor program on Devnet + mint UI + metadata standard. Acceptance: 3 test credentials minted.",
    category: "Development",
    bounty: 5.0,
    contributors: 7,
    walletAddress: DEMO_REQUESTER,
    timestamp: "6 days ago",
    deadline: "2026-06-30",
    isAnonymous: false,
    status: "Open",
  },
  {
    id: "33",
    title: "WishBox protocol ecosystem overview deck (30 slides, investor-ready)",
    description: "30-slide presentation: architecture, state machine, escrow model, fee structure, builder credentials, roadmap, and comparable market analysis (Gitcoin, Superteam, Immunefi). Deliverable: Google Slides + PDF export. Acceptance: reviewed and approved by founding team.",
    category: "Research",
    bounty: 1.6,
    contributors: 6,
    walletAddress: DEMO_REQUESTER,
    builder: "BeC2dFgH3iJkL4mNpO5qRsT6uVwX7yZa",
    timestamp: "12 days ago",
    deadline: "2026-04-20",
    isAnonymous: false,
    status: "Settled",
  },
  {
    id: "34",
    title: "Devnet wishbox: develop huawei phone Solana wallet (0.01 SOL bounty test)",
    category: "Development",
    description: "Test task for platform demonstration. Build a minimal Solana wallet UI optimized for Huawei devices (no GMS). Features: generate/import keypair, view SOL balance, send SOL. Stack: Flutter or React Native. Deliverable: APK + source code.",
    bounty: 0.01,
    contributors: 1,
    walletAddress: DEMO_REQUESTER,
    timestamp: "Just now",
    deadline: "2026-07-31",
    isAnonymous: false,
    status: "Open",
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

  // userRole is the primary mode: "requester" (Fund Tasks) → Contribute first
  //                                "implementer" (Claim Tasks) → Claim first
  const handleWishClick = (wish: Wish) => {
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
        {/* Poster watermark */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/wishbox-bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: 0.18,
          }}
        />
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
            onWishClick={handleWishClick}
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
