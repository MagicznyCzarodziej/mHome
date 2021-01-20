export enum SerialMessageType {
  CMD_START = '>',
  CMD_END = '<',
  CMD_INVALID = 'X',
  CMD_ERROR = 'Y',
  LIGHT_SET = 'S',
  LIGHT_REQUEST = 'L',
  LIGHT_RESPONSE = 'L',
  /** Request reading new temperature from Arduino */
  THERMOMETER_REQUEST = 'T',
  /** Message from Arduino with new temperature reading */
  THERMOMETER_RESPONSE = 'T',
}

export const SerialMessageConstants = {
  auxilary: {
    TEMPERATURE_BELOW_ZERO: 1,
  },
};

export class SerialMessage {
  constructor(
    readonly type: SerialMessageType,
    readonly element: number = 0,
    readonly value: number = 0,
    readonly auxilary: number = 0,
  ) {}

  static fromString(message: string) {
    message = message.trim();

    const regex = new RegExp('^>[A-Z]\\d{9}<$');
    if (!regex.test(message)) throw new Error('Invalid message');

    const type = message[1] as SerialMessageType;
    const element = parseInt(message.substr(2, 3));
    const value = parseInt(message.substr(5, 3));
    const auxilary = parseInt(message.substr(8, 3));

    return new SerialMessage(type, element, value, auxilary);
  }

  /** @param split if true groups of data in message are separated by space (`> X 000 000 000 <`) */
  toString(split?: boolean) {
    let message: string = SerialMessageType.CMD_START;
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
