# Security Architecture & Trust Engineering

## 1. Compliance & Child Protection (DPDP Act & COPPA)

Hackerland is built from the ground up to empower young creators while enforcing ironclad child protection standards under the Indian Digital Personal Data Protection Act (DPDP Act 2023) and COPPA:

- **Verifiable Parental Consent (VPC):** Users under 18 require verifiable parental/guardian linkage before public profile indexing or external communication.
- **Strict Anti-Grooming Communication Fences:**
  - Direct 1-on-1 private messaging between adult accounts and minors is strictly prohibited and blocked at the API layer.
  - All communication for junior squads occurs in open, publicly observable community threads with automated keyword moderation and human educator oversight.
- **Zero Behavioral Tracking on Minors:** No ad profiling, third-party pixel tracking, or targeted telemetry is permitted on minor accounts.

## 2. Authentication & Session Hygiene

- Built on **Better Auth** with HTTP-only, `SameSite=Lax`, encrypted JWT session cookies.
- CSRF protection enabled across all state-mutating route handlers.
- Per-IP and per-account distributed rate-limiting on sensitive endpoints (auth attempts, bounty claims, contact forms).

## 3. Client-Side Sandboxing for Simulations

- PCB simulation, SPICE solvers, and user-supplied HDL code execute strictly client-side inside WebAssembly or Web Worker sandboxes.
- Zero server-side arbitrary code execution: designs export directly to sanitized Gerber RS-274X and SVG assets, validated against regular expression schemas to prevent SVG/XML injection attacks.
