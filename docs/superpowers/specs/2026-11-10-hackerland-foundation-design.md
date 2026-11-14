# Hackerland Foundation — Design Spec

- **Date:** 2026-11-10
- **Status:** Draft — awaiting review
- **Domain:** hackerland.in
- **Scope of this spec:** Sub-project 1 ("Foundation"): monorepo, design system, web app UI shell on sample data, MongoDB + auth scaffold.

---

## 1. Intent

### What was asked
- Replace the existing placeholder Next.js code entirely.
- Set up a **monorepo**.
- Build a **design system** from the uploaded Stitch export ("Aerospace Maker System" `DESIGN.md` + 8 screen mockups). The design may be altered where it improves the product.
- The product is an **innovators' community / social network**, in the spirit of Collaborizm.
- Vision: *the biggest open-source community for free earning, innovation, tech, design, building and making — students, designers, innovators, programmers and all like-minded people in one place.*
- Backend database: **MongoDB**.
- First deliverable: **Foundation + UI shell** (key screens on sample data; DB and auth scaffolded, not wired to every screen).
- Earning model to design for: **sponsored bounties, paid project roles, grants & hackathon prizes, reputation → gigs**.

### Assumptions (stated, open to correction)
- India-first audience (hackerland.in, ₹ alongside $), global-ready.
- Dark-first visual identity (as in the mockups).
- The codebase itself will be open source (existing BSD-3-Clause licence retained).
- Payments, moderation tooling and real-time chat are later sub-projects.

### Success criteria for this sub-project
1. `pnpm install && pnpm dev` runs the web app locally with no database or secrets configured.
2. `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` all pass from the repo root (Turborepo).
3. Every screen listed in §6 renders at desktop (1440px) and phone (390px) widths with no horizontal scroll and no console errors (Playwright smoke test).
4. Design tokens live in one place (`@hackerland/ui`) and every screen is built only from those tokens and DS components.
5. Auth (email/password, plus GitHub/Google when keys are present) and Mongoose models are in place and unit-tested; screens still read sample data.

---

## 2. Research summary

| Platform | What it does well | Gap Hackerland fills |
|---|---|---|
| **Collaborizm** (2013 – closed; ~115k members by 2017) | Cross-discipline team formation around projects; freelance marketplace; planned "collaborator skills" leaderboard | Closed. Its core loop — *find people → form a squad → build → earn* — has no active successor. |
| **Devfolio / Unstop** (India) | Hackathon & competition listings, registrations | Event-centric; teams dissolve after the event. No ongoing project rooms. |
| **Peerlist** | Builder profiles, portfolios, launches | Profile-centric; little team formation or earning. |
| **Hackster / Instructables** | Hardware build guides | Publishing, not collaboration; little software or design. |
| **GitHub** | Code collaboration | Code-only; hard for designers, makers and students to join. |

**Positioning:** Hackerland is where **people from every discipline form squads around real projects and get paid for contributing**, with **portable reputation** that carries across projects. It combines event energy (hackathons, sprints), project rooms (squads) and an earning layer (bounties, paid roles, grants).

**Lessons applied**
- Collaborizm's main asset was the *team-formation loop*. The foundation puts **Projects/Squads with open roles** at the centre of the IA rather than a generic feed.
- Reputation must be **auditable** → an append-only reputation ledger (§8) instead of a mutable counter.
- Students are a core audience → under-18 users are expected. India's DPDP Act 2023 treats under-18s as children (verifiable parental consent; no behavioural tracking or targeted ads). The design **does not display ages** (the mockups showed "Age 16", "Age 74"). It uses opt-in *experience badges* (e.g. "Student", "40+ yrs in aerospace") instead. Real consent flows belong to the identity sub-project.

