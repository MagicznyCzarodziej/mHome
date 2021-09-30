import SocketIO from 'socket.io';

import { SocketMessage } from 'app/sockets/SocketMessage';
import { database } from 'database/database';
import { StandardLogger } from 'app/utils/Logger';
import { EventBus } from 'app/EventBus';
import { BlindStatus } from 'app/interfaces/BlindStatus';

export class BlindController {
  private logger = new StandardLogger('BlindController');

  constructor(private io: SocketIO.Server) {}

  async setBlind(blindId: number, position: number, status: BlindStatus) {
    try {
      const updatedBlind = await database.blinds.update({
        where: {
          id: blindId,
        },
        data: {
          position,
          status,
        },
      });

      EventBus.pushEvent({
        type: 'BLIND',
        payload: {
          elementId: updatedBlind.id,
          position: updatedBlind.position,
          status: updatedBlind.status,
        },
      });

      this.io.emit(SocketMessage.toClient.BLIND_STATE, {
        id: blindId,
        position,
        status,
      });
    } catch (error) {
      this.logger.error(error);
    }
  }
}
