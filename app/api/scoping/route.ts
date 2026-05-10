import { NextRequest, NextResponse } from "next/server";

export interface ScopingReport {
  analysis: string;
  clarity_score: number;
  verifiable_evidence: string[];
  milestones: Array<{ title: string; description: string }>;
  refined_description: string;
  status: "READY" | "NEED_REVISION";
}

// ── Quality signals ────────────────────────────────────────────────────────────

const VAGUE_WORDS = [
  "something", "stuff", "things", "etc", "maybe", "probably", "some",
  "a bit", "kind of", "sort of", "asap", "soon", "better", "improve",
  "nice", "good", "clean", "fix", "update", "make",
];

const EVIDENCE_KEYWORDS: Record<string, string[]> = {
  code:        ["GitHub PR link with merged status", "CI/CD green build badge", "Deployed URL of the feature"],
  develop:     ["GitHub PR link with merged status", "CI/CD green build badge", "Unit test coverage report (≥ 80%)"],
  design:      ["Figma/Sketch source file URL", "Exported PNG/SVG assets (3 formats)", "Before/after screenshot comparison"],
  logo:        ["Vector file (SVG + AI/EPS)", "PNG variants (transparent + white bg)", "Brand usage guidelines doc"],
  translat:    ["Translated document with word count", "Native speaker review sign-off", "Diff against original source"],
  write:       ["Published article URL or Google Doc", "Plagiarism check report (< 5%)", "Word count confirmation"],
  research:    ["Research report PDF (min. 1 000 words)", "Cited sources list (≥ 5 references)", "Executive summary slide"],
  data:        ["Clean dataset file (CSV/JSON) with schema", "Data validation report", "Sample output visualization"],
  audit:       ["Audit report PDF with severity ratings", "Proof-of-fix commit hash for each finding", "Re-test confirmation"],
  "smart contract": ["Deployed contract address on target network", "Verified source on block explorer", "Test coverage report"],
  nft:         ["Minted NFT token address", "Metadata JSON hosted on IPFS", "Marketplace listing URL"],
  solana:      ["Transaction signature on Solana Explorer", "Program ID on devnet/mainnet", "Anchor IDL file"],
  bot:         ["Bot live invite link with uptime ≥ 99%", "Command list documentation", "Error log from 48 h run"],
  video:       ["Uploaded video URL (YouTube/Vimeo)", "Minimum 2-minute runtime", "Transcript or captions file"],
  api:         ["Live API endpoint URL with docs", "Postman collection export", "Response time < 500 ms proof"],
};

const MILESTONE_TEMPLATES: Record<string, Array<{ title: string; description: string }>> = {
  develop: [
    { title: "Requirement Specification", description: "Define acceptance criteria, edge cases, and tech stack constraints in a short spec doc." },
    { title: "Core Implementation", description: "Write the main feature code with inline tests covering happy path and error cases." },
    { title: "Code Review & CI", description: "Open a PR, pass all automated checks, and get at least one reviewer approval." },
    { title: "Deployment & Verification", description: "Deploy to the agreed environment and share a working demo URL or screencast." },
  ],
  design: [
    { title: "Discovery & Moodboard", description: "Research brand context, compile 3 moodboard directions, and get client sign-off on one." },
    { title: "Concept Drafts", description: "Produce 2–3 distinct design concepts in vector format for review." },
    { title: "Revisions & Finalisation", description: "Incorporate feedback from the bounty poster (max 2 revision rounds)." },
    { title: "Asset Delivery", description: "Export all required formats (SVG, PNG, PDF) and hand off source files." },
  ],
  research: [
    { title: "Scope Definition", description: "Agree on exact research questions, geographic/time scope, and output format." },
    { title: "Data Collection", description: "Gather primary or secondary data from at least 5 credible sources." },
    { title: "Analysis & Synthesis", description: "Analyse findings and produce key insights with supporting evidence." },
    { title: "Final Report Delivery", description: "Submit the formatted report with executive summary and cited references." },
  ],
  default: [
    { title: "Kickoff & Scoping", description: "Clarify requirements, deliverables, and communication channel with the bounty poster." },
    { title: "First Milestone Delivery", description: "Complete the primary deliverable and share a draft for early feedback." },
    { title: "Revision & QA", description: "Incorporate feedback and verify all acceptance criteria are met." },
    { title: "Final Submission", description: "Submit all required evidence artifacts and close the bounty." },
  ],
};

// ── Helpers ────────────────────────────────────────────────────────────────────

