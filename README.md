# FamilyCare Contract & Custom Landing Page

Single-page React + Vite landing page for FamilyCare Funeral Trust's contract and custom funeral service.

## Page flow

The page runs in this order:

1. Sticky header — logo, call, WhatsApp, and "Discuss a Plan".
2. How It Works — the four-step path from first conversation to final tribute.
3. Enquiry and WhatsApp — the three-step qualification form beside a WhatsApp concierge that stays in sync with the visitor's draft.
4. Customer reviews — real Google Maps reviews with a link to the full listing.
5. Footer — direct contact details, social links, and privacy/terms modals.
6. Mobile sticky bar — Call, WhatsApp, and "Discuss a Plan" on small screens.

Conversion tracking covers page views, CTA clicks, WhatsApp and phone clicks, form starts, and form submissions, with UTM and platform click-ID attribution pushed to the GTM dataLayer.

## Run locally

**Requirements:** Node.js 22 or newer.

1. Install dependencies:
   `npm install`
2. Copy the environment template:
   `cp .env.example .env.local`
3. Start the dev server:
   `npm run dev`

The site runs at http://localhost:3000.

Without `VITE_LEAD_ENDPOINT`, the enquiry form validates and shows its success state, but the lead is not delivered anywhere. Follow [docs/crm-integration.md](docs/crm-integration.md) to connect it to a CRM.

## Environment variables

Vite inlines the value at build time. Rebuild the site after changing it.

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_LEAD_ENDPOINT` | No | HTTPS URL or same-origin path that receives enquiry submissions as POST JSON. |

Google Tag Manager is loaded from `index.html` with container `GTM-MWNHNDJ2`. The event contract and the container setup checklist are in [docs/gtm-setup.md](docs/gtm-setup.md).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 3000. |
| `npm run build` | Build the production bundle to `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Type-check with `tsc --noEmit`. |
| `npm test` | Run the unit tests. |

The `scripts/` folder holds manual Puppeteer checks for the enquiry form, contact data, boot splash, mobile layout, and section screenshots. Each file documents its default URL and usage.

## CRM integration

The full setup guide, payload contract, field mapping, and endpoint checklist are in [docs/crm-integration.md](docs/crm-integration.md).
