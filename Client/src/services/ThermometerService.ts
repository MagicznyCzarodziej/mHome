import { Api } from './Api';

import { Thermometer, TemperatureEntry } from 'types/Thermometer';

const ENDPOINT = '/thermometers';

const getAllThermometers = async () => await Api.get<Thermometer[]>(ENDPOINT);

const getTemperaturesByThermometerId = async (thermometerId: number) =>
  await Api.get<TemperatureEntry[]>(
    `${ENDPOINT}/${thermometerId}/temperatures`
  );

export const ThermometerService = {
  getAllThermometers,
  getTemperaturesByThermometerId,
};
