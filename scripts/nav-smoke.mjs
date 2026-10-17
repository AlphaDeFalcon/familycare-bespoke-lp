/**
 * Navigation smoke test: nav links must land on their sections from any
 * scroll position, on desktop and mobile; nav must exist on tablet widths.
 * Usage: node scripts/nav-smoke.mjs [url]
 *
 * Waits for smooth scrolling to settle (condition polling) before measuring.
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

// Poll until scrollY is stable for 3 consecutive samples (or timeout).
async function waitForScrollSettle(page) {
  let last = -1;
  let stable = 0;
  for (let i = 0; i < 50; i++) {
    const y = await page.evaluate(() => window.scrollY);
    if (y === last) {
      stable++;
      if (stable >= 3) return y;
    } else {
      stable = 0;
      last = y;
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  return page.evaluate(() => window.scrollY);
}

async function clickNavLink(page, label) {
  await page.evaluate((text) => {
    const link = [...document.querySelectorAll('nav[aria-label="Main Navigation"] a')].find(
      (a) => a.textContent?.trim() === text
    );
    if (link) link.click();
    else throw new Error(`nav link not found: ${text}`);
  }, label);
}

async function clickDrawerLink(page, label) {
  await page.evaluate((text) => {
    const drawer = document.querySelector('[data-nav-drawer]');
    const link = drawer
      ? [...drawer.querySelectorAll('a')].find((a) => a.textContent?.trim() === text)
      : null;
    if (link) link.click();
    else throw new Error(`drawer link not found: ${text}`);
  }, label);
}

const isRendered = (page, selector) =>
  page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }, selector);

const TARGETS = [
  { label: 'Our Approach', id: 'truth', expectedTop: 96 }, // scroll-mt-24
  { label: 'Tailoring', id: 'tailoring', expectedTop: 80 },
  { label: 'How It Works', id: 'process', expectedTop: 80 },
  { label: 'Capabilities', id: 'capabilities', expectedTop: 80 },
  { label: 'Trust & Proof', id: 'trust', expectedTop: 80 },
  { label: 'FAQs', id: 'faq', expectedTop: 80 }
];

// --- Desktop (1440): click each nav link from the footer ---
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200));

  const navVisible = await isRendered(page, 'nav[aria-label="Main Navigation"]');
  check('desktop 1440: main nav visible', navVisible);

  for (const t of TARGETS) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((r) => setTimeout(r, 300));
    await clickNavLink(page, t.label);
    await waitForScrollSettle(page);
    const top = await page.evaluate(
      (id) => document.getElementById(id)?.getBoundingClientRect().top ?? -9999,
      t.id
    );
    check(`desktop 1440: "${t.label}" lands on #${t.id}`, Math.abs(top - t.expectedTop) <= 12, `top=${top}`);
  }
  await page.close();
}

// --- Tablet (768): nav must exist (drawer via hamburger) ---
{
  const page = await browser.newPage();
  await page.setViewport({ width: 768, height: 900 });
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));

  const hamburgerVisible = await isRendered(
    page,
    'button[aria-label="Toggle navigation menu"]'
  );
  check('tablet 768: hamburger menu available', hamburgerVisible);

  if (hamburgerVisible) {
    await page.evaluate(() =>
      document.querySelector('button[aria-label="Toggle navigation menu"]')?.click()
    );
    await new Promise((r) => setTimeout(r, 300));
    const drawerVisible = await isRendered(page, '[data-nav-drawer]');
    check('tablet 768: drawer opens', drawerVisible);

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((r) => setTimeout(r, 300));
    await clickDrawerLink(page, 'FAQs');
    await waitForScrollSettle(page);
    const top = await page.evaluate(
      () => document.getElementById('faq')?.getBoundingClientRect().top ?? -9999
    );
    check('tablet 768: "FAQs" lands on #faq', Math.abs(top - 80) <= 12, `top=${top}`);
  }

  const noOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth
  );
  check('tablet 768: no horizontal overflow', noOverflow);
  await page.close();
}

// --- Mobile (375): drawer links must land on sections from the footer ---
{
  const page = await browser.newPage();
  await page.setViewport({ width: 375, height: 812 });
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 800));

  const hamburgerVisible = await isRendered(
    page,
    'button[aria-label="Toggle navigation menu"]'
  );
  check('mobile 375: hamburger menu available', hamburgerVisible);

  for (const t of TARGETS) {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((r) => setTimeout(r, 300));
    await page.evaluate(() =>
      document.querySelector('button[aria-label="Toggle navigation menu"]')?.click()
    );
    await new Promise((r) => setTimeout(r, 300));
    await clickDrawerLink(page, t.label);
    await waitForScrollSettle(page);
    const top = await page.evaluate(
      (id) => document.getElementById(id)?.getBoundingClientRect().top ?? -9999,
      t.id
    );
    const drawerClosed = await page.evaluate(
      () => !document.querySelector('[data-nav-drawer]')
    );
    check(`mobile 375: "${t.label}" lands on #${t.id}`, Math.abs(top - t.expectedTop) <= 12, `top=${top}`);
    check(`mobile 375: drawer closed after "${t.label}"`, drawerClosed);
  }

  // Drawer's Discuss button must land on the enquiry form (scroll-mt-16)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await new Promise((r) => setTimeout(r, 300));
  await page.evaluate(() =>
    document.querySelector('button[aria-label="Toggle navigation menu"]')?.click()
  );
  await new Promise((r) => setTimeout(r, 300));
  await page.evaluate(() => {
    const drawer = document.querySelector('[data-nav-drawer]');
    const btn = drawer
      ? [...drawer.querySelectorAll('button')].find((b) =>
          b.textContent?.includes('Discuss a Bespoke Plan')
        )
      : null;
    if (btn) btn.click();
    else throw new Error('drawer Discuss button not found');
  });
  await waitForScrollSettle(page);
  const formTop = await page.evaluate(
    () => document.getElementById('enquiry-form')?.getBoundingClientRect().top ?? -9999
  );
  check(
    'mobile 375: drawer "Discuss a Bespoke Plan" lands on #enquiry-form',
    Math.abs(formTop - 64) <= 12,
    `top=${formTop}`
  );
  await page.close();
}

await browser.close();
console.log(failures === 0 ? '\nALL NAV CHECKS PASSED' : `\n${failures} NAV CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
