import * as SerialPort from 'serialport';
const ReadLine = require('@serialport/parser-readline');

import { Logger } from "./utils";

export default class SerialCommunicator {
  port: SerialPort;
  parser: SerialPort.parsers.Readline;
  logger: Logger;

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
    });
  }

  public send(
    messageType: MessageType,
    element: number,
    value: number = 0,
    auxilary: number = 0
  ): void {
    let message: string = MessageType.CMD_START;
    message += messageType;
    message += element.toString().padStart(3, '0');
    message += value.toString().padStart(3, '0');
    message += auxilary.toString().padStart(3, '0');
    message += MessageType.CMD_END;
    
    this.logger.info('Sending message: ' + message)

    this.port.write(message);
  }
}

export enum MessageType {
  CMD_START = '>',
  CMD_END = '<',
  CMD_INVALID = 'X',
  CMD_ERROR = 'Y',
  LIGHT_SET = 'S',
  LIGHT_REQUEST = 'L',
}