import { OnOff } from 'app/interfaces/OnOff';
import { SocketMessage } from 'app/sockets/SocketMessage';
import { database } from 'database/database';

export class LightController {
  constructor(private io: SocketIO.Server) {}

  async switch(id: number, state: OnOff) {
    await database.light.update({
      where: {
        id,
      },
      data: {
        state,
      },
    });

    this.io.emit(SocketMessage.toClient.LIGHT_STATE, state.toString());
  }
}
