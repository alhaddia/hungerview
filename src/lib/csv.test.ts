import { describe, expect, it } from 'vitest';
import { escapeCsvCell, rowsToCsv } from './csv';

describe('csv', () => {
  it('leaves plain cells unquoted', () => {
    expect(escapeCsvCell('Wayne County')).toBe('Wayne County');
    expect(escapeCsvCell(12.4)).toBe('12.4');
  });

  it('quotes cells with commas or quotes', () => {
    expect(escapeCsvCell('Wayne, MI')).toBe('"Wayne, MI"');
    expect(escapeCsvCell('12" monitor')).toBe('"12"" monitor"');
  });

  it('builds CSV rows', () => {
    const csv = rowsToCsv([
      ['name', 'rate'],
      ['Wayne, MI', 14.2]
    ]);
    expect(csv).toBe('name,rate\n"Wayne, MI",14.2');
  });
});
