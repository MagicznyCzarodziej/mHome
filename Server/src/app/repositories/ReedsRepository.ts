import { Service } from 'typedi';
import { database } from 'database/database';

@Service()
export class ReedsRepository {
  async getAllReeds() {
    return await database.reed.findMany({});
  }

  async getReed(id: number) {
    return await database.reed.findUnique({
      where: {
        id,
      },
    });
  }

  async getReedHistory(id: number) {
    return await database.reedHistory.findMany({
      where: {
        reedId: id,
      },
      select: {
        id: true,
        state: true,
        timestamp: true,
      },
    });
  }

  async setReed(id: number, state: string, timestamp: Date = new Date()) {
    return await database.$transaction([
      database.reedHistory.create({
        data: {
          reedId: id,
          state,
          timestamp,
        },
      }),
      database.reed.update({
        where: {
          id,
        },
        data: {
          state,
        },
      }),
    ]);
  }
}
