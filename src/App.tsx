import { useEffect, useMemo, useState } from 'react';
import hdpulse from './data/hdpulseFoodInsecurity2023.json';
import type { HdpulseDataset } from './types';
import { NeedMap, type MapLayer } from './components/NeedMap';
import { NeedPanel, type Scope } from './components/NeedPanel';
import { averageStates, CONTIGUOUS_STATE_FIPS } from './lib/aggregate';

const data = hdpulse as HdpulseDataset;
const MI_PREFIX = '26';

function readParams(): { scope: Scope; selectedId: string | null } {
  const params = new URLSearchParams(window.location.search);
  const scope = params.get('scope') === 'MI' ? 'MI' : 'US';
  const place = params.get('place');
  return {
    scope,
    selectedId: place && /^\d{2,5}$/.test(place) ? place : null
  };
}

function writeParams(scope: Scope, selectedId: string | null) {
  const params = new URLSearchParams();
  if (scope === 'MI') params.set('scope', 'MI');
  if (selectedId) params.set('place', selectedId);
  const qs = params.toString();
  const next = `${window.location.pathname}${qs ? `?${qs}` : ''}`;
  window.history.replaceState(null, '', next);
}

export default function App() {
  const initial = readParams();
  const [scope, setScope] = useState<Scope>(initial.scope);
  const [minPercent, setMinPercent] = useState(10);
  const [selectedId, setSelectedId] = useState<string | null>(initial.selectedId);
  const [mapLayer, setMapLayer] = useState<MapLayer>(
    initial.scope === 'MI' || (initial.selectedId?.length ?? 0) === 5
      ? 'county'
      : 'state'
  );
  const [nationalFitKey, setNationalFitKey] = useState(0);

  useEffect(() => {
    writeParams(scope, selectedId);
  }, [scope, selectedId]);

  const allCounties = useMemo(
    () =>
      data.counties.filter((c) =>
        CONTIGUOUS_STATE_FIPS.has(c.fips.slice(0, 2))
      ),
    []
  );

  const counties = useMemo(() => {
    if (scope === 'MI') {
      return data.counties.filter((c) => c.fips.startsWith(MI_PREFIX));
    }
    return allCounties;
  }, [scope, allCounties]);

  const states = useMemo(() => averageStates(allCounties), [allCounties]);

  const onScope = (s: Scope) => {
    setScope(s);
    setSelectedId(null);
    if (s === 'US') {
      setMapLayer('state');
      setNationalFitKey((k) => k + 1);
    } else {
      setMapLayer('county');
    }
  };

  const onSelect = (id: string) => {
    setSelectedId(id);
    if (id.length === 5) setMapLayer('county');
  };

  return (
    <div className="app">
      <NeedPanel
        scope={scope}
        onScope={onScope}
        mapLayer={mapLayer}
        minPercent={minPercent}
        onMinPercent={setMinPercent}
        selectedId={selectedId}
        onSelect={onSelect}
        counties={counties}
        states={states}
        year={data.year}
      />
      <main className="map-wrap">
        <NeedMap
          counties={scope === 'MI' ? counties : allCounties}
          selectedId={selectedId}
          onSelect={(id) => onSelect(id)}
          onLayerChange={setMapLayer}
          forceCounty={scope === 'MI'}
          focusStateFips={scope === 'MI' ? MI_PREFIX : null}
          nationalFitKey={nationalFitKey}
          minPercent={minPercent}
        />
        <div className="map-chip" aria-live="polite">
          {scope === 'MI'
            ? 'Michigan · county detail'
            : mapLayer === 'state'
              ? 'United States · state averages — zoom in for counties'
              : 'County detail — zoom out for state averages'}
        </div>
      </main>
    </div>
  );
}
