import {
  expect,
  test as base,
  type Locator,
  type Request
} from '@playwright/test';
import { PAGE_URLS } from '../src/constants/page-urls';
import { LoginPage } from '../src/pages/login.page';
import { RegistrationPage } from '../src/pages/registration.page';
import { generateRegistrationEmail } from '../src/utils/generate-registration-email';

type NativeValidityFlag = 'valueMissing' | 'typeMismatch' | 'tooShort';

type RegistrationFixtures = {
  registrationPage: RegistrationPage;
  registrationRequests: Request[];
};

const test = base.extend<RegistrationFixtures>({
  registrationPage: async ({ page }, use) => {
    await use(new RegistrationPage(page));
  },
  registrationRequests: async ({ page }, use) => {
    const requests: Request[] = [];
    page.on('request', (request) => {
      if (
        request.url().endsWith('/api/v1/register') &&
        request.method() === 'POST'
      ) {
        requests.push(request);
      }
    });
    await use(requests);
  }
});

const expectNativeValidationMessage = async (
  input: Locator,
  validityFlag: NativeValidityFlag
): Promise<void> => {
  await expect
    .poll(() =>
      input.evaluate(
        (element, flag) => (element as HTMLInputElement).validity[flag],
        validityFlag
      )
    )
    .toBe(true);
  await expect
    .poll(() =>
      input.evaluate(
        (element) => (element as HTMLInputElement).validationMessage
      )
    )
    .not.toBe('');
};

const expectNoRegistrationRequest = (requests: Request[]): void => {
  expect(requests).toHaveLength(0);
};

test(
  'should register a new user successfully',
  { tag: ['@registration', '@positive'] },
  async ({ page, registrationPage }, testInfo) => {
    const email = generateRegistrationEmail(testInfo.workerIndex);
    const loginPage = new LoginPage(page);

    await registrationPage.goto();

    const registrationResponse = await registrationPage.register(
      email,
      'Playwright Test',
      'TestReg-2026!'
    );

    expect(registrationResponse.status()).toBe(201);
    expect(registrationResponse.request().postDataJSON()).toEqual({
      email,
      displayedName: 'Playwright Test',
      password: 'TestReg-2026!'
    });
    await expect(registrationPage.successBanner).toContainText(
      'Registration successful!'
    );
    await expect(page).toHaveURL(PAGE_URLS.login);
    await expect(loginPage.pageTitle).toBeVisible();
  }
);

