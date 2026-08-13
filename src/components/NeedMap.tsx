import { useEffect, useMemo, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import { feature } from 'topojson-client';
import type { Topology, GeometryCollection } from 'topojson-specification';
import countiesTopo from 'us-atlas/counties-10m.json';
import statesTopo from 'us-atlas/states-10m.json';
import type { CountyFoodInsecurity } from '../types';
import {
  averageStates,
  CONTIGUOUS_STATE_FIPS,
  type StateFoodInsecurity
} from '../lib/aggregate';
import { foodInsecurityColor } from '../lib/score';

export type MapLayer = 'state' | 'county';

/** Below this zoom → state averages; at/above → counties. */
export const COUNTY_ZOOM = 6;

type Props = {
  counties: CountyFoodInsecurity[];
  selectedId: string | null;
  onSelect: (id: string, layer: MapLayer) => void;
  onLayerChange: (layer: MapLayer) => void;
  forceCounty?: boolean;
  /** 2-digit state FIPS when scoped to one state (e.g. Michigan). */
  focusStateFips?: string | null;
  /** Bump to re-fit national contiguous bounds. */
  nationalFitKey?: number;
  minPercent?: number;
};

function loadStates(): FeatureCollection<Geometry> {
  const topo = statesTopo as unknown as Topology<{ states: GeometryCollection }>;
  return feature(topo, topo.objects.states) as FeatureCollection<Geometry>;
}

function loadCounties(): FeatureCollection<Geometry> {
  const topo = countiesTopo as unknown as Topology<{
    counties: GeometryCollection;
  }>;
  return feature(topo, topo.objects.counties) as FeatureCollection<Geometry>;
}

function ContiguousUsFit({ fitKey }: { fitKey: number }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(
      [
        [24.5, -125],
        [49.5, -66.5]
      ],
      { padding: [28, 28], maxZoom: 5, animate: true }
    );
  }, [map, fitKey]);
  return null;
}

function FitState({ stateFips }: { stateFips: string }) {
  const map = useMap();
  const statesGeo = useMemo(() => loadStates(), []);

  useEffect(() => {
    const feat = statesGeo.features.find(
      (f) => String(f.id).padStart(2, '0') === stateFips
    );
    if (!feat) return;
    const layer = L.geoJSON(feat as GeoJSON.GeoJsonObject);
    const bounds = layer.getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 8, animate: true });
    }
  }, [map, stateFips, statesGeo]);

  return null;
}

function ZoomLayerBridge({
  forceCounty,
  onLayerChange
}: {
  forceCounty?: boolean;
  onLayerChange: (layer: MapLayer) => void;
}) {
  const map = useMap();

  const emit = () => {
    if (forceCounty) {
      onLayerChange('county');
      return;
    }
    onLayerChange(map.getZoom() >= COUNTY_ZOOM ? 'county' : 'state');
  };

  useMapEvents({ zoomend: emit });

  useEffect(() => {
    emit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forceCounty]);

  return null;
}

