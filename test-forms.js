const { chromium } = require('playwright');

(async () => {
  const b = await chromium.launch({ headless: true });
  const p = await b.newPage();

  await p.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle' });
  await p.fill('input[type=email]', 'admin@example.com');
  await p.fill('input[type=password]', 'adminpass123');
  await p.click('button[type=submit]');
  await p.waitForLoadState('networkidle');

  // New product form
  await p.goto('http://localhost:3000/admin/products/new', { waitUntil: 'networkidle' });
  await p.screenshot({ path: 'fix-new-product.png', fullPage: true });
  console.log('New product form saved');

  // Edit product form
  await p.goto('http://localhost:3000/admin/products', { waitUntil: 'networkidle' });
  const editHref = await p.locator('a[href*="/edit"]').first().getAttribute('href');
  await p.goto('http://localhost:3000' + editHref, { waitUntil: 'networkidle' });
  await p.screenshot({ path: 'fix-edit-product.png', fullPage: true });
  console.log('Edit product form saved');

  await b.close();
})().catch(e => { console.error(e.message); process.exit(1); });
