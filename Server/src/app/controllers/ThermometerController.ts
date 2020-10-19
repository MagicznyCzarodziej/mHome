import { SocketMessage } from 'app/sockets/SocketMessage';
import { database } from 'database/database';
import SocketIO from 'socket.io';

export class ThermometerController {
  constructor(private io: SocketIO.Server) {}

  addTemperature(id: string, temperature: number, datetime: Date = new Date()) {
    database.thermometer.update({
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
            datetime, // TODO: Check if database accept date in this format
          },
        },
      },
    });

    this.io.emit(SocketMessage.toClient.THERMOMETER_NEW_TEMPERATURE, {
      thermometerId: id,
      temperature,
      datetime,
    });
  }
}
