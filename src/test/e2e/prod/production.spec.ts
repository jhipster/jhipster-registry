import { expect, test } from '@playwright/test';

import { openMenuItem, signInWithPassword } from '../support/registry';

// With the prod profile and nothing else configured, the registry reads its configuration,
// including its JWT secret, from this repository on GitHub over HTTPS.
const sampleConfigRepo = 'https://github.com/jhipster/jhipster-registry-sample-config';

test.describe('default production configuration', () => {
  test.beforeEach(async ({ page }) => {
    await signInWithPassword(page);
    await openMenuItem(page, 'configuration-menu', '/registry/config');
  });

  test('lists the sample configuration repository as the configuration source', async ({ page }) => {
    const sources = page.getByRole('table').last();

    await expect(sources).toContainText('type: "git"');
    await expect(sources).toContainText(`uri: "${sampleConfigRepo}"`);
  });

  test('serves the configuration of the sample repository', async ({ page }) => {
    await expect(page.locator('#label')).toHaveValue('main');

    await expect(page.locator('.tab-pane.active pre.code-block')).toContainText(sampleConfigRepo);
  });
});
