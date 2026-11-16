# ADR 005: Typed Relationship Models Over Graph Databases

## Status
Accepted

## Context
The Global Innovation Operating System connects problems, ideas, squads, prototypes, fabrication logs, and creator passports. A specialized graph database (e.g. Neo4j) was evaluated to model these interconnections.

## Decision
Avoid premature introduction of a dedicated graph database. Implement the **Innovation Graph** using typed relationship arrays and compound indexed references directly within MongoDB, supported by strong TypeScript domain types in `@hackerland/core`.

## Consequences
- **Pros:** Keeps operational complexity low (single database cluster to backup, monitor, and scale). Eliminates distributed transaction issues between graph and document stores.
- **Cons:** Extremely deep transitive traversals (e.g. 5+ hops) require multiple indexed queries. Given the current domain relationships (rarely exceeding 2 hops between Maker -> Squad -> Project -> Problem), MongoDB handles these traversals in <15ms.
