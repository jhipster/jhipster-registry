import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { expect, test } from '@playwright/test';

import { openMenuItem, signInWithPassword } from '../support/registry';

// The directory create-ssh-setup.mjs wrote the keys of the registry to
const sshSetup = resolve(process.env.E2E_GIT_SSH_SETUP ?? 'target/e2e-git-ssh');
const repository = 'ssh://git@git-server/srv/git/config.git';

test.describe('Git over SSH', () => {
  test.beforeEach(async ({ page }) => {
    await signInWithPassword(page);
  });

  test('lists the repository it reads over SSH as the configuration source', async ({ page }) => {
    await openMenuItem(page, 'configuration-menu', '/registry/config');
    const sources = page.getByRole('table').last();

    await expect(sources).toContainText('type: "git"');
    await expect(sources).toContainText(`uri: "${repository}"`);
  });

  test('serves the configuration of that repository', async ({ page }) => {
    await openMenuItem(page, 'configuration-menu', '/registry/config');

    await expect(page.locator('.tab-pane.active pre.code-block')).toContainText('source: git-ssh');
  });

  test('shows the public key that gives it access to the repository', async ({ page }) => {
    const publicKey = readFileSync(resolve(sshSetup, 'client', 'id_rsa.pub'), 'utf8').trim();

    await openMenuItem(page, 'configuration-menu', '/registry/ssh');

    await expect(page.getByRole('heading', { name: 'SSH Public Key', exact: true })).toBeVisible();
    await expect(page.locator('pre.code-block').first()).toHaveText(publicKey);
  });
});
