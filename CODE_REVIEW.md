# PostDoctor Production Readiness Code Review

Date: 2025-01-13
Scope: `server/`, `client/`, root configs (`docker-compose.yml`, `start.sh`, `package.json`)

## Executive Summary
The codebase is feature-rich but currently structured as a demo/MVP. Multiple critical issues prevent production deployment readiness, notably: committed secrets, authentication bypasses, cross-tenant data leakage, unprotected expensive endpoints, and client-side XSS risk. Operationally, background jobs, logging, and database configuration are not production-safe.

Below is a severity-ordered list of findings with file references and concrete recommendations.

---

## Critical Findings (Must Fix Before Production)

1) **Secrets committed in repo / local workspace**
- `server/.env` contains live secrets (OpenAI key, News API key, JWT secret, DB creds). These are high-risk if ever committed or shared.
- `client/.env` is tracked (not gitignored). While Firebase config isn’t a secret, it should be treated as environment config, not committed.
- `server/prisma/dev.db` is stored in the repo and likely contains user data.
Recommendations:
- Rotate all exposed keys immediately.
- Remove `.env` and `dev.db` from source control; enforce with `.gitignore` + pre-commit checks.
- Move secrets to a managed secret store (e.g., Doppler/1Password/Vault/SSM).

2) **Authentication bypass / mock auth in production code**
- `server/src/config/firebase.ts` returns a mock `verifyIdToken` when Firebase isn’t configured and accepts a hardcoded `mock-token`.
Impact: Anyone can authenticate with a known token if Firebase config is missing or misconfigured.
Recommendation: Remove mock auth in production builds. Fail startup if Firebase credentials are missing.

3) **Cross-tenant data leakage on posts**
- `server/src/services/post.service.ts` and `server/src/controllers/post.controller.ts` return all posts for all users (`getPosts` has no user filter).
Impact: Any authenticated user can read other users’ drafts/posts.
Recommendation: Always scope queries to `req.user.uid` and validate workspace ownership.

4) **Unprotected AI generation endpoint**
- `POST /api/posts/generate` is public (no auth) in `server/src/routes/post.routes.ts`.
Impact: Anyone can consume OpenAI credits and abuse the endpoint.
Recommendation: Require auth + rate limits; enforce usage quotas tied to subscriptions.

5) **XSS risk via unsanitized HTML**
- `client/src/pages/ArticleView.tsx` uses `dangerouslySetInnerHTML` with DB content.
Impact: Stored XSS if `Article.content` is untrusted or compromised.
Recommendation: Sanitize HTML server-side (e.g., DOMPurify on server) or store as markdown and render safely.

6) **Sensitive tokens stored in plaintext**
- `server/prisma/schema.prisma` stores `SocialAccount.accessToken`, `Integration.config` (Notion token) as raw strings.
Impact: DB compromise exposes third‑party accounts.
Recommendation: Encrypt tokens at rest (envelope encryption) and scope DB access. Avoid logging tokens.

---

## High Severity Findings

1) **No validation on most write endpoints**
- `server/src/controllers/project.controller.ts`, `server/src/controllers/competitor.controller.ts`, `server/src/controllers/social.controller.ts`, `server/src/controllers/notion.controller.ts` accept unvalidated body input.
Recommendation: Add Zod schemas for all routes; reject unknown fields; validate IDs and enums.

2) **CORS is fully open**
- `server/src/index.ts` uses `cors()` with no origin restrictions.
Impact: Any origin can call the API; combined with token leakage, this expands attack surface.
Recommendation: Lock CORS to allowed origins, enable credentials only if needed.

3) **Scheduler runs inside the web process**
- `server/src/services/scheduler.service.ts` runs cron inside the API server.
Impact: Duplicate jobs on multi-instance deployments and no distributed locking.
Recommendation: Move background jobs to a worker process + queue (BullMQ/Redis) with dedupe/locks.

4) **Database configuration mismatch (SQLite vs Postgres)**
- Prisma schema is hard-coded to SQLite while `.env` indicates Postgres.
Impact: Production DB likely misconfigured; migrations are missing.
Recommendation: Switch datasource to `env("DATABASE_URL")`, add migrations, and remove SQLite db file from repo.

5) **User password stored as plain text placeholder**
- `server/prisma/schema.prisma` requires `User.password`, and code writes placeholder strings (`firebase-managed`).
Impact: Misleading and unsafe; potential risk if later used.
Recommendation: Remove password field or store hashed values only for non-Firebase auth.

6) **Token logging / sensitive logs**
- `server/src/utils/openai.ts` logs key prefix; `server/src/controllers/error.controller.ts` logs full client error payload.
Impact: Logs can leak credentials or PII.
Recommendation: Use structured logging with redaction; limit logged payloads.

