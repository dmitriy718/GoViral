# Requisites

Everything required to move GoViral to production‑ready status.

## Immediate Security
- Rotate and revoke any previously exposed credentials (OpenAI, NewsAPI, Firebase, DB, JWT).
- Remove all secrets from the repo and history; enable secret scanning in CI.
- Store secrets in a managed secret store (SSM/Vault/Doppler/1Password).

## Authentication & Authorization
- Configure Firebase Admin credentials in server env (`FIREBASE_SERVICE_ACCOUNT`).
- Keep `ALLOW_MOCK_AUTH=false` in all non‑dev environments.
- Enforce auth on all API routes, including `/api/posts/generate`.
- Add authorization checks for user/workspace ownership on every read/write.

## Data Isolation & Privacy
- Scope all reads/writes by `userId` and workspace membership.
- Ensure no endpoints return cross‑tenant data.
- Sanitize any HTML content before rendering (Articles).

## Database & Migrations
- Switch Prisma datasource to `DATABASE_URL` (Postgres for prod).
- Generate and apply migrations; remove `dev.db` from repo.
- Encrypt third‑party tokens at rest (SocialAccount, Integration).
- Store and rotate `ENCRYPTION_KEY` securely; use `ENCRYPTION_KEY_OLD` for rotation.
- Decide on the `User.password` field: remove it or store hashed passwords only.

## API Validation & Limits
- Add Zod schemas to all endpoints (project, competitor, social, notion, analytics, error reporting).
- Add rate limits for AI generation and error reporting.
- Set request body size limits and global timeouts.

## Jobs & Reliability
- Move scheduler/automation to a dedicated worker (BullMQ + Redis).
- Add distributed locking to prevent duplicate job execution.
- Add health checks for DB/queue/external services.

## Observability
- Replace `console.*` with structured logging (pino/winston).
- Add error tracking (Sentry) and metrics.
- Redact PII and secrets from logs.
- Provide a `/metrics` endpoint for basic request stats.
- Add product analytics (PostHog) with pageview capture.

## Frontend Production Config
- Use `VITE_API_BASE_URL` for API calls.
- Guard Firebase initialization when config is missing.
- Replace mock UI data or gate it behind feature flags.

## CI/CD & Release
- Add CI steps: lint, typecheck, tests, migrations, security scans.
- Add Playwright E2E smoke tests for critical user flows.
- Add staging environment with production‑like config.
- Use canary/blue‑green deployment and rollback strategy.

## Compliance & Ops
- Define data retention, backup, and recovery policies.
- Document incident response and on‑call escalation.
- Document deployment runbooks and operational SOPs.
