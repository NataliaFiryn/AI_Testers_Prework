import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { expect, test as setup } from '@playwright/test';
import { DEMO_USER_AUTH_STATE_PATH } from '../../src/constants/authentication';
import { PAGE_URLS } from '../../src/constants/page-urls';
import { DEMO_USER } from '../../src/models/user';
import { LoginPage } from '../../src/pages/login.page';

setup('authenticate DEMO_USER', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login(DEMO_USER.email, DEMO_USER.password);

  await expect(page).toHaveURL(PAGE_URLS.profile);

  await mkdir(path.dirname(DEMO_USER_AUTH_STATE_PATH), { recursive: true });
  await page.context().storageState({ path: DEMO_USER_AUTH_STATE_PATH });
});
