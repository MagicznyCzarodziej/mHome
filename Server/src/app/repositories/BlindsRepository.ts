import { Service } from 'typedi';
import { database } from 'database/database';

@Service()
export class BlindsRepository {
  async getAllBlinds() {
    return await database.blinds.findMany();
  }

  async getBlind(id: number) {
    return await database.blinds.findUnique({
      where: {
        id,
      },
    });
  }

  async setBlind(id: number, status: string, position: number) {
    return await database.blinds.update({
      where: {
        id,
      },
      data: {
        status,
        position,
      },
    });
  }
}
