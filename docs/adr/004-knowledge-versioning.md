# ADR 004: Version-Controlled Knowledge & Decision Archaeology

## Status
Accepted

## Context
Engineering case studies, blueprints, and Decision Archaeology narratives evolve as products mature. Readers need confidence that technical teardowns and architectural retrospectives reflect accurate, historical facts.

## Decision
Treat educational content and stories as structured data objects with Git-style versioning and static pre-rendering (Next.js SSG with `generateStaticParams`). High-frequency community discussions live in MongoDB, while core curriculum and verified case studies are revision-controlled in TypeScript data fixtures backed by Zod validation.

## Consequences
- **Pros:** Blazing-fast static delivery (sub-10ms CDN TTFB). Zero database query latency for high-traffic educational pages. Full historical diff tracking in version control.
- **Cons:** Content publishing requires deployment or incremental static revalidation (ISR).
