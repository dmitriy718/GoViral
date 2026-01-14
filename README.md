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
- **Analytics Deep Dive**: Detailed engagement reports and audience growth metrics.
- **Competitor Spy**: Tracks competitor handles and ensures data persistence.
- **Social Auth**: Mock OAuth flow for connecting Twitter, LinkedIn, etc.
- **Plan Limits**: Enforces post/account limits based on subscription tier (Free/Pro).

## Technology Stack

*   **Frontend:** React, TypeScript, Tailwind CSS, Lucide Icons.
*   **Backend:** Node.js, Express, Prisma (Postgres), TypeScript.
*   **Database:** PostgreSQL.

## Production Notes

- **Worker**: run `node dist/worker.js` (or systemd `postdoctor-worker`) for scheduler jobs.
- **Deploy scripts**: see `ops/deploy-frontend.sh` and `ops/deploy-backend.sh`.
- **Environment**: `server/.env` should include `ENCRYPTION_KEY` (32-byte base64) and `MOCK_MODE=false`.

## Note on Docker

Docker composition is provided but disabled by default to ensure immediate functionality without network configuration issues.
