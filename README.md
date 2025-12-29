# ViralPost AI - Content Studio

Welcome to **ViralPost AI**, your new command center for social media dominance.

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

## Features Implemented

*   **Content Studio:** A split-screen editor with live preview.
*   **AI Generation:** Click "Generate with AI" to create variations (Simulated for speed).
*   **Draft Saving:** Persists your creative genius to a local database.
*   **Dashboard:** View your stats (Mock data).

## Technology Stack

*   **Frontend:** React, TypeScript, Tailwind CSS, Lucide Icons.
*   **Backend:** Node.js, Express, Prisma (SQLite), TypeScript.
*   **Database:** SQLite (dev.db file in server folder).

## Note on Docker

Docker composition is provided but disabled by default to ensure immediate functionality without network configuration issues. To use Docker (Postgres/Redis), uncomment the relevant sections in `.env` and `prisma/schema.prisma`.
