import { Api } from './Api';

import { Blind } from 'types/Blind';

const ENDPOINT = '/blinds';

const getAllBlinds = async () => await Api().get<Blind[]>(ENDPOINT);

export const BlindService = {
  getAllBlinds,
};
