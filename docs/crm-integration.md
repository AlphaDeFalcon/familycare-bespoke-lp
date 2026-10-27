# CRM integration

How to connect the enquiry form to a CRM or any endpoint that accepts the lead payload.

## How a submission is handled

1. The visitor completes the three-step form and presses **Request My Consultation** (`src/components/EnquiryForm.tsx`).
2. The form validates every qualification field, then `createCrmLeadPayload` normalizes the phone number, generates a lead reference, and attaches first-touch attribution (`src/utils/conversion.ts`).
3. `submitEnquiry` sends the payload to `VITE_LEAD_ENDPOINT` with `postLeadPayload`:
   - `POST` with `Content-Type: application/json`
   - 8-second timeout via `AbortController`
   - a response is accepted only when `response.ok` is true (2xx)
4. On success, the visitor sees the confirmation panel with their reference, preferred contact route, and WhatsApp/call actions.
5. On failure (non-2xx, network error, or timeout), the form stays filled and shows a retry message with WhatsApp and phone alternatives.
6. A `form_submit` event is pushed to the GTM `dataLayer`. Identity fields (name, phone, email) are excluded (`src/utils/attribution.ts`).

If `VITE_LEAD_ENDPOINT` is blank, the client waits 400 ms and reports success without sending anything. This is useful for design review, but no lead reaches FamilyCare.

## 1. Configure the endpoint

Copy `.env.example` to `.env.local` for local development:

```dotenv
VITE_LEAD_ENDPOINT="https://crm.example.com/inbound/familycare"
```

For production, set `VITE_LEAD_ENDPOINT` in the environment used by the build pipeline. Vite inlines environment variables at build time, so changing the endpoint requires a new build and deployment.

The value can be:

- an absolute HTTPS URL on another host (CORS required), or
- a same-origin path such as `/api/leads` (no CORS required).

The value is shipped in the public JavaScript bundle. Never put an API secret, bearer token, or private key in it.

## 2. Endpoint contract

### Request

```http
POST /inbound/familycare HTTP/1.1
Content-Type: application/json

{ ...lead payload... }
```

### Response

- Any **2xx** status is treated as delivered.
- Any other status, a network error, or no response within **8 seconds** is treated as a failure.
- Recommended: return `201 Created` with a JSON body the client ignores:

```json
{ "ok": true, "leadId": "FC-BESPOKE-123456-4821" }
```

### CORS

When the endpoint is on a different origin, it must:

- allow the live site origin,
- allow `POST` and `OPTIONS`,
- allow the `Content-Type` request header,
- answer preflight `OPTIONS` requests with 2xx.

Example response headers:

```http
Access-Control-Allow-Origin: https://familycaretrust.com
Access-Control-Allow-Methods: POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

Keep the allowed origin to the live domain. Do not use `*` on a public lead endpoint.

### Idempotency

`leadId` is unique per submission. Store it as the external reference and use it to reject duplicates if the visitor resubmits or a retry is added later.

## 3. Payload reference

Example (optional fields are omitted when blank):

```json
{
  "leadId": "FC-BESPOKE-123456-4821",
  "timestamp": "2026-10-23T10:15:00.000Z",
  "identity": {
    "name": "Ama Serwaa",
    "phone_whatsapp": "024 400 1122",
    "normalized_phone": "+233244001122",
    "email": "ama@example.com"
  },
  "qualification": {
    "location": "Greater Accra",
    "need_type": ["Scale & Venue", "Logistics & Transport"],
    "timing": "Immediate need (Within days)",
    "preferred_next_step": "Phone call from an advisor",
    "decision_process": "Spouse / partner needs to approve",
    "notes": "Traditional Akan rites, diaspora kin"
  },
  "consent": {
    "permission_status": "granted",
    "consented_at": "2026-10-23T10:15:00.000Z"
  },
  "commercial": {
    "product": "Contract / Custom Funeral Services",
    "journeyStage": "Qualified Opportunity",
    "status": "New Enquiry Captured"
  },
  "attribution": {
    "utm_source": "google",
    "utm_medium": "cpc",
    "utm_campaign": "ghana_contract_bespoke_search",
    "gclid": "Cj0KC..."
  }
}
```

`attribution` falls back to `{ "utm_source": "direct", "utm_medium": "organic" }` when no campaign parameters were captured. Attribution is first-touch and persists in `sessionStorage` for the browser session.

### Stable values and display labels

The form keeps the value sent to the CRM separate from the label shown to visitors (`src/utils/enquiryOptions.ts`). The payload always contains the stable value. Display copy can change without changing the CRM contract.

| Field | Allowed values |
| --- | --- |
| `qualification.need_type[]` | `Full Funeral Arrangement`, `Scale & Venue`, `Cultural Traditions`, `Caskets`, `Logistics & Transport`, `Catering / Hospitality`, `Repatriation`, `Cemetery Support`, `Budget Guidance` |
| `qualification.timing` | `Immediate need (Within days)`, `Near term (Within 1-3 months)`, `Future planning / Pre-need`, `Just gathering information` |
| `qualification.preferred_next_step` | `WhatsApp conversation`, `Phone call from an advisor`, `Private 1-on-1 consultation` |
| `qualification.decision_process` | `I am the sole decision maker`, `Spouse / partner needs to approve`, `Siblings / family members need to approve`, `Elders / family council need to approve`, `Other decision process` |

Map these exact strings in the CRM. Do not map the display labels shown on the page.

`consent` records `permission_status` and `consented_at` only. The consent wording shown to the visitor is not part of the payload.

### Suggested CRM field mapping

| Payload field | CRM use |
| --- | --- |
| `leadId` | External reference / duplicate check |
| `timestamp` | Enquiry received time |
| `identity.name` | Contact name |
| `identity.normalized_phone` | Phone in E.164 format |
| `identity.phone_whatsapp` | Original number as typed |
| `identity.email` | Email (optional) |
| `qualification.location` | Region / service area |
| `qualification.need_type` | Service interests or tags (stable values above) |
| `qualification.timing` | Urgency / follow-up bucket |
| `qualification.preferred_next_step` | Contact channel / task type |
| `qualification.decision_process` | Approval context for the advisor |
| `qualification.notes` | Enquiry description |
| `consent.permission_status` + `consented_at` | Consent record |
| `commercial.product` | Deal or service name |
| `commercial.journeyStage` | Deal stage (`Qualified Opportunity`) |
| `commercial.status` | Lead status (`New Enquiry Captured`) |
| `attribution.*` | Lead source, campaign, click IDs |

## 4. Integration options

Choose one receiver and point `VITE_LEAD_ENDPOINT` at it.

### A. CRM inbound webhook

Many CRMs accept inbound JSON webhooks (HubSpot, Zoho, Pipedrive, Odoo). Create the webhook, map the fields above, and confirm that it returns a 2xx response. If the CRM requires a different JSON shape, put a small mapping layer in front of it rather than changing the landing page.

### B. Automation middleware

Make, Zapier, n8n, or a similar service can receive the POST, transform it, and create the CRM record. Use the webhook URL as `VITE_LEAD_ENDPOINT`. Confirm that the service responds with 2xx within 8 seconds.

### C. Your own endpoint

Any host works: shared hosting, VPS, or a serverless function on a non-Vercel provider. The endpoint must accept JSON, return 2xx, and be reachable over HTTPS. A minimal Node.js receiver:

```js
// lead-endpoint.mjs - reference implementation. Run behind HTTPS.
import { createServer } from 'node:http';

