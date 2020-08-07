import { Server as ioServer } from 'socket.io';
import { MessageHandler, SocketEvent } from '../../utils';
import { Message } from '../../SerialCommunicator';

export default class LightResponseHandler implements MessageHandler {
  constructor(
    private io: ioServer,
  ) {}

  execute(message: Message) {
    this.io.emit(SocketEvent.LIGHTS_UPDATE, {
      element: message.element,
      value: message.value,
    });
  }
}