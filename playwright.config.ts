import { defineConfig, devices } from '@playwright/test';

/**
 * End-to-end tests for the registry UI. They expect a registry that is already running:
 *
 * - `jwt` needs the registry started with the default (JWT) authentication.
 * - `oauth2` needs Keycloak and the registry started with the `oauth2` profile.
 * - `peers` needs the two registries of src/test/e2e/peers/docker-compose.yml.
 *
 * See DEVELOPMENT.md for the commands.
 */
export default defineConfig({
  testDir: './src/test/e2e',
  outputDir: './target/playwright/test-results',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { outputFolder: 'target/playwright/report', open: 'never' }]],
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:8761',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'jwt',
      testDir: './src/test/e2e/jwt',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'oauth2',
      testDir: './src/test/e2e/oauth2',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'peers',
      testDir: './src/test/e2e/peers',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
