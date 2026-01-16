import { test, expect } from '@playwright/test';

test.describe('Authentication & Email Verification Flow', () => {
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

    // Bypass Auth
    await page.addInitScript(() => {
      window.localStorage.setItem('__E2E_USER_BYPASS__', JSON.stringify({ uid: 'test-uid', email: 'test@example.com' }));
    });

    await page.goto('/');
    
    // Check for blur
    const mainContent = page.getByTestId('main-content');
    await expect(mainContent).toHaveClass(/blur-md/);
    await expect(page.getByText('Verify your email')).toBeVisible();
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

    await page.addInitScript(() => {
      window.localStorage.setItem('__E2E_USER_BYPASS__', JSON.stringify({ uid: 'test-uid', email: 'test@example.com' }));
    });

    await page.goto('/');
    await expect(page.getByText('Verify your email')).not.toBeVisible();
    await expect(page.getByTestId('main-content')).not.toHaveClass(/blur-md/);
  });
});