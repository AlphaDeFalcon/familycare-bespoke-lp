/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Endpoint that receives enquiry-form submissions as POST JSON. */
  readonly VITE_LEAD_ENDPOINT?: string;
  /** Optional Google Tag Manager container ID. */
  readonly VITE_GTM_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
