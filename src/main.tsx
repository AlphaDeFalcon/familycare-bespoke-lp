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
const gtmId = import.meta.env?.VITE_GTM_ID;
if (gtmId && gtmId.charAt(0) === 'G') {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
  document.head.appendChild(script);
}

const SPLASH_MIN_VISIBLE_MS = 500;
const SPLASH_FADE_FALLBACK_MS = 440;

/**
 * Fades out the branded boot splash in index.html once React has painted.
 * The minimum visible time prevents a flash on fast connections; the
 * fallback timer covers browsers where the transition never fires.
 */
function dismissBootSplash(): void {
  const splash = document.getElementById('boot-splash');
  if (!splash) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elapsed = performance.now();
  const wait = Math.max(0, SPLASH_MIN_VISIBLE_MS - elapsed);

  window.setTimeout(() => {
    if (reduceMotion) {
      splash.remove();
      return;
    }
    splash.classList.add('boot-splash--done');
    const remove = () => splash.remove();
    splash.addEventListener('transitionend', remove, { once: true });
    window.setTimeout(remove, SPLASH_FADE_FALLBACK_MS);
  }, wait);
}

createRoot(document.getElementById('root')!).render(<App />);

// Two frames: the first render commits, the second after paint, so the
// splash never fades over a blank page.
requestAnimationFrame(() => requestAnimationFrame(dismissBootSplash));
