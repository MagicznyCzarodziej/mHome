import { database } from 'database/database';
import {
  Scenario,
  ScenarioEntryAction,
  ScenarioEntryCondition,
} from 'app/interfaces/Scenario';
import { StandardLogger } from 'app/utils/Logger';
import { Container } from 'typedi/Container';
import { SerialCommunicator } from 'app/SerialCommunicator/SerialCommunicator';
import {
  SerialMessage,
  SerialMessageType,
} from 'app/SerialCommunicator/SerialMessage';

export class ScenarioController {
  private activeScenarios: Scenario[] = [];
  private logger = new StandardLogger('ScenarioController');

  constructor() {
    this.loadActiveScenarios();
  }

  async loadActiveScenarios() {
    const activeScenarios = await database.scenario.findMany({
      where: {
        active: true,
      },
    });

    this.activeScenarios = activeScenarios.map((scenario) => ({
      ...scenario,
      entries: JSON.parse(scenario.entries),
    }));

    this.doSomething();
  }

  doSomething() {
    this.activeScenarios.forEach((scenario) => {
      this.logger.info(`Checking scenario #${scenario.id} - ${scenario.name}`);
      const rootEntry = scenario.entries.find(
        (entry) => entry.parentEntry === null,
      );
      if (!rootEntry) return; // ??
      if (rootEntry.conditions.every(this.checkCondition)) {
        this.logger.info(
          `#${scenario.id} - ${scenario.name}: Root conditions passed`,
        );
        rootEntry.actions.forEach((action) => {
          this.executeAction(action);
        });
      }
    });
  }

  async checkCondition(condition: ScenarioEntryCondition) {
    switch (condition.type) {
      case 'REED': {
        const reed = await database.reed.findFirst({
          where: { id: condition.elementId },
        });
        if (!reed) return false;
        return reed.state === condition.value;
      }
    }
  }

  async executeAction(action: ScenarioEntryAction) {
    switch (action.type) {
      case 'SET_LIGHT': {
        const serialCommunicator = Container.get(SerialCommunicator);
        //  const message = new SerialMessage(SerialMessageType.LIGHT_SET, action.payload.elementId,action.payload.value )
        const message = new SerialMessage(
          SerialMessageType.LIGHT_SET,
          action.id,
          1,
        );
        serialCommunicator.send(message);
      }
    }
  }
}
