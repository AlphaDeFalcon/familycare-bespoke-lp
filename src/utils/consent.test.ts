import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONSENT_STORAGE_KEY,
  buildConsentUpdate,
  getStoredConsent,
  saveConsent,
  type ConsentStorage,
  type ConsentChoice
} from './consent';

function memoryStorage(initial: Record<string, string> = {}): ConsentStorage {
  const values = new Map(Object.entries(initial));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value)
  };
}

test('reads only valid saved consent choices', () => {
  assert.equal(getStoredConsent(memoryStorage()), null);
  assert.equal(
    getStoredConsent(memoryStorage({ [CONSENT_STORAGE_KEY]: 'granted' })),
    'granted'
  );
  assert.equal(
    getStoredConsent(memoryStorage({ [CONSENT_STORAGE_KEY]: 'denied' })),
    'denied'
  );
  assert.equal(
    getStoredConsent(memoryStorage({ [CONSENT_STORAGE_KEY]: 'unknown' })),
    null
  );
});

test('saves the selected consent choice', () => {
  const storage = memoryStorage();

  saveConsent('granted', storage);

  assert.equal(storage.getItem(CONSENT_STORAGE_KEY), 'granted');
});

test('builds a denied Google consent update', () => {
  assert.deepEqual(buildConsentUpdate('denied'), {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied'
  });
});

test('builds a granted Google consent update without changing the choice type', () => {
  const choice: ConsentChoice = 'granted';

  assert.deepEqual(buildConsentUpdate(choice), {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted'
  });
});
