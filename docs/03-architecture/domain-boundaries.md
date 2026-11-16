# Domain Boundaries & Architecture

Hackerland is architected as a **Modular Monolith** inside a Turborepo monorepo. This eliminates distributed systems overhead while enforcing strict domain isolation.

```mermaid
graph TD
    subgraph UI_Layer ["Next.js App Router (apps/web)"]
        Routes["Server & Client Components"]
        API["Route Handlers (/api/*)"]
    end

    subgraph Core_Domains ["Domain Boundary Engines (packages/core)"]
        Ideation["IdeaLab & Problems Engine"]
        Circuits["PCB Simulation & DRC Engine"]
        StoryDomain["Decision Archaeology Engine"]
        PassportDomain["Proof-of-Work Verification Engine"]
        CollabDomain["Squad Matchmaking Engine"]
    end

    subgraph Data_Layer ["Persistence & Auth (packages/db)"]
        Mongo["MongoDB Document Store"]
        BetterAuth["Better Auth Session Store"]
    end

    Routes --> Core_Domains
    API --> Core_Domains
    Core_Domains --> Data_Layer
```

## Domain Partitioning

1. **Identity & Trust (`@hackerland/core/identity`):**
   - User profiles, handles, Better Auth adapter, session verification, and guardian verification for minors.
2. **Ideation & Discovery (`@hackerland/core/ideas`, `@hackerland/core/problems`):**
   - 7-stage workbook lifecycle, unsolved problem catalog, and claim validations.
3. **Hardware & Simulation (`@hackerland/core/circuits`, `@hackerland/core/physics`):**
   - Pure, deterministic calculation engines: schematic netlists, IPC-2221 trace clearance checks, physics ODE solvers.
4. **Knowledge & Stories (`@hackerland/core/stories`):**
   - Versioned markdown articles, decision forks, and pedagogical exercises.
5. **Collaboration & Opportunities (`@hackerland/core/projects`, `@hackerland/core/opportunities`):**
   - Squad applications, milestone escrow, bounty status machines.
6. **Innovation Passport (`@hackerland/core/passports`):**
   - Tamper-evident credentials, fabrication audit trails, and capability badges.