Sources: [Crunchbase — Collaborizm](https://www.crunchbase.com/organization/collaborizm), [YourStory 2017 founder interview](https://yourstory.com/2017/04/collaborizm-steven-reubenstone), [PitchBook — Collaborizm](https://pitchbook.com/profiles/company/103894-30), [Devfolio Build India 2026](https://devfolio.co/blog/buildindia2026/), [Peerlist hackathons](https://peerlist.io/hackathons/dec-hackathon).

---

## 3. Decomposition (whole platform)

The full vision has many independent subsystems. Each gets its own spec → plan → implementation cycle.

| # | Sub-project | Contents |
|---|---|---|
| **1** | **Foundation (this spec)** | Monorepo, design system, web UI shell on sample data, Mongo + auth scaffold, CI |
| 2 | Identity & profiles | Real sign-up/onboarding (tracks, skills), profile editing, handles, under-18 consent flow |
| 3 | Projects & squads | Create project, open roles, join requests, members, project updates |
| 4 | Feed & social graph | Posts, comments, reactions, follows, notifications |
| 5 | Earning | Bounties (post → claim → submit → accept), paid roles, grants/hackathon aggregation, payouts (UPI/Razorpay, Stripe) |
| 6 | Reputation | Ledger rules, badges, endorsements, leaderboard, reputation-gated gigs |
| 7 | Learn & make | Roadmaps CRUD, makerspace / fab-lab directory, parts marketplace |
| 8 | Trust & safety | Moderation, reporting, spam controls, child-safety review |

Not in this spec: anything from rows 2–8 beyond the UI shell and data-model scaffolding.

---

## 4. Approaches considered

**A. Tailwind v4 tokens + own CVA components (recommended, chosen).** Tokens are CSS variables exposed through Tailwind v4 `@theme`. Components are small typed React wrappers using `class-variance-authority`, in the shadcn style. *Pros:* full control of the distinctive look, no runtime CSS-in-JS, tokens usable anywhere, easy for OSS contributors. *Cons:* we write and maintain our own primitives.

**B. Adopt shadcn/ui + Radix wholesale and re-theme.** *Pros:* accessible interactive primitives out of the box. *Cons:* pulls many components we don't need yet, and the default shadcn look tends to leak through.

**C. CSS-in-JS / Panda / vanilla-extract.** *Pros:* typed tokens. *Cons:* extra build steps, less familiar to contributors, weaker fit with RSC.

Decision: **A**. We add Radix primitives only when a component needs complex interaction (dialogs, menus, popovers). Nothing in the foundation needs them yet.

---

## 5. Architecture

### 5.1 Repository layout

```
hackerland/
├─ apps/
│  └─ web/                    Next.js 16 App Router — hackerland.in
│     ├─ src/app/             routes (see §6)
│     ├─ src/components/      app-level composites (header, footer, cards per domain)
│     ├─ src/lib/auth*.ts     Better Auth server + client
│     ├─ src/lib/data/        sample fixtures + typed query functions (swap to Mongo later)
│     └─ e2e/                 Playwright smoke tests
├─ packages/
│  ├─ ui/                     @hackerland/ui — tokens (theme.css), components, cn(), DESIGN.md
│  ├─ core/                   @hackerland/core — domain constants & zod schemas/types (tracks, compensation, opportunity kinds, reputation rules)
│  ├─ db/                     @hackerland/db — Mongo connection helper + Mongoose models
│  └─ config/                 @hackerland/config — shared tsconfig bases + ESLint flat config
├─ docs/
│  ├─ design/stitch-source/   original uploaded DESIGN.md + downscaled reference screens
│  └─ superpowers/specs/      design specs
├─ docker-compose.yml         local MongoDB
├─ .github/workflows/ci.yml   lint · typecheck · test · build
├─ turbo.json · pnpm-workspace.yaml · package.json
└─ README.md · CONTRIBUTING.md · CODE_OF_CONDUCT.md · LICENSE · .env.example
```

**Boundaries**
- `ui` knows nothing about the domain (no "project" or "bounty" components). It has primitives plus generic composites (StatTile, SectionHeader, ProgressBar…).
- `core` is pure TypeScript + zod, with no React and no Mongo. Both `web` and `db` import it.
- `db` depends on `core`. It exports `connectDb()` and models. Nothing in it is web-specific.
- `web` composes everything. The domain components (ProjectCard, BountyCard, PostCard…) live here.

### 5.2 Toolchain (verified current versions, Nov 2026)

| Tool | Version | Notes |
|---|---|---|
| Node | ≥ 22 | `engines` field + `.nvmrc` |
| pnpm | 10.x | workspaces; `packageManager` field |
| Turborepo | 2.11 | tasks: `dev build lint typecheck test` |
| Next.js | 16.4 | App Router, RSC, Turbopack |
| React | 19.3 | |
| TypeScript | 6.0 | TS 7 (native) is very new and its JS API isn't yet supported by typescript-eslint/Next tooling; revisit later |
| Tailwind CSS | 4.3 | CSS-first `@theme`, `@source` to scan `packages/ui` |
| better-auth | 1.7 | MongoDB adapter |
| mongoose / mongodb | 9.12 / 7.8 | |
| zod | 4.x | |
| lucide-react | 1.x | Icons (replaces the mockups' Material Symbols font: tree-shaken SVGs, no icon-font FOUT) |
| Vitest | 5.x | unit tests in packages and web |
| Playwright | 1.65 | e2e smoke (browser pre-installed in CI image / dev machines) |
| ESLint 10 + Prettier 3 | | flat config in `@hackerland/config` |

Internal packages ship **TypeScript source** (no build step). `web` lists them in `transpilePackages`. This is the simplest setup that works with Turborepo and Next.

### 5.3 Runtime without secrets
- Screens read from `src/lib/data/*` (sample fixtures) through async query functions with the same signatures the Mongo version will have. Sub-projects 2–5 replace the query bodies only.
- MongoDB connects **lazily** on first use. `next build` and pages work with no `MONGODB_URI`.
- Auth routes return a clear "auth not configured" state when `MONGODB_URI`/`BETTER_AUTH_SECRET` are missing. The sign-in page shows that message instead of crashing.
- A small **"Preview · sample data"** pill appears in the footer while fixtures are in use, so a deployed preview never presents made-up numbers as real.

---

## 6. Information architecture & screens

Primary nav: **Feed · Projects · Earn · Learn**, plus search, notifications, "Start project", avatar.

| Route | Source mockup | Contents (foundation) |
|---|---|---|
| `/` | *new* | Landing: hero ("Build together. Earn together."), the six tracks, featured projects, open bounties, how-it-works (Find → Squad → Build → Earn), CTA |
| `/feed` | Universal Discovery Feed | Filter chips; post cards (build log w/ progress & media, squad call w/ open roles & funding, Q&A w/ accepted answer + code block); right rail: open bounties, squad of the week, start-project CTA |
| `/projects` | *new (from cards)* | Track filter, grid of project cards (stage, squad size, open roles, funding) |
| `/projects/[slug]` | Maker Squads Collaboration | Project room: header + licence/visibility tags, stat strip (stage, funding, squad, activity), squad leads, open roles w/ compensation, resources/BOM table, discussion feed |
| `/u/[handle]` | Innovator Profile | Profile header (no age; experience badges), stats, tabs (Projects · Contributions · Endorsements), mentorship pairs, credentials, reputation ledger preview |
| `/earn` | Grants & Capital (simplified) + bounty rail | Tabs: Bounties · Paid roles · Grants · Hackathons; opportunity cards with reward, deadline, sponsor, tracks |
| `/learn` | Skill Roadmaps | Track tabs, spotlight roadmaps, staged roadmap (stages → modules with free/certified tags, hours) |
| `/new` | Start Project / AI Studio | Multi-step "Start a project" UI (idea → tracks & skills → roles → review); step navigation is client-side only, no persistence |
| `/sign-in`, `/sign-up` | *new* | Email/password + OAuth buttons (shown when configured) |
| `/design-system` | *new* | Living style guide: colour tokens, type scale, spacing, all components & states — the contributor reference |
| `not-found`, `error` | *new* | Styled 404 / error boundary |

**Deferred from the mockups:** Fab Lab / rapid prototyping and the Hardware Market (sub-project 7 — they need marketplace, payments and logistics). Investor vault and legal spin-off launchpad are out of scope entirely: they carry regulatory risk and are not core to community/earning.

**Content rules for sample data:** fictional people and organisations only. No third-party product names used as Hackerland features (the mockups' "Collaborizm Squads", "Instructables guides", "HackerRank/HackerEarth challenges" become **Squads**, **Build guides** and **Challenges**). No implied partnerships with real institutions (NASA, YC, MIT…). Free-courseware links to real public resources are fine as *external resources*.

---

## 7. Design system — "Hackerland Mission Control"

Evolved from the uploaded *Aerospace Maker System*. The original is preserved verbatim in `docs/design/stitch-source/DESIGN.md`. The working spec lives at `packages/ui/DESIGN.md`.

### 7.1 What we keep
- Visual identity: **mission control × maker workshop**. Deep navy canvas, hairline borders, telemetry-style labels, restrained neon glows.
- Typefaces: **Space Grotesk** (display, headings, labels, numbers) + **Inter** (body/UI), loaded with `next/font`.
- Type scale names (`display-hero`, `headline-xl…sm`, `body-lg…sm`, `label-lg…sm`).
- Shape scale (4px base, 8px cards, 12px dialogs), 4/8px spacing rhythm, 44px minimum touch targets, tabular numerals.
- Elevation model: tonal layering + hairline strokes + emissive focus halos.

### 7.2 What we change, and why

1. **One canonical palette.** The upload has two conflicting palettes: a Material-3 YAML block with grey-ish surfaces (`#0f131c`, `#1c1f29`…) and a navy scale in the prose (`#0A0E17`, `#101726`, `#182238`…). The screens also mix **cyan** and **neon green** as the primary colour. We adopt the **navy prose scale** and **Ion Cyan as the single primary**. Green is reserved for success / live / earn.
2. **Three-tier tokens.** Primitives (`--hl-navy-950…`, `--hl-cyan-400…`) → semantic (`--hl-bg`, `--hl-surface-1/2/3`, `--hl-border`, `--hl-fg`, `--hl-fg-muted`, `--hl-accent`, `--hl-focus`…) → Tailwind `@theme` utilities (`bg-surface-1`, `text-fg-muted`, `border-hairline`…). Components use semantic tokens only, so a light theme later is one extra CSS block.
3. **Disciplines become "tracks"** (the upload colour-codes aerospace domains; Hackerland serves everyone):

   | Track | Covers | Colour |
   |---|---|---|
   | **Code** | software, web, mobile, AI/ML | Ion Cyan `#00E5FF` |
   | **Make** | hardware, robotics, electronics, fabrication | Forge Amber `#FF8A00` |
   | **Design** | UI/UX, product, visual, industrial | Signal Pink `#FF5FA2` *(new)* |
   | **Research** | deep-tech, space, bio, climate, science | Plasma Violet `#A970FF` *(lightened from `#7928CA` for legibility on navy)* |
   | **Earn** | bounties, paid roles, grants, prizes | Emerald `#00F59B` |
   | **Learn** | roadmaps, courses, mentorship | Electric Blue `#4D9FFF` |

   Each track gets `fg`, `bg-tint` and `border` tokens, so Badge/Chip/Card-accent can take `track="make"` etc.
4. **Status colours** stay: success `#00F59B`, warning `#FFD600`, danger `#FF334B`, plus info = cyan.
5. **Legibility.** `label-sm` goes from 10px to **11px**. All-caps labels are limited to `label-*` styles. Muted text is checked for ≥ 4.5:1 contrast on every surface it sits on. Body text has a 15px minimum.
6. **Glow discipline.** Neon halos appear only on hover/focus and on the single primary CTA per view. They are not used decoratively on static content.
7. **Motion.** 150–200ms ease-out transitions. The live-status pulse and progress shimmer are disabled under `prefers-reduced-motion`.
8. **Code font.** Adds **JetBrains Mono** for code blocks (the feed shows real code; Space Grotesk isn't monospaced).
9. **No ages.** Experience badges replace age badges (see §2).
10. **Plain-language navigation.** The "mesh/telemetry" vocabulary stays as brand flavour (footer status bar, labels like `LIVE`). Primary navigation and actions use plain words ("Join squad", not "Invite node").

### 7.3 Components in `@hackerland/ui` (foundation set)

`Button` (primary · secondary · ghost · make · earn · danger; sm/md/lg; loading; `asChild` via `@radix-ui/react-slot`, the one Radix dependency) · `IconButton` · `Badge` (track · status · neutral; outline/solid) · `Chip`/`FilterChip` · `Card` (+ `CardHeader/Body/Footer`, optional track accent bar on hover) · `Panel` (section container with title row) · `SectionHeader` (eyebrow + title + action) · `StatTile` · `ProgressBar` + `SegmentedProgress` · `Avatar` + `AvatarGroup` · `Input` · `Textarea` · `SearchField` · `Label` · `Tabs` (client, keyboard accessible) · `StatusDot` (live pulse) · `CodeBlock` · `Divider` · `EmptyState` · `Kbd` · `cn()`.

Every interactive component has visible `:focus-visible` styling, a 44px minimum hit area at default size, and correct roles/ARIA.

---

## 8. Data model (MongoDB, scaffolded in `@hackerland/db`)

Better Auth owns the `user`, `session`, `account` and `verification` collections. Hackerland data references `user._id` as `userId`.

| Collection | Key fields | Notes |
|---|---|---|
| `profiles` | `userId` (unique), `handle` (unique, lowercase), `displayName`, `headline`, `bio`, `avatarUrl`, `location`, `tracks[]`, `skills[]`, `experienceBadges[]`, `links[]`, `reputation` (cached sum), timestamps | Profile separate from auth user so auth stays swappable |
| `projects` | `slug` (unique), `title`, `summary`, `body`, `tracks[]`, `tags[]`, `stage` (`idea·prototype·beta·launched`), `licence`, `visibility`, `ownerId`, `members[{userId, role, isLead}]`, `openRoles[{title, track, skills[], description, compensation, status}]`, `funding{goal, raised, currency}`, `resources[{name, qty, spec, cost, status}]`, timestamps | `compensation` = `{type: volunteer·stipend·bounty·revenue-share·equity, amount?, currency?, period?}` |
| `posts` | `authorId`, `projectId?`, `kind` (`update·question·showcase·squad-call`), `title`, `body` (markdown), `media[]`, `tags[]`, `counts{reactions, comments}`, `acceptedAnswerId?`, timestamps | Indexed by `createdAt` for the feed |
| `opportunities` | `kind` (`bounty·paid-role·grant·hackathon·gig`), `title`, `summary`, `sponsor{name, url?}`, `reward{amount, currency, kind}`, `tracks[]`, `deadline?`, `status` (`open·in-review·closed`), `projectId?`, `externalUrl?`, `createdBy` | One collection for every earning surface |
| `reputationEvents` | `userId`, `kind`, `points`, `ref{type, id}`, `createdAt` | **Append-only ledger.** `profiles.reputation` is a cache that can be rebuilt from it |
| `roadmaps` | `slug`, `title`, `track`, `level`, `stages[{title, modules[{title, provider, hours, url, free, certified}]}]` | |

Shared enums and zod schemas (`Track`, `ProjectStage`, `Compensation`, `OpportunityKind`, `ReputationEventKind` + point values) live in `@hackerland/core`. Mongoose schemas reuse the same enums.

---

## 9. Auth

- **Better Auth** with `mongodbAdapter(client.db())`. Handler at `/api/auth/[...all]` via `toNextJsHandler`.
- Email + password enabled. GitHub and Google providers are registered only when their env vars exist.
- `authClient` (React) used by the sign-in/up forms.
- Env (`.env.example`): `MONGODB_URI`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, optional `GITHUB_CLIENT_ID/SECRET`, `GOOGLE_CLIENT_ID/SECRET`.
- Out of scope here: onboarding, handle claiming, under-18 consent, email verification (sub-project 2).

---

## 10. Error handling

- Unknown project slug / handle → `notFound()` → styled 404.
- Route-level `error.tsx` boundary with retry.
- Missing DB/auth env → auth pages show "Sign-in isn't configured on this deployment yet". Nothing else depends on the DB.
- `connectDb()` caches the connection on `globalThis` (survives dev hot-reload) and throws a typed error with a helpful message when `MONGODB_URI` is absent.

---

## 11. Testing

| Layer | Tooling | What |
|---|---|---|
| `@hackerland/ui` | Vitest + Testing Library (jsdom) | Each component renders; variants map to the right classes; Tabs keyboard nav; Button `asChild`/loading/disabled semantics |
| `@hackerland/core` | Vitest | zod schemas accept valid / reject invalid; reputation point table is exhaustive |
| `@hackerland/db` | Vitest | Model `validateSync()` for required fields, enums, unique-index declarations (no live DB needed) |
| `web` | Vitest | Query functions return fixtures matching core schemas |
| `web` e2e | Playwright | Every route in §6 at 1440px & 390px: HTTP 200, no console errors, no horizontal overflow; screenshots attached to PR |

**Environment note:** this cloud environment cannot reach a MongoDB server (Docker daemon unavailable, mongodb.org downloads blocked). Live sign-up/sign-in round-trips will be verified locally (`docker compose up mongo`) or in a later session with DB access. The auth config itself is unit-tested.

CI (`.github/workflows/ci.yml`): pnpm install (cached) → `turbo lint typecheck test build` → Playwright smoke.

---

## 12. Deployment (documented, not executed)

- `apps/web` → Vercel (root `apps/web`, Turborepo-aware), domain **hackerland.in**.
- MongoDB Atlas (M0 free tier to start) or self-hosted Mongo 8.
- Secrets set in the hosting dashboard; never committed.

---

## 13. Out of scope (explicit)

Real persistence for feed/projects/profiles, onboarding, notifications, chat/real-time, payments/payouts, moderation, search backend, image uploads, light theme, i18n, native mobile apps, Fab Lab & Market, investor/legal features.
