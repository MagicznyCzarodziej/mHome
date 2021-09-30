import { Api } from './Api';

import { Reed } from 'types/Reed';

const ENDPOINT = '/reeds';

const getAllReeds = async () => await Api().get<Reed[]>(ENDPOINT);

export const ReedService = {
  getAllReeds,
};
