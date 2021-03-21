import { Dispatch } from 'redux';
import { io, Socket } from 'socket.io-client';
import { API_IP } from 'utils/constants';
import { lightsActions } from 'store/reducers/lightsReducer';
import { thermometersActions } from 'store/reducers/thermometersReducer';

const socket = io(API_IP);

socket.on('connect', () => {
  console.log('Connected to socket');
});

export { socket };

export const SocketMessage = {
  toServer: {
    LIGHT_SET: 'lights/set',
    LIGHTS_SET_GROUP: 'lights/set/group',
    LIGHTS_SET_ALL: 'lights/set/all',
    BLIND_SET: 'blinds/set',
    BLIND_SET_GROUP: 'blinds/set/group',
    BLIND_SET_ALL: 'blinds/set/all',
  },
  toClient: {
    LIGHT_STATE: 'lights/state',
    THERMOMETER_NEW_TEMPERATURE: 'thermometers/newTemperature',
    REED_STATE: 'reeds/state',
    BLIND_POSITION_CHANGE: 'blinds/position',
    BLIND_STATE_CHANGE: 'blinds/state',
  },
};

export const createSocketListeners = (dispatch: Dispatch, socket: Socket) => {
  // New temperature measured
  socket.on(SocketMessage.toClient.THERMOMETER_NEW_TEMPERATURE, (data) => {
    const { thermometerId, ...temperature } = data;
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
};
