import { expect, test } from '@playwright/test';
import { PAGE_URLS } from '../src/constants/page-urls';
import { ContentPage } from '../src/pages/content.page';
import { SwaggerPage } from '../src/pages/swagger.page';

for (const { name, path, title, headerText, additionalText } of [
  {
    name: 'home',
    path: PAGE_URLS.home,
    title: 'Rolnopol',
    headerText: 'Rolnopol',
    additionalText: 'Futuristic Farm & Resource Management'
  },
  {
    name: 'alerts',
    path: PAGE_URLS.alerts,
    title: 'Alerts - Rolnopol',
    headerText: 'Rolnopol',
    additionalText: 'Alerts and Notifications'
  },
  {
    name: 'documentation',
    path: PAGE_URLS.documentation,
    title: 'Documentation - Rolnopol',
    headerText: 'Documentation',
    additionalText: 'Rolnopol System Guide & API Reference'
  },
  {
    name: 'register',
    path: PAGE_URLS.registration,
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
      const contentPage = new ContentPage(page, path);

      // Act
      const response = await contentPage.goto();

      // Assert
      expect(response).not.toBeNull();
      expect(response?.ok()).toBe(true);
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
    await expect(page).toHaveTitle('Rolnopol - Swagger');

    await expect(swaggerPage.swaggerTitle).toBeVisible();
    await expect(swaggerPage.swaggerTitle).toContainText('Rolnopol');
  }
);
