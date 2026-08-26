import type { CountyFoodInsecurity } from '../types';
import type { StateFoodInsecurity } from '../lib/aggregate';
import type { MapLayer } from './NeedMap';
import { exportCountiesCsv, exportStatesCsv } from '../lib/exportCsv';
import { foodInsecurityBand, foodInsecurityColor } from '../lib/score';

export type Scope = 'MI' | 'US';

type Props = {
  scope: Scope;
  onScope: (s: Scope) => void;
  mapLayer: MapLayer;
  minPercent: number;
  onMinPercent: (n: number) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  counties: CountyFoodInsecurity[];
  states: StateFoodInsecurity[];
  year: number;
};

const SHIPPED = [
  'Michigan / US toggle',
  'Min-rate filter and ranked list',
  'CSV export',
  'Link to a selected place'
];

const NEXT_UP = [
  'Pantry / WIC / SNAP overlay',
  'Year-over-year',
  'ZIP grocery access view',
  'Printable map'
];

export function NeedPanel({
  scope,
  onScope,
  mapLayer,
  minPercent,
  onMinPercent,
  selectedId,
  onSelect,
  counties,
  states,
  year
}: Props) {
  const listMode = scope === 'MI' || mapLayer === 'county' ? 'county' : 'state';

  const rankedCounties = [...counties]
    .filter((r) => r.percent >= minPercent)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, scope === 'US' ? 60 : undefined);

  const rankedStates = [...states]
    .filter((r) => r.percent >= minPercent)
    .sort((a, b) => b.percent - a.percent);

  const onExport = () => {
    if (listMode === 'state') {
      exportStatesCsv(rankedStates, { year, minPercent });
      return;
    }
    exportCountiesCsv(rankedCounties, {
      year,
      minPercent,
      scope: scope === 'MI' ? 'MI' : 'US'
    });
  };

  return (
    <aside className="panel">
      <header className="panel-header">
        <p className="brand">HungerView USA</p>
        <h1>County food insecurity</h1>
        <p className="lede">
          HDPulse rates by county. Filter, compare, and export for planning.
        </p>
      </header>

      <div className="scope-toggle" role="group" aria-label="Map scope">
        <button
          type="button"
          className={scope === 'MI' ? 'active' : undefined}
          onClick={() => onScope('MI')}
        >
          Michigan
        </button>
        <button
          type="button"
          className={scope === 'US' ? 'active' : undefined}
          onClick={() => onScope('US')}
        >
          United States
        </button>
      </div>

      <div className="layer-hint">
        {listMode === 'state' ? (
          <>
            <strong>State averages</strong>. Zoom in or click a state for counties.
          </>
        ) : (
          <>
            <strong>Counties</strong>
            {scope === 'US' ? '. Zoom out for state averages.' : '.'}
          </>
        )}
      </div>

      <label className="filter">
        <span>
          Minimum rate <strong>{minPercent.toFixed(0)}%</strong>
        </span>
        <input
          type="range"
          min={6}
          max={25}
          step={1}
          value={minPercent}
          onChange={(e) => onMinPercent(Number(e.target.value))}
        />
      </label>

      <div className="legend" aria-label="Legend">
        <span>
          <i style={{ background: '#7f1d1d' }} /> ≥20%
        </span>
        <span>
          <i style={{ background: '#b91c1c' }} /> ≥16%
        </span>
        <span>
          <i style={{ background: '#c2410c' }} /> ≥13%
        </span>
        <span>
          <i style={{ background: '#ca8a04' }} /> ≥11%
        </span>
        <span>
          <i style={{ background: '#166534' }} /> lower
        </span>
      </div>

      <div className="list-head">
        <div className="list-head-title">
          <h2>{listMode === 'state' ? 'States by need' : 'Counties by need'}</h2>
          <span className="muted">
            {listMode === 'state' ? rankedStates.length : rankedCounties.length} shown
          </span>
        </div>
        <button type="button" className="export-btn" onClick={onExport}>
          Export CSV
        </button>
      </div>

      <ol className="rank-list">
        {listMode === 'state'
          ? rankedStates.map((s) => (
              <li key={s.fips}>
                <button
                  type="button"
                  className={s.fips === selectedId ? 'active' : undefined}
                  onClick={() => onSelect(s.fips)}
                >
                  <span className="zip-line">
                    <strong>{s.name}</strong>
                    <span className="muted">{s.countyCount} counties · avg of rates</span>
                  </span>
                  <span className="score" style={{ color: foodInsecurityColor(s.percent) }}>
                    {s.percent.toFixed(1)}%
                  </span>
                </button>
              </li>
            ))
          : rankedCounties.map((c) => (
              <li key={c.fips}>
                <button
                  type="button"
                  className={c.fips === selectedId ? 'active' : undefined}
                  onClick={() => onSelect(c.fips)}
                >
                  <span className="zip-line">
                    <strong>{c.name}</strong>
                    <span className="muted">
                      {foodInsecurityBand(c.percent)} · FIPS {c.fips}
                    </span>
                  </span>
                  <span className="score" style={{ color: foodInsecurityColor(c.percent) }}>
                    {c.percent.toFixed(1)}%
                  </span>
                </button>
              </li>
            ))}
      </ol>

      <section className="roadmap">
        <h2>Included</h2>
        <ul>
          {SHIPPED.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h2 className="roadmap-next">Ideas</h2>
        <ul>
          {NEXT_UP.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <p className="footnote">
        HDPulse / NIMHD ({year}), Feeding America Map the Meal Gap. State numbers are a
        simple average of counties, not population-weighted.
      </p>
    </aside>
  );
}
