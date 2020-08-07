import { Server as ioServer } from 'socket.io';
import { MessageHandler, ItemId, SwitchState } from '../../utils';
import SerialCommunicator, { MessageType, Message } from '../../SerialCommunicator';

export default class LightSetHandler implements MessageHandler {
  constructor(
    private communicator: SerialCommunicator,
  ) {}

  execute(data: any) {
    const id = ItemId.fromString(data.element).index;
    const state = SwitchState.fromString(data.state).toInt();
  
    const message = new Message(MessageType.LIGHT_SET, id, state);
    this.communicator.send(message);
  }
}