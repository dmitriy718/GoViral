import { test, expect } from '@playwright/test';

test.describe('Settings & Profile Updates', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/users/me', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'test-uid', email: 'test@example.com', name: 'Old Name', jobTitle: 'Old Job', avatarUrl: '', emailVerified: true }),
        });
      } else {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(route.request().postDataJSON()) });
      }
    });
    await page.route('**/api/workspaces', async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ id: '1', name: 'Test' }]) });
    });

    await page.addInitScript(() => {
      window.localStorage.setItem('__E2E_USER_BYPASS__', JSON.stringify({ uid: 'test-uid', email: 'test@example.com' }));
    });

    await page.goto('/settings');
  });

  test('successfully update profile with valid data', async ({ page }) => {
    await page.locator('input[type="text"]').first().fill('New Name');
    await page.getByRole('button', { name: /save changes/i }).click();
    await expect(page.getByText(/profile updated successfully/i)).toBeVisible();
  });
});
