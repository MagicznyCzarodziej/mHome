import { Api } from './Api';
import { socket } from 'services/Socket';

import { Light } from 'types/Light';
import { SocketMessage } from 'services/Socket';

const ENDPOINT = '/lights';

const getAllLights = async () => await Api.get<Light[]>(ENDPOINT);

const setLight = (id: number, state: string) => {
  socket.emit(SocketMessage.toServer.LIGHT_SET, {
    id,
    state,
  });
};

const setAllGroupLights = (groupId: string, state: string) => {
  socket.emit(SocketMessage.toServer.LIGHTS_SET_GROUP, {
    groupId,
    state,
  });
};

export const LightService = {
  getAllLights,
  setLight,
  setAllGroupLights,
};
