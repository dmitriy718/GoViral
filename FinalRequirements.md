# Final Requirements for Production

## Critical Deployment Issue
- **VPS Content Mismatch**: The target VPS (`74.208.153.193`) is currently serving "Carolina Growth | Local growth studio" instead of "PostDoctor". This caused all production smoke tests to fail. 
- **Action Required**: Verify if "PostDoctor" and "Carolina Growth" share the same VPS and if the Nginx configuration is correctly routing based on domain, or if the deployment was overwritten.

## Secrets & Credentials
- **Production Test User**: We need a dedicated test user (email/password) that is pre-verified in the production database to run full E2E regression tests (Dashboard, Settings, etc.).
- **Firebase Service Account**: Ensure the production VPS has the `serviceAccountKey.json` or equivalent env vars loaded (`FIREBASE_SERVICE_ACCOUNT`).

## Environment
- **Redis**: Ensure Redis is running on the VPS and accessible at the `DATABASE_URL` or default localhost port.
