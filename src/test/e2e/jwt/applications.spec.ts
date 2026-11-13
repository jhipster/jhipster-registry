import { expect, test } from '@playwright/test';

import { cancelInstance, openMenuItem, registerInstance, signInWithPassword } from '../support/registry';

const app = 'E2E-APP';
// Every test registers instances of its own. The registry replicates to itself by default, and the replicated
// cancellation of an instance arrives a moment later, so it would remove an instance that registered again
// with the same id right after the previous test cancelled it.
let upInstance: string;
let downInstance: string;

test.describe('registered applications', () => {
  test.beforeEach(async ({ page, request }) => {
    const run = Date.now().toString(36);
    upInstance = `e2e-${run}:1`;
    downInstance = `e2e-${run}:2`;
    await registerInstance(request, app, upInstance, 'UP');
    await registerInstance(request, app, downInstance, 'DOWN');
    await signInWithPassword(page);
  });

  test.afterEach(async ({ request }) => {
    await cancelInstance(request, app, upInstance);
    await cancelInstance(request, app, downInstance);
  });

  test('shows the registered instances and their status on the dashboard', async ({ page }) => {
    const up = page.getByRole('row').filter({ hasText: upInstance });
    await expect(up).toContainText(app);
    await expect(up.locator('.badge')).toHaveText('UP');
    await expect(up.locator('.badge')).toHaveClass(/bg-success/);

    const down = page.getByRole('row').filter({ hasText: downInstance });
    await expect(down.locator('.badge')).toHaveText('DOWN');
    await expect(down.locator('.badge')).toHaveClass(/bg-danger/);
  });

  test('lists the application with its instances, status, and metadata', async ({ page }) => {
    await openMenuItem(page, 'eureka-menu', '/registry/applications');

    const application = page.locator('.apps .list-group-item').filter({ hasText: app });
    await expect(application).toHaveClass(/active/);
    // one of the two instances is up
    await expect(application.locator('.badge')).toHaveText('1/2');

    const up = page.locator('#instances').getByRole('row').filter({ hasText: upInstance });
    await expect(up.getByRole('link', { name: upInstance })).toHaveAttribute('href', 'http://localhost:8081/');
    await expect(up.locator('.badge.bg-success')).toHaveText('UP');
    await expect(up).toContainText('version');
    await expect(up).toContainText('1.0.0');

    const down = page.locator('#instances').getByRole('row').filter({ hasText: downInstance });
    await expect(down.locator('.badge.bg-danger')).toHaveText('DOWN');
  });

  test('offers the registered application on the configuration screen and serves its configuration', async ({ page }) => {
    await openMenuItem(page, 'configuration-menu', '/registry/config');

    await page.locator('#application').fill('e2e-app');
    await page.locator('#profile').fill('dev');
    await page.locator('#profile').press('Enter');

    await expect(page.locator('.tab-pane.active pre.code-block')).toContainText('configserver:');
  });

  test('records registrations and cancellations in the history', async ({ page, request }) => {
    await openMenuItem(page, 'eureka-menu', '/registry/history');

    await expect(
      page
        .getByRole('row')
        .filter({ hasText: `${app}(${upInstance})` })
        .first(),
    ).toBeVisible();
    await expect(
      page
        .getByRole('row')
        .filter({ hasText: `${app}(${downInstance})` })
        .first(),
    ).toBeVisible();

    await cancelInstance(request, app, downInstance);
    await page.getByRole('button', { name: /Refresh now/ }).click();
    await page.getByRole('tab', { name: 'Last canceled leases' }).click();

    await expect(
      page
        .getByRole('row')
        .filter({ hasText: `${app}(${downInstance})` })
        .first(),
    ).toBeVisible();
  });

  test('removes a cancelled instance after a refresh', async ({ page, request }) => {
    await openMenuItem(page, 'eureka-menu', '/registry/applications');
    await expect(page.locator('#instances').getByRole('row').filter({ hasText: downInstance })).toBeVisible();

    await cancelInstance(request, app, downInstance);
    await page.getByRole('button', { name: /Refresh now/ }).click();

    await expect(page.locator('#instances').getByRole('row').filter({ hasText: downInstance })).toBeHidden();
    await expect(page.locator('.apps .list-group-item').filter({ hasText: app }).locator('.badge')).toHaveText('1/1');
  });
});
