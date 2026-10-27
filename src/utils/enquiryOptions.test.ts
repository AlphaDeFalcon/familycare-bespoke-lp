import test from 'node:test';
import assert from 'node:assert/strict';
import {
  NEED_TYPE_OPTIONS,
  TIMING_OPTIONS,
  NEXT_STEP_OPTIONS,
  DECISION_OPTIONS,
  DEFAULT_NEED_TYPE,
  DEFAULT_PREFERRED_NEXT_STEP,
  needTypeLabel,
  optionLabel
} from './enquiryOptions.ts';

test('CRM option values stay stable when display labels change', () => {
  assert.deepEqual(
    NEED_TYPE_OPTIONS.map((option) => option.value),
    [
      'Full Funeral Arrangement',
      'Scale & Venue',
      'Cultural Traditions',
      'Caskets',
      'Logistics & Transport',
      'Catering / Hospitality',
      'Repatriation',
      'Cemetery Support',
      'Budget Guidance'
    ]
  );

  assert.deepEqual(
    TIMING_OPTIONS.map((option) => option.value),
    [
      'Immediate need (Within days)',
      'Near term (Within 1-3 months)',
      'Future planning / Pre-need',
      'Just gathering information'
    ]
  );

  assert.deepEqual(
    NEXT_STEP_OPTIONS.map((option) => option.value),
    [
      'WhatsApp conversation',
      'Phone call from an advisor',
      'Private 1-on-1 consultation'
    ]
  );

  assert.deepEqual(
    DECISION_OPTIONS.map((option) => option.value),
    [
      'I am the sole decision maker',
      'Spouse / partner needs to approve',
      'Siblings / family members need to approve',
      'Elders / family council need to approve',
      'Other decision process'
    ]
  );
});

test('every option has a non-empty, unique display label', () => {
  const groups = [NEED_TYPE_OPTIONS, TIMING_OPTIONS, NEXT_STEP_OPTIONS, DECISION_OPTIONS];

  for (const group of groups) {
    const labels = group.map((option) => option.label.trim());
    assert.ok(labels.every((label) => label.length > 0));
    assert.equal(new Set(labels).size, labels.length);
  }
});

test('optionLabel maps a stored value to its display label', () => {
  assert.equal(needTypeLabel('Scale & Venue'), 'Venue and guest numbers');
  assert.equal(optionLabel(TIMING_OPTIONS, 'Immediate need (Within days)'), 'Within days');
});

test('optionLabel falls back to the stored value for legacy input', () => {
  assert.equal(needTypeLabel('A value from an older browser session'), 'A value from an older browser session');
});

test('default selections are explicit and exist in the option lists', () => {
  assert.equal(DEFAULT_NEED_TYPE, 'Full Funeral Arrangement');
  assert.equal(DEFAULT_PREFERRED_NEXT_STEP, 'WhatsApp conversation');
  assert.ok(NEED_TYPE_OPTIONS.some((option) => option.value === DEFAULT_NEED_TYPE));
  assert.ok(
    NEXT_STEP_OPTIONS.some((option) => option.value === DEFAULT_PREFERRED_NEXT_STEP)
  );
});
