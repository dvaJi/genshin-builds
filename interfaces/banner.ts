export type BannerHistorical = {
  time: string;
  main: string[];
  name: string;
  secondary: string[];
  version: string;
};

export type BannerReRunPrediction = {
  id: string;
  name: string;
  runs: number;
  lastRun: string;
  percentage: number;
};

export interface Banner {
  name: string;
  image: number;
  start: string;
  end: string;
  shortName: string;
  color: string;
  featured: string[];
  featuredRare: string[];
  timezoneDependent: boolean;
  version: string;
}
