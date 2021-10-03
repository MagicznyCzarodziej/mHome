import { Service } from 'typedi';
import { database } from 'database/database';
import moment from 'moment';

@Service()
export class ThermometersRepository {
  async getAllThermometers() {
    return await database.thermometer.findMany({});
  }

  async getThermometer(
    id: number,
    withTemperatures: boolean = false,
    from?: string,
    to?: string,
  ) {
    const include = withTemperatures
      ? {
          temperatures: {
            where: {
              timestamp: {
                gte: moment(from?.toString()).startOf('day').toDate(),
              },
            },
          },
        }
      : null;

    return await database.thermometer.findUnique({
      where: {
        id,
      },
      include,
    });
  }

  async getTemperatures(thermometerId: number) {
    return await database.temperature.findMany({
      where: {
        thermometerId,
      },
      select: {
        id: true,
        value: true,
        timestamp: true,
      },
    });
  }

  async addTemperature(
    thermometerId: number,
    temperature: number,
    timestamp: Date = new Date(),
  ) {
    await database.$transaction([
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
  }
}