test.describe(
  'registration validation',
  { tag: ['@registration', '@negative'] },
  () => {
    test.beforeEach(async ({ registrationPage }) => {
      await registrationPage.goto();
    });

    test('should require an email address', async ({
      page,
      registrationPage,
      registrationRequests
    }) => {
      await registrationPage.fillRegistrationForm('', 'Valid User', 'abc');

      await registrationPage.submit();

      await expectNativeValidationMessage(
        registrationPage.emailInput,
        'valueMissing'
      );
      await expect(registrationPage.emailInput).toBeFocused();
      await expect(page).toHaveURL(PAGE_URLS.registration);
      expectNoRegistrationRequest(registrationRequests);
    });

    test('should reject a whitespace-only email address', async ({
      page,
      registrationPage,
      registrationRequests
    }) => {
      await registrationPage.fillRegistrationForm('   ', 'Valid User', 'abc');

      await registrationPage.submit();

      await expect(registrationPage.emailInput).toHaveValue('');
      await expectNativeValidationMessage(
        registrationPage.emailInput,
        'valueMissing'
      );
      await expect(registrationPage.emailInput).toBeFocused();
      await expect(page).toHaveURL(PAGE_URLS.registration);
      expectNoRegistrationRequest(registrationRequests);
    });

    for (const invalidEmail of [
      'plainaddress',
      'user@',
      '@example.com',
      'user name@example.com'
    ]) {
      test(`should reject malformed email ${invalidEmail}`, async ({
        page,
        registrationPage,
        registrationRequests
      }) => {
        await registrationPage.fillRegistrationForm(
          invalidEmail,
          'Valid User',
          'abc'
        );

        await registrationPage.submit();

        await expectNativeValidationMessage(
          registrationPage.emailInput,
          'typeMismatch'
        );
        await expect(registrationPage.emailInput).toBeFocused();
        await expect(
          registrationPage.alertWithText('Please enter a valid email address')
        ).toHaveText('Please enter a valid email address');
        await expect(page).toHaveURL(PAGE_URLS.registration);
        expectNoRegistrationRequest(registrationRequests);
      });
    }

    test('should reject an email without a domain suffix', async ({
      page,
      registrationPage,
      registrationRequests
    }) => {
      await registrationPage.fillRegistrationForm(
        'user@example',
        'Valid User',
        'abc'
      );

      await registrationPage.submit();

      await expect(
        registrationPage.alertWithText('Please enter a valid email address')
      ).toHaveText('Please enter a valid email address');
      await expect(page).toHaveURL(PAGE_URLS.registration);
      expectNoRegistrationRequest(registrationRequests);
    });

    test('should require a password', async ({
      page,
      registrationPage,
      registrationRequests
    }, testInfo) => {
      const email = generateRegistrationEmail(
        testInfo.workerIndex,
        'password-required'
      );
      await registrationPage.fillRegistrationForm(email, 'Valid User', '');

      await registrationPage.submit();

      await expectNativeValidationMessage(
        registrationPage.passwordInput,
        'valueMissing'
      );
      await expect(
        registrationPage.alertWithText('Password is required')
      ).toHaveText('Password is required');
      await expect(page).toHaveURL(PAGE_URLS.registration);
      expectNoRegistrationRequest(registrationRequests);
    });

    test('should reject a password below the minimum length', async ({
      page,
      registrationPage,
      registrationRequests
    }, testInfo) => {
      const email = generateRegistrationEmail(
        testInfo.workerIndex,
        'short-password'
      );
      await registrationPage.fillRegistrationForm(email, 'Valid User', 'ab');

      await registrationPage.submit();

      await expectNativeValidationMessage(
        registrationPage.passwordInput,
        'tooShort'
      );
      await expect(
        registrationPage.alertWithText('Password must be at least 3 characters')
      ).toHaveText('Password must be at least 3 characters');
      await expect(page).toHaveURL(PAGE_URLS.registration);
      expectNoRegistrationRequest(registrationRequests);
    });

    test('should reject a display name below the minimum length', async ({
      page,
      registrationPage,
      registrationRequests
    }, testInfo) => {
      const email = generateRegistrationEmail(
        testInfo.workerIndex,
        'short-name'
      );
      await registrationPage.fillRegistrationForm(email, 'ab', 'abc');

      await registrationPage.submit();

      await expectNativeValidationMessage(
        registrationPage.displayNameInput,
        'tooShort'
      );
      await expect(
        registrationPage.alertWithText(
          'Display name must be at least 3 characters'
        )
      ).toHaveText('Display name must be at least 3 characters');
      await expect(page).toHaveURL(PAGE_URLS.registration);
      expectNoRegistrationRequest(registrationRequests);
    });

    test('should reject a whitespace-only display name', async ({
      page,
      registrationPage,
      registrationRequests
    }, testInfo) => {
      const email = generateRegistrationEmail(
        testInfo.workerIndex,
        'blank-name'
      );
      await registrationPage.fillRegistrationForm(email, '   ', 'abc');

      await registrationPage.submit();

      await expect(
        registrationPage.alertWithText(
          'Display name must be at least 3 characters'
        )
      ).toHaveText('Display name must be at least 3 characters');
      await expect(page).toHaveURL(PAGE_URLS.registration);
      expectNoRegistrationRequest(registrationRequests);
    });

    for (const { name, displayName } of [
      { name: 'punctuation', displayName: 'User!' },
      { name: 'non-ASCII letters', displayName: 'Łukasz' }
    ]) {
      test(`should reject display-name ${name}`, async ({
        page,
        registrationPage,
        registrationRequests
      }, testInfo) => {
        const email = generateRegistrationEmail(
          testInfo.workerIndex,
          `invalid-name-${name.replaceAll(' ', '-')}`
        );
        await registrationPage.fillRegistrationForm(email, displayName, 'abc');

        await registrationPage.submit();

        await expect(
          registrationPage.alertWithText(
            'Display name can only contain letters, numbers, spaces, hyphens, and underscores'
          )
        ).toHaveText(
          'Display name can only contain letters, numbers, spaces, hyphens, and underscores'
        );
        await expect(page).toHaveURL(PAGE_URLS.registration);
        expectNoRegistrationRequest(registrationRequests);
      });
    }

    test('should limit the display name to 20 characters', async ({
      registrationPage
    }) => {
      await registrationPage.typeDisplayName('a'.repeat(21));

      await expect(registrationPage.displayNameInput).toHaveValue(
        'a'.repeat(20)
      );
    });

    test('should reject registration for an existing email', async ({
      page,
      request,
      registrationPage
    }, testInfo) => {
      const email = generateRegistrationEmail(
        testInfo.workerIndex,
        'duplicate'
      );
      const seedResponse = await request.post('/api/v1/register', {
        data: {
          email,
          displayedName: 'Original User',
          password: 'abc'
        }
      });
      expect(seedResponse.status()).toBe(201);
      await registrationPage.fillRegistrationForm(
        email,
        'Duplicate User',
        'abc'
      );

      const duplicateResponse =
        await registrationPage.submitAndWaitForRegistrationResponse();

      expect(duplicateResponse.status()).toBe(409);
      expect(await duplicateResponse.json()).toMatchObject({
        success: false,
        error: 'User with this email already exists'
      });
      await expect(
        registrationPage.alertWithText('User with this email already exists')
      ).toContainText('User with this email already exists');
      await expect(page).toHaveURL(PAGE_URLS.registration);
    });
  }
);

