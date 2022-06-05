import { Api } from './Api';

import { Light } from 'types/Light';

const ENDPOINT = '/lights';

const getAllLights = async () => await Api().get<Light[]>(ENDPOINT);

export const LightService = {
  getAllLights,
};
