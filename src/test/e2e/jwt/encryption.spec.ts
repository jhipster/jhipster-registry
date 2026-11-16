import { expect, test } from '@playwright/test';

import { basicAuth, hasEncryptionKey, openMenuItem, signInWithPassword } from '../support/registry';

test.describe('encryption', () => {
  test.beforeAll(async ({ request }) => {
    if (!(await hasEncryptionKey(request))) {
      throw new Error(
        'The registry has no encryption key, so it cannot encrypt or decrypt. ' +
          'Start it with the ENCRYPT_KEY environment variable set, for example: ENCRYPT_KEY=e2e-test-key ./mvnw',
      );
    }
  });

  test('encrypts a value and decrypts it again', async ({ page }) => {
    const secret = 'my-secret-value';
    await signInWithPassword(page);
    await openMenuItem(page, 'configuration-menu', '/registry/encryption');
    const result = page.locator('h3:has-text("Result:") + pre');

    await page.locator('#textToEncrypt').fill(secret);
    await page.getByRole('button', { name: 'Encrypt', exact: true }).click();

    await expect(result).toHaveText(/^\{cipher\}[0-9a-f]+$/);
    const cipher = (await result.textContent()) ?? '';
    expect(cipher).not.toContain(secret);

    await page.getByRole('tab', { name: 'Decrypt' }).click();
    // the encrypted value is carried over to the decrypt form
    await expect(page.locator('#encryptedText')).toHaveValue(cipher);
    await page.getByRole('button', { name: 'Decrypt', exact: true }).click();

    await expect(result).toHaveText(secret);
  });

  test('decrypts a value pasted with its {cipher} prefix', async ({ page, request }) => {
    const response = await request.post('/config/encrypt', {
      headers: { ...basicAuth, 'Content-Type': 'text/plain' },
      data: 'pasted-secret',
    });
    const cipher = `{cipher}${await response.text()}`;
    await signInWithPassword(page);
    await openMenuItem(page, 'configuration-menu', '/registry/encryption');

    await page.getByRole('tab', { name: 'Decrypt' }).click();
    await page.locator('#encryptedText').fill(cipher);
    await page.getByRole('button', { name: 'Decrypt', exact: true }).click();

    await expect(page.locator('h3:has-text("Result:") + pre')).toHaveText('pasted-secret');
  });
});
