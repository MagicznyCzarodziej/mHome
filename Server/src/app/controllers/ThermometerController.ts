import SocketIO from 'socket.io';

import { database } from 'database/database';
import { SocketMessage } from 'app/sockets/SocketMessage';
import { StandardLogger } from 'app/utils/Logger';
import { EventBus } from 'app/EventBus';

export class ThermometerController {
  private logger = new StandardLogger('ThermometerController');

  constructor(private io: SocketIO.Server) {}

  async addTemperature(
    thermometerId: number,
    temperature: number,
    timestamp: Date = new Date(),
  ) {
    try {
      const results = await database.$transaction([
        database.temperature.create({
          data: {
            value: temperature,
            timestamp,
            thermometerId,
          },
        }),
        database.thermometer.update({
          where: {
            id: thermometerId,
          },
          data: {
            latestTemperature: temperature,
          },
        }),
      ]);

      const [newTemperature, thermometer] = results;

      EventBus.pushEvent({
        type: 'THERMOMETER',
        payload: {
          elementId: thermometer.id,
          value: thermometer.latestTemperature,
        },
      });

      this.io.emit(SocketMessage.toClient.THERMOMETER_NEW_TEMPERATURE, {
        id: newTemperature.id,
        thermometerId,
        value: temperature,
        timestamp,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
