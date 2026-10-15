/**
 * Screenshot a section (or the full page) at desktop and mobile widths.
 * Usage: node scripts/screenshot-section.mjs
 * Env: SEL (default #enquiry-form), WIDTHS (default "1440,375"), OUT_DIR
 */

import puppeteer from 'puppeteer-core';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = process.env.AUDIT_URL || 'http://localhost:3000/';
const SEL = process.env.SEL || '#enquiry-form';
const WIDTHS = (process.env.WIDTHS || '1440,375').split(',').map(Number);
const OUT_DIR =
  process.env.OUT_DIR ||
  'C:/Users/Administrator/Documents/projects/fc_bespoke_lp/.superpowers/brainstorm/3025-1792084639';

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--no-first-run', '--hide-scrollbars']
});

for (const width of WIDTHS) {
  const page = await browser.newPage();
  await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1500)); // let reveals settle

  const el = await page.$(SEL);
  if (!el) {
    console.error(`NOT FOUND: ${SEL} at ${width}px`);
    await page.close();
    continue;
  }
  const out = `${OUT_DIR}/section-${width}.png`;
  await el.screenshot({ path: out });
  console.log(`SAVED ${out}`);
  await page.close();
}

await browser.close();
