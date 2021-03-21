import { TemperatureRange } from 'types/TemperatureRange';
import * as mdiIcons from '@mdi/js';

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

// Icons
// mdiIcons is imported module with structure: [{iconName<string>: iconPath<string>}]
// But it can't be read as object, so we're creating Map from it
const icons = new Map(Object.entries(mdiIcons));

/**
 * @param iconName icon name from \@mdi/js, eg. `mdiAbTesting`
 * @returns icon svg path string
 */
export const mapIconNameToPath = (iconName: string = '') =>
  icons.get(iconName) || '';
