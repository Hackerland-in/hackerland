# Hackerland Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder Next.js app with a pnpm + Turborepo monorepo. It contains the "Hackerland Mission Control" design system, a web UI shell of every foundation screen on sample data, and a MongoDB + Better Auth scaffold.

**Architecture:** Internal packages ship TypeScript source, and `apps/web` consumes them through `transpilePackages`. `@hackerland/core` (zod + enums) is shared by `@hackerland/db` (Mongoose models) and `apps/web`. `@hackerland/ui` is domain-free: tokens in `theme.css`, CVA components. Web pages are server components that read async query functions backed by fixtures, and later sub-projects swap those bodies for Mongo.

**Tech Stack:** Node ≥ 22, pnpm 10, Turborepo 2.11, Next.js 16.4, React 19.3, TypeScript 6.0, Tailwind CSS 4.3, class-variance-authority, tailwind-merge 3, clsx, @radix-ui/react-slot, lucide-react, zod 4, mongoose 9.12, mongodb 7.8, better-auth 1.7, Vitest 5 + Testing Library + jsdom, @playwright/test **1.63.0** (matches the browsers pre-installed in `/opt/pw-browsers`), ESLint 10 flat config + Prettier 3.

**Spec:** `docs/superpowers/specs/2026-11-10-hackerland-foundation-design.md`

## Global Constraints

- Delete all pre-existing app code (`app/`, `public/`, root `next.config.mjs`, `tailwind.config.ts`, `postcss.config.js`, `.eslintrc.json`, `package-lock.json`, `tsconfig.json`). Keep `LICENSE` (BSD-3-Clause), `.git`, and `docs/`.
- Package names: `@hackerland/web`, `@hackerland/ui`, `@hackerland/core`, `@hackerland/db`, `@hackerland/config`. Root `packageManager: "pnpm@10.28.0"`, `engines.node: ">=22"`, `.nvmrc` = `22`.
- Every package has the scripts `lint` (`eslint .`), `typecheck` (`tsc --noEmit`) and `test` (`vitest run`). Root scripts run them through `turbo run`.
- `pnpm install && pnpm dev` must work with **no** `.env` file. No module may throw at import time for a missing env var.
- `ui` must not import from `core`, `db` or `web`. `core` has no React and no Mongo imports.
- Components use **semantic tokens only** (never raw hex) outside `packages/ui/src/theme.css` and `packages/ui/src/tokens.ts`.
- Six tracks, exact ids, labels and colours: `code` Code `#00E5FF` · `make` Make `#FF8A00` · `design` Design `#FF5FA2` · `research` Research `#A970FF` · `earn` Earn `#00F59B` · `learn` Learn `#4D9FFF`.
- Status colours: success `#00F59B`, warning `#FFD600`, danger `#FF334B`, info = accent cyan `#00E5FF`.
- Navy scale: canvas `#0A0E17`, surface-1 `#101726`, surface-2 `#182238`, surface-3 `#1C2842`, sunken `#0D131F`, hairline `#1E2B45`, line `#2A3B5E`.
- Fonts: Space Grotesk (display, headings, labels), Inter (body), JetBrains Mono (code), loaded with `next/font/google`.
- `label-sm` is **11px** (not 10px). Body text is at least 15px (`body-md`). Default-size interactive controls are at least 44px tall.
- Glows appear only on hover/focus and on one primary CTA per view. Every animation is wrapped in `motion-safe:`.
- Never display ages. Use experience badges ("Student", "40+ yrs aerospace").
- Sample data is fictional. No third-party products used as feature names (use **Squads**, **Build guides**, **Challenges**). No implied partnerships with real institutions. Real free-courseware sites may appear as external module providers.
- The footer always shows the pill **"Preview · sample data"** while fixtures back the queries.
- Primary nav labels: **Feed · Projects · Earn · Learn**. Primary CTA: **Start project**.

## Review Focus

1. **Unknown slug/handle** (`/projects/does-not-exist`, `/u/nobody`) must return HTTP 404 with the styled not-found page, not a 500. Test in Task 9 and Task 10.
2. **Unrecognised query params** (`/feed?kind=banana`, `/projects?track=foo`, `/earn?kind=x`, `/learn?track=x`) must fall back to "all" and render normally. Tested in Task 6 (query parsing) and Task 8 (e2e).
3. **Filters with zero results** must show `EmptyState`, not a blank area. The fixtures deliberately contain no `gig` opportunity and no `learn`-track project. Tested in Tasks 9 and 11.
4. **Long unbroken content** (a 90-char project title, a 30-char (maximum) handle, a long URL in a post) must not cause horizontal scroll at 390px. The fixtures include such a project, and the smoke test asserts no overflow on every route (Task 7 harness).
5. **Auth not configured** (no `MONGODB_URI` / `BETTER_AUTH_SECRET`): `/api/auth/*` must return 503 JSON and the sign-in page must show a "not configured" notice with a disabled form. Tested in Task 13.

---

## File Structure

```
package.json · pnpm-workspace.yaml · turbo.json · .nvmrc · .npmrc · .gitignore · .editorconfig
.prettierrc.json · .prettierignore · docker-compose.yml · .env.example
README.md · CONTRIBUTING.md · CODE_OF_CONDUCT.md · LICENSE (kept)
.github/workflows/ci.yml
docs/design/stitch-source/DESIGN.md + screens/*.webp
packages/config/   package.json · tsconfig/{base,library,react-library,nextjs}.json · eslint/{base,react,next}.js
packages/core/src/ tracks.ts · projects.ts · opportunities.ts · posts.ts · reputation.ts · money.ts · handle.ts · index.ts (+ *.test.ts)
packages/ui/src/   theme.css · tokens.ts · cn.ts · index.ts · DESIGN.md (package root)
                   components/{button,icon-button,badge,chip,status-dot,kbd,divider,label,input,textarea,search-field,
                               card,panel,section-header,stat-tile,progress,avatar,tabs,code-block,empty-state}.tsx (+ tests)
packages/db/src/   connection.ts · mongo-client.ts · models/{profile,project,post,opportunity,reputation-event,roadmap}.ts · index.ts (+ tests)
apps/web/          package.json · next.config.ts · postcss.config.mjs · tsconfig.json · eslint.config.js · vitest.config.ts · playwright.config.ts
  src/app/         layout.tsx · globals.css · page.tsx · not-found.tsx · error.tsx
                   feed/ · projects/ · projects/[slug]/ · u/[handle]/ · earn/ · learn/ · new/ · sign-in/ · sign-up/ · design-system/
                   api/auth/[...all]/route.ts
  src/components/  layout/{app-header,main-nav,mobile-nav,app-footer,skip-link}.tsx
                   domain/{track-badge,money,person-chip,project-cover,project-card,role-card,opportunity-card,post-card,roadmap-card}.tsx
                   auth/auth-form.tsx · new-project/wizard.tsx
  src/lib/         format.ts · auth.ts · auth-client.ts
  src/lib/data/    types.ts · fixtures/{people,projects,posts,opportunities,roadmaps}.ts · queries.ts (+ queries.test.ts)
  e2e/             routes.ts · smoke.spec.ts · a11y.spec.ts
```

---

### Task 1: Monorepo scaffold + `@hackerland/core`

**Files:**
- Delete: everything listed in Global Constraints.
- Create: the root files and `packages/config/*` (from File Structure), plus `packages/core/{package.json,tsconfig.json,eslint.config.js,vitest.config.ts}` and `packages/core/src/*`.
- Test: `packages/core/src/*.test.ts`

