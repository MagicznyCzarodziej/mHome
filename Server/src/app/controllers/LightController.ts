import { OnOff } from 'app/interfaces/OnOff';
import { SocketMessage } from 'app/sockets/SocketMessage';
import { database } from 'database/database';

export class LightController {
  private buffer: { id: number; state: OnOff }[];
  private timeout: NodeJS.Timeout | null;

  constructor(private io: SocketIO.Server) {
    this.buffer = [];
    this.timeout = null;
  }

  async switch(id: number, state: OnOff) {
    try {
      const set = async () => {
        const queries: any = [];
        this.buffer.forEach((light) => {
          queries.push(
            database.light.update({
              where: {
                id: light.id,
              },
              data: {
                state: light.state,
              },
            }),
          );
        });
        database.$transaction(queries);
        this.buffer.forEach((light) => {
          this.io.emit(SocketMessage.toClient.LIGHT_STATE, {
            id: light.id,
            state: light.state,
          });
        });
        this.buffer = [];
      };

      this.buffer.push({ id, state });
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(set, 20);
    } catch (error) {
      console.log(error);
    }
  }
}
