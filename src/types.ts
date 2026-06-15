export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface SelectedFilters {
  region: string;
  year: string;
  sector: string;
}

export type SelectedMetricType = 
  | "gdpIndustrial" 
  | "energyConsumption" 
  | "industrialCompaniesCount" 
  | "employeeCount";

export interface MetricMeta {
  key: SelectedMetricType;
  label: string;
  shortLabel: string;
  unit: string;
  color: string;
  icon: string;
  description: string;
}
