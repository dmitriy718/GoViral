import { test, expect } from '@playwright/test';

test.describe('Content Creation Flow', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addInitScript(() => {
      window.localStorage.setItem('__E2E_USER_BYPASS__', JSON.stringify({ uid: '123', email: 'v@test.com' }));
    });

    await page.route('**/api/users/me', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: '123', email: 'v@test.com', emailVerified: true }) });
    });
    await page.route('**/api/workspaces', async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([{ id: '1', name: 'Test' }]) });
    });
    await page.route('**/api/social', async (route) => {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.goto('/create');
  });

  test('can generate and schedule a post', async ({ page }) => {
    await expect(page.getByTestId('layout-root')).toBeVisible({ timeout: 15000 });
    await page.locator('textarea').first().fill('Test AI Topic');

    await page.route('**/api/posts/generate', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ suggestions: [{ content: 'Generated Viral Content', platform: 'twitter' }] }),
      });
    });

    await page.getByRole('button', { name: /generate magic/i }).click();
    await expect(page.getByText('Generated Viral Content')).toBeVisible();

    await page.route('**/api/posts', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ id: 'post-123' }) });
    });

    await page.getByRole('button', { name: /schedule post/i }).click();
    await expect(page.getByText(/post scheduled/i)).toBeVisible();
  });
});
