import SerialPort from 'serialport';
// eslint-disable-next-line
const ReadLine = require('@serialport/parser-readline');
import chalk from 'chalk';

import { Logger } from 'app/utils/Logger';
import {
  SerialMessage,
  SerialMessageType,
} from 'app/SerialCommunicator/SerialMessage';
import { SerialCommunicatorObserver } from 'app/interfaces/SerialCommunicatorObserver';

export class SerialCommunicator {
  port: SerialPort;
  parser: SerialPort.parsers.Readline;
  observers: SerialCommunicatorObserver[] = [];

  constructor(
    private logger: Logger,
    private serialPath: string,
    private baudRate: number,
  ) {}

  public async init() {
    return new Promise<void>((resolve, reject) => {
      this.port = new SerialPort(
        this.serialPath,
        { baudRate: this.baudRate },
        (error) => {
          if (error) {
            this.logger.error(
              `Cannot open serial port ${this.serialPath} (${error})`,
            );
            reject(error);
          }
        },
      );
      this.parser = this.port.pipe(new ReadLine({ delimiter: '\n' }));

      this.port.on('open', () => {
        // Serial port is open, but may not be ready to receive commands yet
        this.logger.info('SerialPort open');
      });

      // Received data from serial port
      this.parser.on('data', (data: string) => {
        try {
          const message = SerialMessage.fromString(data);
          this.logger.info(
            `Received message: ${chalk.magenta(
              message.toString(true),
            )} (original: ${data.trim()})`,
          );

          if (message.type === SerialMessageType.CMD_READY) {
            // If Arduino is ready to receive commands resolve promise
            this.logger.info('SerialPort ready');
            resolve();
          } else {
            // Notify all observers
            this.notify(message);
          }
        } catch (error) {
          this.logger.error(error);
          this.logger.error('Invalid message: ' + data);
        }
      });
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
