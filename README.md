🌌 Wishbox
AI-Driven & Privacy-Preserving Task Verification Protocol on Solana

Transforming vague human desires into quantifiable, verifiable on-chain assets.


🚀 Vision
在去中心化协作中，最大的障碍是共识的模糊性。Wishbox 通过引入 AI Agent 需求量化与地址隐私技术，让用户能够在保护隐私的前提下，将模糊的愿望转化为具备明确验证标准（Proof of Completion）的 Solana 链上任务。

🤖 核心能力：AI-Agentic Task Verification
不同于简单的愿望清单，Wishbox 集成了一个 AI Task Architect (基于 Claude 3.5)，它充当了“需求工程师”的角色：

去模糊化 (De-ambiguation)：自动识别并修正用户输入中的含糊词汇。

验证标准定义 (Verification Evidence)：为每个愿望自动生成明确的验证证据清单（如：GitHub PR、链上交易、特定格式截图）。

任务拆解 (Decomposition)：将复杂的宏大愿望拆解为 3-4 个可执行的 Milestone，大幅降低执行者的理解门槛。

审计报告 (Cyber-Audit)：在愿望上链前，AI 会给出清晰度评分（Clarity Score），确保任务是“可结算的”。

🔒 隐私保护：Address Privacy
为了确保用户在表达需求时无需暴露其核心财务身份，我们实现了 Ephemeral Wallet (影子钱包) 逻辑：

身份解耦：支持一键生成本地临时密钥对。

按需注资：主钱包仅需通过一次签名注入微量 Gas。

匿名发布：愿望以匿名地址发布，在确保链上透明性的同时，切断了行为与主钱包的直接关联。

🛠️ 技术栈 (Tech Stack)
Frontend: Next.js (App Router) + Tailwind CSS + Framer Motion

Smart Contract: Anchor Framework (Rust) on Solana

AI Infrastructure: Claude-3.5-Sonnet (Requirement Scoping & Audit)

Wallet: Solana Wallet Adapter (Phantom Support)

Deployment: Vercel (Frontend) & Solana Devnet (Program)

📥 快速启动 (Quick Start)
1. 克隆并安装依赖
Bash
git clone https://github.com/futureclover87/wishbox-solana.git
cd wishbox-solana
npm install --legacy-peer-deps
2. 配置环境变量
在根目录创建 .env.local：

代码段
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
ANTHROPIC_API_KEY=your_api_key_here
3. 本地开发
Bash
npm run dev
访问 http://localhost:3000，连接 Phantom (切换至 Devnet) 并开启 "Privacy Mode" 进行体验。

🔗 入口与资源
Live Demo: v0-wishbox-solana.vercel.app

Smart Contract: programs/workspace/src/lib.rs

AI Logic: pages/api/scoping.ts

[Continue working on v0 →](https://v0.app/chat/projects/prj_33GJxY5B5TOCb3UJkUmE9mPdV83t)