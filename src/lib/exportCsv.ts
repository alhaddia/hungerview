import type { CountyFoodInsecurity } from '../types';
import type { StateFoodInsecurity } from './aggregate';

function downloadCsv(filename: string, rows: string[][]) {
  const body = rows
    .map((row) =>
      row
        .map((cell) => {
          const s = String(cell);
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(',')
    )
    .join('\n');
  const blob = new Blob([body], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportCountiesCsv(
  counties: CountyFoodInsecurity[],
  opts: { year: number; minPercent: number; scope: string }
) {
  const rows: string[][] = [
    ['name', 'fips', 'food_insecurity_percent', 'year', 'scope', 'min_percent_filter']
  ];
  for (const c of counties) {
    rows.push([
      c.name,
      c.fips,
      c.percent.toFixed(1),
      String(opts.year),
      opts.scope,
      String(opts.minPercent)
    ]);
  }
  const stamp = new Date().toISOString().slice(0, 10);
  downloadCsv(`hungerview-counties-${opts.scope.toLowerCase()}-${stamp}.csv`, rows);
}

export function exportStatesCsv(
  states: StateFoodInsecurity[],
  opts: { year: number; minPercent: number }
) {
  const rows: string[][] = [
    [
      'name',
      'fips',
      'avg_food_insecurity_percent',
      'county_count',
      'year',
      'min_percent_filter',
      'note'
    ]
  ];
  for (const s of states) {
    rows.push([
      s.name,
      s.fips,
      s.percent.toFixed(1),
      String(s.countyCount),
      String(opts.year),
      String(opts.minPercent),
      'simple average of county rates (not population-weighted)'
    ]);
  }
  const stamp = new Date().toISOString().slice(0, 10);
  downloadCsv(`hungerview-states-${stamp}.csv`, rows);
}
