/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GHANA_REGIONS } from './regions.ts';

const OFFICIAL_16 = [
  'Ahafo',
  'Ashanti',
  'Bono',
  'Bono East',
  'Central',
  'Eastern',
  'Greater Accra',
  'North East',
  'Northern',
  'Oti',
  'Savannah',
  'Upper East',
  'Upper West',
  'Volta',
  'Western',
  'Western North'
];

test('GHANA_REGIONS lists exactly the 16 official regions of Ghana in alphabetical order', () => {
  assert.deepEqual(GHANA_REGIONS, OFFICIAL_16);
});

test('GHANA_REGIONS has no duplicates', () => {
  assert.equal(new Set(GHANA_REGIONS).size, GHANA_REGIONS.length);
});
