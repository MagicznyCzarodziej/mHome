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

export const createSocketListeners = (dispatch: Dispatch, socket: Socket) => {
  socket.on('thermometers/newTemperature', (data) => {
    console.log('elo', data);
    const { thermometerId, ...temperature } = data;
    dispatch(
      thermometersActions.thermometerTemperatureResponse({
        thermometerId,
        temperature,
      })
    );
  });
  socket.on('lights/state', (data) => {
    dispatch(
      lightsActions.lightStateResponse({ id: data.id, state: data.state })
    );
  });
};