function scoreDescription(title: string, desc: string): number {
  const text = `${title} ${desc}`.toLowerCase();
  let score = 45; // baseline

  // length bonuses
  if (desc.length > 80)  score += 10;
  if (desc.length > 150) score += 8;
  if (desc.length > 250) score += 7;

  // specificity signals
  if (/\d+/.test(desc))                          score += 6;  // numbers present
  if (/deliverable|output|format|file/i.test(text)) score += 5;
  if (/deadline|by|within|days|week/i.test(text))   score += 4;
  if (/example|such as|e\.g\.|i\.e\./i.test(text))  score += 4;
  if (/version|v\d|milestone/i.test(text))           score += 3;
  if (title.trim().length > 15)                      score += 4;

  // vague word penalties
  for (const w of VAGUE_WORDS) {
    if (text.includes(w)) score -= 5;
  }

  return Math.max(10, Math.min(97, score));
}

function pickEvidence(title: string, desc: string): string[] {
  const text = `${title} ${desc}`.toLowerCase();
  const found: string[] = [];

  for (const [kw, items] of Object.entries(EVIDENCE_KEYWORDS)) {
    if (text.includes(kw)) {
      for (const item of items) {
        if (!found.includes(item)) found.push(item);
      }
    }
  }

  // generic fallbacks
  if (found.length === 0) {
    found.push(
      "Screenshot or screen recording of completed work",
      "Written summary describing what was done and how",
      "Any supporting files or links referenced in the task",
    );
  }

  // always append a transaction / timestamp proof
  found.push("Solana transaction hash confirming on-chain submission");

  return found.slice(0, 4);
}

function pickMilestones(title: string, desc: string) {
  const text = `${title} ${desc}`.toLowerCase();
  if (/develop|code|program|implement|build|feature|bug|fix|script/i.test(text)) return MILESTONE_TEMPLATES.develop;
  if (/design|logo|brand|ui|ux|figma|illustrat|graphic/i.test(text))           return MILESTONE_TEMPLATES.design;
  if (/research|analys|study|survey|report|data/i.test(text))                   return MILESTONE_TEMPLATES.research;
  return MILESTONE_TEMPLATES.default;
}

function buildAnalysis(title: string, desc: string, score: number): string {
  const issues: string[] = [];
  const text = desc.toLowerCase();

  if (desc.length < 80)
    issues.push("the description is too brief to set clear expectations for a claimant");
  if (!/\d+/.test(desc))
    issues.push("no quantitative targets are specified (e.g., word count, file resolution, test coverage %)");
  if (!/deliverable|output|format|file/i.test(text))
    issues.push("the expected deliverable format is not mentioned");
  if (!/deadline|by |within|days|week/i.test(text))
    issues.push("no internal deadline or milestone dates are given");

  for (const w of VAGUE_WORDS) {
    if (text.includes(w)) {
      issues.push(`vague language detected ("${w}") — replace with a concrete specification`);
      break;
    }
  }

  if (score >= 81) {
    return `This task is well-specified. ${title} provides sufficient context for a claimant to understand scope and deliverables. Minor improvements could add even more precision around acceptance criteria.`;
  }

  const issueList = issues.length
    ? issues.map((i, idx) => `${idx + 1}) ${i}`).join("; ")
    : "the description could be more precise";

  return `The task "${title}" needs improvement before it is suitable for a smart contract bounty. Key issues: ${issueList}. A more detailed description reduces ambiguity and disputes after submission.`;
}

function buildRefined(title: string, desc: string, evidence: string[]): string {
  const evidenceHint = evidence.slice(0, 2).join(" and ");
  return `${desc.trim()} The claimant must deliver all work by the stated deadline and provide verifiable proof of completion, including ${evidenceHint}. All files must meet the quality standards described above; the bounty poster reserves the right to request one round of revisions within 48 hours of submission.`;
}

// ── Route handler ──────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: { title?: string; description?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const title = (body.title ?? "").trim();
  const description = (body.description ?? "").trim();

  if (!title && !description) {
    return NextResponse.json(
      { error: "At least one of title or description is required." },
      { status: 400 }
    );
  }

  // Simulate a short processing delay so the loading animation is visible
  await new Promise((r) => setTimeout(r, 1200));

  const clarity_score       = scoreDescription(title, description);
  const verifiable_evidence = pickEvidence(title, description);
  const milestones          = pickMilestones(title, description);
  const analysis            = buildAnalysis(title, description, clarity_score);
  const refined_description = buildRefined(title, description, verifiable_evidence);
  const status: "READY" | "NEED_REVISION" = clarity_score > 80 ? "READY" : "NEED_REVISION";

  const report: ScopingReport = {
    analysis,
    clarity_score,
    verifiable_evidence,
    milestones,
    refined_description,
    status,
  };

  return NextResponse.json(report);
}
