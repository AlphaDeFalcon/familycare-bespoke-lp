/**
 * Smoke test for the enquiry form: three-step flow, validation paths,
 * stable CRM values, and the dataLayer form_submit event.
 * Usage: node scripts/form-fields-smoke.mjs
 */

import puppeteer from 'puppeteer-core';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = 'http://localhost:3000/?debug=1&utm_source=google&utm_medium=cpc&utm_campaign=smoke';

let failures = 0;

const check = (ok, label, detail = '') => {
  if (ok) {
    console.log(`PASS: ${label}`);
    return;
  }
  failures += 1;
  console.error(`FAIL: ${label}${detail ? ` ${detail}` : ''}`);
};

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
      (b) => b.textContent?.includes('Continue') || b.textContent?.includes('Request My Consultation')
    );
    if (!btn) return false;
    btn.click();
    return true;
  });

// Step 1: contact details (location select should offer all 16 regions)
const locationOptions = await page.evaluate(
  () => [...document.querySelectorAll('#form-location option')].map((o) => o.textContent)
);
check(locationOptions.length - 1 === 16, 'location select lists 16 regions', `got ${locationOptions.length - 1}`);

await page.type('#form-name', 'Kofi Mensah');
await page.type('#form-phone', '0244123456');
await page.select('#form-location', 'Greater Accra');
check(await clickSubmit(), 'step 1 advances');
await new Promise((r) => setTimeout(r, 400));

// Step 2: what needs to be arranged (need_type pre-selected)
await page.select('#form-timing', 'Immediate need (Within days)');
check(await clickSubmit(), 'step 2 advances');
await new Promise((r) => setTimeout(r, 400));

// Step 3: decision select present with 5 options plus placeholder? Budget field gone?
const decisionOptions = await page.evaluate(
  () => [...document.querySelectorAll('#form-decision option')].map((o) => o.textContent)
);
const budgetGone = await page.evaluate(() => !document.getElementById('form-budget'));
check(decisionOptions.length === 6, 'decision select has 5 options plus placeholder', `got ${decisionOptions.length}`);
check(budgetGone, 'budget field is absent');

// Submit with decision unset and consent unchecked -> both errors visible
check(await clickSubmit(), 'step 3 submit is available');
await new Promise((r) => setTimeout(r, 400));
const decisionError = await page.evaluate(
  () => document.getElementById('form-decision-error')?.textContent?.trim() || ''
);
const consentError = await page.evaluate(
  () => document.getElementById('form-consent-error')?.textContent?.trim() || ''
);
check(/decision/i.test(decisionError), 'decision validation message appears', decisionError);
check(/consent/i.test(consentError), 'consent validation message appears', consentError);

// Select decision + check consent, submit
await page.select('#form-decision', 'Siblings / family members need to approve');
await page.click('#form-consent');
check(await clickSubmit(), 'final submit is available');
await new Promise((r) => setTimeout(r, 1500));

const successText = await page.evaluate(
  () => document.querySelector('[role="status"]')?.textContent?.replace(/\s+/g, ' ').trim() || ''
);
check(successText.startsWith('Thank you'), 'success state renders', successText.slice(0, 80));

// dataLayer form_submit: stable decision value present, PII/consent absent
const dl = await page.evaluate(() => {
  const submits = (window.dataLayer || []).filter((e) => e.event === 'form_submit');
  const last = submits[submits.length - 1] || {};
  return {
    decision_process: last.decision_process || '',
    consent_leaked: ['consent', 'permission_status', 'consented_at'].some((k) => k in last),
    lead_id: last.lead_id || '',
    utm_source: last.utm_source || ''
  };
});
check(dl.decision_process === 'Siblings / family members need to approve', 'dataLayer keeps the stable decision value', dl.decision_process);
check(dl.consent_leaked === false, 'dataLayer excludes consent data');
check(dl.lead_id.length > 0, 'dataLayer includes lead_id');
check(dl.utm_source === 'google', 'dataLayer preserves utm_source', dl.utm_source);

await browser.close();

if (failures > 0) {
  console.error(`\n${failures} smoke check(s) failed.`);
  process.exitCode = 1;
} else {
  console.log('\nAll smoke checks passed.');
}
