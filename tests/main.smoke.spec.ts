import { expect, test } from '@playwright/test';

for (const { name, path, title } of [
  { name: 'home', path: '/', title: 'Rolnopol' },
  { name: 'login', path: '/login.html', title: 'Login - Rolnopol' },
  { name: 'register', path: '/register.html', title: 'Register - Rolnopol' }
]) {
  test(
    `should load and display the ${name} page`,
    { tag: '@smoke' },
    async ({ page }) => {
      const response = await page.goto(path);

      expect(response?.ok()).toBe(true);
      await expect(page.locator('body')).toBeVisible();
      await expect(page).toHaveTitle(title);
    }
  );
}
