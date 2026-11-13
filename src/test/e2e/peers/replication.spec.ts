import { type APIRequestContext, type Page, expect, test } from '@playwright/test';

import { cancelInstance, openMenuItem, registerInstance, signInWithPassword } from '../support/registry';

// The first peer is the registry under test (baseURL), the second one listens on another port.
const peer2Url = process.env.E2E_PEER_2_URL ?? 'http://localhost:8762';
const app = 'E2E-REPLICATED';
const instance = 'e2e-replicated:1';

// Replication between peers is asynchronous, so the screens are refreshed until the change shows up.
const replication = { timeout: 30_000, intervals: [1_000] };

async function refresh(page: Page): Promise<void> {
  await page.getByRole('button', { name: /Refresh now/ }).click();
}

async function openApplication(page: Page): Promise<void> {
  await refresh(page);
  await page.locator('.apps .list-group-item').filter({ hasText: app }).click({ timeout: 1_000 });
}

test.describe('peer replication', () => {
  let peer1: APIRequestContext;
  let peer2: APIRequestContext;

  test.beforeAll(async ({ playwright, baseURL }) => {
    peer1 = await playwright.request.newContext({ baseURL });
    peer2 = await playwright.request.newContext({ baseURL: peer2Url });
  });

  test.afterEach(async () => {
    await cancelInstance(peer1, app, instance);
    await cancelInstance(peer2, app, instance);
  });

  test.afterAll(async () => {
    await peer1.dispose();
    await peer2.dispose();
  });

  test('each peer lists the other one as its replica', async ({ page }) => {
    await signInWithPassword(page);
    await openMenuItem(page, 'eureka-menu', '/registry/replicas');
    await expect(page.locator('#replicas').getByRole('link', { name: 'eureka-peer-2:8762' })).toBeVisible();

    await signInWithPassword(page, peer2Url);
    await openMenuItem(page, 'eureka-menu', '/registry/replicas');
    await expect(page.locator('#replicas').getByRole('link', { name: 'eureka-peer-1:8761' })).toBeVisible();
  });

  test('both registries are registered and up on each peer', async ({ page }) => {
    for (const registryUrl of ['/', peer2Url]) {
      await signInWithPassword(page, registryUrl);

      await expect(async () => {
        await refresh(page);
        const registries = page.getByRole('row').filter({ hasText: 'JHIPSTER-REGISTRY' });
        await expect(registries).toHaveCount(2, { timeout: 1_000 });
        await expect(registries.locator('.badge', { hasText: 'UP' })).toHaveCount(2, { timeout: 1_000 });
      }).toPass(replication);
    }
  });

  test('an instance registered with the first peer shows up on the second, and disappears there when cancelled on the first', async ({
    page,
  }) => {
    await registerInstance(peer1, app, instance, 'UP');
    await signInWithPassword(page, peer2Url);
    await openMenuItem(page, 'eureka-menu', '/registry/applications');
    const row = page.locator('#instances').getByRole('row').filter({ hasText: instance });

    await expect(async () => {
      await openApplication(page);
      await expect(row.locator('.badge.bg-success')).toHaveText('UP', { timeout: 1_000 });
    }).toPass(replication);

    await cancelInstance(peer1, app, instance);

    await expect(async () => {
      await refresh(page);
      await expect(page.locator('.apps .list-group-item').filter({ hasText: app })).toHaveCount(0, { timeout: 1_000 });
    }).toPass(replication);
  });

  test('an instance registered with the second peer shows up on the first', async ({ page }) => {
    await registerInstance(peer2, app, instance, 'UP');
    await signInWithPassword(page);
    await openMenuItem(page, 'eureka-menu', '/registry/applications');

    await expect(async () => {
      await openApplication(page);
      await expect(page.locator('#instances').getByRole('row').filter({ hasText: instance })).toBeVisible({ timeout: 1_000 });
    }).toPass(replication);
  });
});
