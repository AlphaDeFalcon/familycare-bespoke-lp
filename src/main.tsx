import {createRoot} from 'react-dom/client';
import App from './App.tsx';

import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/cormorant-garamond/600-italic.css';
import './index.css';

// Load the GTM container only when a container ID is configured.
// import.meta.env is statically replaced at build time, so no placeholder
// literal can leak into production bundles.
const gtmId = import.meta.env?.VITE_GTM_ID as string | undefined;
if (gtmId && gtmId.charAt(0) === 'G') {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
  document.head.appendChild(script);
}

createRoot(document.getElementById('root')!).render(<App />);
