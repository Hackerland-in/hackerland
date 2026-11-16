# Database Collections Reference

### 1. `users` & `sessions`
- Managed via Better Auth with custom Hackerland profile fields (`handle`, `bio`, `role`, `skills`, `guardianId`, `isMinor`).

### 2. `projects`
- Open hardware/software initiatives. Contains title, slug, summary, hardware specs, BOM, licenses, and squad roster.

### 3. `ideas`
- Stage Zero IdeaLab workbooks adhering to `ideaSchema`. Stores notice, choose, understand, define, prototype, test, and plan stages.

### 4. `problems`
- Unsolved Grand Challenges adhering to `problemSchema`. Stores domains, constraints, impact targets, and assigned squad references.

### 5. `stories`
- Build journeys and Decision Archaeology case studies adhering to `buildJourneyStorySchema`. Stores chapters, decisions, and interactive quiz prompts.

### 6. `passports`
- Verifiable builder credentials adhering to `personalInnovationPassportSchema`. Stores fabrication records, code commit reviews, and earned badges.

### 7. `opportunities`
- Bounties, grants, and project squad openings with status lifecycles (`open`, `claimed`, `completed`, `paid`).
