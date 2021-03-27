import { SocketMessage } from 'app/sockets/SocketMessage';
import { database } from 'database/database';
import SocketIO from 'socket.io';
import { StandardLogger } from 'app/utils/Logger';

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

      const temperatureId = results[0].id;
      this.io.emit(SocketMessage.toClient.THERMOMETER_NEW_TEMPERATURE, {
        id: temperatureId,
        thermometerId,
        value: temperature,
        timestamp,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
