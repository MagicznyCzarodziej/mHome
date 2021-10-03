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
}
