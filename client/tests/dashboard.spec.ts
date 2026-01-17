import { test, expect } from '@playwright/test';

test.describe('Dashboard Functionality', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript(() => {
      window.localStorage.setItem('__E2E_USER_BYPASS__', JSON.stringify({ uid: '123', email: 'v@test.com' }));
    });

    await page.route('**/api/users/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: '123', email: 'v@test.com', emailVerified: true }),
      });
    });
    await page.route('**/api/workspaces', async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ id: '1', name: 'Test' }]) });
    });
    await page.route('**/api/analytics/dashboard', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ viralScore: 85, estRoi: 420, totalReach: 1337, activePersonas: 3 }),
      });
    });
    await page.route('**/api/trends', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ topic: 'AI Growth', vol: '1.2M', sentiment: 'Positive' }]),
      });
    });
    await page.route('**/api/social', async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.goto('/');
  });

  test('dashboard renders stats and trends', async ({ page }) => {
    await expect(page.getByTestId('layout-root')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('85/100')).toBeVisible();
    await expect(page.getByRole('heading', { name: '$420' })).toBeVisible();
    await expect(page.getByText('AI Growth')).toBeVisible();
  });

  test('can navigate to post creation', async ({ page }) => {
    await expect(page.getByTestId('layout-root')).toBeVisible({ timeout: 15000 });
    await page.getByRole('link', { name: /content studio/i }).click();
    await expect(page).toHaveURL(/\/create/);
  });
});