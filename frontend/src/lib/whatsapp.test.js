import { describe, expect, test } from 'vitest';
import { whatsappLink } from './whatsapp';

describe('whatsappLink', () => {
  test('uses digits only for the number', () => {
    expect(whatsappLink('+965 6643 3680', ['Hi'])).toBe('https://wa.me/96566433680?text=Hi');
  });

  test('encodes the whole message so "&" and "#" do not cut it short', () => {
    const url = whatsappLink('96566433680', ['*Occasion:* Weddings & Receptions', 'Ref #12', '', 'Name: Sara']);
    const text = new URL(url).searchParams.get('text');

    expect(text).toBe('*Occasion:* Weddings & Receptions\nRef #12\n\nName: Sara');
  });

  test('drops null and undefined lines but keeps blank ones', () => {
    const text = new URL(whatsappLink('1', ['a', null, '', undefined, 'b'])).searchParams.get('text');
    expect(text).toBe('a\n\nb');
  });
});
