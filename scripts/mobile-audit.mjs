/**
 * Mobile viewport audit: renders the LP at 320/375/768 and reports
 * horizontal overflow plus key conversion-element geometry.
 * Usage: node scripts/mobile-audit.mjs
 */

import puppeteer from 'puppeteer-core';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = process.env.AUDIT_URL || 'http://localhost:3000/';
const WIDTHS = [320, 375, 768];

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--no-first-run', '--hide-scrollbars']
});

for (const width of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 812, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500)); // let reveals settle

  const report = await page.evaluate(() => {
    const doc = document.documentElement;
    const overflow = doc.scrollWidth > window.innerWidth;
    const offenders = [];
    if (overflow) {
      const max = window.innerWidth;
      for (const el of document.querySelectorAll('body *')) {
        const rect = el.getBoundingClientRect();
        if (rect.right > max + 1 || rect.left < -1) {
          offenders.push({
            tag: el.tagName,
            cls: (el.className || '').toString().slice(0, 80),
            right: Math.round(rect.right),
            width: Math.round(rect.width)
          });
        }
      }
    }

    const rectOf = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.x), w: Math.round(r.width), h: Math.round(r.height) };
    };

    // CTAs and key controls
    const h1 = document.querySelector('h1');
    const h1Rect = h1?.getBoundingClientRect();
    const heroCta = rectOf('section a[href], section button');
    const stickyBar = rectOf('div.fixed.bottom-0');
    const stickyButtons = [...document.querySelectorAll('div.fixed.bottom-0 button')].map((b) => {
      const r = b.getBoundingClientRect();
      const text = (b.textContent || '').trim().slice(0, 20);
      return { text, w: Math.round(r.width), h: Math.round(r.height) };
    });
    const formInputs = [...document.querySelectorAll('#enquiry-form input, #enquiry-form select')].map((i) => {
      const r = i.getBoundingClientRect();
      return { id: i.id, w: Math.round(r.width), h: Math.round(r.height) };
    });
    const formVisible = !!document.querySelector('#enquiry-form');

    // Any element wider than the viewport
    const wideEls = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width > window.innerWidth + 2) {
        wideEls.push({ tag: el.tagName, cls: (el.className || '').toString().slice(0, 70), w: Math.round(r.width) });
      }
    }

    return {
      viewport: window.innerWidth,
      scrollWidth: doc.scrollWidth,
      horizontalOverflow: overflow,
      offenderCount: offenders.length,
      topOffenders: offenders.slice(0, 6),
      wideElements: wideEls.slice(0, 6),
      h1Lines: h1Rect ? Math.round(h1Rect.height / parseFloat(getComputedStyle(h1).lineHeight)) : null,
      h1Rect: h1Rect ? { w: Math.round(h1Rect.width), h: Math.round(h1Rect.height) } : null,
      heroCta,
      stickyBar,
      stickyButtons,
      formVisible,
      formInputs: formInputs.slice(0, 8)
    };
  });

  console.log(`\n=== ${width}px viewport ===`);
  console.log(JSON.stringify(report, null, 2));
  await page.close();
}

await browser.close();
