import * as schedule from 'node-schedule';
import { Container } from 'typedi';
import { SerialCommunicator } from 'app/SerialCommunicator/SerialCommunicator';
import {
  SerialMessage,
  SerialMessageType,
} from 'app/SerialCommunicator/SerialMessage';
import { Script } from './ScriptInterface';

export class ReadTemperatures implements Script {
  readonly name = 'ReadTemperatures';

  public execute() {
    const serialCommunicator = Container.get(SerialCommunicator);
    const message = new SerialMessage(SerialMessageType.THERMOMETER_REQUEST, 0);
    serialCommunicator.send(message);
    const message2 = new SerialMessage(
      SerialMessageType.THERMOMETER_REQUEST,
      1
    );
    serialCommunicator.send(message2);
  }

  public register(onFired: (firedAt: Date) => void) {
    const EVERY_TEN_MINUTES = '*/10 * * * *';
    schedule.scheduleJob(EVERY_TEN_MINUTES, (firedAt) => {
      onFired(firedAt);
      this.execute();
    });
  }
}
