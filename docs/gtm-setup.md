# GTM and GA4 Setup

Container `GTM-MWNHNDJ2` is installed in `index.html`. GA4 property `G-QEL6XZVRT3` is wired through the container's Google tag.

The site pushes events to `window.dataLayer`; GTM decides what each event sends. This file is the contract for configuring the container.

## Event contract

| Event | Fires when | Key fields |
| --- | --- | --- |
| `form_start` | Visitor first changes any form field | `section`, `form_id` |
| `form_submit` | Enquiry delivered to the CRM successfully. Failed validation and failed delivery do not fire it | `lead_id`, `lead_location`, `lead_timing`, `lead_needs` (comma-separated string), `preferred_next_step`, `decision_process`, `section`, `form_id` |
| `cta_click` | Any "Discuss a Plan" CTA | `section`, `cta_name` |
| `whatsapp_click` | Any WhatsApp CTA | `section`, `cta_name` |
| `phone_click` | Any Call CTA | `section`, `cta_name` |

All events carry `event_time`, `page_location`, `page_referrer`, and the captured attribution fields (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `msclkid`, `ttclid`).

Identity fields (name, phone, email) and consent status never enter the dataLayer.

`page_view` is not pushed by the site. The container's Google tag already sends a GA4 page view on load. Do not add a second page-view tag unless the Google tag's automatic page view is turned off.

## Required container change

The container currently has a `generate_lead` GA4 event tag on a **click** trigger matching the element text `Request My Bespoke Consultation`. The form button now reads `Request My Consultation`, so the tag never fires. A click trigger would also count failed validation attempts.

Replace it with a successful-submit trigger:

1. Open the container, go to **Triggers**, and create a **Custom Event** trigger named `Form submit (success)` with event name `form_submit`.
2. Open the `generate_lead` event tag and replace its trigger with the new one.
3. Keep the tag's measurement ID as `G-QEL6XZVRT3` and event name `generate_lead`.
4. Add event parameters from the table above (`lead_id`, `lead_location`, `lead_timing`, `lead_needs`, `preferred_next_step`, `decision_process`, `form_id`).
5. Delete the old click trigger if nothing else uses it.

The `whatsapp_click` tag is already correct: its Custom Event trigger matches the dataLayer event.

## Data layer variables to create

Create Data Layer Variables for any field used as a tag parameter: `lead_id`, `lead_location`, `lead_timing`, `lead_needs`, `preferred_next_step`, `decision_process`, `form_id`, `section`, `cta_name`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `msclkid`, `ttclid`.

## Verify

1. GTM **Preview** on the live page, submit the form, confirm `form_submit` appears and the `generate_lead` tag fires.
2. Submit with an invalid field and confirm no `form_submit` and no `generate_lead`.
3. Check GA4 **DebugView** for `generate_lead` with the expected parameters.