export function NeedMap({
  counties,
  selectedId,
  onSelect,
  onLayerChange,
  forceCounty = false,
  focusStateFips,
  nationalFitKey = 0,
  minPercent = 0
}: Props) {
  const [layer, setLayer] = useState<MapLayer>(forceCounty ? 'county' : 'state');

  const byCounty = useMemo(() => {
    const m = new Map<string, CountyFoodInsecurity>();
    for (const c of counties) m.set(c.fips, c);
    return m;
  }, [counties]);

  const states: StateFoodInsecurity[] = useMemo(
    () => averageStates(counties),
    [counties]
  );

  const byState = useMemo(() => {
    const m = new Map<string, StateFoodInsecurity>();
    for (const s of states) m.set(s.fips, s);
    return m;
  }, [states]);

  const countyGeo = useMemo(() => {
    const all = loadCounties();
    if (forceCounty && focusStateFips) {
      return {
        ...all,
        features: all.features.filter((f) =>
          String(f.id).padStart(5, '0').startsWith(focusStateFips)
        )
      };
    }
    return {
      ...all,
      features: all.features.filter((f) =>
        CONTIGUOUS_STATE_FIPS.has(String(f.id).padStart(5, '0').slice(0, 2))
      )
    };
  }, [forceCounty, focusStateFips]);

  const stateGeo = useMemo(() => {
    const all = loadStates();
    return {
      ...all,
      features: all.features.filter((f) =>
        CONTIGUOUS_STATE_FIPS.has(String(f.id).padStart(2, '0'))
      )
    };
  }, []);

  const activeLayer: MapLayer = forceCounty ? 'county' : layer;

  const handleLayer = (next: MapLayer) => {
    setLayer(next);
    onLayerChange(next);
  };

  return (
    <MapContainer
      center={[39.8, -98.5]}
      zoom={4}
      className="map"
      scrollWheelZoom
      minZoom={3}
      maxZoom={10}
      maxBounds={[
        [15, -140],
        [55, -50]
      ]}
      maxBoundsViscosity={0.85}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {!forceCounty ? <ContiguousUsFit fitKey={nationalFitKey} /> : null}
      {forceCounty && focusStateFips ? <FitState stateFips={focusStateFips} /> : null}
      {!forceCounty && selectedId && selectedId.length === 2 ? (
        <FitState stateFips={selectedId} />
      ) : null}
      <ZoomLayerBridge forceCounty={forceCounty} onLayerChange={handleLayer} />

      {activeLayer === 'state' ? (
        <GeoJSON
          key={`state-${minPercent}-${selectedId}`}
          data={stateGeo}
          style={(feat?: Feature<Geometry>) => {
            if (!feat) return {};
            const fips = String(feat.id).padStart(2, '0');
            const row = byState.get(fips);
            const selected = selectedId === fips;
            if (!row || row.percent < minPercent) {
              return {
                fillColor: '#e7e5e4',
                color: '#a8a29e',
                weight: 0.8,
                fillOpacity: 0.4
              };
            }
            return {
              fillColor: foodInsecurityColor(row.percent),
              color: selected ? '#0f172a' : '#44403c',
              weight: selected ? 2.5 : 1,
              fillOpacity: selected ? 0.92 : 0.8
            };
          }}
          onEachFeature={(feat, lyr) => {
            const fips = String(feat.id).padStart(2, '0');
            const row = byState.get(fips);
            lyr.bindTooltip(
              row
                ? `${row.name}: ${row.percent.toFixed(1)}% avg · ${row.countyCount} counties`
                : `State ${fips}: no data`,
              { sticky: true }
            );
            lyr.on({
              click: () => {
                onSelect(fips, 'state');
                const poly = lyr as L.Polygon;
                if (typeof poly.getBounds === 'function') {
                  const map = (lyr as unknown as { _map: L.Map })._map;
                  const bounds = poly.getBounds();
                  if (map && bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 7 });
                  }
                }
              }
            });
          }}
        />
      ) : (
        <GeoJSON
          key={`county-${minPercent}-${selectedId}-${focusStateFips ?? 'us'}`}
          data={countyGeo}
          style={(feat?: Feature<Geometry>) => {
            if (!feat) return {};
            const fips = String(feat.id).padStart(5, '0');
            const row = byCounty.get(fips);
            const selected = selectedId === fips;
            if (!row || row.percent < minPercent) {
              return {
                fillColor: '#e7e5e4',
                color: '#a8a29e',
                weight: 0.35,
                fillOpacity: 0.35
              };
            }
            return {
              fillColor: foodInsecurityColor(row.percent),
              color: selected ? '#0f172a' : '#57534e',
              weight: selected ? 2 : 0.45,
              fillOpacity: selected ? 0.92 : 0.78
            };
          }}
          onEachFeature={(feat, lyr) => {
            const fips = String(feat.id).padStart(5, '0');
            const row = byCounty.get(fips);
            lyr.bindTooltip(
              row
                ? `${row.name}: ${row.percent.toFixed(1)}% food insecure`
                : `FIPS ${fips}: no HDPulse value`,
              { sticky: true }
            );
            lyr.on({ click: () => onSelect(fips, 'county') });
          }}
        />
      )}
    </MapContainer>
  );
}
