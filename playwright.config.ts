import { defineConfig, devices } from '@playwright/test';
import { DEMO_USER_AUTH_STATE_PATH } from './src/constants/authentication';
import { environment } from './src/config/environment';

export default defineConfig({
  testDir: './tests',
  timeout: 10 * 1000,
  fullyParallel: true,
  forbidOnly: environment.isCi,
  retries: environment.isCi ? 2 : 0,
  workers: environment.isCi ? 1 : undefined,
  reporter: environment.isCi
    ? [['github'], ['html', { open: 'never' }]]
    : [['html', { open: 'never' }]],
  use: {
    baseURL: environment.baseUrl,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure'
  },
  projects: [
    {
      name: 'setup',
      testMatch: '**/auth/demo-user.setup.ts',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'smoke-tests',
      testMatch: '**/main.smoke.spec.ts',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'public-tests',
      testMatch: ['**/profile.spec.ts', '**/registration.spec.ts'],
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'demo-user',
      testMatch: '**/auth/**/*.spec.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: DEMO_USER_AUTH_STATE_PATH
      }
    }
  ]
});
