# Identity & Passport API

### `GET /api/me/profile`
Fetches the currently authenticated session's builder profile, permissions, and guardian status.

### `GET /api/u/[handle]`
Public profile resolution. Returns builder bio, verified badges, active squads, and public fabrication records.

### `GET /api/u/check-handle?handle=[handle]`
Availability checker for unique usernames/handles during onboarding.

### `GET /api/passport/[handle]`
Cryptographically verifiable Innovation Passport document, including completed hardware builds, peer review scores, and verified physical prototypes.
