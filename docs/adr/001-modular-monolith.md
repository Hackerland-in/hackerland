# ADR 001: Modular Monolith with Domain Boundaries

## Status
Accepted

## Context
Hackerland integrates 15 product pillars (MakerSpace, IdeaLab, Collaboration Hub, Knowledge Universe, Founder Stories, Research Commons, Manufacturing Hub, Bounties). Microservices at this stage would introduce immense network serialization overhead, distributed transaction complexity, and deployment friction.

## Decision
Adopt a Modular Monolith architecture within a Turborepo monorepo:
- `apps/web`: Next.js 16 (App Router + Turbopack), presentation, route handlers, client components.
- `packages/core`: Pure domain definitions, Zod validation schemas, business logic.
- `packages/db`: Data persistence, Mongoose models, indexes, and connection pooling.
- `packages/ui`: Shared design system tokens and accessible UI primitives.

All modules interact through defined domain services, preserving the ability to extract high-throughput workers if required later.