**Interfaces:**
- Produces (`@hackerland/core`):
  - `TRACKS = ['code','make','design','research','earn','learn'] as const`, `type Track`, `trackSchema`, `TRACK_META: Record<Track,{label:string; description:string}>`
  - `PROJECT_STAGES = ['idea','prototype','beta','launched'] as const`, `type ProjectStage`, `projectStageSchema`, `PROJECT_STAGE_LABEL: Record<ProjectStage,string>`
  - `CURRENCIES = ['INR','USD','EUR'] as const`, `type Currency`
  - `COMPENSATION_TYPES = ['volunteer','stipend','bounty','revenue-share','equity'] as const`, `compensationSchema` = `{type, amount?: number≥0, currency?: Currency, period?: 'one-time'|'month'}` with refine: `stipend` and `bounty` require `amount` and `currency`. `type Compensation`
  - `OPPORTUNITY_KINDS = ['bounty','paid-role','grant','hackathon','gig'] as const`, `OPPORTUNITY_KIND_LABEL`, `OPPORTUNITY_STATUSES = ['open','in-review','closed'] as const`, `opportunitySchema` = `{kind, title (4–140), summary (≤400), sponsor:{name, url?: url}, reward:{amount≥0, currency}, tracks: Track[] (min 1), deadline?: ISO date string, status, externalUrl?: url}`, `type Opportunity`
  - `POST_KINDS = ['update','question','showcase','squad-call'] as const`, `type PostKind`, `POST_KIND_LABEL`
  - `REPUTATION_EVENT_KINDS = ['project-created','role-filled','post-helpful','answer-accepted','bounty-completed','endorsement-received','mentorship-session'] as const`, `REPUTATION_POINTS: Record<ReputationEventKind, number>` (values: 10, 15, 2, 15, 50, 5, 10), `reputationTotal(events: {points:number}[]): number`
  - `formatMoney(amount: number, currency: Currency): string`. INR uses `en-IN` grouping with no decimals (`₹1,50,000`); USD/EUR use `en-US` with no decimals (`$500`, `€2,000`)
  - `handleSchema`: lowercase `^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$`, 3–30 chars, transforms input to lowercase before validating
  - `parseEnum<T extends readonly string[]>(values: T, input: unknown): T[number] | undefined`, for safe query-param parsing

- [ ] **Step 1: Remove old code, write root workspace files**

  - `pnpm-workspace.yaml` packages: `apps/*`, `packages/*`.
  - `turbo.json` tasks:
    - `build` (dependsOn `^build`, outputs `.next/**` excluding `.next/cache/**`)
    - `dev` (persistent, no cache)
    - `lint`, `typecheck`, `test` (no task dependencies)
    - `test:e2e` (no cache)
  - `.npmrc`: `auto-install-peers=true`.
  - `docker-compose.yml`: a single `mongo:8` service on port 27017 with a named volume.
  - `.env.example`: `MONGODB_URI=mongodb://localhost:27017/hackerland`, `BETTER_AUTH_SECRET=`, `BETTER_AUTH_URL=http://localhost:3000`, and commented `GITHUB_CLIENT_ID/SECRET` and `GOOGLE_CLIENT_ID/SECRET`.

- [ ] **Step 2: Write `@hackerland/config`**

  - tsconfig bases. `base.json` sets strict, `noUncheckedIndexedAccess`, `moduleResolution: "bundler"`, `module: "esnext"`, `target: "es2022"`, `verbatimModuleSyntax`, `skipLibCheck`. `library.json` and `react-library.json` add `jsx: react-jsx` and DOM libs. `nextjs.json` adds the Next plugin, `jsx: preserve`, `allowJs` and `noEmit`.
  - ESLint flat configs: `base.js` (js recommended + typescript-eslint recommended + prettier), `react.js` (+ react-hooks), `next.js` (+ `eslint-config-next` flat export).
  - If ESLint 10 has a peer conflict with typescript-eslint or eslint-config-next at install time, pin ESLint `^9` and note it in the commit message.

- [ ] **Step 3: Write failing tests for core**

  `packages/core/src/core.test.ts`:
  - `trackSchema.parse('design') === 'design'`; `trackSchema.safeParse('art').success === false`; `Object.keys(TRACK_META)` equals `TRACKS`.
  - `compensationSchema.safeParse({type:'stipend'}).success === false`; `compensationSchema.safeParse({type:'stipend', amount:40000, currency:'INR', period:'month'}).success === true`; `compensationSchema.safeParse({type:'volunteer'}).success === true`.
  - `opportunitySchema` rejects `tracks: []` and accepts a full valid bounty.
  - Every `ReputationEventKind` has a positive integer in `REPUTATION_POINTS`; `reputationTotal([{points:10},{points:5}]) === 15`; `reputationTotal([]) === 0`.
  - `formatMoney(150000,'INR') === '₹1,50,000'`, `formatMoney(500,'USD') === '$500'`, `formatMoney(2000,'EUR') === '€2,000'`.
  - `handleSchema.parse('Meera-Iyer') === 'meera-iyer'`; it rejects `'ab'`, `'-abc'`, `'a b c'` and a 31-char handle.
  - `parseEnum(TRACKS,'make') === 'make'`; `parseEnum(TRACKS,'foo') === undefined`; `parseEnum(TRACKS, ['make']) === undefined`.

- [ ] **Step 4: Run tests to verify they fail**

  Run: `pnpm install && pnpm --filter @hackerland/core test`
  Expected: FAIL (modules not found).

- [ ] **Step 5: Implement the core modules listed in Interfaces**

- [ ] **Step 6: Verify**

  Run: `pnpm --filter @hackerland/core test && pnpm turbo run lint typecheck --filter @hackerland/core`
  Expected: all pass.

- [ ] **Step 7: Commit**

  `git add -A && git commit -m "chore: replace placeholder app with pnpm/turbo monorepo and @hackerland/core"`

---

### Task 2: `@hackerland/ui` foundations: tokens, `cn`, DESIGN.md

**Files:**
- Create: `packages/ui/{package.json,tsconfig.json,eslint.config.js,vitest.config.ts,vitest.setup.ts,DESIGN.md}`, `packages/ui/src/{theme.css,tokens.ts,cn.ts,index.ts}`
- Test: `packages/ui/src/tokens.test.ts`, `packages/ui/src/cn.test.ts`

**Interfaces:**
- Produces:
  - Package exports: `"."` → `./src/index.ts`, `"./theme.css"` → `./src/theme.css`.
  - Tailwind utilities that every later task uses:
    - Colours (each defined as `--color-*` in `@theme`): `canvas`, `surface-1`, `surface-2`, `surface-3`, `sunken`, `hairline`, `line`, `fg`, `fg-muted` `#A9B6CC`, `fg-subtle` `#7D8DA8`, `accent` `#00E5FF`, `accent-strong` `#5CF0FF`, `on-solid` `#060B12`, `success`, `warning`, `danger`, plus for each track `<t>` and `<t>-fg`. The `-fg` text variants are: code `#38E8FF`, make `#FFA033`, design `#FF85B8`, research `#C29BFF`, earn `#5CFFBA`, learn `#7DB8FF`. Tints are opacity modifiers (`bg-make/12`).
    - Fonts: `font-display`, `font-sans`, `font-mono`, each reading `var(--font-space-grotesk)`, `var(--font-inter)` and `var(--font-jetbrains-mono)` with system fallbacks.
    - Type scale `text-<name>`, with line-height, letter-spacing and weight from the uploaded DESIGN.md. Names: `display-hero`, `display-hero-mobile`, `headline-xl`, `headline-xl-mobile`, `headline-lg`, `headline-md`, `headline-sm`, `body-lg`, `body-md`, `body-sm`, `label-lg`, `label-md`, `label-sm` (11px/14px, 0.08em, 700), `code-inline`.
    - Shadows: `shadow-module`, `shadow-overlay`, `shadow-glow-accent`, `shadow-glow-make`, `shadow-glow-earn` (values from the uploaded DESIGN.md §Elevation; earn uses `rgb(0 245 155 / .35)`).
    - Container `max-w-page` = 90rem.
  - Base layer: `body` gets `bg-canvas text-fg font-sans text-body-md antialiased`, `font-variant-numeric: tabular-nums` on `.tabular`, a `:focus-visible` outline of 2px accent with 2px offset, and `::selection` set to accent / on-solid.
  - `tokens.ts`: `COLOR_TOKENS: {name:string; cssVar:`--color-${string}`; value:string; usage:string}[]` (every colour above), `TRACK_TONES = ['code','make','design','research','earn','learn'] as const`, `type TrackTone`, `type StatusTone = 'success'|'warning'|'danger'|'neutral'|'accent'`, `type Tone = TrackTone | StatusTone`.
  - `cn(...inputs: ClassValue[]): string`, which is clsx + `extendTailwindMerge` taught the custom `text-*` scale names as font sizes.

