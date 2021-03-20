import { Api } from './Api';

import { Thermometer } from 'types/Thermometer';

const ENDPOINT = '/thermometers';

const getAllThermometers = async () => await Api.get<Thermometer[]>(ENDPOINT);

export const ThermometerService = {
  getAllThermometers,
};
