import { defineConfig, devices } from '@playwright/test';
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
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
