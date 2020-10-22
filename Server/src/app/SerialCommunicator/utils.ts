import { SerialMessageConstants } from './SerialMessage';

/**
 * Temperature sent from Arduino is multiplied by 10 to preserve decimal part of reading.
 * If temperature is below zero degrees, auxilary part is equal 1.
 *
 * @param value value from SerialMessage
 * @param auxilary auxilary from SerialMessage
 * @returns Temperature as float number eg. 21.5
 */
export function decodeTemperature(value: number, auxilary: number): number {
  const belowZero =
    auxilary === SerialMessageConstants.auxilary.TEMPERATURE_BELOW_ZERO;
  let temperature = value / 10;
  if (belowZero) temperature = -temperature;
  return temperature;
}
