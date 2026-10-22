/**
 * Boot-splash smoke test: the branded loading screen must paint before the
 * JS bundle executes, show the icon and brand copy, then hand over to the
 * mounted app. Reduced-motion users get a static rule.
 * Usage: node scripts/splash-smoke.mjs [url]
 */

import puppeteer from 'puppeteer-core';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = process.env.AUDIT_URL || 'http://localhost:4173/';

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--no-first-run']
});

let failures = 0;
const check = (label, ok, detail) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  (${detail})` : ''}`);
  if (!ok) failures++;
};

/**
 * Navigates with the JS bundle request held open, so the splash is observed
 * exactly as it paints before any app code runs. Returns the held requests;
 * releasing them lets the app mount and dismiss the splash.
 */
async function openWithHeldBundle(page) {
  const held = [];
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (/\/assets\/.*\.js(\?|$)/.test(req.url())) {
      held.push(req);
    } else {
      req.continue();
    }
  });
  // Not awaited: DOMContentLoaded waits on the deferred module we are holding.
  page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {});
  await page.waitForSelector('#boot-splash', { timeout: 5000 });
  return held;
}

const release = (held) => held.forEach((req) => req.continue());

async function waitForRemoval(page) {
  for (let i = 0; i < 40; i++) {
    const gone = await page.evaluate(() => !document.getElementById('boot-splash'));
    if (gone) return true;
    await new Promise((r) => setTimeout(r, 150));
  }
  return false;
}

// --- Splash paints before the app bundle, then hands over ---
{
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  const held = await openWithHeldBundle(page);

  const beforeJs = await page.evaluate(() => {
    const splash = document.getElementById('boot-splash');
    if (!splash) return { present: false };
    const rect = splash.getBoundingClientRect();
    const style = getComputedStyle(splash);
    const img = splash.querySelector('img');
    const ring = splash.querySelector('[data-splash-ring]');
    const ringRect = ring?.getBoundingClientRect();
    const logoRect = img?.getBoundingClientRect();
    const centre = (r) => [(r.left + r.right) / 2, (r.top + r.bottom) / 2];
    const ringEncirclesLogo =
      !!ringRect && !!logoRect && ringRect.width > logoRect.width &&
      Math.abs(centre(ringRect)[0] - centre(logoRect)[0]) <= 8 &&
      Math.abs(centre(ringRect)[1] - centre(logoRect)[1]) <= 8;
    const text = splash.textContent?.replace(/\s+/g, ' ').trim() || '';
    return {
      present: true,
      coversViewport:
        rect.width >= window.innerWidth && rect.height >= window.innerHeight &&
        style.position === 'fixed',
      backgroundImage: style.backgroundImage,
      logoLoaded: !!img && img.complete && img.naturalWidth > 0,
      logoSrc: img?.getAttribute('src') || '',
      ringEncirclesLogo,
      text,
      role: splash.getAttribute('role'),
      label: splash.getAttribute('aria-label')
    };
  });

  check('splash paints before the JS bundle runs', beforeJs.present);
  check('splash covers the viewport', beforeJs.coversViewport === true);
  check(
    'splash uses the brand forest-green background',
    /rgb\(11,\s*61,\s*38\)/.test(beforeJs.backgroundImage || ''),
    beforeJs.backgroundImage?.slice(0, 80)
  );
  check('splash logo image loads', beforeJs.logoLoaded === true, beforeJs.logoSrc);
  check('loading ring encircles the logo', beforeJs.ringEncirclesLogo === true);
  check(
    'splash shows the brand name and tagline',
    /FamilyCare Funeral Trust/.test(beforeJs.text || '') &&
      /Today.s Wisdom, Tomorrow.s Peace of Mind/i.test(beforeJs.text || ''),
    beforeJs.text?.slice(0, 90)
  );
  check('splash exposes an accessible status', beforeJs.role === 'status' && !!beforeJs.label, `${beforeJs.role}/${beforeJs.label}`);

  if (process.env.SCREENSHOT === '1') {
    await new Promise((r) => setTimeout(r, 700)); // let the entrance settle
    await page.screenshot({ path: 'splash-mobile.png' });
    console.log('saved splash-mobile.png');
  }

  release(held);
  check('splash is removed once the app mounts', await waitForRemoval(page));

  const appVisible = await page.evaluate(() => {
    const header = document.querySelector('header');
    return !!header && header.getBoundingClientRect().height > 0;
  });
  check('app is visible after handover', appVisible);
  await page.close();
}

// --- Desktop capture for visual review (opt-in) ---
if (process.env.SCREENSHOT === '1') {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const held = await openWithHeldBundle(page);
  await new Promise((r) => setTimeout(r, 700)); // let the entrance settle
  await page.screenshot({ path: 'splash-desktop.png' });
  console.log('saved splash-desktop.png');
  release(held);
  await page.close();
}

// --- Reduced motion: no sweep animation ---
{
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.emulateMediaFeatures([
    { name: 'prefers-reduced-motion', value: 'reduce' }
  ]);
  const held = await openWithHeldBundle(page);

  const motion = await page.evaluate(() => {
    const splash = document.getElementById('boot-splash');
    const ring = splash?.querySelector('[data-splash-ring]');
    if (!ring) return { found: false };
    const style = getComputedStyle(ring);
    return {
      found: true,
      animationName: style.animationName,
      animationDuration: style.animationDuration
    };
  });

  check('reduced motion: loading ring is present', motion.found === true);
  check(
    'reduced motion: ring does not spin',
    motion.found && (motion.animationName === 'none' || motion.animationDuration === '0s'),
    `${motion.animationName} / ${motion.animationDuration}`
  );
  release(held);
  await page.close();
}

await browser.close();
console.log(failures === 0 ? '\nALL SPLASH CHECKS PASSED' : `\n${failures} SPLASH CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
