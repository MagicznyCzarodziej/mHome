import { Server as ioServer } from 'socket.io';
import { MessageHandler, ItemId, SwitchState, SocketEvent } from '../../utils';
import SerialCommunicator, { MessageType } from '../../SerialCommunicator';

export default class LightsSetHandler implements MessageHandler {
  private communicator: SerialCommunicator;
  constructor(communicator: SerialCommunicator, private io: ioServer) {
    
    this.communicator = communicator;
  }

  execute(data: any) {
    const id = ItemId.fromString(data.element).index;
    const state = SwitchState.fromString(data.state).toInt();
  
    this.communicator.send(MessageType.LIGHT_SET, id, state)
    
    const message = {
      element: data.element,
      state: data.state,
    };
  
    this.io.emit(SocketEvent.LIGHTS_UPDATE, message);
  }
}