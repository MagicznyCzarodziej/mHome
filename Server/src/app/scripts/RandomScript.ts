import * as schedule from 'node-schedule';
import { Container } from 'typedi';
import { SerialCommunicator } from 'app/SerialCommunicator/SerialCommunicator';
import {
  SerialMessage,
  SerialMessageSource,
  SerialMessageType,
} from 'app/SerialCommunicator/SerialMessage';
import { Script } from './ScriptInterface';
import { database } from 'database/database';

export class RandomScript implements Script {
  readonly name = 'RandomScript';

  public async execute() {
    const serialCommunicator = Container.get(SerialCommunicator);
    const light = await database.light.findUnique({
      where: { id: 0 },
      select: { state: true },
    });

    const message = new SerialMessage(
      SerialMessageSource.SCRIPT,
      SerialMessageType.LIGHT_SET,
      0,
      light?.state === 'ON' ? 0 : 1,
    );
    serialCommunicator.send(message);
  }

  public register(onFired: (firedAt: Date) => void) {
    schedule.scheduleJob('*/5 * * * * *', (firedAt) => {
      onFired(firedAt);
      this.execute();
    });
  }
}
