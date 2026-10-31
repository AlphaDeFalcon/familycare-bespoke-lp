import { useEffect, useState } from 'react';
import {
  CONSENT_PREFERENCES_EVENT,
  getStoredConsent,
  saveConsent,
  updateGoogleConsent,
  type ConsentChoice
} from '../utils/consent';

export function CookieConsent() {
  const [choice, setChoice] = useState<ConsentChoice | null>(() => getStoredConsent());
  const [isOpen, setIsOpen] = useState(() => getStoredConsent() === null);

  useEffect(() => {
    if (choice) updateGoogleConsent(choice);
  }, [choice]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener(CONSENT_PREFERENCES_EVENT, handleOpen);
    return () => window.removeEventListener(CONSENT_PREFERENCES_EVENT, handleOpen);
  }, []);

  const selectChoice = (nextChoice: ConsentChoice) => {
    saveConsent(nextChoice);
    setChoice(nextChoice);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <aside
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className="fixed inset-x-4 bottom-4 z-40 mx-auto max-w-3xl rounded-card border border-hairline bg-white p-5 text-body shadow-[0_18px_60px_-24px_rgba(7,42,26,0.45)] sm:inset-x-6 sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-2xl space-y-2">
          <h2 id="cookie-consent-title" className="font-display text-xl font-bold text-ink">
            Your privacy matters
          </h2>
          <p id="cookie-consent-description" className="text-xs leading-relaxed text-muted">
            We use optional analytics and advertising cookies to understand which campaigns bring enquiries.
            You can allow them or continue with only the essential page features.
          </p>
          <p className="text-[11px] leading-relaxed text-muted">
            You can change this choice anytime from Cookie preferences in the footer.
          </p>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:min-w-44">
          <button
            type="button"
            onClick={() => selectChoice('granted')}
            className="rounded-full bg-ink px-5 py-3 text-xs font-semibold text-white transition-colors hover:bg-body focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Allow optional cookies
          </button>
          <button
            type="button"
            onClick={() => selectChoice('denied')}
            className="rounded-full border border-ink/20 px-5 py-3 text-xs font-semibold text-ink transition-colors hover:border-ink/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
          >
            Only necessary
          </button>
        </div>
      </div>
    </aside>
  );
}
