import { getNextSerialMessageId } from 'app/SerialCommunicator/utils';

export enum SerialMessageType {
  CMD_START = '>',
  CMD_END = '<',
  /** Arduino ready to receive commands */
  CMD_READY = 'A',
  CMD_INVALID = 'X',
  CMD_ERROR = 'Y',
  LIGHT_SET = 'S',
  LIGHT_REQUEST = 'L',
  LIGHT_RESPONSE = 'L',
  /** Request reading new temperature from Arduino */
  THERMOMETER_REQUEST = 'T',
  /** Message from Arduino with new temperature reading */
  THERMOMETER_RESPONSE = 'T',
  /** Message from Arduino with new reed state */
  REED_RESPONSE = 'R',
}

/** 3 characters long string */
export type SerialMessageId = string;

export enum SerialMessageSource {
  SOCKETS = 'W',
  SCENARIO = 'S',
  SCRIPT = 'C',
}

export const SerialMessageConstants = {
  auxilary: {
    TEMPERATURE_BELOW_ZERO: 1,
  },
};

export class SerialMessage {
  readonly requestId: SerialMessageId;

  constructor(
    requestSource: SerialMessageSource | SerialMessageId,
    readonly type: SerialMessageType,
    readonly element: number = 0,
    readonly value: number = 0,
    readonly auxilary: number = 0,
  ) {
    // Accept existing requestId when creating message from string
    if (requestSource.length === 3) this.requestId = requestSource;
    else
      this.requestId = getNextSerialMessageId(
        requestSource as SerialMessageSource,
      );
  }

  static fromString(message: string) {
    message = message.trim();

    const regex = new RegExp('^>[a-zA-Z0-9]{3}[A-Z]\\d{9}<$');
    if (!regex.test(message)) throw new Error('Invalid message');

    const requestId = message.substr(1, 3);
    const type = message[4] as SerialMessageType;
    const element = parseInt(message.substr(5, 3));
    const value = parseInt(message.substr(8, 3));
    const auxilary = parseInt(message.substr(11, 3));

    return new SerialMessage(requestId, type, element, value, auxilary);
  }

  /**
   * @param split if true groups of data in message are separated
   * by space (`> 000 X 000 000 000 <`)
   */
  toString(split?: boolean) {
    let message: string = SerialMessageType.CMD_START;
    if (split) message += ' ';
    message += this.requestId;
    if (split) message += ' ';
    message += this.type;
    if (split) message += ' ';
    message += this.element.toString().padStart(3, '0');
    if (split) message += ' ';
    message += this.value.toString().padStart(3, '0');
    if (split) message += ' ';
    message += this.auxilary.toString().padStart(3, '0');
    if (split) message += ' ';
    message += SerialMessageType.CMD_END;
    if (split) message += ' (splitted)';

    return message;
  }
}
