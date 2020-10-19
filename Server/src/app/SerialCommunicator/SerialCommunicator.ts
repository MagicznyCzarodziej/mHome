import SerialPort from 'serialport';
// eslint-disable-next-line
const ReadLine = require('@serialport/parser-readline');
import chalk from 'chalk';

import { Logger } from 'app/utils/Logger';
import { SerialMessage } from 'app/SerialCommunicator/SerialMessage';
import { SerialCommunicatorObserver } from 'app/interfaces/SerialCommunicatorObserver';

export class SerialCommunicator {
  port: SerialPort;
  parser: SerialPort.parsers.Readline;
  logger: Logger;
  observers: SerialCommunicatorObserver[] = [];

  constructor(logger: Logger, serialPath: string, baudRate: number) {
    this.logger = logger;
    this.port = new SerialPort(serialPath, { baudRate }, (error) => {
      if (error)
        this.logger.error(`Cannot open serial port ${serialPath} (${error})`);
    });
    this.parser = this.port.pipe(new ReadLine({ delimiter: '\n' }));

    this.port.on('open', () => {
      this.logger.info('SerialPort open');
    });

    // Received data from serial port
    this.parser.on('data', (data: string) => {
      this.logger.info(
        `Received message: ${chalk.magenta(
          SerialMessage.fromString(data).toString(true)
        )} (original: ${data.trim()})`
      );

      // Notify all observers
      try {
        const message = SerialMessage.fromString(data);
        this.notify(message);
      } catch (error) {
        this.logger.error(error);
        this.logger.error('Invalid message: ' + data);
      }
    });
  }

  public subscribe(observer: SerialCommunicatorObserver) {
    this.observers.push(observer);
  }

  private notify(message: SerialMessage) {
    this.observers.forEach((observer) => {
      observer.handleSerialMessage(message);
    });
  }

  public send(message: SerialMessage): void {
    this.logger.info('Sending message:  ' + message.toString(true));
    this.port.write(message.toString());
  }
}
