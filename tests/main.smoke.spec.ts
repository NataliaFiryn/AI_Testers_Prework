import { expect, test } from '@playwright/test';

for (const {
  name,
  path,
  title,
  headerSelector,
  headerText,
  additionalText
} of [
  {
    name: 'home',
    path: '/',
    title: 'Rolnopol',
    headerSelector: '.main-title',
    headerText: 'Rolnopol',
    additionalText: 'Futuristic Farm & Resource Management'
  },
  {
    name: 'alerts',
    path: '/alerts.html',
    title: 'Alerts - Rolnopol',
    headerSelector: '.main-title',
    headerText: 'Rolnopol',
    additionalText: 'Alerts and Notifications'
  },
  {
    name: 'documentation',
    path: '/docs.html',
    title: 'Documentation - Rolnopol',
    headerSelector: '.main-title',
    headerText: 'Documentation',
    additionalText: 'Rolnopol System Guide & API Reference'
  },
  {
    name: 'register',
    path: '/register.html',
    title: 'Register - Rolnopol',
    headerSelector: '.main-title',
    headerText: 'Rolnopol',
    additionalText: 'Create Your User Account'
  }
]) {
  test(
    `should load and display the ${name} page`,
    { tag: '@smoke' },
    async ({ page }) => {
      // Arrange - use the current page configuration from the test data above

      // Act
      const response = await page.goto(path);

      // Assert
      expect(response).not.toBeNull();
      expect(response?.ok()).toBe(true);
      await expect(page.locator('body')).toBeVisible();
      await expect(page).toHaveTitle(title);
      await expect(page.locator(headerSelector)).toBeVisible();
      await expect(page.locator(headerSelector)).toHaveText(headerText);
      await expect(
        page.locator('header').getByText(additionalText, { exact: true })
      ).toBeVisible();
    }
  );
}

test(
  'should load and display the Swagger page',
  { tag: '@smoke' },
  async ({ page }) => {
    // Arrange
    const swaggerTitle = page.frameLocator('iframe').locator('.title');

    // Act
    const response = await page.goto('/swagger.html');

    // Assert
    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);
    await expect(page.locator('body')).toBeVisible();
    await expect(page).toHaveTitle('Rolnopol - Swagger');

    await expect(swaggerTitle).toBeVisible();
    await expect(swaggerTitle).toContainText('Rolnopol');
  }
);