- [ ] **Step 1: Write failing tests**
  - `tokens.test.ts` reads `theme.css` with `fs`. For every `COLOR_TOKENS` entry it asserts the CSS contains `${cssVar}: ${value}` (case-insensitive). It asserts each `TRACK_TONES` id has both `--color-<t>` and `--color-<t>-fg`, and asserts `--text-label-sm: 11px` (or `0.6875rem`).
  - `cn.test.ts`:
    - `cn('text-body-md text-fg', 'text-label-sm')` contains both `text-fg` and `text-label-sm` and not `text-body-md`
    - `cn('px-2', false, 'px-4') === 'px-4'`

- [ ] **Step 2: Run and confirm failure**

  Run: `pnpm --filter @hackerland/ui test`. Expected: FAIL.

- [ ] **Step 3: Implement `theme.css`, `tokens.ts`, `cn.ts` and `index.ts`**

  Use Tailwind v4 `@theme` with raw values for colours, so opacity modifiers work. Semantic aliases like `--color-surface-1` hold the navy hex directly. Under `@media (prefers-reduced-motion: reduce)`, animations and transitions drop to near-zero duration.

- [ ] **Step 4: Write `packages/ui/DESIGN.md`**

  This is the working design-system document, rewritten from the upload with spec §7 changes applied. Sections: Brand & Style, Colour (navy scale, tracks table, status), Typography (scale table), Layout & Spacing (12/8/4-column grids, `max-w-page`, gutters 16/24/48px), Elevation, Shape, Motion, Components (one line each, linking to `/design-system`), Accessibility rules, and a Changes-from-source list.

- [ ] **Step 5: Verify**

  Run: `pnpm --filter @hackerland/ui test`. Expected: PASS.

- [ ] **Step 6: Commit**

  `git commit -m "feat(ui): add Mission Control design tokens, cn helper and DESIGN.md"`

---

### Task 3: `@hackerland/ui` primitives

**Files:**
- Create: `packages/ui/src/components/{button,icon-button,badge,chip,status-dot,kbd,divider,label,input,textarea,search-field}.tsx`, exported from `index.ts`.
- Test: `packages/ui/src/components/primitives.test.tsx`

**Interfaces:**
- Consumes: `cn`, `Tone`, `TrackTone` (Task 2).
- Produces (all forward refs and native props unless noted):
  - `Button({variant?: 'primary'|'secondary'|'ghost'|'make'|'earn'|'danger' = 'primary', size?: 'sm'|'md'|'lg' = 'md', loading?: boolean, asChild?: boolean})`.
    - Heights: sm `h-9`, md `h-11`, lg `h-13`.
    - `primary` is `bg-accent text-on-solid hover:shadow-glow-accent active:scale-[.98]`; `secondary` is transparent with `border-line`, `hover:border-accent hover:bg-accent/8`.
    - `loading` sets `aria-busy`, disables the button and shows a spinner.
    - `buttonVariants` is exported for links.
  - `IconButton({label: string, variant?: 'ghost'|'secondary', size?: 'sm'|'md'})`. It is square (md = 44px) and sets `aria-label={label}`.
  - `Badge({tone?: Tone = 'neutral', variant?: 'outline'|'solid' = 'outline'})`. It renders a `<span>` 22px high with `px-2` and `font-display text-label-sm uppercase`. Outline uses `bg-<t>/12 border-<t>/60 text-<t>-fg`.
  - `Chip({tone?: Tone})`, a static pill (skills, tags) in `text-body-sm` normal case.
  - `FilterChip({selected?: boolean, tone?: Tone, asChild?: boolean})`. It sets `aria-pressed` when rendered as a button and `aria-current="true"` when `asChild` and selected.
  - `StatusDot({tone?: 'success'|'warning'|'danger'|'accent' = 'success', pulse?: boolean, label?: string})`. `label` renders sr-only; the pulse is `motion-safe:animate-pulse`.
  - `Kbd`, `Divider({orientation?: 'horizontal'|'vertical'})` (role separator) and `Label`.
  - `Input({invalid?: boolean})` and `Textarea({invalid?: boolean})`: `bg-sunken border-line`, `focus:border-accent`, a 1px accent ring, `aria-invalid` when invalid, danger border.
  - `SearchField(InputProps)`: `type="search"` with a lucide `Search` icon (aria-hidden) and padding for the icon.

- [ ] **Step 1: Write failing tests** (Testing Library + jest-dom)
  - Button:
    - the default renders a `<button>` with the class `bg-accent`
    - `variant="make"` contains `bg-make`
    - `loading` → `toBeDisabled()` and `aria-busy="true"`
    - `asChild` with `<a href="/x">` renders an `<a>` with button classes
  - IconButton has an accessible name equal to `label`.
  - Badge `tone="research"` has class `text-research-fg`; the default contains `text-fg-muted`.
  - FilterChip `selected` → `aria-pressed="true"`; unselected → `"false"`.
  - StatusDot `label="Live"` exposes the text "Live" (sr-only).
  - Input `invalid` → `aria-invalid="true"`.
  - SearchField has role `searchbox`.

