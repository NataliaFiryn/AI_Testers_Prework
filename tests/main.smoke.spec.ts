import { expect, test } from '@playwright/test';
import { ContentPage } from '../src/pages/content.page';
import { SwaggerPage } from '../src/pages/swagger.page';

for (const { name, path, title, headerText, additionalText } of [
  {
    name: 'home',
    path: '/',
    title: 'Rolnopol',
    headerText: 'Rolnopol',
    additionalText: 'Futuristic Farm & Resource Management'
  },
  {
    name: 'alerts',
    path: '/alerts.html',
    title: 'Alerts - Rolnopol',
    headerText: 'Rolnopol',
    additionalText: 'Alerts and Notifications'
  },
  {
    name: 'documentation',
    path: '/docs.html',
    title: 'Documentation - Rolnopol',
    headerText: 'Documentation',
    additionalText: 'Rolnopol System Guide & API Reference'
  },
  {
    name: 'register',
    path: '/register.html',
    title: 'Register - Rolnopol',
    headerText: 'Rolnopol',
    additionalText: 'Create Your User Account'
  }
]) {
  test(
    `should load and display the ${name} page`,
    { tag: '@smoke' },
    async ({ page }) => {
      // Arrange
      const contentPage = new ContentPage(page);

      // Act
      const response = await contentPage.goto(path);

      // Assert
      expect(response).not.toBeNull();
      expect(response?.ok()).toBe(true);
      await expect(contentPage.body).toBeVisible();
      await expect(page).toHaveTitle(title);
      await expect(contentPage.mainTitle).toBeVisible();
      await expect(contentPage.mainTitle).toHaveText(headerText);
      await expect(contentPage.headerText(additionalText)).toBeVisible();
    }
  );
}

test(
  'should load and display the Swagger page',
  { tag: '@smoke' },
  async ({ page }) => {
    // Arrange
    const swaggerPage = new SwaggerPage(page);

    // Act
    const response = await swaggerPage.goto();

    // Assert
    expect(response).not.toBeNull();
    expect(response?.ok()).toBe(true);
    await expect(swaggerPage.body).toBeVisible();
    await expect(page).toHaveTitle('Rolnopol - Swagger');

    await expect(swaggerPage.swaggerTitle).toBeVisible();
    await expect(swaggerPage.swaggerTitle).toContainText('Rolnopol');
  }
);
