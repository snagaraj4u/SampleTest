import { test as setup, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/**
 * Global setup that runs before all tests.
 * Use this for authentication, data seeding, or environment preparation.
 */

const STORAGE_STATE_PATH = path.join(__dirname, '..', '.auth', 'user.json');

setup('create reports directory', async () => {
  const reportsDir = path.join(process.cwd(), 'reports');
  const screenshotsDir = path.join(reportsDir, 'screenshots');
  const logsDir = path.join(reportsDir, 'logs');

  const directories = [reportsDir, screenshotsDir, logsDir];

  for (const dir of directories) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
});

setup('verify environment configuration', async () => {
  const requiredEnvVars = ['BASE_URL'];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.warn(`Warning: Environment variable ${envVar} is not set`);
    }
  }
});

/**
 * Uncomment and modify this setup for authentication.
 * This will save the authenticated state for use in other tests.
 */
// setup('authenticate user', async ({ page }) => {
//   await page.goto('/login');
//
//   await page.fill('[data-testid="email"]', process.env.TEST_USER_EMAIL || '');
//   await page.fill('[data-testid="password"]', process.env.TEST_USER_PASSWORD || '');
//   await page.click('[data-testid="login-button"]');
//
//   await expect(page).toHaveURL('/dashboard');
//
//   const authDir = path.dirname(STORAGE_STATE_PATH);
//   if (!fs.existsSync(authDir)) {
//     fs.mkdirSync(authDir, { recursive: true });
//   }
//
//   await page.context().storageState({ path: STORAGE_STATE_PATH });
// });

setup('global setup completed', async () => {
  console.log('Global setup completed successfully');
});
