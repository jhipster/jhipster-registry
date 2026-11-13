import { type Page, expect, test } from '@playwright/test';

import { expectDashboard, openMenuItem, password, signOut, username } from '../support/registry';

async function signIn(page: Page, user = username, pass = password): Promise<void> {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);
  await page.locator('#username').fill(user);
  await page.locator('#password').fill(pass);
  await page.getByRole('button', { name: 'Sign in' }).click();
}

test.describe('sign-in', () => {
  test('sends an anonymous visitor to the sign-in page', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('sends an anonymous visitor who opens a protected page to the sign-in page', async ({ page }) => {
    await page.goto('/registry/applications');

    await expect(page).toHaveURL(/\/login$/);
  });

  test('rejects a wrong password', async ({ page }) => {
    await signIn(page, username, 'not-the-password');

    await expect(page.getByText('Failed to sign in!')).toBeVisible();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('shows the dashboard after signing in, and hides it after signing out', async ({ page }) => {
    await signIn(page);
    await expectDashboard(page);

    await signOut(page);

    await expect(page.getByText('You are not authenticated.')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'System Status' })).toBeHidden();

    await page.getByText('Please sign in').click();
    await expect(page).toHaveURL(/\/login$/);
  });

  test('sends the visitor to the sign-in page after signing out from another screen', async ({ page }) => {
    await signIn(page);
    await expectDashboard(page);
    await openMenuItem(page, 'eureka-menu', '/registry/replicas');
    await expect(page.getByRole('heading', { name: 'Registry Replicas' })).toBeVisible();

    await signOut(page);

    await expect(page).toHaveURL(/\/login$/);
  });
});

test.describe('registry screens', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await expectDashboard(page);
  });

  test('lists application instances', async ({ page }) => {
    await openMenuItem(page, 'eureka-menu', '/registry/applications');

    await expect(page.getByRole('heading', { name: 'Application Instances' })).toBeVisible();
  });

  test('shows the instances history', async ({ page }) => {
    await openMenuItem(page, 'eureka-menu', '/registry/history');

    await expect(page.getByRole('heading', { name: 'Instances history' })).toBeVisible();
    await page.getByRole('tab', { name: 'Last canceled leases' }).click();
    await expect(page.getByRole('tab', { name: 'Last canceled leases' })).toHaveClass(/active/);
  });

  test('lists the registry itself as a replica', async ({ page }) => {
    await openMenuItem(page, 'eureka-menu', '/registry/replicas');

    await expect(page.getByRole('heading', { name: 'Registry Replicas' })).toBeVisible();
    await expect(page.locator('#replicas').getByRole('link', { name: /:8761$/ })).toBeVisible();

    await page.getByText('show more').click();
    await expect(page.getByRole('heading', { name: 'Configuring replication' })).toBeVisible();
  });

  test('shows the configuration served by the config server', async ({ page }) => {
    await openMenuItem(page, 'configuration-menu', '/registry/config');

    await expect(page.getByRole('heading', { name: 'Spring Cloud Configuration' })).toBeVisible();
    // central-config/application.yml is served for every application
    await expect(page.locator('.tab-pane.active pre.code-block')).toContainText('configserver:');

    await page.getByRole('tab', { name: 'Properties' }).click();
    await expect(page.locator('.tab-pane.active pre.code-block')).toContainText('configserver.status');

    await expect(page.getByRole('heading', { name: 'Configuration Sources' })).toBeVisible();
    await expect(page.getByText('type: "native"')).toBeVisible();
  });

  test('shows the encryption form', async ({ page }) => {
    await openMenuItem(page, 'configuration-menu', '/registry/encryption');

    await expect(page.getByRole('heading', { name: 'Encrypt and decrypt properties' })).toBeVisible();
    const encrypt = page.getByRole('button', { name: 'Encrypt', exact: true });
    await expect(encrypt).toBeDisabled();
    await page.locator('#textToEncrypt').fill('secret');
    await expect(encrypt).toBeEnabled();
  });

  test('shows the SSH public key page', async ({ page }) => {
    await openMenuItem(page, 'configuration-menu', '/registry/ssh');

    await expect(page.getByRole('heading', { name: 'SSH Public Key', exact: true })).toBeVisible();
  });
});

test.describe('administration screens', () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await expectDashboard(page);
  });

  for (const [item, path, headingId, heading] of [
    ['Metrics', '/admin/metrics', 'metrics-page-heading', 'Application Metrics'],
    ['Health', '/admin/health', 'health-page-heading', 'Health Checks'],
    ['Configuration', '/admin/configuration', 'configuration-page-heading', 'Configuration'],
    ['Logs', '/admin/logs', 'logs-page-heading', 'Logs'],
  ]) {
    test(`opens ${item}`, async ({ page }) => {
      await openMenuItem(page, 'admin-menu', path);

      await expect(page.locator(`#${headingId}`)).toHaveText(heading);
    });
  }
});
