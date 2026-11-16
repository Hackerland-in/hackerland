# ADR 003: Better Auth for Unified Authentication & Child Safety

## Status
Accepted

## Context
We need a robust, secure authentication system supporting email/password, social OAuth (GitHub, Google), and session management, while strictly adhering to India's DPDP Act regarding verifiable guardian consent for minor creators.

## Decision
Adopt **Better Auth** with a MongoDB adapter. Better Auth runs completely self-hosted inside Next.js Route Handlers (`apps/web/src/app/api/auth/[...all]/route.ts`), providing complete data ownership and zero third-party vendor lock-in.

## Consequences
- **Pros:** No vendor per-seat licensing fees. Full control over session cookies and data storage. Seamless extension of user schemas with `isMinor`, `guardianId`, and verified identity fields.
- **Cons:** Self-hosted email delivery and token lifecycle must be monitored.
