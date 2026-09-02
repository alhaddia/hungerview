import { describe, expect, it } from 'vitest';
import { averageStates, stateFipsFromCounty, stateName } from './aggregate';
import type { CountyFoodInsecurity } from '../types';

const sample: CountyFoodInsecurity[] = [
  { fips: '26001', name: 'Alcona County, MI', percent: 12.4 },
  { fips: '26003', name: 'Alger County, MI', percent: 14.8 },
  { fips: '48001', name: 'Anderson County, TX', percent: 18.2 }
];

describe('aggregate', () => {
  it('derives state FIPS from county FIPS', () => {
    expect(stateFipsFromCounty('26163')).toBe('26');
  });

  it('labels known states', () => {
    expect(stateName('26')).toBe('Michigan');
  });

  it('averages county rates per state', () => {
    const states = averageStates(sample);
    const mi = states.find((s) => s.fips === '26');
    const tx = states.find((s) => s.fips === '48');

    expect(mi?.percent).toBeCloseTo(13.6);
    expect(mi?.countyCount).toBe(2);
    expect(tx?.percent).toBeCloseTo(18.2);
    expect(tx?.countyCount).toBe(1);
  });

  it('sorts states by descending average', () => {
    const states = averageStates(sample);
    expect(states[0].fips).toBe('48');
    expect(states[1].fips).toBe('26');
  });
});
