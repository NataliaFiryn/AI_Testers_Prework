import { expect, test } from '@playwright/test';

test(
  'should display Rolnopol in homepage title',
  { tag: '@smoke' },
  async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Rolnopol/);
  }
);
