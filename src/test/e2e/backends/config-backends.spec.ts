import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { type APIRequestContext, type Page, expect, test } from '@playwright/test';

import { openMenuItem, signInWithPassword } from '../support/registry';

// The repository created by create-config-repo.mjs, which the registry reads its configuration from.
const configRepo = resolve(process.env.E2E_CONFIG_REPO ?? 'target/e2e-config-repo');
const vaultUrl = process.env.E2E_VAULT_URL ?? 'http://localhost:8200';
// The development token of src/main/docker/vault.yml, which is also what the registry uses in bootstrap.yml.
const vaultToken = process.env.E2E_VAULT_TOKEN ?? 'jhipster-registry';

const configuration = (page: Page) => page.locator('.tab-pane.active pre.code-block');

async function showConfiguration(page: Page, application: string, profile: string, label?: string): Promise<void> {
  await page.locator('#application').fill(application);
  await page.locator('#profile').fill(profile);
  if (label) {
    await page.locator('#label').fill(label);
  }
  await page.locator('#profile').press('Enter');
}

function commit(file: string, content: string): void {
  const git = (...args: string[]) =>
    execFileSync('git', ['-c', 'user.name=e2e', '-c', 'user.email=e2e@localhost', ...args], { cwd: configRepo, stdio: 'pipe' });
  // The registry works in the same repository while it answers requests, and Git then refuses to run
  // because of its lock file. Wait for the registry to finish and try again.
  for (let attempt = 1; ; attempt++) {
    try {
      git('checkout', '--quiet', 'main');
      writeFileSync(join(configRepo, file), content);
      git('add', '--all');
      git('commit', '--quiet', '--message', `Change ${file}`);
      return;
    } catch (error) {
      if (attempt === 5) {
        throw error;
      }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 500);
    }
  }
}

async function writeSecret(request: APIRequestContext, path: string, data: Record<string, string>): Promise<void> {
  const response = await request.post(`${vaultUrl}/v1/secret/data/${path}`, {
    headers: { 'X-Vault-Token': vaultToken },
    data: { data },
  });
  expect(response.ok(), `writing the secret ${path} to Vault at ${vaultUrl}`).toBe(true);
}

test.beforeEach(async ({ page }) => {
  await signInWithPassword(page);
  await openMenuItem(page, 'configuration-menu', '/registry/config');
});

test.describe('Git backend', () => {
  test('lists the Git repository as a configuration source', async ({ page }) => {
    const sources = page.getByRole('table').last();

    await expect(sources).toContainText('type: "git"');
    await expect(sources).toContainText('uri: "file:');
  });

  test('serves the configuration of the default branch', async ({ page }) => {
    await showConfiguration(page, 'application', 'prod');

    await expect(configuration(page)).toContainText('source: git-main');
  });

  test('serves the configuration of the branch given as the Git label', async ({ page }) => {
    // The label field is only offered when the registry does not run with the native profile
    await expect(page.locator('#label')).toHaveValue('main');

    await showConfiguration(page, 'application', 'prod', 'feature');

    await expect(configuration(page)).toContainText('source: git-feature');
  });

  test('serves a change as soon as it is committed', async ({ page }) => {
    const value = `committed-${Date.now()}`;
    commit('e2e-git-app.yml', `e2e:\n  committed: ${value}\n`);

    await showConfiguration(page, 'e2e-git-app', 'dev');

    await expect(configuration(page)).toContainText(`committed: ${value}`);
    // the configuration shared by all applications is still included
    await expect(configuration(page)).toContainText('source: git-main');
  });
});

test.describe('Vault backend', () => {
  test('lists Vault as a configuration source', async ({ page }) => {
    await expect(page.getByRole('table').last()).toContainText('type: "vault"');
  });

  test('serves the secrets of an application and profile, and their updates', async ({ page, request }) => {
    const value = `secret-${Date.now()}`;
    await writeSecret(request, 'e2e-vault-app/dev', { 'e2e.vault.secret': value });

    await showConfiguration(page, 'e2e-vault-app', 'dev');
    await page.getByRole('tab', { name: 'Properties' }).click();
    await expect(configuration(page)).toContainText(`e2e.vault.secret: ${value}`);

    await writeSecret(request, 'e2e-vault-app/dev', { 'e2e.vault.secret': `${value}-updated` });
    await page.getByRole('button', { name: /Refresh now/ }).click();
    await expect(configuration(page)).toContainText(`e2e.vault.secret: ${value}-updated`);
  });

  test('does not serve the secrets of one profile to another', async ({ page, request }) => {
    const value = `secret-${Date.now()}`;
    await writeSecret(request, 'e2e-vault-app/dev', { 'e2e.vault.secret': value });

    await showConfiguration(page, 'e2e-vault-app', 'prod');
    await page.getByRole('tab', { name: 'Properties' }).click();

    await expect(configuration(page)).toContainText('e2e.source: git-main');
    await expect(configuration(page)).not.toContainText('e2e.vault.secret');
  });

  test('serves the secrets shared by all applications together with the Git configuration', async ({ page, request }) => {
    const value = `shared-${Date.now()}`;
    await writeSecret(request, 'application', { 'e2e.vault.shared': value });

    await showConfiguration(page, 'e2e-other-app', 'dev');
    await page.getByRole('tab', { name: 'Properties' }).click();

    await expect(configuration(page)).toContainText(`e2e.vault.shared: ${value}`);
    await expect(configuration(page)).toContainText('e2e.source: git-main');
  });
});
