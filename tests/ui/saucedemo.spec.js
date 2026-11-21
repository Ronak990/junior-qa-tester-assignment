// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Helper to log into SauceDemo
 * @param {import('@playwright/test').Page} page
 * @param {string} username
 * @param {string} password
 */
async function login(page, username, password) {
  await page.goto('/');
  await page.locator('[data-test="username"]').fill(username);
  await page.locator('[data-test="password"]').fill(password);
  await page.locator('[data-test="login-button"]').click();
}

test.describe('SauceDemo E2E UI Suite (Part 3)', () => {
  test('UI-01 (TC-001): Successful login with standard_user redirects to inventory', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    await expect(page.locator('[data-test="inventory-item"]')).toHaveCount(6);
  });

  test('UI-02 (TC-002): Locked out user displays lockout error message', async ({ page }) => {
    await login(page, 'locked_out_user', 'secret_sauce');

    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.'
    );
  });

  test('UI-03 (TC-004): Invalid password displays authentication error', async ({ page }) => {
    await login(page, 'standard_user', 'wrong_password');

    await expect(page.locator('[data-test="error"]')).toHaveText(
      'Epic sadface: Username and password do not match any user in this service'
    );
  });

  test('UI-04 (TC-008): Product sorting by Price (low to high) orders items numerically', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await page.locator('[data-test="product-sort-container"]').selectOption('lohi');

    const priceTexts = await page.locator('[data-test="inventory-item-price"]').allInnerTexts();
    const prices = priceTexts.map((text) => parseFloat(text.replace('$', '')));
    const sorted = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sorted);
    expect(prices[0]).toBe(7.99);
  });

  test('UI-05 (TC-009): Product sorting by Name (Z to A) orders items reverse-alphabetically', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await page.locator('[data-test="product-sort-container"]').selectOption('za');

    const names = await page.locator('[data-test="inventory-item-name"]').allInnerTexts();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));

    expect(names).toEqual(sorted);
  });

  test('UI-06 (TC-013): Add and remove items updates shopping cart badge accurately', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');

    const addBackpack = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await addBackpack.click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('2');

    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('UI-07 (TC-016): Cart items persist across page navigation', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();

    await page.locator('[data-test="inventory-item-name"]', { hasText: 'Sauce Labs Backpack' }).click();
    await expect(page).toHaveURL(/\/inventory-item\.html/);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');

    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveText('1');
  });

  test('UI-08 (TC-019): Complete end-to-end checkout verifies subtotal, tax, and confirmation', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();

    await expect(page).toHaveURL(/\/cart\.html$/);
    await page.locator('[data-test="checkout"]').click();

    await page.locator('[data-test="firstName"]').fill('Ronak');
    await page.locator('[data-test="lastName"]').fill('Oza');
    await page.locator('[data-test="postalCode"]').fill('400016');
    await page.locator('[data-test="continue"]').click();

    await expect(page).toHaveURL(/\/checkout-step-two\.html$/);
    await expect(page.locator('[data-test="subtotal-label"]')).toContainText('$29.99');
    await expect(page.locator('[data-test="tax-label"]')).toContainText('$2.40');
    await expect(page.locator('[data-test="total-label"]')).toContainText('$32.39');

    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(/\/checkout-complete\.html$/);
    await expect(page.locator('[data-test="complete-header"]')).toHaveText('Thank you for your order!');
    await expect(page.locator('[data-test="shopping-cart-badge"]')).toHaveCount(0);
  });

  test('UI-09 (TC-022): Checkout form blocks submission when required fields are missing', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();

    // Missing First Name
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');

    // Fill First & Last Name, leave Postal Code empty
    await page.locator('[data-test="firstName"]').fill('Ronak');
    await page.locator('[data-test="lastName"]').fill('Oza');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toHaveText('Error: Postal Code is required');
  });

  test('UI-10 (TC-027): Logout clears session and blocks direct access to inventory', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');
    await page.locator('#react-burger-menu-btn').click();
    await page.locator('[data-test="logout-sidebar-link"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/');

    await page.goto('/inventory.html');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toContainText(
      "You can only access '/inventory.html' when you are logged in."
    );
  });
});
