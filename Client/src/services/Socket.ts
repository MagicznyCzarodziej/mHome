import { Dispatch } from 'redux';
import { io, Socket } from 'socket.io-client';
import { lightsActions } from 'store/reducers/lightsReducer';
import { thermometersActions } from 'store/reducers/thermometersReducer';
import { reedsActions } from 'store/reducers/reedsReducer';
import { blindsActions } from 'store/reducers/blindsReducer';
import { getApiIp } from './Api';

export const SocketMessage = {
  toServer: {
    LIGHT_SET: 'lights/set',
    LIGHTS_SET_GROUP: 'lights/set/group',
    LIGHTS_SET_INSIDE: 'lights/set/inside',
    LIGHTS_SET_ALL: 'lights/set/all',
    BLIND_SET: 'blinds/set',
    BLINDS_SET_GROUP: 'blinds/set/group',
    BLINDS_SET_ALL: 'blinds/set/all',
  },
  toClient: {
    LIGHT_STATE: 'lights/update',
    THERMOMETER_NEW_TEMPERATURE: 'thermometers/newTemperature',
    REED_STATE: 'reeds/update',
    BLIND_STATE: 'blinds/update',
  },
};

const socket = io(getApiIp());

socket.on('connect', () => {
  console.log('Connected to socket');
});

export { socket };

export const createSocketListeners = (dispatch: Dispatch, socket: Socket) => {
  // New temperature measured
  socket.on(SocketMessage.toClient.THERMOMETER_NEW_TEMPERATURE, (data) => {
    const { thermometerId, temperature } = data;

    dispatch(
      thermometersActions.thermometerTemperatureResponse({
        thermometerId,
        temperature,
      })
    );
  });

  // Light state changed
  socket.on(SocketMessage.toClient.LIGHT_STATE, (data) => {
    dispatch(
      lightsActions.lightStateResponse({ id: data.id, state: data.state })
    );
  });

  // Reed state changed
  socket.on(SocketMessage.toClient.REED_STATE, (data) => {
    dispatch(
      reedsActions.reedStateResponse({ id: data.id, state: data.state })
    );
  });

  // Blind state changed
  socket.on(SocketMessage.toClient.BLIND_STATE, (data) => {
    dispatch(
      blindsActions.blindStateResponse({
        id: data.id,
        position: data.position,
        status: data.status,
      })
    );
  });
};
