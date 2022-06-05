import { OnOff } from 'app/interfaces/OnOff';
import {
  Scenario,
  ScenarioActionType,
  ScenarioEntry,
  ScenarioEntryAction,
} from 'app/interfaces/Scenario';
import {
  SerialMessage,
  SerialMessageSource,
  SerialMessageType,
} from 'app/SerialCommunicator/SerialMessage';
import { Logger } from 'app/utils/Logger';
import { SwitchState } from 'app/utils/SwitchState';
import { Inject, Service } from 'typedi';
import { SerialCommunicator } from './../SerialCommunicator/SerialCommunicator';
import { ConditionChecker } from './ConditionChecker';

@Service()
export class ScenariosProcessor {
  @Logger('ScenariosProcessor')
  private readonly logger: Logger;

  @Inject(() => ConditionChecker)
  private readonly conditionChecker: ConditionChecker;

  @Inject(() => SerialCommunicator)
  private readonly communicator: SerialCommunicator;

  /**
   * Finds scenario's root entry and starts processing
   * @param scenarios Scenarios to process
   */
  processScenarios(scenarios: Scenario[]) {
    scenarios.forEach(async (scenario) => {
      this.logger.info(
        `[#${scenario.id} - ${scenario.name}] Processing scenario...`,
      );
      try {
        const rootEntry = scenario.entries.find(
          (entry) => entry.parentEntry === null,
        );
        if (!rootEntry) {
          throw new Error('Root entry not found');
        }

        await this.processEntry(scenario, rootEntry);
        this.logger.info(
          `[#${scenario.id} - ${scenario.name}] Scenario processed`,
        );
      } catch (error) {
        this.logger.error(
          `[#${scenario.id} - ${scenario.name}] Processing failed`,
        );
        this.logger.error(`[X][#${scenario.id} - ${scenario.name}] ${error}`);
      }
    });
  }

  /**
   * Recursively checks conditions and executes actions
   * @param scenario Scenario to process
   * @param entry Entry to process
   */
  private async processEntry(scenario: Scenario, entry: ScenarioEntry) {
    const promises = entry.conditions.map((condition) =>
      this.conditionChecker.checkCondition(condition),
    );
    const allConditionsPassed = (await Promise.all(promises)).every(Boolean);

    if (allConditionsPassed) {
      this.logger.info(
        `[#${scenario.id} - ${scenario.name}] Entry #${entry.id} Conditions (${entry.conditions.length}) passed`,
      );
      entry.actions.forEach((action) => {
        this.executeAction(action);
      });

      const nestedEntries = scenario.entries.filter(
        (nestedEntry) => nestedEntry.parentEntry === entry.id,
      );

      nestedEntries.forEach((nestedEntry) =>
        this.processEntry(scenario, nestedEntry),
      );
    }
  }

  private async executeAction(action: ScenarioEntryAction) {
    switch (action.type) {
      case ScenarioActionType.SET_LIGHT: {
        const state = SwitchState.parse(action.payload!.value as OnOff).toInt();
        const message = new SerialMessage(
          SerialMessageSource.SCENARIO,
          SerialMessageType.LIGHT_SET,
          action.payload?.elementId,
          state,
        );
        this.communicator.send(message);
        break;
      }
      case ScenarioActionType.SET_BLIND: {
        const message = new SerialMessage(
          SerialMessageSource.SCENARIO,
          SerialMessageType.BLIND_SET,
          action.payload!.elementId,
          action.payload!.value as number,
        );
        this.communicator.send(message);
        break;
      }
    }
  }
}