---

## Medium Severity Findings

1) **Error-report endpoint can be abused**
- `server/src/controllers/error.controller.ts` writes arbitrary payloads to disk with no auth or rate limiting.
Impact: Disk exhaustion and PII exposure.
Recommendation: Add rate limiting, size limits, and store in a proper logging/incident system.

2) **No request timeouts or retries for external APIs**
- `axios` calls in `server/src/services/trends.service.ts` and `server/src/controllers/social.controller.ts` have no timeouts.
Recommendation: Set timeouts, retries with backoff, and circuit breakers.

3) **Hardcoded API base URLs on the client**
- `client/src/lib/api.ts` uses `http://localhost:5000` for API and error reporting.
Impact: Production build will call localhost.
Recommendation: Use `import.meta.env.VITE_API_BASE_URL` with environment-specific config.

4) **Firebase initialization lacks safety guard**
- `client/src/lib/firebase.ts` comment says “initialize only if config is present” but code always initializes.
Impact: App may crash if env missing.
Recommendation: Add explicit checks and fail fast with a clear UI message.

5) **Mock data and simulation logic in production paths**
- `server/src/services/analytics.service.ts`, `server/src/services/competitor.service.ts`, `server/src/services/notion.service.ts`, `server/src/services/automation.service.ts`, `client/src/pages/Support.tsx`, `client/src/pages/ActivityLog.tsx`.
Impact: Misleading metrics, no real integrations; not production-ready.
Recommendation: Replace mocks with real data pipelines or feature-flag them off.

6) **Multiple PrismaClient instances**
- Many files instantiate `new PrismaClient()` directly.
Impact: Excess connections and resource usage under load.
Recommendation: Centralize Prisma client (singleton) and reuse.

---

## Low Severity Findings

1) **Generate-post schema allows invalid states**
- `server/src/schemas/post.schema.ts` allows `keywords` to be optional, but `ai.service` expects an array for non-repurpose mode.
Recommendation: Require keywords or enforce `sourceContent` when repurposing.

2) **Workspace slug collisions possible**
- `server/src/controllers/workspace.controller.ts` builds slugs with a random suffix but no uniqueness check.
Recommendation: Enforce uniqueness with a retry loop.

3) **Noise in logs**
- Debug logs (`console.log`) throughout server and client (e.g., `server/src/services/automation.service.ts`).
Recommendation: Replace with leveled logger and disable noisy logs in production.

4) **Static demo data in UI**
- `client/src/pages/Dashboard.tsx` uses static chart data; “Viral Drops” are hardcoded in `client/src/pages/Calendar.tsx`.
Recommendation: Wire to real data or move behind feature flags.

---

## Production Readiness Recommendations (Priority Order)

1) **Security & Secrets**
- Rotate exposed keys immediately.
- Enforce no-secrets-in-repo policy; add secret scanning (gitleaks, trufflehog).
- Remove mock auth and require Firebase credentials in production builds.

2) **Data Isolation & Access Control**
- Scope all reads/writes by user and workspace.
- Add authorization checks on workspace/project membership for every resource.

3) **Input Validation & Rate Limiting**
- Add Zod schemas to all endpoints.
- Apply per-user rate limits on AI generation and error reporting.

4) **Operational Reliability**
- Move schedulers to a job queue worker.
- Add health checks for DB + external services.
- Add request timeouts/retries for external APIs.

5) **Database & Migrations**
- Switch Prisma to `DATABASE_URL` and add migrations.
- Remove `dev.db` from repo; add migration pipeline for CI/CD.

6) **Logging & Observability**
- Replace console logs with structured logger (pino/winston).
- Add request IDs, error tracking (Sentry), and metrics.

7) **Frontend Production Config**
- Move API base URLs to env.
- Sanitize HTML content before rendering.
- Replace mock data with real endpoints or feature flags.

---

## Suggested Next Steps

1) Triage and fix Critical findings (auth bypass, data leakage, secrets, XSS).
2) Align database configuration and create proper migrations.
3) Add validation + rate limiting to all endpoints.
4) Replace or gate mocked services with real integrations.
5) Establish CI/CD with tests, linting, and security scanning.

If you want, I can turn these into a tracked remediation plan with estimates and staged milestones.

---

## Remediation Plan (All Items Covered)

This plan addresses every finding above. It is ordered to minimize risk, prevent regressions, and keep production compatibility.