- [ ] **Step 2: Run** `pnpm --filter @hackerland/ui test`. Expected: FAIL.
- [ ] **Step 3: Implement components with CVA**
- [ ] **Step 4: Run** `pnpm --filter @hackerland/ui test && pnpm --filter @hackerland/ui typecheck`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(ui): add button, badge, chip, input and other primitives`

---

### Task 4: `@hackerland/ui` composites

**Files:**
- Create: `packages/ui/src/components/{card,panel,section-header,stat-tile,progress,avatar,tabs,code-block,empty-state}.tsx`, exported from `index.ts`.
- Test: `packages/ui/src/components/composites.test.tsx`

**Interfaces:**
- Consumes: Task 2 and 3 exports.
- Produces:
  - `Card({accent?: TrackTone | 'accent', interactive?: boolean, asChild?: boolean})`: `bg-surface-1 border border-hairline rounded-lg`. `interactive` adds hover `border-accent/20` and `shadow-module`. `accent` draws a 2px top bar in the tone that appears on hover/focus-within (`data-accent` attribute). Also `CardHeader`, `CardBody`, `CardFooter` (padding `p-4 md:p-5`).
  - `Panel({title: ReactNode, icon?: ReactNode, action?: ReactNode, headingLevel?: 2|3 = 2, children})`: a `<section aria-labelledby>` with a title row.
  - `SectionHeader({eyebrow?: string, title: ReactNode, description?: ReactNode, action?: ReactNode, as?: 'h1'|'h2' = 'h2', size?: 'hero'|'page'|'section' = 'section'})`. The eyebrow is `text-label-sm uppercase text-accent` with a leading `StatusDot`.
  - `StatTile({label: string, value: ReactNode, hint?: ReactNode, tone?: Tone, icon?: ReactNode})`.
  - `ProgressBar({value: number, max?: number = 100, tone?: Tone = 'accent', label: string, showValue?: boolean})`: role `progressbar`, `aria-valuenow` clamped to `[0,max]`, `aria-label=label`.
  - `SegmentedProgress({total: number, completed: number, tone?: Tone, label: string})`: renders `total` segments, of which `completed` (clamped) are filled; role `progressbar`.
  - `Avatar({name: string, src?: string, size?: 'sm'|'md'|'lg'|'xl' = 'md', tone?: Tone})`: `<img alt={name}>` if `src`, else initials (first letters of the first and last words, uppercase, ignoring a leading "Dr." / "Prof.") with `aria-label={name}` and role img.
  - `AvatarGroup({people: {name:string; src?:string}[], max?: number = 4, size?})`: shows the first `max` people and a `+N` bubble with `aria-label="N more"`.
  - `Tabs({defaultValue: string, value?, onValueChange?, children})`, `TabsList({label: string})`, `TabsTrigger({value})`, `TabsContent({value})`. This is a `"use client"` file following the WAI-ARIA tabs pattern: roving tabindex, ArrowLeft/ArrowRight wrap, Home and End, automatic activation.
  - `CodeBlock({code: string, filename?: string, language?: string})`: a `<figure>` with an optional `figcaption` and `<pre><code class="font-mono">`, scrolling horizontally inside itself (`overflow-x-auto`, never the page).
  - `EmptyState({icon?: ReactNode, title: string, description?: string, action?: ReactNode})`.

- [ ] **Step 1: Write failing tests**
  - `ProgressBar value={150}` → `aria-valuenow="100"`; `value={-5}` → `"0"`.
  - `SegmentedProgress total={7} completed={3}` → 7 segments, 3 with `data-filled="true"`.
  - `Avatar name="Dr. Meera Iyer"` without src → text `MI`; with src → `img` with alt `Dr. Meera Iyer`.
  - `AvatarGroup` with 6 people and `max={4}` → 4 avatars and a `+2` element labelled "2 more".
  - Tabs with three triggers:
    - clicking the second shows its panel and hides the others
    - focusing the first and pressing ArrowRight moves focus and selection to the second; End → last; ArrowRight on the last → first
    - triggers have `aria-selected` and `aria-controls` pointing to the panel id
  - `Panel title="Open roles"` → `getByRole('region',{name:'Open roles'})`.
  - `EmptyState title="Nothing here yet"` renders the heading.

- [ ] **Step 2: Run** `pnpm --filter @hackerland/ui test`. Expected: FAIL.
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run** `pnpm turbo run test lint typecheck --filter @hackerland/ui`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(ui): add card, panel, progress, avatar, tabs and other composites`

---

### Task 5: `@hackerland/db` connection + models

**Files:**
- Create: `packages/db/{package.json,tsconfig.json,eslint.config.js,vitest.config.ts}`, `packages/db/src/{connection.ts,mongo-client.ts,index.ts}`, `packages/db/src/models/{profile,project,post,opportunity,reputation-event,roadmap}.ts`
- Test: `packages/db/src/models.test.ts`, `packages/db/src/connection.test.ts`

**Interfaces:**
- Consumes: the enums from `@hackerland/core` (`TRACKS`, `PROJECT_STAGES`, `COMPENSATION_TYPES`, `CURRENCIES`, `OPPORTUNITY_KINDS`, `OPPORTUNITY_STATUSES`, `POST_KINDS`, `REPUTATION_EVENT_KINDS`).
- Produces:
  - `class MissingDatabaseUrlError extends Error`, with the message `"MONGODB_URI is not set. Copy .env.example to .env and start MongoDB with \`docker compose up -d mongo\`."`
  - `connectDb(uri = process.env.MONGODB_URI): Promise<typeof mongoose>`. It throws `MissingDatabaseUrlError` when the URI is empty and caches the promise on `globalThis.__hackerlandMongoose`.
  - `getMongoClient(uri = process.env.MONGODB_URI): MongoClient`. It throws `MissingDatabaseUrlError` and is cached on `globalThis.__hackerlandMongoClient`. It does not connect eagerly.
  - Models, guarded with `models.X ?? model(...)`: `ProfileModel`, `ProjectModel`, `PostModel`, `OpportunityModel`, `ReputationEventModel`, `RoadmapModel`. Fields are as in spec §8, with timestamps on all of them except `ReputationEvent` (`createdAt` only, immutable).
  - Indexes: profile `{userId:1}` unique and `{handle:1}` unique; project `{slug:1}` unique and `{tracks:1, updatedAt:-1}`; post `{createdAt:-1}` and `{projectId:1, createdAt:-1}`; opportunity `{status:1, kind:1, deadline:1}`; reputationEvent `{userId:1, createdAt:-1}`; roadmap `{slug:1}` unique.

- [ ] **Step 1: Write failing tests** (no live DB; use `new Model(doc).validateSync()` and `Model.schema.indexes()`)
  - `new ProfileModel({}).validateSync()` reports errors for `userId`, `handle`, `displayName`.
  - Profile `handle: 'Meera-Iyer'` is stored lowercased; `tracks: ['art']` fails the enum.
  - A project with `openRoles:[{title:'X', track:'make', compensation:{type:'stipend'}}]` fails (amount and currency required for stipend/bounty, via a custom validator that reuses `compensationSchema`).
  - `OpportunityModel` with `tracks: []` fails.
  - `ReputationEventModel` rejects an unknown `kind`.
  - Indexes: `ProfileModel.schema.indexes()` contains `[{handle:1},{unique:true}]` and `[{userId:1},{unique:true}]`; `ProjectModel` contains the unique `{slug:1}`.
  - `connectDb('')` rejects with `MissingDatabaseUrlError`; `getMongoClient('')` throws it.

