import { MessageHandler, ItemId } from '../../utils';
import SerialCommunicator, { MessageType, Message } from '../../SerialCommunicator';

export default class LightRequestHandler implements MessageHandler {
  constructor(
    private communicator: SerialCommunicator,
  ) {}

  execute(data: any) {
    const id = ItemId.fromString(data.element).index;
  
    const message = new Message(MessageType.LIGHT_REQUEST, id);
    this.communicator.send(message);
  }
}