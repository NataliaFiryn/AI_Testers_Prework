import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';

if (existsSync('.env')) {
  loadEnvFile();
}

const getRequiredEnvironmentVariable = (name: string): string => {
  const value = process.env[name];

  if (!value || value.trim().length === 0) {
    throw new Error(
      `Environment variable ${name} is required and must not be empty.`
    );
  }

  return value;
};

const getBaseUrl = (): string => {
  const baseUrl = getRequiredEnvironmentVariable('BASE_URL');
  let url: URL;

  try {
    url = new URL(baseUrl);
  } catch {
    throw new Error('Environment variable BASE_URL must be a valid URL.');
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error(
      'Environment variable BASE_URL must use the http or https protocol.'
    );
  }

  return baseUrl;
};

export const environment = Object.freeze({
  baseUrl: getBaseUrl(),
  get userEmail(): string {
    return getRequiredEnvironmentVariable('EMPTY_USER_EMAIL');
  },
  get userPassword(): string {
    return getRequiredEnvironmentVariable('EMPTY_USER_PASSWORD');
  },
  get demoUserEmail(): string {
    return getRequiredEnvironmentVariable('DEMO_USER_EMAIL');
  },
  get demoUserPassword(): string {
    return getRequiredEnvironmentVariable('DEMO_USER_PASSWORD');
  },
  isCi: process.env.CI === 'true'
});
