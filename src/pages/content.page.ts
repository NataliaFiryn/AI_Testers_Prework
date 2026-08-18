import type { Locator, Page, Response } from '@playwright/test';

export class ContentPage {
  readonly body: Locator;
  readonly mainTitle: Locator;

  private readonly header: Locator;

  constructor(private readonly page: Page) {
    this.body = page.locator('body');
    this.mainTitle = page.locator('.main-title');
    this.header = page.locator('header');
  }

  async goto(path: string): Promise<Response | null> {
    return this.page.goto(path);
  }

  headerText(text: string): Locator {
    return this.header.getByText(text, { exact: true });
  }
}
