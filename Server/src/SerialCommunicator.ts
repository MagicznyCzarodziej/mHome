import * as SerialPort from 'serialport';
const ReadLine = require('@serialport/parser-readline');

import { Logger } from "./utils";

export default class SerialCommunicator {
  port: SerialPort;
  parser: SerialPort.parsers.Readline;
  logger: Logger;
  observers: Function[] = [];

  constructor(logger: Logger, serialPath: string, baudRate: number) {
    this.logger = logger;
    this.port = new SerialPort(serialPath, { baudRate }, (error) => {
      if (error) this.logger.error(`Cannot open serial port ${serialPath} (${error})`);
    });
    this.parser = this.port.pipe(new ReadLine({ delimiter: '\n' }));

    this.port.on('open', () => {
      this.logger.info('SerialPort open');
    });

    this.parser.on('data', (data) => {
      this.logger.info('Received message: ' + data);

      try {
        const message = Message.fromString(data);
        this.notify(message);
      } catch (error) {
        this.logger.error('Invalid message: ' + data);
      }
    });
  }

  public subscribe(observer: Function) {
    this.observers.push(observer)
  }

  public notify(message: Message) {
    this.observers.forEach(observer => {
      observer(message);
    });
  }

  public send(message: Message): void {
    this.logger.info('Sending message: ' + message.toString());

    this.port.write(message.toString());
  }
}

export enum MessageType {
  CMD_START = '>',
  CMD_END = '<',
  CMD_INVALID = 'X',
  CMD_ERROR = 'Y',
  LIGHT_SET = 'S',
  LIGHT_REQUEST = 'L',
  LIGHT_RESPONSE = 'L',
  THERMOMETER_REQUEST = 'T',
  THERMOMETER_RESPONSE = 'T',
}

export class Message {
  constructor(
    readonly type: string,
    readonly element: number = 0,
    readonly value: number = 0,
    readonly auxilary: number = 0,
  ) { }

  static fromString(message: string) {
    message = message.trim();
    
    const regex = new RegExp('^>[A-Z]\\d{9}<$');
    if(!regex.test(message)) throw new Error('Invalid message');

    const type = message[1];
    const element = parseInt(message.substr(2, 3));
    const value = parseInt(message.substr(5, 3));
    const auxilary = parseInt(message.substr(8, 3));

    return new Message(type, element, value, auxilary);
  }

  toString() {
    let message: string = MessageType.CMD_START;
    message += this.type;
    message += this.element.toString().padStart(3, '0');
    message += this.value.toString().padStart(3, '0');
    message += this.auxilary.toString().padStart(3, '0');
    message += MessageType.CMD_END;
    
    return message;
  }
}