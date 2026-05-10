import { NextRequest, NextResponse } from "next/server";

export interface VerifyResult {
  status: "APPROVED" | "REVISION_NEEDED";
  score: number; // 0-100
  feedback: string;
  checklist: { item: string; passed: boolean }[];
}

// ── Smart mock — no external API needed ──────────────────────────────────────

const WEAK_SIGNALS = ["todo", "wip", "placeholder", "coming soon", "tbd", "n/a", "test", "draft"];
const LINK_PATTERNS = [
  /github\.com/i, /gitlab\.com/i, /drive\.google/i, /notion\.so/i,
  /figma\.com/i, /docs\.google/i, /vercel\.app/i, /netlify\.app/i,
  /ipfs\.io/i, /arweave\.net/i, /loom\.com/i, /youtube\.com/i,
];
const CODE_SIGNALS   = ["github.com", "gitlab.com", "vercel.app", "netlify.app", "devnet", "program id", "transaction"];
const DESIGN_SIGNALS = ["figma.com", "dribbble.com", "behance.net", "png", "svg", "pdf"];
const WRITE_SIGNALS  = ["mirror.xyz", "hashnode.com", "dev.to", "medium.com", "notion.so", "docs.google"];

function hasValidLink(url: string): boolean {
  return LINK_PATTERNS.some((p) => p.test(url));
}

function scoreNote(note: string): number {
  const words = note.trim().split(/\s+/).filter(Boolean);
  if (words.length < 10) return 20;
  if (words.length < 30) return 50;
  if (words.length < 60) return 75;
  return 90;
}

function hasWeakSignals(text: string): boolean {
  const lower = text.toLowerCase();
  return WEAK_SIGNALS.some((w) => lower.includes(w));
}

function detectContentType(url: string, note: string): "code" | "design" | "writing" | "general" {
  const combined = (url + " " + note).toLowerCase();
  if (CODE_SIGNALS.some((s) => combined.includes(s))) return "code";
  if (DESIGN_SIGNALS.some((s) => combined.includes(s))) return "design";
  if (WRITE_SIGNALS.some((s) => combined.includes(s))) return "writing";
  return "general";
}

function buildChecklist(
  url: string,
  note: string,
  contentType: "code" | "design" | "writing" | "general"
): { item: string; passed: boolean }[] {
  const hasLink = hasValidLink(url);
  const noteWords = note.trim().split(/\s+/).filter(Boolean).length;
  const hasWeakContent = hasWeakSignals(url + " " + note);

  const shared = [
    { item: "Submission link provided", passed: url.trim().length > 0 },
    { item: "Link points to a recognized platform", passed: hasLink },
    { item: "Work summary is descriptive (≥ 30 words)", passed: noteWords >= 30 },
    { item: "No placeholder or WIP indicators", passed: !hasWeakContent },
  ];

  const typed: { item: string; passed: boolean }[] =
    contentType === "code"
      ? [
          { item: "GitHub / GitLab or deployment URL detected", passed: hasLink },
          { item: "Mentions Devnet / program / transaction (on-chain evidence)", passed: /devnet|program id|tx|transaction/i.test(url + note) },
        ]
      : contentType === "design"
      ? [
          { item: "Figma / image hosting link detected", passed: /figma|dribbble|behance|png|pdf/i.test(url) },
          { item: "Asset format mentioned in summary", passed: /svg|png|pdf|figma|webp|tgs/i.test(note) },
        ]
      : contentType === "writing"
      ? [
          { item: "Published URL (Mirror / dev.to / Hashnode / Notion)", passed: hasLink },
          { item: "Word count or section structure mentioned", passed: /word|section|part|chapter|\d+\s*(word|page)/i.test(note) },
        ]
      : [
          { item: "External link to deliverable provided", passed: hasLink },
          { item: "Summary explains what was completed", passed: noteWords >= 20 },
        ];

  return [...shared, ...typed];
}

function buildFeedback(
  checklist: { item: string; passed: boolean }[],
  score: number,
  status: "APPROVED" | "REVISION_NEEDED"
): string {
  const failed = checklist.filter((c) => !c.passed).map((c) => c.item);

  if (status === "APPROVED") {
    if (score >= 90)
      return "Excellent submission — all verification criteria met. Payment will be released automatically in 7 days unless the requester raises a dispute.";
    return "Submission meets the minimum acceptance criteria. Payment is scheduled for 7 days from now. The requester may review and dispute within this window.";
  }

  const reasons = failed.map((f) => `• ${f}`).join("\n");
  return `Your submission needs revision before it can be accepted:\n\n${reasons}\n\nPlease address the above points and resubmit.`;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const { url, note, taskTitle } = (await req.json()) as {
    url: string;
    note: string;
    taskTitle?: string;
  };

  // Simulate processing time
  await new Promise((r) => setTimeout(r, 1800));

  const contentType = detectContentType(url, note);
  const checklist   = buildChecklist(url, note, contentType);
  const passed      = checklist.filter((c) => c.passed).length;
  const total       = checklist.length;

  const urlScore  = hasValidLink(url) ? 40 : url.trim().length > 0 ? 15 : 0;
  const noteScore = scoreNote(note);
  const weakPenalty = hasWeakSignals(url + " " + note) ? 20 : 0;
  const score = Math.min(100, Math.round((urlScore * 0.5 + noteScore * 0.5) - weakPenalty));

  const allCriticalPassed = checklist.slice(0, 2).every((c) => c.passed); // link + platform
  const status: "APPROVED" | "REVISION_NEEDED" =
    score >= 55 && allCriticalPassed && passed >= Math.ceil(total * 0.6)
      ? "APPROVED"
      : "REVISION_NEEDED";

  const feedback = buildFeedback(checklist, score, status);

  const result: VerifyResult = { status, score, feedback, checklist };
  return NextResponse.json(result);
}
