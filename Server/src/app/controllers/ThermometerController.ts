import { SocketMessage } from 'app/sockets/SocketMessage';
import { database } from 'database/database';
import SocketIO from 'socket.io';
import { StandardLogger } from 'app/utils/Logger';

export class ThermometerController {
  private logger = new StandardLogger('ThermometerController');

  constructor(private io: SocketIO.Server) {}

  async addTemperature(
    id: number,
    temperature: number,
    datetime: Date = new Date(),
  ) {
    try {
      await database.thermometer.update({
        where: {
          id,
        },
        include: {
          temperatures: {},
        },
        data: {
          latestTemperature: temperature,
          temperatures: {
            create: {
              value: temperature,
              datetime,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(error);
    }
    this.io.emit(SocketMessage.toClient.THERMOMETER_NEW_TEMPERATURE, {
      thermometerId: id,
      temperature,
      datetime,
    });
  }
}
