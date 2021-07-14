import {
  SerialMessageConstants,
  SerialMessageId,
  SerialMessageSource,
} from './SerialMessage';

/** Returns next id for SerialMessage
 * @examples `'S00'`, `'C1f'`, `'W2A'`
 */
export const getNextSerialMessageId = (() => {
  let counter = 0;
  const source =
    '0123456789abcdefghijklmnopqrstuwvxyzABCDEFGHIJKLMNOPQRSTUWVXYZ';

  return function next(type: SerialMessageSource): SerialMessageId {
    const first = source[Math.floor(counter / source.length)];
    const second = source[counter % source.length];
    counter++;
    if (counter >= source.length ** 2) counter = 0;
    return `${type}${first}${second}`;
  };
})();

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
