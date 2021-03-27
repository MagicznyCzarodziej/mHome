import SocketIO from 'socket.io';

import { SocketMessage } from 'app/sockets/SocketMessage';
import { database } from 'database/database';
import { StandardLogger } from 'app/utils/Logger';
import { ReedState } from 'app/interfaces/ReedState';

export class ReedController {
  private logger = new StandardLogger('ReedController');

  constructor(private io: SocketIO.Server) {}

  async setReed(
    reedId: number,
    state: ReedState,
    timestamp: Date = new Date(),
  ) {
    try {
      await database.$transaction([
        database.reedHistory.create({
          data: {
            reedId,
            state,
            timestamp,
          },
        }),
        database.reed.update({
          where: {
            id: reedId,
          },
          data: {
            state,
          },
        }),
      ]);

      this.io.emit(SocketMessage.toClient.REED_STATE, {
        id: reedId,
        reedId,
        state,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}