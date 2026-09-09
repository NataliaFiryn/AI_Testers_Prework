import path from 'node:path';

export const DEMO_USER_AUTH_STATE_PATH = path.join(
  process.cwd(),
  'playwright',
  '.auth',
  'user.json'
);
