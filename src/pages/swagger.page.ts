import type { Locator, Page, Response } from '@playwright/test';

export class SwaggerPage {
  readonly swaggerTitle: Locator;

  constructor(private readonly page: Page) {
    this.swaggerTitle = page.frameLocator('iframe').locator('.title');
  }

  async goto(): Promise<Response | null> {
    return this.page.goto('/swagger.html');
  }
}
