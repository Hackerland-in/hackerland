# Database Design & Modeling

Hackerland uses **MongoDB** as its primary document datastore via `@hackerland/db` (Mongoose ODM). Documents represent polymorphic innovation entities (Projects, Workbooks, Stories, Passports) with strongly typed TypeScript interfaces derived directly from `@hackerland/core` Zod schemas.

## Data Design Philosophy

1. **Embedding for Read Performance:**
   - Entities frequently accessed together (e.g. PCB components, project milestones, chapter prompts) are embedded directly within the parent document.
2. **Referencing for Collaboration & Identity:**
   - User identities, verified badges, and squad applications are referenced via standardized `ObjectId` or canonical slug handles to maintain referential integrity.
3. **Optimistic Locking:**
   - Projects and IdeaLab workbooks leverage schema `version` fields to prevent concurrent edit clobbering during collaborative design sessions.
