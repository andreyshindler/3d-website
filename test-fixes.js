const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = browser.newContext ? await browser.newContext() : browser;

  async function shot(page, path) {
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path, fullPage: true });
    console.log('Saved:', path);
  }

  // --- HEBREW MODE (default) ---
  const page = await browser.newPage();
  await page.context().clearCookies();
  await page.goto('http://localhost:3000/catalog', { waitUntil: 'networkidle' });
  await shot(page, 'c:/Projects/3d-prints-web/fix-catalog-he.png');

  await page.goto('http://localhost:3000/catalog/1', { waitUntil: 'networkidle' });
  await shot(page, 'c:/Projects/3d-prints-web/fix-product-he.png');

  // --- ENGLISH MODE ---
  const page2 = await browser.newPage();
  await page2.context().addCookies([{ name: 'locale', value: 'en', domain: 'localhost', path: '/' }]);
  await page2.goto('http://localhost:3000/catalog', { waitUntil: 'networkidle' });
  await shot(page2, 'c:/Projects/3d-prints-web/fix-catalog-en.png');

  await page2.goto('http://localhost:3000/catalog/1', { waitUntil: 'networkidle' });
  await shot(page2, 'c:/Projects/3d-prints-web/fix-product-en.png');

  // --- ADMIN (Hebrew default) ---
  const page3 = await browser.newPage();
  await page3.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle' });
  await page3.fill('input[type=email]', 'admin@example.com');
  await page3.fill('input[type=password]', 'adminpass123');
  await page3.click('button[type=submit]');
  await page3.waitForLoadState('networkidle');
  await shot(page3, 'c:/Projects/3d-prints-web/fix-admin-he.png');

  await browser.close();
  console.log('Done.');
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
