import { test, expect, type Page } from '@playwright/test';

async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/(dashboard|measurements|orders)/, { timeout: 15000 });
}

// ---------------------------------------------------------------------------
// Public smoke — no credentials needed
// ---------------------------------------------------------------------------

test('login page loads with email + password fields', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('input[type="email"]')).toBeVisible();
  await expect(page.locator('input[type="password"]')).toBeVisible();
  await expect(page.locator('button[type="submit"]')).toBeVisible();
});

// ---------------------------------------------------------------------------
// Authenticated tests — skip when env vars not provided
// ---------------------------------------------------------------------------

const TAILOR_EMAIL    = process.env.E2E_TAILOR_EMAIL    ?? '';
const TAILOR_PASSWORD = process.env.E2E_TAILOR_PASSWORD ?? '';
const ADMIN_EMAIL     = process.env.E2E_ADMIN_EMAIL     ?? '';
const ADMIN_PASSWORD  = process.env.E2E_ADMIN_PASSWORD  ?? '';

test.describe('Tailor — measurements page loads', () => {
  test.skip(!TAILOR_EMAIL || !TAILOR_PASSWORD, 'Set E2E_TAILOR_EMAIL + E2E_TAILOR_PASSWORD');

  test.beforeEach(async ({ page }) => {
    await loginAs(page, TAILOR_EMAIL, TAILOR_PASSWORD);
  });

  test('page loads without permission error', async ({ page }) => {
    await page.goto('/measurements');
    await expect(page.locator('text=Permission denied')).not.toBeVisible();
    await expect(page.locator('text=Requests')).toBeVisible();
    await expect(page.locator('text=Customers')).toBeVisible();
  });

  test('assign-tailor selector is hidden from tailor role', async ({ page }) => {
    await page.goto('/measurements');
    await expect(page.locator('text=Select tailor')).not.toBeVisible();
  });
});

test.describe('Admin — measurement form', () => {
  test.skip(!ADMIN_EMAIL || !ADMIN_PASSWORD, 'Set E2E_ADMIN_EMAIL + E2E_ADMIN_PASSWORD');

  async function gotoFirstCustomerMeasurements(page: Page) {
    await page.goto('/measurements');
    await page.click('text=Customers');
    const link = page.locator('a:has-text("View / Add")').first();
    await expect(link).toBeVisible({ timeout: 8000 });
    await link.click();
    await page.waitForURL(/\/measurements\/[^/]+$/, { timeout: 10000 });
  }

  test.beforeEach(async ({ page }) => {
    await loginAs(page, ADMIN_EMAIL, ADMIN_PASSWORD);
  });

  test('form shows both Kameez and Shalwar sections by default', async ({ page }) => {
    await gotoFirstCustomerMeasurements(page);
    await expect(page.locator('text=قمیض')).toBeVisible();
    await expect(page.locator('text=شلوار')).toBeVisible();
  });

  test('Urdu labels visible in Kameez section', async ({ page }) => {
    await gotoFirstCustomerMeasurements(page);
    for (const label of ['تیرہ', 'بازو', 'گلہ', 'چھاتی', 'کمر', 'مونڈھا', 'کف', 'پانچا']) {
      await expect(page.locator(`text=${label}`)).toBeVisible();
    }
  });

  test('"Kameez Only" hides Shalwar section', async ({ page }) => {
    await gotoFirstCustomerMeasurements(page);
    await page.check('input[type="radio"][value="kameez"]');
    await expect(page.locator('text=قمیض')).toBeVisible();
    await expect(page.locator('text=شلوار')).not.toBeVisible();
  });

  test('"Shalwar Only" hides Kameez section', async ({ page }) => {
    await gotoFirstCustomerMeasurements(page);
    await page.check('input[type="radio"][value="shalwar"]');
    await expect(page.locator('text=شلوار')).toBeVisible();
    await expect(page.locator('text=قمیض')).not.toBeVisible();
  });

  test('"Other" hides both sections', async ({ page }) => {
    await gotoFirstCustomerMeasurements(page);
    await page.check('input[type="radio"][value="other"]');
    await expect(page.locator('text=قمیض')).not.toBeVisible();
    await expect(page.locator('text=شلوار')).not.toBeVisible();
  });

  test('Add button opens custom detail fields', async ({ page }) => {
    await gotoFirstCustomerMeasurements(page);
    await expect(page.locator('input[placeholder="Title (e.g. Design, Buttons...)"]')).not.toBeVisible();
    await page.click('button:has-text("Add")');
    await expect(page.locator('input[placeholder="Title (e.g. Design, Buttons...)"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder="Description..."]')).toBeVisible();
  });

  test('multiple custom detail fields can be added', async ({ page }) => {
    await gotoFirstCustomerMeasurements(page);
    await page.click('button:has-text("Add")');
    await page.click('button:has-text("Add")');
    await expect(page.locator('input[placeholder="Title (e.g. Design, Buttons...)"]')).toHaveCount(2);
  });

  test('trash icon removes a custom detail field', async ({ page }) => {
    await gotoFirstCustomerMeasurements(page);
    await page.click('button:has-text("Add")');
    await expect(page.locator('input[placeholder="Title (e.g. Design, Buttons...)"]')).toBeVisible();
    await page.click('button[aria-label="Remove detail"]');
    await expect(page.locator('input[placeholder="Title (e.g. Design, Buttons...)"]')).not.toBeVisible();
  });
});
