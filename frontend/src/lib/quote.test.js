import { describe, expect, test } from 'vitest';
import { calculateQuote, formatItemPrice, formatKD, isIncludedInPackage, parseItems } from './quote';

const essential = { id: 1, name: 'Essential', price: 85, items: ['Decor & Backdrop Elegance', 'Photography'] };
const photography = { id: 7, name: 'Photography', price: 45 };
const dj = { id: 3, name: 'DJ & Sound System', price: 80 };
const lighting = { id: 4, name: 'Event Lighting', price: 0 };
const mc = { id: 1, name: 'Host / MC', price: 45 };

describe('parseItems', () => {
  test('accepts arrays, JSON strings and newline text', () => {
    expect(parseItems(['a'])).toEqual(['a']);
    expect(parseItems('["a","b"]')).toEqual(['a', 'b']);
    expect(parseItems('a\n\n b ')).toEqual(['a', 'b']);
    expect(parseItems('{"not":"a list"}')).toEqual([]);
    expect(parseItems(undefined)).toEqual([]);
  });
});

describe('calculateQuote', () => {
  test('sums package, services and add-ons', () => {
    const quote = calculateQuote({ pkg: essential, services: [dj], addons: [mc] });
    expect(quote.total).toBe(85 + 80 + 45);
    expect(quote.hasPriceOnRequest).toBe(false);
  });

  test('does not charge for services already in the package', () => {
    const quote = calculateQuote({ pkg: essential, services: [photography, dj] });
    expect(quote.total).toBe(85 + 80);
    expect(quote.chargedServices).toEqual([dj]);
    expect(isIncludedInPackage(photography, essential)).toBe(true);
    expect(isIncludedInPackage({ name: ' photography ' }, essential)).toBe(true);
    expect(isIncludedInPackage(dj, essential)).toBe(false);
  });

  test('price 0 is "upon request" and excluded from the total', () => {
    const quote = calculateQuote({ services: [lighting, dj] });
    expect(quote.total).toBe(80);
    expect(quote.hasPriceOnRequest).toBe(true);
  });

  test('handles an empty selection and string prices', () => {
    expect(calculateQuote({}).total).toBe(0);
    expect(calculateQuote({ services: [{ name: 'X', price: '12.5' }] }).total).toBe(12.5);
  });
});

describe('formatting', () => {
  test('formatKD', () => {
    expect(formatKD(650)).toBe('KD 650');
    expect(formatKD(650, { onRequest: true })).toBe('KD 650+');
  });

  test('formatItemPrice', () => {
    expect(formatItemPrice(dj)).toBe('KD 80');
    expect(formatItemPrice(lighting)).toBe('Price upon request');
  });
});