const ALLOWED_ORIGIN = 'https://familycaretrust.com';

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204).end();
    return;
  }

  if (req.method !== 'POST' || req.url !== '/leads') {
    res.writeHead(404).end();
    return;
  }

  let body = '';
  for await (const chunk of req) body += chunk;

  let lead;
  try {
    lead = JSON.parse(body);
  } catch {
    res.writeHead(400).end();
    return;
  }

  if (!lead?.leadId || !lead?.identity?.name || !lead?.identity?.normalized_phone) {
    res.writeHead(422).end();
    return;
  }

  // Persist to the CRM, send a notification, or enqueue the lead here.

  res.writeHead(201, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: true, leadId: lead.leadId }));
});

server.listen(4000);
```

Run it with `node lead-endpoint.mjs`. For PHP or another runtime, read the raw request body and return a 2xx status; the JSON contract is the same.

## 5. Test the integration

### Local receiver

1. Start the endpoint (the example listens on `http://localhost:4000/leads`).
2. Point the site at it in `.env.local`:
   ```dotenv
   VITE_LEAD_ENDPOINT="http://localhost:4000/leads"
   ```
3. Run `npm run dev`, submit a test enquiry, and check the browser Network tab for the POST and the 201 response.
4. Confirm the record in the CRM.

If the receiver runs on a different origin, its CORS headers must allow `http://localhost:3000`. Alternatively, proxy the request through Vite during development:

```ts
// vite.config.ts, dev only
server: {
  proxy: { '/api': 'http://localhost:4000' }
}
```

Then use `VITE_LEAD_ENDPOINT="/api/leads"`.

### Protocol test with curl

```bash
curl -i -X POST https://crm.example.com/inbound/familycare \
  -H "Content-Type: application/json" \
  -d '{
    "leadId": "FC-BESPOKE-TEST-0001",
    "timestamp": "2026-10-23T10:15:00.000Z",
    "identity": { "name": "Test Lead", "phone_whatsapp": "0244001122", "normalized_phone": "+233244001122" },
    "qualification": { "location": "Greater Accra", "need_type": ["Scale & Venue"], "timing": "Future planning / Pre-need", "preferred_next_step": "WhatsApp conversation", "decision_process": "I am the sole decision maker" },
    "consent": { "permission_status": "granted", "consented_at": "2026-10-23T10:15:00.000Z" },
    "commercial": { "product": "Contract / Custom Funeral Services", "journeyStage": "Qualified Opportunity", "status": "New Enquiry Captured" },
    "attribution": { "utm_source": "direct", "utm_medium": "organic" }
  }'
```

Expect a 2xx response. A non-2xx response is what the form surfaces as a delivery failure.

### Automated checks

`npm test` covers the payload builder, validation, the no-endpoint path, and the endpoint-configured path. It does not call the live CRM.

## 6. Production checklist

- [ ] Endpoint is HTTPS and returns 2xx for a valid payload.
- [ ] CORS allows only the live site origin.
- [ ] Server-side validation rejects missing `leadId`, `identity.name`, and `identity.normalized_phone`.
- [ ] Rate limiting or spam protection is enabled on the endpoint.
- [ ] CRM fields are mapped and a test lead appears in the CRM.
- [ ] Consent status and timestamp are stored with the lead.
- [ ] Identity data is not written to application logs or analytics.
- [ ] A test submission from the production build reaches the CRM.
- [ ] The form failure message is verified by temporarily returning a 500 from the endpoint.

## Security notes

- The endpoint URL is public. Anyone can POST to it, so rate limiting and validation are required.
- Client-side validation is a convenience, not a security control. Validate every field again on the server.
- Never return stack traces or CRM credentials in the endpoint response.
- Store only the fields the sales team needs, and define a retention period for consent and lead data.
