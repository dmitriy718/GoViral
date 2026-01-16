import { test, expect } from '@playwright/test';

test('login page loads', async ({ page }) => {
  await page.goto('/login');
  await expect(page).toHaveTitle(/PostDoctor/i);
  await expect(page.getByRole('heading', { name: /postdoctor/i })).toBeVisible();
});

test('public legal pages render', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { name: /privacy policy/i })).toBeVisible();

  await page.goto('/terms');
  await expect(page.getByRole('heading', { name: /terms of service/i })).toBeVisible();

  await page.goto('/cookies');
  await expect(page.getByRole('heading', { name: /cookie policy/i })).toBeVisible();
});
