const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  const page = await browser.newPage();

  async function check(label) {
    await page.waitForLoadState('networkidle');
    const lang = await page.$eval('html', el => el.getAttribute('lang'));
    const dir  = await page.$eval('html', el => el.getAttribute('dir'));
    const h1   = await page.locator('h1').first().textContent();
    results.push(`${label}  lang=${lang} dir=${dir}  h1="${h1?.trim()}"`);
    await page.screenshot({ path: `c:/Projects/3d-prints-web/test-i18n-${label.toLowerCase().replace(/\s+/g,'-')}.png`, fullPage: true });
  }

  // 1. Default (no cookie) → Hebrew
  await page.context().clearCookies();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await check('DEFAULT');

  // 2. Click toggle → wait for full reload, then re-navigate fresh
  page.once('dialog', d => d.dismiss());
  await page.locator('button', { hasText: 'English' }).first().click();
  // Give the server action time to set the cookie, then navigate fresh
  await page.waitForTimeout(1500);
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await check('ENGLISH');

  // 3. Catalog in English
  await page.goto('http://localhost:3000/catalog', { waitUntil: 'networkidle' });
  const allLabel = await page.locator('button').filter({ hasText: /^All$/ }).textContent().catch(() => 'n/a');
  results.push(`  catalog all-btn: "${allLabel?.trim()}"`);
  await page.screenshot({ path: 'c:/Projects/3d-prints-web/test-i18n-catalog-en.png', fullPage: true });

  // 4. Toggle back to Hebrew, navigate fresh
  await page.locator('button', { hasText: 'עברית' }).first().click();
  await page.waitForTimeout(1500);
  await page.goto('http://localhost:3000/catalog', { waitUntil: 'networkidle' });
  await check('HEBREW-catalog');

  // 5. Contact in Hebrew
  await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle' });
  await check('CONTACT-HE');

  await browser.close();
  results.forEach(r => console.log(r));
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
