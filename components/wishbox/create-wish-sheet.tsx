"use client";

import { useState, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Sparkles,
  Loader2,
  Eye,
  Coins,
  PenLine,
  AlertCircle,
  CheckCircle2,
  Timer,
  BrainCircuit,
  ArrowLeft,
  Wallet,
  ShieldCheck,
  KeyRound,
  Zap,
  Link2,
} from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useConnection } from "@solana/wallet-adapter-react";
import { Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { WISHBOX_TREASURY } from "@/lib/wishbox-constants";
import { AuditCard } from "@/components/wishbox/audit-card";
import type { ScopingReport } from "@/app/api/scoping/route";

interface CreateWishSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    title: string;
    description: string;
    category: string;
    bounty: number;
    isAnonymous: boolean;
    deadline: string;
  }) => void;
}

const categories = [
  "Development",
  "Design",
  "Translation",
  "Writing",
  "Data",
  "Research",
  "Other",
];

type Step = "form" | "scoping" | "confirm" | "signing" | "success";
type PrivacyPhase = "funding" | "posting";

/** SOL reserved on the ephemeral address to cover the relay tx fee (~5000 lamports) */
const RELAY_FEE_SOL = 0.01;

export function CreateWishSheet({ open, onOpenChange, onSubmit }: CreateWishSheetProps) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Development");
  const [reward, setReward] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);

  // Step machine
  const [step, setStep] = useState<Step>("form");
  const [auditReport, setAuditReport] = useState<ScopingReport | null>(null);
  const [scopingError, setScopingError] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [privacyPhase, setPrivacyPhase] = useState<PrivacyPhase>("funding");
  const [ephemeralAddress, setEphemeralAddress] = useState<string | null>(null);

  // Ephemeral keypair lives in a ref — never stored in state to avoid re-renders
  const ephemeralRef = useRef<Keypair | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const rewardNum = parseFloat(reward) || 0;

  const isFormValid =
    !!publicKey &&
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    !!reward &&
    parseFloat(reward) > 0;

  // When privacy mode is toggled on, also force isAnonymous
  const handlePrivacyToggle = (enabled: boolean) => {
    setPrivacyMode(enabled);
    if (enabled) setIsAnonymous(true);
  };

  // ── Step 1 → 2: AI scoping ─────────────────────────────────────────────────
  const handleRequestScoping = async () => {
    if (!isFormValid) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setScopingError(null);
    setAuditReport(null);
    setStep("scoping");

    try {
      const res = await fetch("/api/scoping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), description: description.trim() }),
        signal: controller.signal,
      });

      const data = await res.json();

      if (!res.ok) {
        setScopingError(data?.error ?? "AI analysis failed. You can still proceed.");
        setStep("confirm");
        return;
      }

      setAuditReport(data as ScopingReport);
      setStep("confirm");
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setScopingError("Could not reach the AI service. You can still proceed.");
      setStep("confirm");
    }
  };

  // ── Apply refined description → back to form ──────────────────────────────
  const handleApplyRefined = (refined: string) => {
    setDescription(refined);
    setAuditReport(null);
    setScopingError(null);
    setStep("form");
  };

  // ── Helper: confirm a tx given the blockhash data ─────────────────────────
  const confirmTx = async (sig: string, blockhash: string, lastValidBlockHeight: number) => {
    await connection.confirmTransaction({ signature: sig, blockhash, lastValidBlockHeight }, "confirmed");
  };

  // ── Step 3a: Normal signing flow ───────────────────────────────────────────
  const signNormal = async () => {
    if (!publicKey) return;
    const lamports = Math.round(rewardNum * LAMPORTS_PER_SOL);

    const tx = new Transaction().add(
      SystemProgram.transfer({ fromPubkey: publicKey, toPubkey: WISHBOX_TREASURY, lamports })
    );
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash("confirmed");
    tx.recentBlockhash = blockhash;
    tx.feePayer = publicKey;

    const sig = await sendTransaction(tx, connection);
    await confirmTx(sig, blockhash, lastValidBlockHeight);
    console.log("[Wishbox] Post task tx:", sig);
  };

  // ── Step 3b: Privacy Mode signing flow ────────────────────────────────────
  const signPrivacy = async () => {
    if (!publicKey) return;

    const bountyLamports  = Math.round(rewardNum * LAMPORTS_PER_SOL);
    const relayFeeLamports = Math.round(RELAY_FEE_SOL * LAMPORTS_PER_SOL);
    const totalFundLamports = bountyLamports + relayFeeLamports;

    // 1. Generate ephemeral relay keypair (in-memory, never persisted)
    const ephemeral = Keypair.generate();
    ephemeralRef.current = ephemeral;
    setEphemeralAddress(ephemeral.publicKey.toBase58());

    // ── Phase 1: Main wallet funds the ephemeral relay address ──────────────
    setPrivacyPhase("funding");

    const fundTx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: ephemeral.publicKey,
        lamports: totalFundLamports,
      })
    );
    const { blockhash: fBh, lastValidBlockHeight: fLvBh } =
      await connection.getLatestBlockhash("confirmed");
    fundTx.recentBlockhash = fBh;
    fundTx.feePayer = publicKey;

    // This is the ONLY wallet prompt the user sees in privacy mode
    const fundSig = await sendTransaction(fundTx, connection);
    await confirmTx(fundSig, fBh, fLvBh);
    console.log("[Wishbox] Privacy: funded relay address:", ephemeral.publicKey.toBase58(), "tx:", fundSig);

    // ── Phase 2: Ephemeral keypair self-signs the wish transaction ──────────
    setPrivacyPhase("posting");

    const wishTx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: ephemeral.publicKey,
        toPubkey: WISHBOX_TREASURY,
        lamports: bountyLamports,
      })
    );
    const { blockhash: wBh, lastValidBlockHeight: wLvBh } =
      await connection.getLatestBlockhash("confirmed");
    wishTx.recentBlockhash = wBh;
    wishTx.feePayer = ephemeral.publicKey;

    // Ephemeral keypair signs locally — no wallet prompt
    wishTx.sign(ephemeral);

    const rawTx  = wishTx.serialize();
    const wishSig = await connection.sendRawTransaction(rawTx, { skipPreflight: false });
    await confirmTx(wishSig, wBh, wLvBh);
    console.log("[Wishbox] Privacy: wish posted from relay:", ephemeral.publicKey.toBase58(), "tx:", wishSig);

    // Clear the ephemeral key from memory immediately after use
    ephemeralRef.current = null;
  };

  // ── Step 3: Entry point ───────────────────────────────────────────────────
  const handleConfirmAndSign = async () => {
    if (!publicKey) return;

    setTxError(null);
    setPrivacyPhase("funding");
    setEphemeralAddress(null);
    setStep("signing");

    try {
      if (privacyMode) {
        await signPrivacy();
      } else {
        await signNormal();
      }

      const days = parseInt(deadlineDays) || 30;
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + days);
      const deadline = deadlineDate.toISOString().split("T")[0];

      // In privacy mode the posted address is the ephemeral, so force anonymous
      onSubmit({
        title,
        description,
        category,
        bounty: rewardNum,
        isAnonymous: privacyMode ? true : isAnonymous,
        deadline,
      });

      setStep("success");
      setTimeout(() => { resetAll(); onOpenChange(false); }, 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("rejected") || msg.toLowerCase().includes("cancelled")) {
        setTxError("Transaction cancelled — your task was not posted.");
      } else {
        setTxError("Transaction failed. Please check your balance and try again.");
      }
      console.error("[Wishbox] Sign error:", err);
      setStep("confirm"); // bounce back so user can retry
    }
  };

  const resetAll = () => {
    setTitle(""); setDescription(""); setCategory("Development");
    setReward(""); setDeadlineDays(""); setIsAnonymous(false); setPrivacyMode(false);
    setStep("form"); setAuditReport(null); setScopingError(null); setTxError(null);
    setPrivacyPhase("funding"); setEphemeralAddress(null);
    ephemeralRef.current = null;
  };

  // Step indicator
  const stepIndex = { form: 0, scoping: 1, confirm: 1, signing: 2, success: 2 }[step];
  const stepLabels = ["Fill Details", "AI Review", "Sign & Post"];

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        if (!v) { abortRef.current?.abort(); resetAll(); }
        onOpenChange(v);
      }}
    >
      <SheetContent
        side="right"
        className="w-full border-glass-border bg-background/95 backdrop-blur-xl sm:max-w-md flex flex-col"
      >
        {/* ── Sticky header ── */}
        <SheetHeader className="flex-shrink-0 border-b border-glass-border pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20 shadow-[0_0_15px_var(--glow-primary)]">
              <PenLine className="size-5 text-primary" />
            </div>
            <div>
              <SheetTitle className="text-lg text-foreground">Post New Task</SheetTitle>
              <SheetDescription>
                {step === "form" && "Fill in your task details"}
                {(step === "scoping" || step === "confirm") && "AI Audit in progress…"}
                {step === "signing" && (
                  privacyMode
                    ? privacyPhase === "funding"
                      ? "Step 1/2 — Approve wallet transfer"
                      : "Step 2/2 — Posting anonymously…"
                    : "Approve in your wallet"
                )}
                {step === "success" && "Task is live!"}
              </SheetDescription>
            </div>
          </div>

          {/* Step dots */}
          {step !== "success" && (
            <div className="mt-3 flex items-center gap-2">
              {stepLabels.map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className={`size-2 rounded-full transition-all ${
                      i < stepIndex ? "bg-green-400" : i === stepIndex ? "bg-primary scale-125" : "bg-secondary/60"
                    }`} />
                    <span className={`text-[10px] font-medium transition-colors ${
                      i === stepIndex ? "text-foreground" : "text-muted-foreground/50"
                    }`}>{label}</span>
                  </div>
                  {i < stepLabels.length - 1 && (
                    <div className={`h-px w-6 transition-colors ${i < stepIndex ? "bg-green-400/60" : "bg-secondary/40"}`} />
                  )}
                </div>
              ))}
            </div>
          )}
        </SheetHeader>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-4 py-5">

          {/* ══ SUCCESS ══ */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
              <div className="flex size-20 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircle2 className="size-10 text-green-400" />
              </div>
              <p className="text-2xl font-bold text-green-400">Task Posted!</p>
              <p className="text-muted-foreground">
                {privacyMode
                  ? "Your task is live. The on-chain signer is an anonymous relay address."
                  : `Your task is live and ${rewardNum} SOL has been locked in escrow.`}
              </p>
            </div>
          )}

          {/* ══ FORM ══ */}
          {step === "form" && (
            <div className="space-y-5">
              {!publicKey && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center text-sm text-muted-foreground">
                  Connect your wallet to post a task.
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Task Title</label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Design a logo for my project"
                  className="border-glass-border bg-secondary/50" />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Category</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setCategory(cat)}
                      className={`rounded-lg border px-3 py-1.5 text-sm transition-all ${
                        category === cat
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-glass-border bg-secondary/30 text-muted-foreground hover:border-primary/50"
                      }`}>
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Task Description</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your task in detail..."
                  className="min-h-[120px] resize-none border-glass-border bg-secondary/50" />
              </div>

              {/* Bounty */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Initial Bounty</label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary" />
                  <Input type="number" step="0.01" min="0.01" value={reward}
                    onChange={(e) => setReward(e.target.value)} placeholder="0.00"
                    className="border-glass-border bg-secondary/50 pl-10 pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">SOL</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Locked in escrow. Others can contribute to increase the bounty.
                </p>
              </div>

              {/* Deadline */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Task Deadline</label>
                <div className="relative">
                  <Timer className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="number" min="1" max="365" value={deadlineDays}
                    onChange={(e) => setDeadlineDays(e.target.value)} placeholder="30"
                    className="border-glass-border bg-secondary/50 pl-10 pr-16" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">days</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Defaults to <span className="font-medium text-foreground">30 days</span> if left blank.
                </p>
              </div>

              {/* ── Visibility selector (Public / Private) ─────────────── */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Visibility</p>
                <div className="grid grid-cols-2 gap-2">
                  {/* Private option */}
                  <button
                    type="button"
                    onClick={() => handlePrivacyToggle(true)}
                    className={`flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                      privacyMode
                        ? "border-violet-500 bg-violet-500/10 shadow-[0_0_16px_rgba(139,92,246,0.3)]"
                        : "border-glass-border bg-secondary/20 hover:border-violet-500/40"
                    }`}
                  >
                    <ShieldCheck className={`size-4 shrink-0 ${privacyMode ? "text-violet-400" : "text-muted-foreground"}`} />
                    <div>
                      <p className={`text-sm font-semibold ${privacyMode ? "text-violet-300" : "text-muted-foreground"}`}>Private</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">Relay keypair hides you</p>
                    </div>
                    {privacyMode && (
                      <CheckCircle2 className="ml-auto size-4 shrink-0 text-violet-400" />
                    )}
                  </button>

                  {/* Public option */}
                  <button
                    type="button"
                    onClick={() => { handlePrivacyToggle(false); setIsAnonymous(false); }}
                    className={`flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-left transition-all ${
                      !privacyMode
                        ? "border-primary bg-primary/10 shadow-[0_0_16px_var(--glow-primary)]"
                        : "border-glass-border bg-secondary/20 hover:border-primary/40"
                    }`}
                  >
                    <Eye className={`size-4 shrink-0 ${!privacyMode ? "text-primary" : "text-muted-foreground"}`} />
                    <div>
                      <p className={`text-sm font-semibold ${!privacyMode ? "text-primary" : "text-muted-foreground"}`}>Public</p>
                      <p className="text-[10px] text-muted-foreground leading-tight">Wallet visible on-chain</p>
                    </div>
                    {!privacyMode && (
                      <CheckCircle2 className="ml-auto size-4 shrink-0 text-primary" />
                    )}
                  </button>
                </div>

                {/* Private expanded info */}
                {privacyMode && (
                  <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 px-3 py-2.5 text-xs space-y-1.5 text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-violet-400 shrink-0">1.</span>
                      <span>A one-time <span className="text-violet-300 font-medium">relay keypair</span> is generated locally — never stored or transmitted.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-violet-400 shrink-0">2.</span>
                      <span>Your wallet funds the relay, then the relay <span className="text-violet-300 font-medium">self-signs</span> the on-chain wish — your address never appears.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA */}
              <Button onClick={handleRequestScoping} disabled={!isFormValid}
                className={`w-full transition-all ${
                  privacyMode
                    ? "bg-violet-600 text-white hover:bg-violet-500"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
                style={{ boxShadow: isFormValid
                  ? privacyMode ? "0 0 25px rgba(139,92,246,0.5)" : "0 0 25px var(--glow-primary)"
                  : "none" }}>
                <BrainCircuit className="mr-2 size-4" />
                Analyse &amp; Continue
              </Button>
            </div>
          )}

          {/* ══ SCOPING (loading) ══ */}
          {step === "scoping" && (
            <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
              <div className="relative flex size-20 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <div className="relative flex size-16 items-center justify-center rounded-full bg-primary/10">
                  <BrainCircuit className="size-8 text-primary animate-pulse" />
                </div>
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">AI is auditing your task…</p>
                <p className="mt-1 text-sm text-muted-foreground">Checking verifiability and specificity</p>
              </div>
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          )}

          {/* ══ CONFIRM (audit result) ══ */}
          {step === "confirm" && (
            <div className="space-y-5">
              {scopingError && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{scopingError}</span>
                </div>
              )}

              {auditReport && (
                <AuditCard report={auditReport} onApplyRefined={handleApplyRefined} />
              )}

              {/* Privacy Mode summary badge */}
              {privacyMode && (
                <div className="flex items-center gap-3 rounded-lg border border-violet-500/30 bg-violet-500/10 px-4 py-3">
                  <ShieldCheck className="size-5 shrink-0 text-violet-400" />
                  <div>
                    <p className="text-sm font-semibold text-violet-300">Privacy Mode active</p>
                    <p className="text-xs text-muted-foreground">
                      1 wallet prompt · relay auto-signs the wish
                    </p>
                  </div>
                </div>
              )}

              {/* Payment summary */}
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
                <div className="flex items-center justify-between font-semibold text-primary">
                  <span>Bounty locked in escrow</span>
                  <span className="font-mono">{rewardNum} SOL</span>
                </div>
              </div>

              {txError && (
                <div className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  <AlertCircle className="size-4 shrink-0" />
                  {txError}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep("form")}
                  className="flex-1 border-glass-border bg-secondary/30 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="mr-2 size-4" />
                  Edit
                </Button>
                <Button onClick={handleConfirmAndSign}
                  className={`flex-1 transition-all ${
                    privacyMode
                      ? "bg-violet-600 text-white hover:bg-violet-500"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                  style={{ boxShadow: privacyMode ? "0 0 25px rgba(139,92,246,0.5)" : "0 0 25px var(--glow-primary)" }}>
                  {privacyMode
                    ? <><ShieldCheck className="mr-2 size-4" />Sign &amp; Post Anonymously</>
                    : <><Wallet className="mr-2 size-4" />Sign &amp; Post</>}
                </Button>
              </div>
            </div>
          )}

          {/* ══ SIGNING ══ */}
          {step === "signing" && (
            <div className="flex flex-col items-center justify-center gap-5 py-10 text-center">
              {privacyMode ? (
                <>
                  {/* Privacy mode — 2-phase display */}
                  <div className="flex gap-3 w-full">
                    {/* Phase 1 */}
                    <div className={`flex-1 rounded-xl border p-4 transition-all ${
                      privacyPhase === "funding"
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-green-500/30 bg-green-500/5 opacity-70"
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {privacyPhase === "funding"
                          ? <Loader2 className="size-4 animate-spin text-violet-400" />
                          : <CheckCircle2 className="size-4 text-green-400" />}
                        <span className="text-xs font-semibold text-foreground">1 / 2</span>
                      </div>
                      <p className={`text-xs ${privacyPhase === "funding" ? "text-violet-300" : "text-muted-foreground"}`}>
                        Fund relay address
                      </p>
                      <p className="mt-1 font-mono text-xs text-muted-foreground">
                        {(rewardNum + RELAY_FEE_SOL).toFixed(3)} SOL
                      </p>
                    </div>

                    {/* Connector */}
                    <div className="flex items-center pt-2">
                      <Link2 className={`size-4 transition-colors ${
                        privacyPhase === "posting" ? "text-violet-400" : "text-muted-foreground/30"
                      }`} />
                    </div>

                    {/* Phase 2 */}
                    <div className={`flex-1 rounded-xl border p-4 transition-all ${
                      privacyPhase === "posting"
                        ? "border-violet-500/50 bg-violet-500/10"
                        : "border-glass-border bg-secondary/20 opacity-50"
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {privacyPhase === "posting"
                          ? <Loader2 className="size-4 animate-spin text-violet-400" />
                          : <KeyRound className="size-4 text-muted-foreground/50" />}
                        <span className="text-xs font-semibold text-foreground">2 / 2</span>
                      </div>
                      <p className={`text-xs ${privacyPhase === "posting" ? "text-violet-300" : "text-muted-foreground/50"}`}>
                        Relay self-signs
                      </p>
                      <p className="mt-1 font-mono text-xs text-muted-foreground/50">no prompt</p>
                    </div>
                  </div>

                  {/* Ephemeral address */}
                  <div className="w-full rounded-lg border border-violet-500/20 bg-secondary/30 px-3 py-2 text-left">
                    <p className="text-[10px] text-muted-foreground/60 mb-0.5 flex items-center gap-1">
                      <KeyRound className="size-3" /> Relay address (ephemeral)
                    </p>
                    <p className="font-mono text-[11px] text-violet-300 break-all">
                      {ephemeralAddress ?? "Generating…"}
                    </p>
                  </div>

                  {privacyPhase === "funding" && (
                    <p className="text-sm text-muted-foreground">
                      Approve the transfer in your wallet to fund the relay address.
                    </p>
                  )}
                  {privacyPhase === "posting" && (
                    <div className="flex items-center gap-2 text-sm text-violet-300">
                      <Zap className="size-4 animate-pulse" />
                      Relay is posting your wish — no wallet needed.
                    </div>
                  )}
                </>
              ) : (
                /* Normal mode */
                <>
                  <div className="relative flex size-20 items-center justify-center">
                    <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
                    <div className="relative flex size-16 items-center justify-center rounded-full bg-primary/10">
                      <Wallet className="size-8 text-primary" />
                    </div>
                  </div>
                  <div>
                    <p className="text-base font-semibold text-foreground">Waiting for signature…</p>
                    <p className="mt-1 text-sm text-muted-foreground">Approve the transaction in your wallet</p>
                  </div>
                  <div className="rounded-lg border border-primary/20 bg-primary/5 px-5 py-3 text-sm">
                    <div className="flex items-center justify-between gap-8 text-muted-foreground">
                      <span>Amount</span>
                      <span className="font-mono font-semibold text-primary">{rewardNum} SOL</span>
                    </div>
                  </div>
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