test(
  'should trim email whitespace around a valid address',
  { tag: ['@registration', '@positive'] },
  async ({ page, registrationPage }, testInfo) => {
    const email = generateRegistrationEmail(testInfo.workerIndex, 'trim-email');
    await registrationPage.goto();
    await registrationPage.fillRegistrationForm(
      `  ${email}  `,
      'Valid User',
      'abc'
    );

    const registrationResponse =
      await registrationPage.submitAndWaitForRegistrationResponse();

    expect(registrationResponse.status()).toBe(201);
    expect(registrationResponse.request().postDataJSON()).toMatchObject({
      email
    });
    await expect(registrationPage.successBanner).toContainText(
      'Registration successful!'
    );
    await expect(page).toHaveURL(PAGE_URLS.login);
  }
);

test(
  'should trim a valid display name before registration',
  { tag: ['@registration', '@positive'] },
  async ({ page, registrationPage }, testInfo) => {
    const email = generateRegistrationEmail(
      testInfo.workerIndex,
      'name-boundary'
    );
    await registrationPage.goto();
    await registrationPage.fillRegistrationForm(email, '  Valid_Name  ', 'abc');

    const registrationResponse =
      await registrationPage.submitAndWaitForRegistrationResponse();

    expect(registrationResponse.status()).toBe(201);
    expect(registrationResponse.request().postDataJSON()).toEqual({
      email,
      displayedName: 'Valid_Name',
      password: 'abc'
    });
    await expect(registrationPage.successBanner).toContainText(
      'Registration successful!'
    );
    await expect(page).toHaveURL(PAGE_URLS.login);
  }
);

test(
  'should register without an optional display name',
  { tag: ['@registration', '@positive'] },
  async ({ page, registrationPage }, testInfo) => {
    const email = generateRegistrationEmail(
      testInfo.workerIndex,
      'without-display-name'
    );
    await registrationPage.goto();
    await registrationPage.fillRegistrationForm(email, '', 'abc');

    const registrationResponse =
      await registrationPage.submitAndWaitForRegistrationResponse();

    expect(registrationResponse.status()).toBe(201);
    expect(registrationResponse.request().postDataJSON()).toEqual({
      email,
      password: 'abc'
    });
    await expect(registrationPage.successBanner).toContainText(
      'Registration successful!'
    );
    await expect(page).toHaveURL(PAGE_URLS.login);
  }
);
