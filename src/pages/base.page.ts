import type { Page, Response } from '@playwright/test';

export abstract class BasePage {
  protected constructor(
    protected readonly page: Page,
    private readonly url: string
  ) {}

  async goto(): Promise<Response | null> {
    return this.page.goto(this.url);
  }
}
