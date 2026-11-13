import { type Page, expect, test } from '@playwright/test';

import { expectDashboard, openMenuItem, password, signOut, username } from '../support/registry';

const keycloakSignIn = /\/realms\/jhipster\/protocol\/openid-connect\/auth/;

async function signInWithKeycloak(page: Page): Promise<void> {
  await page.goto('/');
  await expect(page).toHaveURL(keycloakSignIn);
  await page.locator('#username').fill(username);
  await page.locator('#password').fill(password);
  await page.locator('#kc-login').click();
}

test('sends an anonymous visitor to Keycloak', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(keycloakSignIn);
});

test('shows the dashboard after signing in with Keycloak', async ({ page }) => {
  await signInWithKeycloak(page);

  await expect(page).toHaveURL(/localhost:8761\/$/);
  await expectDashboard(page);
});

test('maps the Keycloak roles so that an administrator can open the registry screens', async ({ page }) => {
  await signInWithKeycloak(page);
  await expectDashboard(page);

  await openMenuItem(page, 'eureka-menu', '/registry/replicas');
  await expect(page.getByRole('heading', { name: 'Registry Replicas' })).toBeVisible();

  await openMenuItem(page, 'configuration-menu', '/registry/config');
  await expect(page.getByRole('heading', { name: 'Spring Cloud Configuration' })).toBeVisible();
  await expect(page.locator('.tab-pane.active pre.code-block')).toContainText('configserver:');
});

test('ends the Keycloak session when signing out', async ({ page }) => {
  await signInWithKeycloak(page);
  await expectDashboard(page);

  await signOut(page);

  // Signing out goes through Keycloak and back; the registry then asks to sign in again.
  await expect(page).toHaveURL(keycloakSignIn);
  await expect(page.locator('#kc-login')).toBeVisible();
});
