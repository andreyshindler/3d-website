const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Clear cookie → default Hebrew
  await page.context().clearCookies();

  // Home
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'c:/Projects/3d-prints-web/final-home-he.png', fullPage: true });

  // Catalog
  await page.goto('http://localhost:3000/catalog', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'c:/Projects/3d-prints-web/final-catalog-he.png', fullPage: true });

  // Product detail
  const href = await page.locator('a[href*="/catalog/"]').first().getAttribute('href');
  await page.goto('http://localhost:3000' + href, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'c:/Projects/3d-prints-web/final-product-he.png', fullPage: true });

  // Admin login → products
  await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle' });
  await page.fill('input[type=email]', 'admin@example.com');
  await page.fill('input[type=password]', 'adminpass123');
  await page.click('button[type=submit]');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'c:/Projects/3d-prints-web/final-admin-he.png', fullPage: true });

  await browser.close();
  console.log('Screenshots saved.');
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
