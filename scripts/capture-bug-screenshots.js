// @ts-check
const fs = require('fs');
const path = require('path');
const { chromium } = require('@playwright/test');

const SCREENSHOT_DIR = path.join(__dirname, '..', 'docs', 'screenshots');

async function captureBugScreenshots() {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  try {
    // BUG-01 & BUG-03: problem_user inventory images & broken Add to cart buttons
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();

    await page.goto('https://www.saucedemo.com/');
    await page.locator('[data-test="username"]').fill('problem_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.waitForSelector('[data-test="inventory-list"]');

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'bug-01-problem-user-images.png'),
      fullPage: true,
    });

    // Attempt to click Add to cart on Bolt T-Shirt & Fleece Jacket
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'bug-03-problem-user-cart.png'),
      fullPage: true,
    });

    // BUG-02: problem_user checkout Last Name overwrite
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="firstName"]').fill('Ronak');
    await page.locator('[data-test="lastName"]').fill('Oza');
    await page.locator('[data-test="postalCode"]').fill('400016');
    await page.locator('[data-test="continue"]').click();
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'bug-02-problem-user-checkout.png'),
      fullPage: true,
    });
    await context.close();

    // BUG-04: performance_glitch_user login latency
    const perfContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const perfPage = await perfContext.newPage();
    await perfPage.goto('https://www.saucedemo.com/');
    await perfPage.locator('[data-test="username"]').fill('performance_glitch_user');
    await perfPage.locator('[data-test="password"]').fill('secret_sauce');

    const start = Date.now();
    await perfPage.locator('[data-test="login-button"]').click();
    await perfPage.waitForSelector('[data-test="inventory-list"]', { timeout: 30000 });
    const elapsedMs = Date.now() - start;

    await perfPage.evaluate((ms) => {
      const banner = document.createElement('div');
      banner.textContent = `Measured login load time: ${ms} ms`;
      banner.style.cssText =
        'position:fixed;top:8px;right:8px;z-index:9999;background:#d32f2f;color:#fff;padding:8px 12px;font:bold 14px sans-serif;border-radius:4px;';
      document.body.appendChild(banner);
    }, elapsedMs);

    await perfPage.screenshot({
      path: path.join(SCREENSHOT_DIR, 'bug-04-performance-glitch.png'),
      fullPage: false,
    });
    await perfContext.close();

    console.log(`Captured 4 bug screenshots in ${SCREENSHOT_DIR}`);
  } finally {
    await browser.close();
  }
}

captureBugScreenshots().catch((err) => {
  console.error(err);
  process.exit(1);
});
