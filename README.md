# Athena — Private Treasury Agent for Solana

![Athena Banner](https://via.placeholder.com/1200x400/000000/FFFFFF?text=Athena+%E2%80%94+Private+Treasury+Agent)

**Athena** (formerly YieldShield) is an AI-powered treasury agent built on Solana that enables freelancers, small businesses, DAOs, and individuals to autonomously put their idle USDC to work in decentralized finance (DeFi), all through a simple conversational interface and with zero DeFi knowledge required. 

Designed for the **Colosseum Frontier Hackathon 2026**.

## 🚀 The Vision: Why Athena?

Billions of dollars in USDC sit idle in wallets and exchange accounts earning 0%. Existing yield aggregators are complex, require users to understand APY mechanics, impermanent loss, and rebalancing, and expose all financial activity publicly on-chain—a dealbreaker for businesses.

**Athena solves this by wrapping DeFi complexity behind a conversational AI agent with a privacy-first approach.** You simply tell your AI assistant what you want to achieve:
- *"Deposit 500 USDC and earn the best yield available."*
- *"Withdraw 200 USDC to my wallet."*
- *"Show me what I earned this week."*
- *"Rebalance my portfolio to the highest APY"*

The agent handles protocol selection, transaction execution, privacy wrapping, and weekly reporting—all while remaining completely non-custodial.

## 💼 Investor Highlights & Monetization

Athena is built with a sustainable, transparent, and scalable revenue model:
- **Pay-Per-Action:** A transparent, flat **0.1 USDC fee** per yield action (deposit, withdraw, rebalance), executed on-chain via smart contracts. Read-only actions are completely free.
- **Athena Pro:** A premium monthly subscription tier for enterprise users unlocking zero-fee autonomous trading and advanced features.
- **Market Projections:** With just 1,000 active users averaging 10 yield actions a month, Athena generates an annual run rate of **$12,000 USDC** with effectively zero infrastructure costs. Scaling to 10,000 users brings the run rate to **$120,000 USDC**.
- **Non-Custodial & Trustless:** Athena never holds user funds, mitigating regulatory and counterparty risks. Because it relies purely on smart contracts, there are no traditional banking intermediaries or chargeback risks.

## 🛠 Tech Stack & Core Integrations

Athena is built using a modern, scalable web stack and heavily leverages the bleeding edge of the Solana ecosystem:

### Core Architecture
- **Frontend:** React + Vite (TypeScript), TailwindCSS, Framer Motion for a premium, enterprise-grade user interface.
- **Backend:** Node.js + Express for robust AI agent orchestration and secure transaction proxying.
- **Database:** MongoDB for structured user data and encrypted private key shards.

### Blockchain & AI Ecosystem
- **AI Brain (Abacus.AI):** Integrates Claude via the RouteLLM API to power the core conversational AI agent, transforming natural language into executable, optimized DeFi strategies.
- **Privacy (Umbra SDK / Arcium):** Every deposit and withdrawal is strictly routed through the Umbra privacy layer. Transaction amounts, sender, and receiver details are shielded, ensuring complete financial privacy for businesses.
- **Yield Ecosystem (Lulo & Kamino Finance):** The agent automatically aggregates, allocates, and rebalances USDC deposits to earn the maximum available yield across Lulo Finance (USDC lending) and Kamino Finance (USDC vaults).
- **Portfolio Analytics (Covalent GoldRush API):** Provides real-time comprehensive portfolio history, token balances, and transaction timelines to power the dashboard and human-readable weekly AI reports.
- **DEX Aggregation (Jupiter v6):** Utilizes Jupiter Aggregator for underlying token-to-USDC conversions and optimal price routing during rebalancing maneuvers.
- **On-Chain Identity (SNS):** Operates under the registered Solana Name Service identity `yieldshield.sol`, establishing a verified on-chain presence.
- **Authentication & Security:** 
  - **Email Onboarding:** Frictionless "Zero-Crypto UX" onboarding via email (generating an embedded Solana wallet).
  - **Shamir's Secret Sharing (SSS):** Decentralized, highly secure client-side key fragmentation and wallet recovery. No raw keys are ever stored in `localStorage`.

## 🌟 Key Features & User Flow

1. **Frictionless Onboarding:** Sign up with an email. No seed phrases, no extensions, no complex wallet generation friction.
2. **Conversational Interface:** Talk to Athena like a real-world CFO assistant. No complex DeFi UI to navigate, the agent does the heavy lifting.
3. **Smart Dashboard:** Monitor live APY, track active positions, view total returns, and analyze data on an enterprise-grade analytics chart.
4. **Privacy by Default:** Your business transaction history and treasury size remain strictly confidential.
5. **Human-Readable Reports:** Get weekly, AI-generated treasury summaries written in plain English, ready to show to your accountant or stakeholders.

## 🏃‍♂️ Getting Started (Development)

### Prerequisites
- Node.js (v18+)
- MongoDB Database
- Solana Wallet

### 1. Start the Backend Server
```bash
cd server
npm install
# Ensure your .env is populated with MongoDB, Abacus.AI, Jupiter, and Covalent API keys requirements
npm run dev
```

### 2. Start the Frontend Application
```bash
cd athena
npm install
npm run dev
```

The application will be accessible via `http://localhost:5173`.

---
*Built for the Colosseum Frontier Hackathon 2026.*
