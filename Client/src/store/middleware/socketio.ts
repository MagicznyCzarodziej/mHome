import { Middleware } from 'redux';
import { Socket } from 'socket.io-client';

const createSocketIoMiddleware = (socket: Socket): Middleware => {
  return (middlewareApi) => (next) => (action) => {
    if (action.type !== 'socket') return next(action);

    const { eventType, ...payload } = action.payload;
    socket.emit(eventType, payload);
  };
};

export default createSocketIoMiddleware;
