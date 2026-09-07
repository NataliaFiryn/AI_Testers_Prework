import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

if (existsSync('.env')) {
  loadEnvFile();
}

const getBaseUrl = (): string => {
  const baseUrl = process.env.BASE_URL;

  if (!baseUrl) {
    throw new Error(
      'BASE_URL is required. Copy .env.example to .env and set BASE_URL.'
    );
  }
  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    throw new Error('BASE_URL must be a valid URL.');
  }
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('BASE_URL must use the http or https protocol.');
  }
  return baseUrl;
};

export default defineConfig({
  testDir: './tests',
  timeout: 10 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['html', { open: 'never' }]],
  use: {
    baseURL: getBaseUrl(),
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
