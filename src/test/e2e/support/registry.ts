import { type APIRequestContext, type Page, expect } from '@playwright/test';

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

export const basicAuth = { Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}` };

/** Registers an instance the way an application does, through the Eureka REST API. */
export async function registerInstance(request: APIRequestContext, app: string, instanceId: string, status: 'UP' | 'DOWN'): Promise<void> {
  const response = await request.post(`/eureka/apps/${app}`, {
    headers: basicAuth,
    data: {
      instance: {
        instanceId,
        app,
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        status,
        port: { $: 8081, '@enabled': 'true' },
        securePort: { $: 443, '@enabled': 'false' },
        dataCenterInfo: { '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo', name: 'MyOwn' },
        homePageUrl: 'http://localhost:8081/',
        statusPageUrl: 'http://localhost:8081/management/info',
        healthCheckUrl: 'http://localhost:8081/management/health',
        vipAddress: app.toLowerCase(),
        metadata: { zone: 'primary', profile: 'dev', version: '1.0.0' },
      },
    },
  });
  expect(response.status(), `registering ${instanceId} with Eureka`).toBe(204);
}

/** Cancels the lease of an instance. It is not an error if the instance is already gone. */
export async function cancelInstance(request: APIRequestContext, app: string, instanceId: string): Promise<void> {
  const response = await request.delete(`/eureka/apps/${app}/${instanceId}`, { headers: basicAuth });
  expect([200, 404], `cancelling ${instanceId} in Eureka`).toContain(response.status());
}

/** Tells whether the config server has an encryption key, which the encrypt and decrypt endpoints need. */
export async function hasEncryptionKey(request: APIRequestContext): Promise<boolean> {
  const response = await request.get('/config/encrypt/status', { headers: basicAuth });
  return response.ok();
}

/** Signs in to the registry under test, or to the registry at the given URL. */
export async function signInWithPassword(page: Page, registryUrl = '/'): Promise<void> {
  await page.goto(registryUrl);
  await expect(page).toHaveURL(/\/login$/);
  await page.locator('#username').fill(username);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expectDashboard(page);
}
