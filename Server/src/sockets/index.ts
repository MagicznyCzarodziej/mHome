import Container from 'typedi';
import { Logger, Device, ItemId, SwitchState } from '../utils';

export function handleSockets(io: SocketIO.Server, logger: Logger) {
  io.on('connection', (socket) => {
    logger.info(
      `Socket.io client connected (ID: ${socket.id} IP: ${socket.handshake.address})`
    );
  
    socket.on('lights/set', (data: any, callback) => {
      try {
        const device: Device = Container.get('Device');
        const id = ItemId.fromString(data.element);
        const state = SwitchState.fromString(data.state);
    
        device.updateLight(id, state);
        
        const message = {
          element: data.element,
          state: data.state,
        };
    
        if (callback) callback();
        io.emit('lights/update', message);
      } catch (error) {
        if (callback) callback(error.message)
      }
    });
  });
}