import { execFileSync } from 'node:child_process';

import { type Page, expect, test } from '@playwright/test';

import { basicAuth, openMenuItem, signInWithPassword } from '../support/registry';

// The first replica is the registry under test (baseURL), the second one listens on another port.
const replica2Url = process.env.E2E_REPLICA_2_URL ?? 'http://localhost:8762';
const kubeContext = process.env.E2E_KUBE_CONTEXT ?? 'kind-jhipster-registry-e2e';
const manifests = 'src/test/e2e/kubernetes/registry.yml';

// The replicas find each other through Eureka, which takes a few of its 15 second intervals.
const registration = { timeout: 90_000, intervals: [2_000] };

function kubectl(args: string[], input?: string): string {
  return execFileSync('kubectl', ['--context', kubeContext, ...args], { input, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
}

async function refresh(page: Page): Promise<void> {
  await page.getByRole('button', { name: /Refresh now/ }).click();
}

test.describe('on Kubernetes', () => {
  test.afterAll(() => {
    // puts the ConfigMap back as it was
    kubectl(['apply', '-f', manifests]);
  });

  test('each replica lists the other one as its replica', async ({ page }) => {
    await signInWithPassword(page);
    await openMenuItem(page, 'eureka-menu', '/registry/replicas');
    await expect(page.locator('#replicas').getByRole('link', { name: /^jhipster-registry-1\.jhipster-registry\./ })).toBeVisible();

    await signInWithPassword(page, replica2Url);
    await openMenuItem(page, 'eureka-menu', '/registry/replicas');
    await expect(page.locator('#replicas').getByRole('link', { name: /^jhipster-registry-0\.jhipster-registry\./ })).toBeVisible();
  });

  test('both replicas are registered and up on each replica', async ({ page }) => {
    for (const registryUrl of ['/', replica2Url]) {
      await signInWithPassword(page, registryUrl);

      await expect(async () => {
        await refresh(page);
        const registries = page.getByRole('row').filter({ hasText: 'JHIPSTER-REGISTRY' });
        await expect(registries).toHaveCount(2, { timeout: 1_000 });
        await expect(registries.locator('.badge', { hasText: 'UP' })).toHaveCount(2, { timeout: 1_000 });
      }).toPass(registration);
    }
  });

  test('serves the configuration of the ConfigMap', async ({ page }) => {
    await signInWithPassword(page);
    await openMenuItem(page, 'configuration-menu', '/registry/config');

    await expect(page.locator('.tab-pane.active pre.code-block')).toContainText('Connected to the JHipster Registry running in Kubernetes');
  });

  test('applies a change of the ConfigMap without a restart', async ({ request }) => {
    // Kubernetes updates the mounted files of a ConfigMap within a minute or two
    test.setTimeout(300_000);
    const logger = `e2e.refresh.r${Date.now().toString(36)}`;
    const level = async () => {
      const response = await request.get(`/management/loggers/${logger}`, { headers: basicAuth });
      return response.ok() ? ((await response.json()).configuredLevel as string | null) : null;
    };
    expect(await level()).toBeNull();
    const restarts = kubectl(['get', 'pod', 'jhipster-registry-0', '-o', 'jsonpath={.status.containerStatuses[0].restartCount}']);

    // The registry watches the directory the ConfigMap is mounted in, and reloads its configuration when it changes.
    // A log level is a setting that shows the reload from the outside.
    const configMap = JSON.parse(kubectl(['get', 'configmap', 'application-config', '-o', 'json']));
    configMap.data['application.yml'] += `\nlogging:\n  level:\n    ${logger}: TRACE\n`;
    delete configMap.metadata.resourceVersion;
    kubectl(['apply', '-f', '-'], JSON.stringify(configMap));

    await expect.poll(level, { timeout: 240_000, intervals: [5_000] }).toBe('TRACE');
    expect(kubectl(['get', 'pod', 'jhipster-registry-0', '-o', 'jsonpath={.status.containerStatuses[0].restartCount}'])).toBe(restarts);
  });
});
