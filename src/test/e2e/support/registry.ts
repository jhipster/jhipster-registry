import { type Page, expect } from '@playwright/test';

// Defaults for the registry's development setup, see spring.security.user in application.yml
// and the users of the Keycloak realm in src/main/docker/realm-config.
export const username = process.env.E2E_USERNAME ?? 'admin';
export const password = process.env.E2E_PASSWORD ?? 'admin';

export async function expectDashboard(page: Page): Promise<void> {
  await expect(page.getByRole('heading', { name: /JHipster Registry/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'System Status' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Instances Registered' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'General Info' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Health', exact: true })).toBeVisible();
  // The registry reports its own health, so at least one component must be UP.
  await expect(page.locator('#healthCheck .badge', { hasText: 'UP' }).first()).toBeVisible();
}

/** Opens a navbar dropdown and follows the item that links to the given path. */
export async function openMenuItem(page: Page, menuId: string, path: string): Promise<void> {
  await page.locator(`#${menuId}`).click();
  await page.locator(`a.dropdown-item[href$="${path}"]`).click();
  await expect(page).toHaveURL(new RegExp(`${path}$`));
}

export async function signOut(page: Page): Promise<void> {
  // Releases before 8.0.0 have the sign-out link directly in the navbar instead of in an account menu.
  const accountMenu = page.locator('#account-menu');
  if ((await accountMenu.count()) > 0) {
    await accountMenu.click();
  }
  await page.locator('#logout').click();
}
