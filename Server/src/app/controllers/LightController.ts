import { OnOff } from 'app/interfaces/OnOff';
import { SocketMessage } from 'app/sockets/SocketMessage';
import { database } from 'database/database';

export class LightController {
  constructor(private io: SocketIO.Server) {}

  switch(id: string, state: OnOff) {
    database.light.update({
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
