export type CountyFoodInsecurity = {
  name: string;
  /** 5-digit county FIPS */
  fips: string;
  /** Food insecurity rate (%) */
  percent: number;
};

export type HdpulseDataset = {
  source: string;
  measure: string;
  year: number;
  population: string;
  exportFile: string;
  citation: string;
  counties: CountyFoodInsecurity[];
};
