import * as schedule from 'node-schedule';
import { Logger } from 'app/utils/Logger';
import { Container } from 'typedi';
import { SerialCommunicator } from 'app/SerialCommunicator/SerialCommunicator';
import {
  SerialMessage,
  SerialMessageType,
} from 'app/SerialCommunicator/SerialMessage';

export function register(logger: Logger) {
  logger.info('Script registered: Script');
  const name = 'Skrypt testowy';
  schedule.scheduleJob('23 * * *', function (firedAt) {
    const serialCommunicator = Container.get(SerialCommunicator);
    const message = new SerialMessage(
      SerialMessageType.LIGHT_SET,
      0,
      Math.round(Math.random())
    );
    serialCommunicator.send(message);

    logger.info(
      `Script [${name}] planned on ${firedAt.toISOString()} run at ${new Date().toISOString()} (delay: ${
        new Date().getUTCMilliseconds() - firedAt.getUTCMilliseconds()
      }ms)`
    );
  });
}
