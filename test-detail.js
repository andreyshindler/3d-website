const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });

  // Hebrew product detail
  const he = await browser.newPage();
  await he.context().clearCookies();
  await he.goto('http://localhost:3000/catalog', { waitUntil: 'networkidle' });
  const href1 = await he.locator('a[href*="/catalog/"]').first().getAttribute('href');
  await he.goto('http://localhost:3000' + href1, { waitUntil: 'networkidle' });
  await he.screenshot({ path: 'c:/Projects/3d-prints-web/fix-product-he.png', fullPage: true });
  console.log('HE product:', href1);

  // English product detail
  const en = await browser.newPage();
  await en.context().addCookies([{ name: 'locale', value: 'en', domain: 'localhost', path: '/' }]);
  await en.goto('http://localhost:3000/catalog', { waitUntil: 'networkidle' });
  const href2 = await en.locator('a[href*="/catalog/"]').first().getAttribute('href');
  await en.goto('http://localhost:3000' + href2, { waitUntil: 'networkidle' });
  await en.screenshot({ path: 'c:/Projects/3d-prints-web/fix-product-en.png', fullPage: true });
  console.log('EN product:', href2);

  await browser.close();
})().catch(e => { console.error(e.message); process.exit(1); });
