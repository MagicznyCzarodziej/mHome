import { Service } from 'typedi';
import { database } from 'database/database';

@Service()
export class GroupsRepository {
  async getAllGroups() {
    return await database.group.findMany();
  }

  async getGroup(id: string) {
    return await database.group.findUnique({
      where: {
        id,
      },
    });
  }

  async getGroupElements(groupId: string) {
    const lights = await database.light.findMany({
      where: {
        groupId,
      },
    });
    const thermometers = await database.thermometer.findMany({
      where: {
        groupId,
      },
    });
    const reeds = await database.reed.findMany({
      where: {
        groupId,
      },
    });
    const blinds = await database.blinds.findMany({
      where: {
        groupId,
      },
    });

    return {
      lights,
      thermometers,
      reeds,
      blinds,
    };
  }
}
