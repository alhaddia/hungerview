import { describe, expect, it } from 'vitest';
import { foodInsecurityBand, foodInsecurityColor } from './score';

describe('score', () => {
  it('maps percent to color bands', () => {
    expect(foodInsecurityColor(21)).toBe('#7f1d1d');
    expect(foodInsecurityColor(17)).toBe('#b91c1c');
    expect(foodInsecurityColor(8)).toBe('#166534');
  });

  it('maps percent to labels', () => {
    expect(foodInsecurityBand(21)).toBe('Very high');
    expect(foodInsecurityBand(14)).toBe('Elevated');
    expect(foodInsecurityBand(9)).toBe('Lower');
  });
});
