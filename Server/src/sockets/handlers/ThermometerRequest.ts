import { Server as ioServer } from 'socket.io';
import { MessageHandler, ItemId } from '../../utils';
import SerialCommunicator, { MessageType, Message } from '../../SerialCommunicator';

export default class ThermometerRequestHandler implements MessageHandler {
  constructor(
    private communicator: SerialCommunicator,
  ) {}

  execute(data: any) {
    const id = ItemId.fromString(data.element).index;

    const message = new Message(MessageType.THERMOMETER_REQUEST, id);
    this.communicator.send(message);
  }
}
