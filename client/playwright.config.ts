import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:5173';

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  expect: { timeout: 15000 },
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ignoreHTTPSErrors: true
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 5173',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
        NODE_ENV: 'test',
        VITE_FIREBASE_API_KEY: 'test',
        VITE_FIREBASE_AUTH_DOMAIN: 'test',
        VITE_FIREBASE_PROJECT_ID: 'test',
        VITE_FIREBASE_STORAGE_BUCKET: 'test',
        VITE_FIREBASE_MESSAGING_SENDER_ID: 'test',
        VITE_FIREBASE_APP_ID: 'test',
    }
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
