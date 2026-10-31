export const CONSENT_STORAGE_KEY = 'fc_consent_v1';
export const CONSENT_PREFERENCES_EVENT = 'fc:open-consent-preferences';

export type ConsentChoice = 'granted' | 'denied';

export interface ConsentStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function defaultStorage(): ConsentStorage {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return { getItem: () => null, setItem: () => undefined };
    }
    return window.localStorage;
  } catch {
    return { getItem: () => null, setItem: () => undefined };
  }
}

export function getStoredConsent(storage: ConsentStorage = defaultStorage()): ConsentChoice | null {
  try {
    const value = storage.getItem(CONSENT_STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

export function saveConsent(
  choice: ConsentChoice,
  storage: ConsentStorage = defaultStorage()
): void {
  try {
    storage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Consent UI must never break the page when storage is unavailable.
  }
}

export function buildConsentUpdate(choice: ConsentChoice): Record<string, ConsentChoice> {
  return {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice
  };
}

export function updateGoogleConsent(choice: ConsentChoice): void {
  try {
    if (typeof window === 'undefined') return;
    const w = window as typeof window & {
      gtag?: (...args: unknown[]) => void;
      dataLayer?: unknown[];
    };
    if (w.gtag) {
      w.gtag('consent', 'update', buildConsentUpdate(choice));
      return;
    }
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push(['consent', 'update', buildConsentUpdate(choice)]);
  } catch {
    // Consent signaling must never break the page.
  }
}

export function openConsentPreferences(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(CONSENT_PREFERENCES_EVENT));
  }
}
