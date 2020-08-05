import { MessageHandler, ItemId } from '../../utils';
import SerialCommunicator, { MessageType } from '../../SerialCommunicator';

export default class LightsRequestHandler implements MessageHandler {
  constructor(
    private communicator: SerialCommunicator,
  ) {}

  execute(data: any) {
    const id = ItemId.fromString(data.element).index;
  
    this.communicator.send(MessageType.LIGHT_REQUEST, id);
  }
}