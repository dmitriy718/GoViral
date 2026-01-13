#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/postdoctor/server"

cd "${APP_DIR}"
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build

systemctl restart postdoctor-api

echo "Backend deployed and service restarted."
