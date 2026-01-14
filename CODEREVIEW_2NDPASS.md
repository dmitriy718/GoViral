# PostDoctor Production Readiness Code Review — Second Pass

Date: 2026-01-14
Scope: server, client, deployment tooling, and VPS setup

## Overview
This pass validates the remediation work and highlights remaining gaps to reach “production-hardened” readiness. Many critical issues from the first review are now addressed (auth hardening, scoped data, rate limits, migrations, encryption, logging, worker separation). Below are the remaining risks and suggested follow‑ups.

---

## Critical / High

1) **Encryption key lifecycle risk**
- `ENCRYPTION_KEY` is required at runtime; if rotated or lost, encrypted tokens/configs become unreadable.
- No key rotation or re‑encryption flow exists.
Recommendation:
- Store key in managed secrets (KMS/SSM) and document rotation plan.
- Add a re‑encryption job to rotate existing tokens safely.
Status:
- Added `ENCRYPTION_KEY_OLD` support and `reencrypt:tokens` script for rotation.

2) **Background job concurrency**
- Scheduler moved to a worker, but no distributed lock/deduping exists.
Impact: If multiple workers start, scheduled posts can double‑publish.
Recommendation:
- Add a job queue (BullMQ) + distributed lock (Redis) for publish tasks.
- Ensure only one scheduler instance runs in production.
Status:
- Added a Postgres advisory lock in the scheduler to prevent duplicate runs.

3) **Error reports stored on disk**
- Error reports are written to local disk (`/logged_errors`).
Impact: PII storage and disk growth risk persists.
Recommendation:
- Replace with external error pipeline (Sentry/Cloudwatch/ELK) and disable local persistence.
Status:
- Disk persistence removed; errors are logged only.

---

## Medium

1) **Mock/feature‑flagged data still present**
- Mock data is gated via `MOCK_MODE` / `VITE_MOCK_MODE`, but features still return placeholders.
- Server mocks: `server/src/services/analytics.service.ts` (engagement/demographics), `server/src/services/competitor.service.ts` (analysis), `server/src/services/notion.service.ts` (mock Notion pages), `server/src/services/automation.service.ts` (auto‑plug/auto‑DM), `server/src/services/trends.service.ts` (fallback mock trends when API key missing).
- Client mocks: `client/src/pages/Support.tsx` (ticket submission), `client/src/pages/ActivityLog.tsx` (activity list), `client/src/pages/Dashboard.tsx` (chart data), `client/src/pages/Calendar.tsx` (viral drops).
Recommendation:
- Replace with real integrations or disable endpoints in production.
- Add clear 501 responses to avoid silent no‑ops.
Status:
- Mock gating enforced via `MOCK_MODE`/`VITE_MOCK_MODE`; Notion sync now returns 501 when disabled.

2) **Limited API retries**
- Retries added for NewsAPI + Facebook, but no exponential backoff or circuit breaker.
Recommendation:
- Add retry backoff and per‑service failure thresholds.
Status:
- Added retry helper with exponential backoff + jitter; circuit breaker still recommended.

3) **Frontend build artifacts served by custom node server**
- Static server is functional, but lacks caching headers and compression.
Recommendation:
- Configure Nginx to serve static assets directly with caching and gzip/brotli.
Status:
- Static server now sets cache headers; nginx direct static serving still recommended for max efficiency.

4) **Observability still partial**
- Pino logger added, but many operational metrics are missing.
Recommendation:
- Add request metrics, error rates, and DB timing instrumentation.
Status:
- Added request IDs and basic in‑memory metrics endpoint; DB timing still pending.

---

## Low

1) **Project ownership logic relies on syncUser**
- Projects now use `syncUser`, which is safer but still assumes token trust without explicit workspace checks.
Recommendation:
- Add workspace‑level authorization middleware as the app evolves.

2) **Large frontend bundle warnings**
- Build warnings indicate large JS bundles.
Recommendation:
- Add code‑splitting for dashboard and analytics pages.

---

## Suggested Next Steps

1) Implement a real job queue with distributed locks for scheduled publishing.
2) Add key rotation strategy + encrypted data rekeying path.
3) Replace mock endpoints with real integrations or explicit 501 responses.
4) Upgrade observability to include metrics and tracing.
5) Add CI checks for bundle size + dependency vulnerabilities.
