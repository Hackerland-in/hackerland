# Projects & Collaboration API

### `GET /api/projects`
List curated and community open hardware/software projects. Supports filters for `domain`, `status`, `difficulty`, and pagination.

### `POST /api/projects`
Create a new project. Requires authenticated session. Body validated against `projectCreateSchema`.

### `GET /api/projects/[slug]`
Detailed project view, including hardware BOM, active squad roster, open squad roles, and milestone history.

### `POST /api/projects/[slug]/apply`
Submit an application to an open squad role.

### `POST /api/projects/[slug]/updates`
Publish a build log update, PCB revision, or field test benchmark.
