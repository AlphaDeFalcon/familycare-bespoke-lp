# FamilyCare Contract & Custom Landing Page

Single-page React + Vite site for FamilyCare Funeral Trust's contract and custom funeral service. It includes the three-step enquiry form, WhatsApp concierge, capability proof, FAQ, and conversion tracking.

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

Google Tag Manager is loaded from `index.html` with container `GTM-MWNHNDJ2`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 3000. |
| `npm run build` | Build the production bundle to `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Type-check with `tsc --noEmit`. |
| `npm test` | Run the unit tests. |

## CRM integration

The full setup guide, payload contract, field mapping, and endpoint checklist are in [docs/crm-integration.md](docs/crm-integration.md).
