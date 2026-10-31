# Hosting deployment

This project builds a static bundle for the existing FamilyCare landing-page host.

## Build

```powershell
npm test
npm run lint
npm run build
```

The deployable files are written to `dist/`. Upload the contents of `dist/` into the document root for `/sales/custom/` using the authorized hosting control panel. Preserve the generated `assets/` directory beside `index.html`.

The current host exposes cPanel at `https://familycaretrust.com:2083/`. The document root is host-specific and must be confirmed in cPanel before replacing files. Keep a backup of the existing `index.html` and `assets/` directory until the live smoke checks pass.

## Post-deploy checks

```powershell
$env:AUDIT_URL = "https://familycaretrust.com/sales/custom/"
node scripts/contact-smoke.mjs
node scripts/form-fields-smoke.mjs
```

Also verify that the page source contains `GTM-MWNHNDJ2`, the consent banner is visible on a fresh browser profile, and the banner's optional-cookie choice updates Google Consent Mode before GTM loads measurement tags.
