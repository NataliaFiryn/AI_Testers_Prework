import { expect, test } from '@playwright/test';
import { PAGE_URLS } from '../../src/constants/page-urls';
import { DEMO_USER } from '../../src/models/user';
import { ContentPage } from '../../src/pages/content.page';
import { LoginPage } from '../../src/pages/login.page';
import { ProfilePage } from '../../src/pages/profile.page';

// Logout invalidates the backend session, so this test needs its own login.
test.use({ storageState: { cookies: [], origins: [] } });

test(
  'should display the DEMO_USER profile and log out',
  { tag: ['@auth', '@smoke', '@positive'] },
  async ({ page }) => {
    const profilePage = new ProfilePage(page);
    const homePage = new ContentPage(page, PAGE_URLS.home);
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(DEMO_USER.email, DEMO_USER.password);

    await expect(page).toHaveURL(PAGE_URLS.profile);
    await expect(page).toHaveTitle('Profile - Rolnopol');
    await expect(profilePage.profileInformationHeading).toBeVisible();
    await expect(profilePage.updateProfileHeading).toBeVisible();
    await expect(profilePage.dangerZoneHeading).toBeVisible();

    await profilePage.logout();

    await expect(page).toHaveURL(PAGE_URLS.home);
    await expect(page).toHaveTitle('Rolnopol');
    await expect(homePage.mainTitle).toHaveText('Rolnopol');
  }
);
