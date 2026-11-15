# Hackerland

**Turn any idea into a buildable plan, the right team, and an honest path to reality.**

Hackerland is the open-source community platform where students, designers, programmers, makers, and innovators form squads around real-world projects and earn. It bridges physical fabrication with digital intelligence across six disciplines: **Code**, **Make**, **Design**, **Research**, **Earn**, and **Learn**.

---

## Architecture

Managed as a **pnpm + Turborepo** monorepo:

```
hackerland/
├── apps/
│   └── web/                   # Next.js 16 (App Router) + React 19 + Tailwind CSS 4
│       ├── src/app/           # Routes: /, /feed, /projects, /u/[handle], /earn, /learn, /new, /design-system
│       ├── src/components/    # App shell, domain cards (ProjectCard, OpportunityCard, PostCard, RoadmapCard)
│       ├── src/lib/auth*.ts   # Better Auth client & server configuration
│       ├── src/lib/data/      # Typed sample fixtures & queries
│       └── e2e/               # Playwright smoke test suite
├── packages/
│   ├── ui/                    # "Hackerland Mission Control" design system (tokens in theme.css, CVA components)
│   ├── core/                  # Domain types, Zod schemas, tracks, compensation, money formatting, reputation rules
│   ├── db/                    # MongoDB connection helpers and Mongoose models
│   └── config/                # Shared TypeScript and ESLint flat configs
└── docs/                      # Product specifications and architecture plans
```

---

## Quick Start

### Prerequisites
- Node.js ≥ 22
- pnpm ≥ 10 (`corepack enable` or `npm install -g pnpm`)

### Local Setup
```bash
# Clone the repository
git clone https://github.com/Hackerland-in/hackerland.git
cd hackerland

# Install dependencies across all workspace packages
pnpm install

# Start development server (runs with typed sample data with zero configuration)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

Run commands across packages using Turborepo from the root:

| Command | Action |
|---|---|
| `pnpm dev` | Start development servers |
| `pnpm build` | Production build across all packages |
| `pnpm lint` | ESLint across all packages |
| `pnpm typecheck` | TypeScript verification across all packages |
| `pnpm test` | Vitest unit tests (114 passing tests) |
| `pnpm test:e2e` | Playwright end-to-end smoke tests (29 passing tests) |
| `pnpm turbo run lint typecheck test build` | Run full validation pipeline |

---

## Environment Variables

Copy `.env.example` to `apps/web/.env.local` to connect to a live MongoDB instance:

| Variable | Description | Default / Example |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas or local connection string | `mongodb+srv://...` or `mongodb://localhost:27017/hackerland` |
| `BETTER_AUTH_SECRET` | 32-byte secret for session token signing | Generate via `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Canonical origin for authentication | `https://www.hackerland.in` or `http://localhost:3000` |
| `GITHUB_CLIENT_ID` | Optional GitHub OAuth app client ID | — |
| `GITHUB_CLIENT_SECRET` | Optional GitHub OAuth app secret | — |
| `GOOGLE_CLIENT_ID` | Optional Google Cloud OAuth client ID | — |
| `GOOGLE_CLIENT_SECRET` | Optional Google Cloud OAuth secret | — |

---

## Roadmap

The platform development is structured into 8 modular sub-projects:

| # | Sub-project | Status | Scope |
|---|---|---|---|
| **1** | **Foundation** | **Shipped** | Monorepo scaffold, design system, web UI shell on sample data, Mongo + auth models, Playwright CI |
| 2 | Identity & Profiles | Upcoming | Live user onboarding, handle claiming, profile editing, India DPDP Act under-18 consent flow |
| 3 | Projects & Squads | Upcoming | Live project creation, role recruitment, join applications, project build updates |
| 4 | Feed & Social Graph | Upcoming | Publishing posts, comments, reactions, upvotes, and follows |
| 5 | Earning Layer | Upcoming | Bounty escrow, paid roles, grant aggregation, payouts (UPI / Razorpay, Stripe) |
| 6 | Reputation Engine | Upcoming | Live append-only reputation ledger calculating points dynamically from platform contributions |
| 7 | Learn & Make | Upcoming | Roadmaps CRUD, makerspace / fab-lab directory (Atal Tinkering Labs), parts marketplace |
| 8 | Trust & Safety | Upcoming | Moderation queues, report flagging, spam detection, child safety review |

---

## License

BSD-3-Clause License. See [LICENSE](LICENSE) for details.
