import { Api } from './Api';
import { socket } from 'services/Socket';

import { Light } from 'types/Light';

const ENDPOINT = '/lights';

const getAllLights = async () => await Api.get<Light[]>(ENDPOINT);

const setLight = (id: number, state: string) => {
  socket.emit('lights/set', {
    id,
    state,
  });
};

const setAllGroupLights = (groupId: string, state: string) => {
  socket.emit('group/lights/set', {
    groupId,
    state,
  });
};

export const LightService = {
  getAllLights,
  setLight,
  setAllGroupLights,
};
