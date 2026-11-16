# API Conventions & Architecture

All Hackerland REST Route Handlers in `apps/web/src/app/api/` adhere to consistent standards:

1. **Standardized Response Envelope:**
   ```json
   {
     "success": true,
     "data": { ... },
     "meta": { "total": 42, "page": 1, "limit": 20 }
   }
   ```
   On errors:
   ```json
   {
     "success": false,
     "error": {
       "code": "VALIDATION_FAILED",
       "message": "Field 'title' is required.",
       "details": [ ... ]
     }
   }
   ```

2. **Validation:**
   - Every incoming request body and search query parameter is validated against an explicit Zod schema from `@hackerland/core`.
   - Unknown fields are stripped (`strip()`).

3. **Authentication:**
   - Handled via `auth.api.getSession({ headers })`. Unauthenticated calls to protected routes return `HTTP 401 Unauthorized`.
   - Age-restricted endpoints check `session.user.isMinor` and reject unauthorized cross-generational actions with `HTTP 403 Forbidden`.
