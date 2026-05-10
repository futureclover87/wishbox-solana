🌌 Wishbox
AI-Driven & Privacy-Preserving Task Verification Protocol on Solana

Transforming vague human desires into quantifiable, verifiable on-chain assets.

🚀 Vision
In decentralized collaboration, the greatest obstacle is the ambiguity of consensus. Wishbox introduces AI-Agentic requirement scoping and address privacy technology, enabling users to transform fuzzy "wishes" into Solana-based tasks with crystal-clear Proof of Completion—all while protecting their primary identity.

🤖 Core Capability: AI-Agentic Task Verification
Beyond a simple wishlist, Wishbox integrates an AI Task Architect (powered by Claude 3.5) that acts as a "Requirement Engineer":

De-ambiguation: Automatically identifies and refines vague terminology in user inputs.

Verification Evidence: Generates a precise checklist of required evidence for each wish (e.g., GitHub PRs, on-chain transaction hashes, specific screenshots).

Task Decomposition: Breaks down complex, grand visions into 3-4 executable Actionable Specs, significantly lowering the barrier for contributors.

Cyber-Audit: Before a wish is anchored on-chain, the AI provides a Clarity Score to ensure the task is "settable" and verifiable.

🔒 Privacy Protection: Address Privacy
To ensure users can express needs without exposing their core financial identity, we have implemented Identity Abstraction via Ephemeral (Shadow) Wallets:

Identity Decoupling: Supports one-click generation of local, temporary keypairs.

On-Demand Funding: The primary wallet injects a tiny amount of Gas via a single signature to the shadow address.

Anonymous Publishing: Wishes are published using anonymous addresses. This ensures on-chain transparency while severing the direct link between user behavior and their primary wallet.

🛠️ Tech Stack
Frontend: Next.js (App Router) + Tailwind CSS + Framer Motion

Smart Contract: Anchor Framework (Rust) on Solana Devnet

AI Infrastructure: Claude-3.5-Sonnet (Requirement Scoping & Audit)

Wallet: Solana Wallet Adapter (Phantom Support)

Deployment: Vercel (Frontend) & Solana Blockchain (Program)

📥 Quick Start
1. Clone and Install Dependencies
Bash
git clone https://github.com/futureclover87/wishbox-solana.git
cd wishbox-solana
npm install --legacy-peer-deps
2. Configure Environment Variables
Create a .env.local file in the root directory:

代码段
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
ANTHROPIC_API_KEY=your_api_key_here
3. Local Development
Bash
npm run dev
Visit http://localhost:3000, connect your Phantom wallet (switch to Devnet), and toggle "Privacy Mode" to start the experience.

🔗 Resources & Entry Points
Live Demo: v0-wishbox-solana.vercel.app

Smart Contract: programs/workspace/src/lib.rs

AI Logic: pages/api/scoping.ts

[Continue working on v0 →](https://v0.app/chat/projects/prj_33GJxY5B5TOCb3UJkUmE9mPdV83t)

Built for the Solana Global Task Economy.