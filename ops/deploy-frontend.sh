#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/postdoctor/client"
RELEASES_DIR="${APP_DIR}/releases"
TIMESTAMP="$(date +%Y%m%d%H%M%S)"
NEW_RELEASE="${RELEASES_DIR}/${TIMESTAMP}"
CURRENT_LINK="${APP_DIR}/current"

mkdir -p "${RELEASES_DIR}"

cd "${APP_DIR}"
npm ci --legacy-peer-deps
npm run build

mkdir -p "${NEW_RELEASE}"
rsync -a --delete "${APP_DIR}/dist/" "${NEW_RELEASE}/"

ln -sfn "${NEW_RELEASE}" "${CURRENT_LINK}"

echo "Frontend deployed to ${NEW_RELEASE}"
