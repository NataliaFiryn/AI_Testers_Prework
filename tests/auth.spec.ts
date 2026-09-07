import { expect, test } from '@playwright/test';
import { PAGE_URLS } from '../src/constants/page-urls';
import { ContentPage } from '../src/pages/content.page';
import { LoginPage } from '../src/pages/login.page';
import { ProfilePage } from '../src/pages/profile.page';

test(
  'should log in, display the user profile, and log out',
  { tag: ['@auth', '@smoke', '@positive'] },
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    const profilePage = new ProfilePage(page);
    const homePage = new ContentPage(page, PAGE_URLS.home);

    await loginPage.goto();

    await loginPage.login('emptyuser@rolnopol.demo.pl', 'demoPass123');

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
