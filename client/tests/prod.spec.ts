import { test, expect } from '@playwright/test';

test.describe('Production Smoke Tests', () => {
  
  test('public pages are accessible', async ({ page }) => {
    const pages = ['/login', '/privacy', '/terms'];
    
    for (const path of pages) {
      console.log(`Checking ${path}...`);
      const response = await page.goto(path);
      expect(response?.ok()).toBeTruthy();
      
      // Basic accessibility check (title exists)
      const title = await page.title();
      expect(title).toBeTruthy();
    }
  });

  test('login page has correct elements', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In', exact: true })).toBeVisible();
  });

  // Note: We cannot test full signup/login flow without a known test user or 
  // polluting the prod DB with random users. 
  // We rely on the "Verify Email" modal appearance if we were to signup, 
  // but for safety in this automated suite, we stop at the boundary.
});
