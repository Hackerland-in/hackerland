# Contributing to Hackerland

Thank you for contributing to Hackerland! We welcome contributions across software, hardware schematics, UI/UX design, research, and documentation.

## Code of Conduct

All contributors are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md). Please report issues or unacceptable behaviour to [conduct@hackerland.in](mailto:conduct@hackerland.in).

## Monorepo Setup

This repository is managed with **pnpm 10** and **Turborepo 2.11**.

### Prerequisites
- Node.js ≥ 22 (`.nvmrc` = 22)
- pnpm ≥ 10 (`corepack enable` or `npm install -g pnpm`)

### Quick Start
```bash
# Clone and enter
git clone https://github.com/Hackerland-in/hackerland.git
cd hackerland

# Install all workspace dependencies
pnpm install

# Start the dev server (runs with typed sample data with no .env required)
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Core Rules & Conventions

### 1. Semantic Design Tokens Only (Never Raw Hex)
Outside of `packages/ui/src/theme.css` and `packages/ui/src/tokens.ts`, **never write raw hex colour codes** (such as `#00E5FF` or `#0A0E17`). Always use semantic Tailwind utility classes or tokens exported from `@hackerland/ui`.

### 2. Six Tracks Taxonomy
Hackerland groups all projects, members, and opportunities into 6 standardized tracks:
- `code` (**Code**): Software, web, mobile, AI, and systems programming.
- `make` (**Make**): Hardware, electronics, robotics, and physical fabrication.
- `design` (**Design**): UI/UX, product design, industrial design, and branding.
- `research` (**Research**): Deep-tech, space, biotech, climate, and applied science.
- `earn` (**Earn**): Sponsored bounties, paid roles, grants, and hackathons.
- `learn` (**Learn**): Interactive roadmaps, curriculum modules, and mentorship.

### 3. Adding a UI Component
When creating a new component in `packages/ui`:
1. Use `class-variance-authority` (CVA) for variants.
2. Export the component and its props from `packages/ui/src/index.ts`.
3. Add a unit test in `packages/ui/src/components/*.test.tsx`.
4. Showcase the component in the living style guide at `apps/web/src/app/design-system/page.tsx`.

### 4. Commit Message Convention
We adhere to **Conventional Commits**:
- `feat(scope): add new feature`
- `fix(scope): resolve bug or defect`
- `docs(scope): update documentation`
- `chore(scope): repository maintenance or dependency upgrades`
- `test(scope): add or improve tests`

## Running Tests & Verification

Before submitting a pull request, ensure all checks pass:

```bash
# Run lint, typecheck, unit tests, and Next.js build
pnpm turbo run lint typecheck test build

# Run Playwright end-to-end tests
pnpm test:e2e
```
