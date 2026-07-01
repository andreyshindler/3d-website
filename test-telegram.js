const { chromium } = require('playwright');

(async () => {
  const b = await chromium.launch({ headless: true });
  const p = await b.newPage();

  await p.goto('http://localhost:3000/contact', { waitUntil: 'networkidle' });

  await p.fill('#name', 'Test User');
  await p.fill('#email', 'test@example.com');
  await p.fill('#product', 'Dragon Figurine');
  await p.fill('#message', 'Hello! I am interested in ordering the Dragon Figurine. Can you tell me more about the colors available?');

  await p.click('button[type=submit]');
  // Wait for success or error banner to appear (up to 15s)
  await p.waitForSelector('.bg-green-50, .bg-red-50', { timeout: 15000 }).catch(() => {});

  // Check for success message
  const success = await p.locator('.bg-green-50').isVisible().catch(() => false);
  const error = await p.locator('.bg-red-50').isVisible().catch(() => false);

  if (success) {
    console.log('SUCCESS — form submitted, Telegram message sent!');
  } else if (error) {
    const msg = await p.locator('.bg-red-50').textContent();
    console.log('ERROR:', msg);
  } else {
    console.log('Unknown state');
  }

  await p.screenshot({ path: 'test-telegram-result.png', fullPage: false });
  await b.close();
})().catch(e => { console.error('FATAL:', e.message); process.exit(1); });
