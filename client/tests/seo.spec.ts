import { test, expect } from '@playwright/test';

test('SEO metadata is present', async ({ page }) => {
  await page.goto('/login');
  const description = page.locator('meta[name="description"][data-rh="true"]');
  await expect(description).toHaveAttribute('content', /PostDoctor/i);

  const ogTitle = page.locator('meta[property="og:title"][data-rh="true"]');
  await expect(ogTitle).toHaveAttribute('content', /PostDoctor/i);
});
