import { Light, Prisma } from '@prisma/client';
import { OnOff } from 'app/interfaces/OnOff';
import { SocketMessage } from 'app/sockets/SocketMessage';
import { database } from 'database/database';
import { Server as SocketServer } from 'socket.io';
import { EventBus } from 'app/EventBus';

export class LightController {
  private buffer: { id: number; state: OnOff }[];
  private timeout: NodeJS.Timeout | null;

  constructor(private io: SocketServer) {
    this.buffer = [];
    this.timeout = null;
  }

  async switch(id: number, state: OnOff) {
    try {
      const set = async () => {
        const queries: Prisma.Prisma__LightClient<Light>[] = [];
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

        const result = await database.$transaction(queries);

        result.forEach((light) => {
          EventBus.pushEvent({
            type: 'LIGHT',
            payload: {
              elementId: light.id,
              value: light.state,
            },
          });
        });

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
