import { Service } from 'typedi';
import { database } from 'database/database';

@Service()
export class SecurityRepository {
  async getHistory(
    cursor: number = 0,
    size: number = 20,
    parsePayload: boolean = false,
  ) {
    const history = await database.history.findMany({
      skip: cursor,
      take: size,
      orderBy: {
        timestamp: 'desc',
      },
    });

    return parsePayload
      ? history.map((entry) => ({
          ...entry,
          payload: JSON.parse(entry.payload),
        }))
      : history;
  }

  async saveHistoryEvent(eventType: string, source: string, payload: any) {
    await database.history.create({
      data: {
        eventType,
        payload: JSON.stringify(payload),
        source,
      },
    });
  }

  async saveConnection(ip: string) {
    const connection = await database.connection.create({
      data: {
        ip,
      },
    });
    return connection.id;
  }

  async closeConnection(id: number) {
    await database.connection.update({
      where: { id: id },
      data: {
        disconnectedAt: new Date(),
      },
    });
  }

  async getConnections() {
    return await database.connection.findMany();
  }
}
