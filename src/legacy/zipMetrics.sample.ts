export type ZipMetric = {
  zip: string;
  name: string;
  lat: number;
  lng: number;
  population: number;
  /** 0–1; higher = easier grocery access */
  groceryAccess: number;
  /** average miles from homes to nearest grocery */
  avgMilesToStore: number;
  /** 0–1; share of households with vehicle access */
  vehicleAccess: number;
};

/**
 * Sample metro Detroit ZIPs for UI development.
 * Replace with real Census / USDA / retailer-derived metrics.
 * Values are illustrative only — not official statistics.
 */
export const zipMetrics: ZipMetric[] = [
  {
    zip: '48201',
    name: 'Midtown Detroit',
    lat: 42.352,
    lng: -83.063,
    population: 14500,
    groceryAccess: 0.55,
    avgMilesToStore: 1.4,
    vehicleAccess: 0.62
  },
  {
    zip: '48202',
    name: 'New Center / North End',
    lat: 42.378,
    lng: -83.078,
    population: 16800,
    groceryAccess: 0.42,
    avgMilesToStore: 2.1,
    vehicleAccess: 0.58
  },
  {
    zip: '48204',
    name: 'Northwest Detroit',
    lat: 42.365,
    lng: -83.14,
    population: 22000,
    groceryAccess: 0.28,
    avgMilesToStore: 2.8,
    vehicleAccess: 0.71
  },
  {
    zip: '48205',
    name: 'Northeast Detroit',
    lat: 42.43,
    lng: -82.97,
    population: 31000,
    groceryAccess: 0.35,
    avgMilesToStore: 2.4,
    vehicleAccess: 0.74
  },
  {
    zip: '48206',
    name: 'Boston-Edison / NW',
    lat: 42.385,
    lng: -83.11,
    population: 18500,
    groceryAccess: 0.31,
    avgMilesToStore: 2.6,
    vehicleAccess: 0.66
  },
  {
    zip: '48207',
    name: 'East Riverfront',
    lat: 42.345,
    lng: -83.01,
    population: 19000,
    groceryAccess: 0.48,
    avgMilesToStore: 1.7,
    vehicleAccess: 0.64
  },
  {
    zip: '48214',
    name: 'East Side',
    lat: 42.37,
    lng: -82.98,
    population: 20500,
    groceryAccess: 0.33,
    avgMilesToStore: 2.5,
    vehicleAccess: 0.69
  },
  {
    zip: '48219',
    name: 'Far Northwest',
    lat: 42.425,
    lng: -83.25,
    population: 24000,
    groceryAccess: 0.38,
    avgMilesToStore: 2.2,
    vehicleAccess: 0.78
  },
  {
    zip: '48226',
    name: 'Downtown',
    lat: 42.333,
    lng: -83.048,
    population: 7200,
    groceryAccess: 0.72,
    avgMilesToStore: 0.8,
    vehicleAccess: 0.55
  },
  {
    zip: '48227',
    name: 'Grandmont / Rosedale',
    lat: 42.4,
    lng: -83.2,
    population: 27000,
    groceryAccess: 0.36,
    avgMilesToStore: 2.3,
    vehicleAccess: 0.76
  },
  {
    zip: '48228',
    name: 'Warrendale',
    lat: 42.35,
    lng: -83.22,
    population: 29000,
    groceryAccess: 0.3,
    avgMilesToStore: 2.7,
    vehicleAccess: 0.73
  },
  {
    zip: '48235',
    name: 'Greenfield / Schaefer',
    lat: 42.42,
    lng: -83.19,
    population: 32000,
    groceryAccess: 0.4,
    avgMilesToStore: 2.0,
    vehicleAccess: 0.77
  },
  {
    zip: '48126',
    name: 'Dearborn',
    lat: 42.322,
    lng: -83.176,
    population: 45000,
    groceryAccess: 0.68,
    avgMilesToStore: 1.1,
    vehicleAccess: 0.88
  },
  {
    zip: '48124',
    name: 'Dearborn Heights',
    lat: 42.337,
    lng: -83.273,
    population: 28000,
    groceryAccess: 0.7,
    avgMilesToStore: 1.0,
    vehicleAccess: 0.91
  },
  {
    zip: '48240',
    name: 'Redford',
    lat: 42.383,
    lng: -83.297,
    population: 22000,
    groceryAccess: 0.65,
    avgMilesToStore: 1.2,
    vehicleAccess: 0.9
  }
];
