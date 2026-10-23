/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Endpoint that receives enquiry-form submissions as POST JSON. */
  readonly VITE_LEAD_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