- [ ] **Step 2: Run** `pnpm --filter @hackerland/db test`. Expected: FAIL.
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run** `pnpm turbo run test lint typecheck --filter @hackerland/db`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(db): add MongoDB connection helpers and Mongoose models`

---

### Task 6: `apps/web` scaffold + data layer

**Files:**
- Create: `apps/web/{package.json,next.config.ts,postcss.config.mjs,tsconfig.json,eslint.config.js,vitest.config.ts}`, `apps/web/src/app/{layout.tsx,globals.css,page.tsx}` (with a temporary minimal page), `apps/web/src/lib/format.ts`, `apps/web/src/lib/data/{types.ts,queries.ts}`, `apps/web/src/lib/data/fixtures/*.ts`
- Test: `apps/web/src/lib/data/queries.test.ts`

**Interfaces:**
- Consumes: the core enums and schemas.
- Produces (`src/lib/data/types.ts`):
  - `ExperienceBadge {label:string; tone: Track | 'neutral'}`
  - `PersonRef {handle; name; avatarUrl?; headline?; badges: ExperienceBadge[]}`
  - `ProjectSummary {slug; title; summary; tracks: Track[]; stage: ProjectStage; licence; squad: PersonRef[]; squadSize; openRoleCount; funding?: {goal; raised; currency: Currency}; updatedAt: string}`
  - `OpenRole {id; title; track: Track; skills: string[]; description; compensation: Compensation}`
  - `Resource {name; qty; spec; cost; currency; status: 'funded'|'sourcing'|'needs-funding'}`
  - `ProjectDetail extends ProjectSummary {body; leads: (PersonRef & {role; bio; skills: string[]})[]; openRoles: OpenRole[]; resources: Resource[]; updates: FeedPost[]; milestone: {current; total; label; next}}`
  - `FeedPost {id; kind: PostKind; author: PersonRef; coAuthors: PersonRef[]; project?: {slug; title}; title; body; tags: string[]; createdAt; reactions; comments; progress?: {current; total; label}; code?: {filename; language; source}; acceptedAnswer?: {author: PersonRef; body; code?: {filename; language; source}}; squadCall?: {openRoles: OpenRole[]; funding?: ProjectSummary['funding']}}`
  - `OpportunityView = Opportunity & {id; projectSlug?}`
  - `RoadmapView {slug; title; track; level: 'beginner'|'intermediate'|'advanced'; summary; hours; learners; stages: {title; status:'done'|'active'|'locked'; modules: {title; provider; hours; free: boolean; certified: boolean; url?: string}[]}[]}`
  - `ProfileView {handle; name; headline; bio; location; avatarUrl?; tracks; skills; badges; links: {label; url}[]; reputation; stats: {projects; endorsements; contributions; earned: {amount; currency}}; projects: ProjectSummary[]; mentorships: (PersonRef & {relation:'mentor'|'mentee'; project?: string})[]; credentials: {title; issuer}[]; endorsements: {author: PersonRef; quote}[]; recentReputation: {kind: ReputationEventKind; points; label; at}[]}`
  - `PlatformStats {members; projects; openOpportunities; rewardsPool: {amount; currency}}`
- Produces (`queries.ts`, all `async`, server-only):
  - `getFeed(kind?: PostKind): Promise<FeedPost[]>`, newest first
  - `listProjects(track?: Track): Promise<ProjectSummary[]>`
  - `getProject(slug: string): Promise<ProjectDetail | null>`
  - `getProfile(handle: string): Promise<ProfileView | null>`
  - `listOpportunities(kind?: OpportunityKind): Promise<OpportunityView[]>`, ordered by deadline ascending with undefined last
  - `listRoadmaps(track?: Track): Promise<RoadmapView[]>`
  - `getPlatformStats(): Promise<PlatformStats>`
- Produces (`format.ts`): `formatDate(iso: string): string`, giving `"12 Nov 2026"` with `en-IN` in the `Asia/Kolkata` time zone, deterministic on server and client.
- Fixture content (fictional; at least what the tests and pages need):
  - Projects (5 slugs): `aeroglide` (make, research; prototype; 7 squad, 3 open roles incl. a stipend role ₹40,000/month and a revenue-share role; funding ₹1,20,000 of ₹2,50,000), `saathi-voice` (code), `open-braille` (make, design), `kisan-sense` (make, code), and `pixel-pathshala-open-illustration-kit-for-every-government-school-textbook-in-india` (design; its 90-char title is the overflow probe). No `learn`-track project.
  - People: `meera-iyer` (Dr. Meera Iyer, "40+ yrs aerospace" badge, mentor; full ProfileView), `kabir-shah` ("Student"), `zoya-khan` (designer), `arjun-menon` (ML), `lena-fischer` (hardware, Berlin), and `kavya-subramaniam-ramakrishnan` (30 chars, the maximum handle length; display name "Kavya Subramaniam Ramakrishnan-Venkataraghavan").
  - Posts: at least 1 of each `PostKind`. The question has an `acceptedAnswer` with a `code` block. One update body contains a long unbroken URL.
  - Opportunities: at least one `bounty`, `paid-role`, `grant` and `hackathon`, and **zero `gig`**.
  - Roadmaps: `embedded-systems-from-zero` (make), `full-stack-web` (code), `product-design-foundations` (design), `cubesat-engineering` (research). Modules cite real free providers (MIT OpenCourseWare, NPTEL, freeCodeCamp) as external resources.

- [ ] **Step 1: Write failing tests** (`queries.test.ts`)
  - `getProject('aeroglide')` is non-null; `getProject('does-not-exist')` is `null`; `getProfile('nobody')` is `null`.
  - `listProjects('make')` contains only projects whose `tracks` include `make`; `listProjects('learn')` equals `[]`; `listProjects()` has 5 items.
  - `getFeed('question')` contains only questions; `getFeed()` is sorted by `createdAt` descending.
  - `listOpportunities('gig')` equals `[]`. Every opportunity passes `opportunitySchema.parse` (strip `id` and `projectSlug`).
  - Every `OpenRole.compensation` across projects passes `compensationSchema`.
  - Every track id used in fixtures is in `TRACKS`; every handle in fixtures passes `handleSchema`.
  - `formatDate('2026-11-12T03:00:00Z') === '12 Nov 2026'`.

- [ ] **Step 2: Run** `pnpm --filter @hackerland/web test`. Expected: FAIL.

- [ ] **Step 3: Implement types, fixtures, queries and format**

  - `next.config.ts`: `transpilePackages: ['@hackerland/ui','@hackerland/core','@hackerland/db']`, `typedRoutes: true` if supported.
  - `globals.css`: `@import "tailwindcss"; @import "@hackerland/ui/theme.css"; @source "../../../../packages/ui/src";`
  - `layout.tsx`: sets up the three `next/font/google` fonts with the CSS variable names from Task 2, `<html lang="en" class="dark">`, and metadata (title template `%s · Hackerland`, default title "Hackerland: build together, earn together", description from the spec vision, `metadataBase: https://hackerland.in`).

- [ ] **Step 4: Run** `pnpm --filter @hackerland/web test && pnpm --filter @hackerland/web build`. Expected: tests PASS; build succeeds with no env file present.

- [ ] **Step 5: Commit** `feat(web): scaffold Next.js app with typed sample-data layer`

---

### Task 7: App shell (header, nav, footer, 404, error) + landing page + e2e harness

**Files:**
- Create: `apps/web/src/components/layout/{skip-link,app-header,main-nav,mobile-nav,app-footer}.tsx`, `apps/web/src/components/domain/{track-badge,money,person-chip,project-cover,project-card,opportunity-card}.tsx`, `apps/web/src/app/{not-found.tsx,error.tsx}`, `apps/web/playwright.config.ts`, `apps/web/e2e/{routes.ts,smoke.spec.ts,a11y.spec.ts}`
- Modify: `apps/web/src/app/layout.tsx` (wrap the shell), `apps/web/src/app/page.tsx` (landing page)

**Interfaces:**
- Consumes: UI components, the data layer and `formatMoney`.
- Produces:
  - `TrackBadge({track: Track})` → `Badge tone={track}` with `TRACK_META[track].label`.
  - `Money({amount, currency})` → `<span class="tabular">{formatMoney()}</span>`.
  - `PersonChip({person: PersonRef, size?: 'sm'|'md', showBadges?: boolean})`: avatar, name linking to `/u/{handle}`, badges.
  - `ProjectCover({tracks: Track[], title: string, className?})`: decorative CSS/SVG "blueprint" art (grid lines + track-colour glow + a lucide icon per primary track). `aria-hidden`. No external images.
  - `ProjectCard({project: ProjectSummary})`: links to `/projects/{slug}`; uses `min-w-0` and `break-words` on the title.
  - `OpportunityCard({opportunity: OpportunityView})`: kind badge, reward via `Money`, sponsor, deadline via `formatDate`, tracks.
  - `e2e/routes.ts`: `export const ROUTES: string[]`. Each later page task appends its route here.
  - The smoke spec, for each route at viewports `{width:1440,height:900}` and `{width:390,height:844}`, asserts:
    - response status < 400
    - no `console.error` and no `pageerror`
    - `document.documentElement.scrollWidth <= window.innerWidth`
    - an `h1` exists
  - Playwright `webServer`: `pnpm build && pnpm start -p 3100` (reuse the existing server locally).
  - Root script `test:e2e` → `pnpm --filter @hackerland/web test:e2e`.

- Shell requirements:
  - **Header** (sticky, `bg-canvas/90 backdrop-blur`, hairline bottom border). Left: logo mark (an inline SVG "H" in a cyan-bordered square) + "HACKERLAND" wordmark. Centre: `MainNav` (Feed · Projects · Earn · Learn, active state via `usePathname`, `aria-current="page"`). Right: `SearchField` (≥ lg only, placeholder "Search projects, people, bounties…"), a notifications `IconButton`, a primary `Button asChild` → `/new` "Start project", and a secondary "Sign in" → `/sign-in`.
  - **Below md:** the header shows logo, search icon and "Sign in". `MobileNav` is a fixed bottom bar with 5 items (Feed, Projects, a Start (+) centre button, Earn, Learn), each ≥ 44px. `main` gets bottom padding so content is never hidden.
  - **Footer** status bar: `StatusDot pulse` "HACKERLAND MESH", platform stats from `getPlatformStats()`, the **"Preview · sample data"** `Badge tone="warning"`, and "Open source · BSD-3-Clause" plus "© 2026 Hackerland · hackerland.in".
  - **Skip link** "Skip to content" → `#main`, visible on focus.
  - **not-found.tsx**: h1 "Signal lost: page not found", explanation, and buttons to Feed and Home. **error.tsx** (client): h1 "Something broke in the lab" and a Retry button calling `reset()`.
- Landing page (`/`) content, top to bottom:
  1. Hero: eyebrow "OPEN-SOURCE INNOVATION NETWORK"; h1 "Build together. Earn together."; a subline naming students, designers, programmers, makers and innovators; CTAs "Start project" (primary) and "Explore projects" (secondary); a stat strip of 4 `StatTile`s from `getPlatformStats()`.
  2. "Six tracks, one community": a grid of 6 cards, one per track (icon, label, description, track accent).
  3. "How it works": 4 steps (Find a project → Join a squad → Build in the open → Earn & level up).
  4. "Featured projects": 3 `ProjectCard`s.
  5. "Open bounties & paid roles": 3 `OpportunityCard`s and a link to `/earn`.
  6. A closing CTA panel.

- [ ] **Step 1: Write failing e2e tests**
  - Set `ROUTES = ['/']`.
  - `a11y.spec.ts`:
    - (a) the first Tab on `/` focuses a link named "Skip to content"
    - (b) `/projects/does-not-exist` returns status 404 and shows the heading "Signal lost: page not found"
    - (c) at 390px the bottom nav is visible and the header main nav is hidden

- [ ] **Step 2: Run** `pnpm --filter @hackerland/web test:e2e`. Expected: FAIL (no shell; `/projects/...` 404 heading missing).
- [ ] **Step 3: Implement the shell, domain components and landing page**
- [ ] **Step 4: Run** `pnpm --filter @hackerland/web test:e2e && pnpm turbo run lint typecheck --filter @hackerland/web`. Expected: PASS.
- [ ] **Step 5: Commit** `feat(web): add app shell, landing page and Playwright smoke harness`

---

### Task 8: Feed (`/feed`)

**Files:**
- Create: `apps/web/src/app/feed/page.tsx`, `apps/web/src/components/domain/{post-card,role-card}.tsx`
- Modify: `apps/web/e2e/routes.ts`

**Interfaces:**
- Consumes: `getFeed`, `listOpportunities`, `listProjects`, `parseEnum`, `POST_KINDS`, and Task 7 domain components.
- Produces:
  - `RoleCard({role: OpenRole, compact?: boolean})`: title, `TrackBadge`, compensation line (`volunteer` → "Volunteer"; `stipend` → "₹40,000 / month"; `bounty` → `Money`; `revenue-share`/`equity` → label), skills as `Chip`s, and an "Apply" button (a disabled link-style button with the title "Applications open with accounts").
  - `PostCard({post: FeedPost})`. The frame is a `Card` with `accent` set by the first track of the post's project, or `accent` otherwise. It shows the kind badge, the author `PersonChip` (+ co-authors), the project link and `formatDate`. Kind-specific blocks:
    - `update`/`showcase`: optional `SegmentedProgress` with label
    - `question`: the body, an optional code block, and an `acceptedAnswer` block with a success-tone "Accepted answer" badge
    - `squad-call`: `RoleCard compact` list + funding `ProgressBar`

    The footer shows reaction and comment counts (lucide icons + numbers, non-interactive). Bodies use `break-words`.

- Page layout:
  - Header: `SectionHeader as="h1" eyebrow="LIVE FEED" title="What the community is building"`.
  - A filter row of `FilterChip asChild` links: All · Build logs (`update`) · Showcases · Questions · Squad calls.
  - `?kind=` is parsed with `parseEnum(POST_KINDS, …)`; invalid values mean "All".
  - Grid: `lg:grid-cols-[minmax(0,1fr)_360px]`.
  - Main column: `PostCard` list, or `EmptyState` when the list is empty.
  - Right rail panels: "Open bounties" (top 3 bounties via `OpportunityCard`), "Squad of the week" (first project, `ProjectCard`), and "Got a project?" (CTA → `/new`).

- [ ] **Step 1:** Append `'/feed'` and `'/feed?kind=question'` and `'/feed?kind=banana'` to `ROUTES`, and add an e2e assertion that `/feed?kind=question` shows only posts with the "Question" badge and `/feed?kind=banana` shows the "All" chip as current.
- [ ] **Step 2: Run** `pnpm --filter @hackerland/web test:e2e`. Expected: FAIL (404).
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run** e2e + lint + typecheck. Expected: PASS.
- [ ] **Step 5: Commit** `feat(web): add community feed`

---

### Task 9: Projects directory (`/projects`) + project room (`/projects/[slug]`)

**Files:**
- Create: `apps/web/src/app/projects/page.tsx`, `apps/web/src/app/projects/[slug]/page.tsx`
- Modify: `apps/web/e2e/routes.ts`

**Interfaces:**
- Consumes: `listProjects`, `getProject`, `parseEnum(TRACKS, …)`, `RoleCard`, `PostCard`, `ProjectCard`, `ProjectCover`, and UI components.
- Produces: `generateStaticParams` for project slugs and `generateMetadata` (title = project title).

- `/projects`:
  - `SectionHeader as="h1"` "Projects looking for squads".
  - Track `FilterChip` links (All + 6 tracks, via `?track=`).
  - A responsive grid of `ProjectCard` (1/2/3 columns), or an `EmptyState` ("No {Track} projects yet — start one") with a CTA → `/new`.
- `/projects/[slug]`:
  - `getProject` returns null → `notFound()`.
  - Hero: badges (`PROJECT #`, licence, "Public workspace"), h1 title, summary, and actions "Offer mentorship" (secondary) and "Join squad" (primary). Both are disabled-state buttons titled "Available once accounts launch".
  - Stat strip of 4 `StatTile`s: Stage (with `SegmentedProgress` milestone), Funding (`ProgressBar` + `Money`), Squad (`AvatarGroup` + "{n} active · {m} roles open"), Activity (updates count + last update `formatDate`).
  - Two-column body:
    - left: Panel "Squad leads" (lead cards: avatar, role, bio, skill chips), Panel "About" (body paragraphs), Panel "Resources & bill of materials" (a table: Item · Qty · Spec · Cost · Status badge; inside `overflow-x-auto` on mobile), Panel "Updates" (`PostCard`s)
    - right: Panel "Open roles" (`RoleCard`s with a count badge "{n} OPEN")

- [ ] **Step 1:** Append `/projects`, `/projects?track=make`, `/projects?track=learn`, `/projects?track=foo`, `/projects/aeroglide`, and `/projects/pixel-pathshala-open-illustration-kit-for-every-government-school-textbook-in-india` to `ROUTES`. Add e2e assertions:
  - `/projects?track=learn` shows the text "No Learn projects yet"
  - `/projects/aeroglide` shows the region "Open roles" containing "/ month"
  - `/projects/does-not-exist` → 404 (already covered in Task 7)
- [ ] **Step 2: Run** e2e. Expected: FAIL.
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run** e2e + lint + typecheck. Expected: PASS.
- [ ] **Step 5: Commit** `feat(web): add projects directory and project room`

---

### Task 10: Profile (`/u/[handle]`)

**Files:**
- Create: `apps/web/src/app/u/[handle]/page.tsx`
- Modify: `apps/web/e2e/routes.ts`

**Interfaces:**
- Consumes: `getProfile`, `ProjectCard`, `PersonChip`, `Tabs*`, and UI components.

- Content:
  - `getProfile` returns null → `notFound()`.
  - Header card: XL avatar, h1 name, `@handle`, location, headline, experience badges, track badges, links, and actions "Request mentorship" (primary) and "Message" (secondary), both disabled-state.
  - Stats row of 4 `StatTile`s: Projects, Endorsements, Reputation (`tabular`), Earned (`Money`).
  - Left column: Panel "Mentorship" (mentor/mentee `PersonChip`s with relation and project), Panel "Credentials", Panel "Recent reputation" (a ledger list: label, `+{points}`, date), which notes "Reputation is an append-only ledger".
  - Right column: `Tabs` (Projects · Endorsements · Skills). Projects → a `ProjectCard` grid; Endorsements → quote cards; Skills → `Chip`s grouped under the profile's tracks.
  - **No ages anywhere.**

- [ ] **Step 1:** Append `/u/meera-iyer` and `/u/kavya-subramaniam-ramakrishnan` to `ROUTES`. Add e2e:
  - `/u/nobody` → 404
  - `/u/meera-iyer`: clicking the tab "Endorsements" shows at least one blockquote
  - the page text does not match `/\bage\s*\d+/i`

  The second profile route needs a minimal ProfileView fixture for that handle.
- [ ] **Step 2: Run** e2e. Expected: FAIL.
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run** e2e + lint + typecheck. Expected: PASS.
- [ ] **Step 5: Commit** `feat(web): add innovator profile`

---

### Task 11: Earn (`/earn`) + Learn (`/learn`)

**Files:**
- Create: `apps/web/src/app/earn/page.tsx`, `apps/web/src/app/learn/page.tsx`, `apps/web/src/components/domain/roadmap-card.tsx`
- Modify: `apps/web/e2e/routes.ts`

**Interfaces:**
- Consumes: `listOpportunities`, `listRoadmaps`, `parseEnum(OPPORTUNITY_KINDS|TRACKS, …)`, `OPPORTUNITY_KIND_LABEL`, `OpportunityCard`, and UI components.
- Produces: `RoadmapCard({roadmap: RoadmapView, expanded?: boolean})`.
  - Collapsed: title, track badge, level, hours, learners, and an overall `ProgressBar` (done stages / total).
  - `expanded`: an ordered list of stages, each with a numbered marker, a status badge (Done / In progress / Locked) and module rows showing title, provider, hours, and "FREE" (earn tone) / "CERTIFICATE" (learn tone) badges. External `url`s open with `rel="noopener noreferrer" target="_blank"`.

- `/earn`:
  - h1 "Earn by building".
  - Intro line: the rewards are funded by sponsors, and Hackerland charges contributors nothing.
  - A 4-tile stat strip: open opportunities, total rewards via `Money`, count per kind.
  - Kind `FilterChip` links (All · Bounties · Paid roles · Grants · Hackathons · Gigs via `?kind=`).
  - An `OpportunityCard` grid, or `EmptyState` ("No open gigs right now").
  - A "Sponsor a bounty" CTA panel (a mailto link to `hello@hackerland.in` is acceptable as a placeholder; label it "Get in touch").
- `/learn`:
  - h1 "Learn by doing".
  - Track `FilterChip` links (`?track=`).
  - "Spotlight roadmaps": the first two as collapsed `RoadmapCard`s.
  - The first roadmap of the filtered list rendered `expanded`.
  - Panel "Squads learning together" (2 `ProjectCard`s).
  - `EmptyState` when the filter is empty (`learn` and `earn` tracks have none).

- [ ] **Step 1:** Append `/earn`, `/earn?kind=bounty`, `/earn?kind=gig`, `/earn?kind=x`, `/learn`, `/learn?track=make`, `/learn?track=earn` and `/learn?track=x` to `ROUTES`. Add e2e assertions:
  - `/earn?kind=gig` shows "No open gigs right now"
  - `/learn` shows at least one "FREE" badge
  - an external module link has `rel` containing `noopener`
- [ ] **Step 2: Run** e2e. Expected: FAIL.
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run** e2e + lint + typecheck. Expected: PASS.
- [ ] **Step 5: Commit** `feat(web): add earn and learn hubs`

---

### Task 12: Start project wizard (`/new`)

**Files:**
- Create: `apps/web/src/app/new/page.tsx`, `apps/web/src/components/new-project/wizard.tsx` (`"use client"`)
- Test: `apps/web/src/components/new-project/wizard.test.tsx` (jsdom)
- Modify: `apps/web/e2e/routes.ts`

**Interfaces:**
- Consumes: `TRACKS`, `TRACK_META`, `COMPENSATION_TYPES`, `compensationSchema`, and UI components.
- Produces: `NewProjectWizard()`, which has no props. Its state is local `{title, tagline, description, tracks: Track[], skills: string[], roles: {title; track: Track; compensation: Compensation}[]}`.

- Steps:
  1. **Idea**: Title (required, ≥ 4 chars), One-line pitch (≤ 140 chars with a live counter), Description.
  2. **Tracks & skills**: track `FilterChip` toggles (≥ 1 required) and skill entry (type + Enter adds a `Chip` with a remove button; duplicates are ignored case-insensitively).
  3. **Roles**: an add-role form (title, track select, compensation type select; amount + currency appear for stipend/bounty and are validated with `compensationSchema`). The added roles are listed with remove buttons.
  4. **Review**: a preview card (title, pitch, track badges, skills, roles). The "Publish project" button is disabled, with helper text "Publishing opens when accounts launch. Your draft stays in this tab."
- A `SegmentedProgress total={4}` step indicator plus step labels; Back/Next buttons; Next is disabled until the current step is valid.

- [ ] **Step 1: Write failing tests** (`wizard.test.tsx` with user-event)
  - Initially "Next" is disabled; typing "Drone" in Title enables it.
  - On step 2, Next is disabled until a track chip is pressed; typing "kicad{Enter}" then "KiCad{Enter}" yields exactly one chip "kicad".
  - On step 3, choosing compensation "stipend" without an amount shows an error and does not add the role; with amount 5000 and INR, the role appears.
  - Step 4 shows the title, the role title, and a disabled "Publish project" button.
- [ ] **Step 2: Run** `pnpm --filter @hackerland/web test`. Expected: FAIL.
- [ ] **Step 3: Implement.** Append `/new` to `ROUTES`. The page h1 is "Start a project".
- [ ] **Step 4: Run** unit + e2e + lint + typecheck. Expected: PASS.
- [ ] **Step 5: Commit** `feat(web): add start-a-project wizard`

---

### Task 13: Auth (Better Auth + MongoDB) and sign-in/sign-up

**Files:**
- Create: `apps/web/src/lib/{auth.ts,auth-client.ts}`, `apps/web/src/app/api/auth/[...all]/route.ts`, `apps/web/src/components/auth/auth-form.tsx` (`"use client"`), `apps/web/src/app/{sign-in,sign-up}/page.tsx`
- Test: `apps/web/src/lib/auth.test.ts`, `apps/web/src/app/api/auth/route.test.ts`
- Modify: `apps/web/e2e/routes.ts`

**Interfaces:**
- Consumes: `getMongoClient` (Task 5).
- Produces:
  - `isAuthConfigured(env = process.env): boolean`, true iff `MONGODB_URI` and `BETTER_AUTH_SECRET` are non-empty.
  - `getEnabledSocialProviders(env = process.env): ('github'|'google')[]`: a provider is included only when both its `*_CLIENT_ID` and `*_CLIENT_SECRET` are set.
  - `getAuth()`: a memoised `betterAuth({ database: mongodbAdapter(getMongoClient().db()), emailAndPassword: { enabled: true, minPasswordLength: 8 }, socialProviders: <only the enabled ones>, baseURL: env.BETTER_AUTH_URL })`. Confirm the adapter import path from `node_modules/better-auth/package.json` exports (expected `better-auth/adapters/mongodb`). It is never called at module scope.
  - Route `GET`/`POST`: if `!isAuthConfigured()` → `Response.json({error:'auth_not_configured'}, {status:503})`; else delegate to `toNextJsHandler(getAuth())`.
  - `authClient = createAuthClient()` from `better-auth/react`.
  - `AuthForm({mode: 'sign-in'|'sign-up', configured: boolean, providers: ('github'|'google')[]})`.
    - Fields: email and password, plus name for sign-up. Social buttons only for `providers`. Calls `authClient.signIn.email` / `signUp.email` / `signIn.social`, then `router.push('/feed')`.
    - Shows a `role="alert"` error on failure. When `!configured`, a warning panel "Sign-in isn't configured on this deployment yet." appears above a disabled fieldset.
  - The sign-in/up pages are server components passing `isAuthConfigured()` and `getEnabledSocialProviders()`. h1s are "Welcome back" / "Join Hackerland", with cross-links between them.

- [ ] **Step 1: Write failing tests**
  - `isAuthConfigured({})` is false; `isAuthConfigured({MONGODB_URI:'mongodb://x', BETTER_AUTH_SECRET:'s'})` is true.
  - `getEnabledSocialProviders({GITHUB_CLIENT_ID:'a'})` equals `[]`; with GitHub id and secret → `['github']`; with both providers → `['github','google']`.
  - Route test: with `MONGODB_URI` and `BETTER_AUTH_SECRET` unset, `GET(new Request('http://localhost/api/auth/session'))` returns status 503 and JSON `{error:'auth_not_configured'}`. Importing the route module does not throw.
- [ ] **Step 2: Run** `pnpm --filter @hackerland/web test`. Expected: FAIL.
- [ ] **Step 3: Implement.** Append `/sign-in` and `/sign-up` to `ROUTES`, and add an e2e assertion that `/sign-in` (no env in the e2e server) shows "Sign-in isn't configured on this deployment yet." and a disabled email input.
- [ ] **Step 4: Run** unit + e2e + lint + typecheck. Expected: PASS. (A live sign-up round-trip cannot run here because there is no MongoDB. Document it in the PR as a manual check: `docker compose up -d mongo`, set `.env`, sign up at `/sign-up`.)
- [ ] **Step 5: Commit** `feat(web): add Better Auth with MongoDB adapter and sign-in/up pages`

---

### Task 14: Living style guide (`/design-system`)

**Files:**
- Create: `apps/web/src/app/design-system/page.tsx` (plus a small client island for the Tabs demo if needed)
- Modify: `apps/web/e2e/routes.ts`

**Interfaces:**
- Consumes: `COLOR_TOKENS`, `TRACK_TONES`, and every UI component.

- Sections, each a `Panel` with an anchor id:
  - Colours: swatches from `COLOR_TOKENS` with name, value and usage.
  - Tracks: 6 rows, each with a badge, chip, card accent and button where applicable.
  - Typography: every `text-*` scale name rendered with its spec.
  - Buttons: all variants × sizes, with loading and disabled.
  - Badges & chips.
  - Form controls: input, invalid input, textarea, search.
  - Data display: StatTile, ProgressBar, SegmentedProgress, Avatar/AvatarGroup, CodeBlock.
  - Layout: Card variants, Panel, SectionHeader, EmptyState.
  - Navigation: a Tabs demo.
  - Motion & accessibility notes.
- h1 "Mission Control design system". A link to `packages/ui/DESIGN.md` on GitHub goes in the intro.

- [ ] **Step 1:** Append `/design-system` to `ROUTES`. Add an e2e assertion that the page lists the swatch text `#00E5FF` and the six track names.
- [ ] **Step 2: Run** e2e. Expected: FAIL.
- [ ] **Step 3: Implement**
- [ ] **Step 4: Run** e2e + lint + typecheck. Expected: PASS.
- [ ] **Step 5: Commit** `feat(web): add living design-system page`

---

### Task 15: CI, docs, design source assets, full verification

**Files:**
- Create: `.github/workflows/ci.yml`, `README.md` (rewrite), `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md` (Contributor Covenant 2.1, contact `conduct@hackerland.in`), `docs/design/stitch-source/DESIGN.md` (the upload, verbatim), `docs/design/stitch-source/screens/*.webp` (8 screens, ≤ 1280px wide, quality 80, via PIL from the extracted zip in the scratchpad), `docs/design/stitch-source/README.md` (what these are; the HTML exports are intentionally not committed)

- CI on `pull_request` and `push` to `main`:
  1. checkout
  2. `pnpm/action-setup` (version from `packageManager`)
  3. `actions/setup-node` with Node 22 and pnpm cache
  4. `pnpm install --frozen-lockfile`
  5. `pnpm turbo run lint typecheck test build`
  6. `pnpm --filter @hackerland/web exec playwright install --with-deps chromium`
  7. `pnpm test:e2e`
  8. upload the Playwright report on failure
- README sections:
  - what Hackerland is (vision, tracks)
  - screenshots (2 from the e2e run, saved under `docs/screenshots/`)
  - quick start (`pnpm install`, `pnpm dev`; optional `docker compose up -d mongo` + `.env`)
  - repo structure
  - scripts
  - environment variables
  - deployment notes (Vercel + Atlas, domain hackerland.in)
  - roadmap (the 8 sub-projects table from the spec)
  - licence
- CONTRIBUTING covers: setup, branch/commit conventions (Conventional Commits), "use tokens, never hex", how to add a UI component (tests plus a style-guide entry), and how to run tests.

- [ ] **Step 1:** Write the files above.
- [ ] **Step 2: Full verification from a clean state**

  Run: `rm -rf node_modules apps/*/node_modules packages/*/node_modules apps/web/.next && pnpm install --frozen-lockfile && pnpm turbo run lint typecheck test build && pnpm test:e2e`
  Expected: every task succeeds; Playwright reports all specs passed across every route at both viewports.
- [ ] **Step 3:** Capture screenshots for the PR at deviceScaleFactor 2: `/`, `/feed`, `/projects/aeroglide` and `/u/meera-iyer` at 1440px, and `/feed` at 390px. Save the README pair to `docs/screenshots/`.
- [ ] **Step 4: Commit** `docs: add README, contributing guide, CI workflow and design source`
- [ ] **Step 5:** Push the branch, update the PR description (summary, screens, test plan with results, the manual auth check), and confirm CI is green.
