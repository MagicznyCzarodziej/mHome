import * as SerialPort from 'serialport';
const ReadLine = require('@serialport/parser-readline');
import { ItemId, Device, SwitchState, Logger, Command } from "./utils";

class SerialCommunicator {
  port: SerialPort;
  parser: SerialPort.parsers.Readline;
  logger: Logger;

  constructor(logger: Logger, serialPath: string, baudRate: number) {
    this.logger = logger;
    this.port = new SerialPort(serialPath, { baudRate }, (error) => {
      this.logger.error(`Cannot open serial port ${serialPath} (${error})`);
    });
    this.parser = this.port.pipe(new ReadLine({ delimiter: '\n' }));

    this.port.on('open', () => {
      this.logger.info('SerialPort open');
    });
    this.parser.on('data', (data) => {
      this.logger.info('Received data: ' + data);
    });
  }

  public send(command: Command, ...args: (string|number)[]): void {
    this.port.write(`${command}${args.join(':')}${Command.END}`);
  }
}

export class RPI implements Device {
  logger: Logger;
  serialCommunicator: SerialCommunicator;

  constructor(serialPath: string, baudRate: number) {
    this.logger = new Logger('RPI');
    this.connectArduino(serialPath, baudRate);
  }
  updateLight(id: ItemId, state: SwitchState): void {
    const index = id.index;
    const stateValue = state.toInt();
    this.serialCommunicator.send(Command.SET_LIGHT, index, stateValue);
  }
  public connectArduino(serialPath: string, baudRate: number): void {
    this.serialCommunicator = new SerialCommunicator(this.logger, serialPath, baudRate);
  }
}