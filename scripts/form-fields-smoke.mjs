/**
 * One-off smoke test for the decision-process + consent form fields.
 * Exercises the 3-step form, the new validation paths, and the
 * dataLayer form_submit event. Usage: node scripts/form-fields-smoke.mjs
 */

import puppeteer from 'puppeteer-core';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = 'http://localhost:3000/?debug=1&utm_source=google&utm_medium=cpc&utm_campaign=smoke';

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ['--no-first-run']
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 30000 });
await page.evaluate(() => document.getElementById('enquiry-form')?.scrollIntoView());
await new Promise((r) => setTimeout(r, 800));

const clickSubmit = () =>
  page.evaluate(() => {
    const btn = [...document.querySelectorAll('form button[type="submit"]')].find(
      (b) => b.textContent?.includes('Continue') || b.textContent?.includes('Request My Bespoke Consultation')
    );
    btn?.click();
  });

// Step 1: contact details
await page.type('#form-name', 'Kofi Mensah');
await page.type('#form-phone', '0244123456');
await page.select('#form-location', 'Accra / Greater Accra');
await clickSubmit();
await new Promise((r) => setTimeout(r, 400));

// Step 2: what needs to be arranged (need_type pre-selected)
await page.select('#form-timing', 'Immediate need (Within days)');
await clickSubmit();
await new Promise((r) => setTimeout(r, 400));

// Step 3: decision select present with 5 options? Budget field gone?
const decisionOptions = await page.evaluate(
  () => [...document.querySelectorAll('#form-decision option')].map((o) => o.textContent)
);
const budgetGone = await page.evaluate(() => !document.getElementById('form-budget'));
console.log('decision options:', decisionOptions.length, '->', decisionOptions.join(' | '));
console.log('budget field removed:', budgetGone);

// Submit with decision unset and consent unchecked -> both errors visible
await clickSubmit();
await new Promise((r) => setTimeout(r, 400));
const decisionError = await page.evaluate(
  () => document.getElementById('form-decision-error')?.textContent?.trim() || '(none)'
);
const consentError = await page.evaluate(
  () => document.getElementById('form-consent-error')?.textContent?.trim() || '(none)'
);
console.log('decision error:', decisionError);
console.log('consent error:', consentError);

// Select decision + check consent, submit
await page.select('#form-decision', 'Siblings / family members need to approve');
await page.click('#form-consent');
await clickSubmit();
await new Promise((r) => setTimeout(r, 1500));

const successText = await page.evaluate(
  () => document.querySelector('[role="status"]')?.textContent?.replace(/\s+/g, ' ').trim() || ''
);
console.log('success state:', successText.slice(0, 120));

// dataLayer form_submit: decision_process present, consent absent
const dl = await page.evaluate(() => {
  const submits = (window.dataLayer || []).filter((e) => e.event === 'form_submit');
  const last = submits[submits.length - 1] || {};
  return {
    decision_process: last.decision_process || '(missing)',
    consent_leaked: ['consent', 'permission_status', 'consented_at'].some((k) => k in last),
    lead_id: last.lead_id || '(missing)',
    utm_source: last.utm_source || '(missing)'
  };
});
console.log('dataLayer form_submit:', JSON.stringify(dl));

await browser.close();
