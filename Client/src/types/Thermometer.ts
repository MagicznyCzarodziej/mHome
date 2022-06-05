export interface Thermometer {
  id: number;
  name: string;
  description: string | null;
  latestTemperature: number;
  temperatures: TemperatureEntry[];
  groupId: string;
}

export interface TemperatureEntry {
  id: number;
  value: number;
  timestamp: string;
}
