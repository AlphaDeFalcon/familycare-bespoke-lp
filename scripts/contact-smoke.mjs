/**
 * Contact-data smoke test: every tel: link, WhatsApp link, JSON-LD phone,
 * and visible phone string must use the current FamilyCare number.
 * Usage: node scripts/contact-smoke.mjs [url]
 */

import puppeteer from 'puppeteer-core';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = process.env.AUDIT_URL || 'http://localhost:4173/';
const EXPECTED_TEL = 'tel:+233597434114';
const EXPECTED_WA = '233597434114';
const OLD_NUMBER = '262626181';

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--no-first-run']
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
await new Promise((r) => setTimeout(r, 800));

const report = await page.evaluate(() => {
  const telLinks = [...document.querySelectorAll('a[href^="tel:"]')].map((a) => a.getAttribute('href'));
  const waLinks = [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => a.getAttribute('href'));
  const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')]
    .map((s) => {
      try {
        return JSON.parse(s.textContent);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  return {
    telLinks,
    waLinks,
    jsonLdTelephone: jsonLd.find((d) => d.telephone)?.telephone || null,
    bodyText: document.body.innerText
  };
});

let failures = 0;
const check = (label, ok, detail) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  (${detail})` : ''}`);
  if (!ok) failures++;
};

check(
  'all tel: links use the current number',
  report.telLinks.length > 0 && report.telLinks.every((h) => h === EXPECTED_TEL),
  `${report.telLinks.length} links: ${[...new Set(report.telLinks)].join(', ')}`
);
check(
  'all WhatsApp links use the current number',
  report.waLinks.length > 0 && report.waLinks.every((h) => h.includes(EXPECTED_WA)),
  `${report.waLinks.length} links`
);
check(
  'JSON-LD telephone is the current number',
  report.jsonLdTelephone === '+233597434114',
  report.jsonLdTelephone || 'missing'
);
check('visible number is formatted correctly', report.bodyText.includes('+233 59 743 4114'));
check('old number absent from visible text', !report.bodyText.includes('26 262 6181'));

await browser.close();
console.log(failures === 0 ? '\nALL CONTACT CHECKS PASSED' : `\n${failures} CONTACT CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
