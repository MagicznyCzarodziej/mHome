import { Server as ioServer } from 'socket.io';
import { MessageHandler, SocketEvent } from '../../utils';
import { Message } from '../../SerialCommunicator';

export default class ThermometerResponseHandler implements MessageHandler {
  constructor(
    private io: ioServer
  ) {}

  execute(message: Message) {
    this.io.emit(SocketEvent.THERMOMETER_UPDATE, {
      element: message.element,
      value: message.value,
    });
  }
}
