import SerialCommunicator, { MessageType } from './SerialCommunicator';
import { ItemId, Device, SwitchState, Logger } from "./utils";

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
    this.serialCommunicator.send(MessageType.LIGHT_SET, index, stateValue);
  }
  public connectArduino(serialPath: string, baudRate: number): void {
    this.serialCommunicator = new SerialCommunicator(this.logger, serialPath, baudRate);
  }
}