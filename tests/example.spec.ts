import { expect, test } from '@playwright/test';

test('has Playwright title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Playwright/);
});
