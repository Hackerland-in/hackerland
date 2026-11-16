# ADR 002: MongoDB as Polymorphic Innovation Datastore

## Status
Accepted

## Context
An innovation platform deals with highly heterogeneous entities: PCB netlists, bills of materials (BOM), step-by-step ideation workbooks, dynamic quiz prompts, and hardware fabrication logs. Rigid relational schemas incur high migration friction whenever new engineering domains (e.g. quantum circuits or synthetic biology) are integrated.

## Decision
Adopt MongoDB as the primary document store using Mongoose ODM, with document schemas validated by Zod schemas defined in `@hackerland/core`.

## Consequences
- **Pros:** Native JSON document model matches rich nested structures (BOMs, layers, chapters). Polymorphic queries and text search work out of the box. Fast local iteration and zero schema migration friction.
- **Cons:** Relational joins across large collections require careful referencing and indexing. Mitigated by disciplined document embedding and compound indexes.
