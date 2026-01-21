# Final Requirements for Production

## Secrets & Credentials
- **Production Test User**: We need a dedicated test user (email/password) that is pre-verified in the production database to run full E2E regression tests (Dashboard, Settings, etc.).
- **Firebase Service Account**: Ensure the production VPS has the `serviceAccountKey.json` or equivalent env vars loaded (`FIREBASE_SERVICE_ACCOUNT`).

## Environment
- **Redis**: Ensure Redis is running on the VPS and accessible at the `DATABASE_URL` or default localhost port.
