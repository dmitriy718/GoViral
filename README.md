# PostDoctor - The Cure for Boring Feeds

Welcome to **PostDoctor**, your new command center for social media dominance.

## Quick Start

1.  **Install Dependencies:**
    (Already done during setup)

2.  **Start the Application:**
    Run the start script in the root directory:
    ```bash
    ./start.sh
    ```

3.  **Access:**
    *   **Frontend:** [http://localhost:5173](http://localhost:5173)
    *   **Backend API:** [http://localhost:5000](http://localhost:5000)

## 🚀 Real Features Implemented
- **AI Content Studio**: Generates posts using OpenAI (gpt-4o-mini) with tone customization (Professional, Meme Lord, etc.).
- **Smart Scheduler**: Worker-backed scheduler publishes scheduled posts automatically.
- **Analytics Overview**: Aggregated dashboard stats based on stored activity.
- **Queue-backed Publishing**: BullMQ + Redis with retries, dedupe, and visibility timeouts.
- **Observability**: Request IDs, latency percentiles, DB timing, and Sentry error capture.
- **Product Analytics**: PostHog pageview capture when `VITE_POSTHOG_KEY` is set.
- **Social Auth**: Mock OAuth flow for connecting Twitter, LinkedIn, etc. (for development only).
- **Plan Limits**: Enforces post/account limits based on subscription tier (Free/Pro).

## Technology Stack

*   **Frontend:** React, TypeScript, Tailwind CSS, Lucide Icons.
*   **Backend:** Node.js, Express, Prisma (Postgres), TypeScript.
*   **Database:** PostgreSQL.

## Production Notes

- **Worker**: run `node dist/worker.js` (or systemd `postdoctor-worker`) for scheduler jobs.
- **Deploy scripts**: see `ops/deploy-frontend.sh` and `ops/deploy-backend.sh`.
- **Environment**: `server/.env` should include `ENCRYPTION_KEY` (32-byte base64) and `MOCK_MODE=false`.
- **Mock-only features**: Competitor analysis, Notion sync, and detailed analytics are disabled unless `MOCK_MODE=true`.
- **Sentry**: set `SENTRY_DSN` to enable server/client error capture.
- **PostHog**: set `VITE_POSTHOG_KEY` and optionally `VITE_POSTHOG_HOST`.

## Note on Docker

Docker composition is provided but disabled by default to ensure immediate functionality without network configuration issues.
