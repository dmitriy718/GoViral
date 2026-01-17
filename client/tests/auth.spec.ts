import { test, expect } from '@playwright/test';

test.describe('Authentication & Email Verification Flow', () => {
  test.beforeEach(async ({ context }) => {
    await context.addInitScript(() => {
      window.localStorage.setItem('__E2E_USER_BYPASS__', JSON.stringify({ uid: 'test-uid', email: 'test@example.com' }));
    });
  });

  test('unverified user sees blur and verification modal', async ({ page }) => {
    // Mock API
    await page.route('**/api/users/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'test-uid', email: 'test@example.com', name: 'Test User', emailVerified: false }),
      });
    });
    await page.route('**/api/workspaces', async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ id: '1', name: 'Test' }]) });
    });
    await page.route('**/api/social', async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.goto('/');
    
    // Check for layout root
    await expect(page.getByTestId('layout-root')).toBeVisible({ timeout: 15000 });
    
    // Check for blur
    const mainContent = page.getByTestId('main-content');
    await expect(mainContent).toHaveClass(/blur-md/, { timeout: 10000 });
    await expect(page.getByText(/verify your email/i)).toBeVisible();
  });

  test('verified user does not see modal', async ({ page }) => {
    await page.route('**/api/users/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'test-uid', email: 'test@example.com', name: 'Test User', emailVerified: true }),
      });
    });
    await page.route('**/api/workspaces', async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ id: '1', name: 'Test' }]) });
    });
    await page.route('**/api/social', async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.goto('/');
    
    await expect(page.getByTestId('layout-root')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/verify your email/i)).not.toBeVisible();
    await expect(page.getByTestId('main-content')).not.toHaveClass(/blur-md/);
  });
});
