import { Service } from 'typedi';
import { database } from 'database/database';
import { Light, Prisma } from '@prisma/client';
import { SwitchState } from 'app/utils/SwitchState';
import {
  SerialMessage,
  SerialMessageSource,
  SerialMessageType,
} from 'app/SerialCommunicator/SerialMessage';

@Service()
export class LightsRepository {
  private buffer: { id: number; state: string }[];
  private timeout: NodeJS.Timeout | null;

  constructor() {
    this.buffer = [];
    this.timeout = null;
  }

  async getAllLights() {
    return await database.light.findMany();
  }

  async getGroupLights(groupId: string) {
    return (
      (
        await database.group.findUnique({
          where: { id: groupId },
          select: {
            lights: true,
          },
        })
      )?.lights || []
    );
  }

  async getInsideLights() {
    return await database.light.findMany({
      where: {
        NOT: {
          groupId: 'OUTSIDE',
        },
      },
    });
  }

  async getLight(id: number) {
    return await database.light.findUnique({
      where: {
        id,
      },
    });
  }

  async setLight(id: number, state: string) {
    this.buffer.push({ id, state });
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(this.switchBuffered.bind(this), 20);
  }

  private async switchBuffered() {
    // eslint-disable-next-line @typescript-eslint/camelcase
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

    await database.$transaction(queries);
    this.buffer = [];
  }

  async setGroupLights(groupId: string, state: string) {
    const stateInt = SwitchState.parse(state).toInt();
    const group = await database.group.findUnique({
      where: { id: groupId },
      include: { lights: true },
    });
    group?.lights.forEach((light: any) => {
      const element = light.id;
      const message = new SerialMessage(
        SerialMessageSource.SOCKETS,
        SerialMessageType.LIGHT_SET,
        element,
        stateInt,
      );
    });
  }
}
