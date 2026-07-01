const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];
  const ss = (name) => page.screenshot({ path: `c:/Projects/3d-prints-web/test-${name}.png`, fullPage: true });

  // Home
  await page.goto('http://localhost:3000');
  results.push('HOME: ' + page.url() + ' | title: ' + await page.title());
  await ss('home');

  // Catalog
  await page.goto('http://localhost:3000/catalog');
  await page.waitForLoadState('networkidle');
  const cards = await page.locator('a[href*="/catalog/"]').count();
  results.push('CATALOG: ' + page.url() + ' | product links: ' + cards);
  await ss('catalog');

  // Product detail
  try {
    const firstCard = page.locator('a[href*="/catalog/"]').first();
    const href = await firstCard.getAttribute('href');
    await page.goto('http://localhost:3000' + href);
    await page.waitForLoadState('networkidle');
    results.push('PRODUCT DETAIL: ' + page.url() + ' | title: ' + await page.title());
    await ss('product');
  } catch(e) {
    results.push('PRODUCT DETAIL: error — ' + e.message);
  }

  // Contact
  await page.goto('http://localhost:3000/contact');
  await page.waitForLoadState('networkidle');
  results.push('CONTACT: ' + page.url() + ' | title: ' + await page.title());
  await ss('contact');

  // Admin — should redirect to login
  await page.goto('http://localhost:3000/admin');
  await page.waitForLoadState('networkidle');
  results.push('ADMIN redirect: ' + page.url());

  // Login
  try {
    await page.fill('input[type=email]', 'admin@example.com');
    await page.fill('input[type=password]', 'adminpass123');
    const submitBtn = page.locator('button[type=submit]').filter({ hasNotText: 'Logout' });
    await submitBtn.click();
    await page.waitForLoadState('networkidle');
    results.push('ADMIN after login: ' + page.url());
    await ss('admin-products');
    const rows = await page.locator('table tbody tr').count();
    results.push('ADMIN product rows: ' + rows);
  } catch(e) {
    results.push('ADMIN login error: ' + e.message);
  }

  await browser.close();
  results.forEach(r => console.log(r));
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
