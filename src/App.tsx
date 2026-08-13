import { useMemo, useState } from 'react';
import hdpulse from './data/hdpulseFoodInsecurity2023.json';
import type { HdpulseDataset } from './types';
import { NeedMap, type MapLayer } from './components/NeedMap';
import { NeedPanel, type Scope } from './components/NeedPanel';
import { averageStates, CONTIGUOUS_STATE_FIPS } from './lib/aggregate';

const data = hdpulse as HdpulseDataset;
const MI_PREFIX = '26';

export default function App() {
  const [scope, setScope] = useState<Scope>('US');
  const [minPercent, setMinPercent] = useState(10);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapLayer, setMapLayer] = useState<MapLayer>('state');
  const [nationalFitKey, setNationalFitKey] = useState(0);

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

  return (
    <div className="app">
      <NeedPanel
        scope={scope}
        onScope={onScope}
        mapLayer={mapLayer}
        minPercent={minPercent}
        onMinPercent={setMinPercent}
        selectedId={selectedId}
        onSelect={setSelectedId}
        counties={counties}
        states={states}
        year={data.year}
      />
      <main className="map-wrap">
        <NeedMap
          counties={scope === 'MI' ? counties : allCounties}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
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
