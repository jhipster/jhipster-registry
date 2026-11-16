import { type Page, expect, test } from '@playwright/test';

import { cancelInstance, openMenuItem, registerInstance, signInWithPassword } from '../support/registry';

// Every test registers an application and instances of its own. The registry replicates to itself by default,
// and the replicated cancellation of an instance arrives a moment later, so it would remove an instance that
// registered again with the same id right after the previous test cancelled it. It also keeps the tests
// independent of instances an aborted run left behind, and of other applications in the registry.
let app: string;
let upInstance: string;
let downInstance: string;

// The registry may still list an instance for a moment after its cancellation was accepted (7.5.0 does),
// so the screens are refreshed until the change shows up.
const afterRefresh = { timeout: 15_000, intervals: [500] };

/** The application is not always the first one of the list, which is the one the screen selects. */
async function selectApplication(page: Page): Promise<void> {
  await page.locator('.apps .list-group-item').filter({ hasText: app }).click();
}

test.describe('registered applications', () => {
  test.beforeEach(async ({ page, request }) => {
    const run = Date.now().toString(36);
    app = `E2E-${run.toUpperCase()}`;
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
    await selectApplication(page);

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
    await page.getByRole('tab', { name: 'Last canceled leases' }).click();

    await expect(async () => {
      await page.getByRole('button', { name: /Refresh now/ }).click();
      const cancelled = page.getByRole('row').filter({ hasText: `${app}(${downInstance})` });
      await expect(cancelled.first()).toBeVisible({ timeout: 1_000 });
    }).toPass(afterRefresh);
  });

  test('removes a cancelled instance after a refresh', async ({ page, request }) => {
    await openMenuItem(page, 'eureka-menu', '/registry/applications');
    await selectApplication(page);
    await expect(page.locator('#instances').getByRole('row').filter({ hasText: downInstance })).toBeVisible();

    await cancelInstance(request, app, downInstance);

    await expect(async () => {
      await page.getByRole('button', { name: /Refresh now/ }).click();
      await expect(page.locator('#instances').getByRole('row').filter({ hasText: downInstance })).toBeHidden({ timeout: 1_000 });
    }).toPass(afterRefresh);
    await expect(page.locator('.apps .list-group-item').filter({ hasText: app }).locator('.badge')).toHaveText('1/1');
  });
});
