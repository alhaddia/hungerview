import type { CountyFoodInsecurity } from '../types';

export type StateFoodInsecurity = {
  /** 2-digit state FIPS */
  fips: string;
  name: string;
  /** Average of county rates (not population-weighted). */
  percent: number;
  countyCount: number;
};

/** Common state names by FIPS for labels when aggregating. */
const STATE_NAMES: Record<string, string> = {
  '01': 'Alabama',
  '02': 'Alaska',
  '04': 'Arizona',
  '05': 'Arkansas',
  '06': 'California',
  '08': 'Colorado',
  '09': 'Connecticut',
  '10': 'Delaware',
  '11': 'District of Columbia',
  '12': 'Florida',
  '13': 'Georgia',
  '15': 'Hawaii',
  '16': 'Idaho',
  '17': 'Illinois',
  '18': 'Indiana',
  '19': 'Iowa',
  '20': 'Kansas',
  '21': 'Kentucky',
  '22': 'Louisiana',
  '23': 'Maine',
  '24': 'Maryland',
  '25': 'Massachusetts',
  '26': 'Michigan',
  '27': 'Minnesota',
  '28': 'Mississippi',
  '29': 'Missouri',
  '30': 'Montana',
  '31': 'Nebraska',
  '32': 'Nevada',
  '33': 'New Hampshire',
  '34': 'New Jersey',
  '35': 'New Mexico',
  '36': 'New York',
  '37': 'North Carolina',
  '38': 'North Dakota',
  '39': 'Ohio',
  '40': 'Oklahoma',
  '41': 'Oregon',
  '42': 'Pennsylvania',
  '44': 'Rhode Island',
  '45': 'South Carolina',
  '46': 'South Dakota',
  '47': 'Tennessee',
  '48': 'Texas',
  '49': 'Utah',
  '50': 'Vermont',
  '51': 'Virginia',
  '53': 'Washington',
  '54': 'West Virginia',
  '55': 'Wisconsin',
  '56': 'Wyoming',
  '72': 'Puerto Rico'
};

export function stateFipsFromCounty(countyFips: string): string {
  return countyFips.slice(0, 2);
}

export function stateName(fips: string): string {
  return STATE_NAMES[fips] ?? `State ${fips}`;
}

/** Contiguous US + DC — excludes AK/HI/territories so national fit isn't globe-scale. */
export const CONTIGUOUS_STATE_FIPS = new Set(
  Object.keys(STATE_NAMES).filter((f) => !['02', '15', '72'].includes(f))
);

export function averageStates(
  counties: CountyFoodInsecurity[]
): StateFoodInsecurity[] {
  const buckets = new Map<string, number[]>();
  for (const c of counties) {
    const sf = stateFipsFromCounty(c.fips);
    const list = buckets.get(sf) ?? [];
    list.push(c.percent);
    buckets.set(sf, list);
  }

  return [...buckets.entries()]
    .map(([fips, vals]) => ({
      fips,
      name: stateName(fips),
      percent: vals.reduce((a, b) => a + b, 0) / vals.length,
      countyCount: vals.length
    }))
    .sort((a, b) => b.percent - a.percent);
}