### Phase 0 — Safety & Triage (Immediate)
- Rotate all exposed secrets; invalidate compromised OpenAI/NewsAPI/JWT/DB credentials.
- Remove committed secrets from the repo history if applicable, then enforce secret scanning (gitleaks/trufflehog) in CI.
- Freeze production deployment until Phases 1–2 are complete.

### Phase 1 — Security & Auth (Blocker Fixes)
1) **Remove mock auth and enforce Firebase**
   - `server/src/config/firebase.ts`: delete mock `verifyIdToken` and fail startup if credentials missing in production.
   - Add explicit `NODE_ENV` gating to avoid fallback in prod.
2) **Lock down AI generation endpoint**
   - `server/src/routes/post.routes.ts`: require `authenticate` for `/generate`.
   - Add rate limiting (per user + per IP) and enforce subscription quotas on AI usage.
3) **Close cross-tenant data leaks**
   - `server/src/services/post.service.ts`, `server/src/controllers/post.controller.ts`: scope all reads by `req.user.uid`.
   - Add ownership checks for workspace/project resources across controllers.
4) **Fix XSS risk**
   - `client/src/pages/ArticleView.tsx`: sanitize HTML before render.
   - Prefer markdown rendering with whitelist (DOMPurify or server-side sanitizer).
5) **Encrypt tokens at rest**
   - `SocialAccount.accessToken`, `Integration.config`: implement envelope encryption.
   - Introduce a KMS-managed key and store ciphertext + metadata.

### Phase 2 — Data Model & DB Alignment
1) **Normalize DB config**
   - `server/prisma/schema.prisma`: use `env("DATABASE_URL")` and migrate from SQLite.
   - Remove `dev.db` from repo and add to `.gitignore`.
2) **Migrations**
   - Create migration scripts for Postgres and run against staging.
3) **User password field**
   - If Firebase-only auth: drop `password` column.
   - If mixed auth: hash-only storage (bcrypt) and enforce strong policies.

### Phase 3 — Input Validation & API Reliability
1) **Schema validation**
   - Add Zod schemas to all endpoints (projects, competitors, social, notion, analytics, error reporting).
2) **Request limits**
   - Add body size limits and request timeouts; avoid unbounded disk writes.
3) **External API robustness**
   - Apply axios timeouts, retries (exponential backoff), and circuit breakers.

### Phase 4 — Jobs, Logging & Observability
1) **Job architecture**
   - Move scheduler to a dedicated worker (BullMQ + Redis).
   - Add distributed locking to prevent duplicate publishes.
2) **Logging**
   - Replace `console.*` with structured logger (pino/winston).
   - Add PII redaction and a log retention policy.
3) **Monitoring**
   - Add Sentry/Datadog and health checks for DB/queue/external APIs.

### Phase 5 — Frontend Production Readiness
1) **Config**
   - `client/src/lib/api.ts`: replace hardcoded base URL with `VITE_API_BASE_URL`.
   - Ensure `firebase.ts` initializes only when env is valid and fail fast with UI guard.
2) **Mock data removal**
   - Replace or feature-flag mock stats, competitor analysis, and support tickets.

### Phase 6 — Compliance, QA, and Deployment
1) **CI/CD**
   - Lint, typecheck, unit/integration tests, migrations, security scan gates.
2) **Pre-prod validation**
   - Load test AI endpoints and scheduler; verify rate limits and quotas.
3) **Release**
   - Blue/green or canary deployment; rollback strategy.

---

## Compatibility & Breakage Risk Check

- **Auth changes**: Removing mock auth may break local dev unless Firebase credentials are provided. Plan includes a dev-only guard to allow local testing with explicit flagging.
- **Post scoping**: Filtering posts by user will change UI behavior (no more shared data). Client already expects user-specific data; update any admin views if needed.
- **DB migration**: Switching to Postgres must be coordinated with schema migrations and data copy. Requires staging validation before prod.
- **Token encryption**: Existing stored tokens must be re-encrypted in place; add a migration job to backfill.
- **AI generation**: Adding auth + rate limits may require UI updates to handle quota errors.
- **HTML sanitization**: Sanitizer may strip some content; ensure article content is stored in an allowed subset.

This plan is designed to be compatible with current code patterns and to avoid breaking functionality by sequencing risky changes after safety gates.

---

## Current Status (As Implemented)

- Auth hardened; mock auth disabled in production.
- AI generation protected by auth + rate limits + usage tracking.
- Cross‑tenant post access fixed.
- Prisma migrated to Postgres with migrations tracked.
- Logging reduced for sensitive payloads; structured logging + request IDs added.
- Scheduler moved to worker with advisory lock.
- Encryption added for social tokens + Notion config.
- Mock data gated behind `MOCK_MODE`/`VITE_MOCK_MODE`.
