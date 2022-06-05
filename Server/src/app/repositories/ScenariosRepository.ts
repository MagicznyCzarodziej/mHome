import { Service } from 'typedi';
import { database } from 'database/database';

@Service()
export class ScenariosRepository {
  async getAllScenarios() {
    return await database.scenario.findMany({
      // Skip entries
      select: {
        id: true,
        name: true,
        description: true,
        active: true,
      },
    });
  }

  async getActiveScenarios() {
    return await database.scenario.findMany({
      where: {
        active: true,
      },
    });
  }

  async getScenario(id: number, parseEntries: boolean = false) {
    const scenario = await database.scenario.findUnique({
      where: {
        id,
      },
    });

    if (parseEntries && scenario !== null) {
      const entries = JSON.parse(scenario?.entries);
      return {
        ...scenario,
        entries,
      };
    }

    return scenario;
  }

  async createScenario(
    name: string,
    description: string,
    active: boolean,
    entries: string,
  ) {
    return await database.scenario.create({
      data: {
        name,
        description,
        active,
        entries,
      },
    });
  }

  async deleteScenario(id: number) {
    return await database.scenario.delete({
      where: {
        id,
      },
    });
  }

  async editScenario(id: number, data: any) {
    return await database.scenario.update({
      where: {
        id,
      },
      data,
    });
  }
}
