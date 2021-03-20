import { TemperatureRange } from 'types/TemperatureRange';

// Temperatures

/**
 * @param temperature Temperature in degrees Celsius
 */
export const getTemperatureRange = (temperature: number): TemperatureRange => {
  const LOW = 20.5;
  const HIGH = 24;

  if (temperature < LOW) return 'LOW';
  else if (temperature > HIGH) return 'HIGH';
  else return 'MEDIUM';
};
