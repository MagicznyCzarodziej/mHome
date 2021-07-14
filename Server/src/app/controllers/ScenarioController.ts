import { DateTime } from 'luxon';
import { Container } from 'typedi';
import * as schedule from 'node-schedule';
import { getSunrise, getSunset } from 'sunrise-sunset-js';

import {
  Scenario,
  ScenarioActionType,
  ScenarioConditionType,
  ScenarioEntryAction,
  ScenarioEntryCondition,
} from 'app/interfaces/Scenario';
import {
  SerialMessage,
  SerialMessageSource,
  SerialMessageType,
} from 'app/SerialCommunicator/SerialMessage';
import { database } from 'database/database';
import { StandardLogger } from 'app/utils/Logger';
import { ScenarioEntry } from 'app/interfaces/Scenario';
import { EventBus, SystemEvent } from 'app/EventBus';
import { SerialCommunicator } from 'app/SerialCommunicator/SerialCommunicator';

const EVERY_MINUTE = '* * * * *';

function findDependentScenarios(
  scenarios: Scenario[],
  condition: (condition: ScenarioEntryCondition) => Boolean,
) {
  return scenarios.filter((scenario) =>
    scenario.entries.some((entry) => entry.conditions.find(condition)),
  );
}

interface EventSubscription {
  [name: string]: (
    event: SystemEvent,
    condition: ScenarioEntryCondition,
  ) => Boolean;
}

export class ScenarioController {
  private activeScenarios: Scenario[] = [];
  private logger = new StandardLogger('ScenarioController');
  private serialCommunicator: SerialCommunicator;

  constructor() {
    this.serialCommunicator = Container.get(SerialCommunicator);
    this.loadActiveScenarios();

    // Reload scenarios on change
    EventBus.subscribe('SCENARIO', () => {
      this.loadActiveScenarios();
    });

    // Subscribe to elements states changes (temperatures, reeds, etc.)
    this.subscribeToEvents();

    // Process scenarios dependent on time every minute
    schedule.scheduleJob(EVERY_MINUTE, () => {
      const dependentScenarios = findDependentScenarios(
        this.activeScenarios,
        (condition: ScenarioEntryCondition) =>
          condition.type === ScenarioConditionType.TIME,
      );

      this.processScenarios(dependentScenarios);
    });
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

    this.logger.info(
      `Active scenarios (${activeScenarios.length}): [${activeScenarios
        .map((s) => '#' + s.id + ' - ' + s.name)
        .join(', ')}]`,
    );

    this.processScenarios(this.activeScenarios);
  }

  subscribeToEvents() {
    const events: EventSubscription = {
      REED: (event, condition) =>
        condition.type === ScenarioConditionType.REED &&
        condition.elementId === event.payload.elementId,
      TEMPERATURE: (event, condition) =>
        [
          ScenarioConditionType.TEMPERATURE_BELOW,
          ScenarioConditionType.TEMPERATURE_ABOVE,
        ].includes(condition.type) &&
        condition.elementId === event.payload.elementId,
    };

    Object.entries(events).forEach(([type, processingCondition]) => {
      EventBus.subscribe(type, (event: SystemEvent) => {
        const dependentScenarios = findDependentScenarios(
          this.activeScenarios,
          processingCondition.bind(null, event),
        );
        this.processScenarios(dependentScenarios);
      });
    });
  }

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
  async processEntry(scenario: Scenario, entry: ScenarioEntry) {
    const promises = entry.conditions.map(this.checkCondition);
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

  async checkCondition(condition: ScenarioEntryCondition) {
    switch (condition.type) {
      case ScenarioConditionType.LIGHT_STATE: {
        const light = await database.light.findFirst({
          where: { id: condition.elementId },
        });
        if (!light) return false;

        return light.state === condition.value;
      }
      case ScenarioConditionType.REED: {
        const reed = await database.reed.findFirst({
          where: { id: condition.elementId },
        });
        if (!reed) return false;

        return reed.state === condition.value;
      }
      case ScenarioConditionType.TEMPERATURE_BELOW: {
        const thermometer = await database.thermometer.findFirst({
          where: { id: condition.elementId },
        });
        if (!thermometer) return false;

        return thermometer.latestTemperature < condition.value;
      }
      case ScenarioConditionType.TEMPERATURE_ABOVE: {
        const thermometer = await database.thermometer.findFirst({
          where: { id: condition.elementId },
        });
        if (!thermometer) return false;

        return thermometer.latestTemperature > condition.value;
      }
      case ScenarioConditionType.TIME_BEFORE: {
        const nowDateTime = DateTime.now();
        const conditionDateTime = DateTime.fromFormat(
          condition.value as string,
          'HH:mm',
        );
        return nowDateTime < conditionDateTime;
      }
      case ScenarioConditionType.TIME_AFTER: {
        const nowDateTime = DateTime.now();
        const conditionDateTime = DateTime.fromFormat(
          condition.value as string,
          'HH:mm',
        );

        return nowDateTime > conditionDateTime;
      }
      case ScenarioConditionType.TIME: {
        const nowDateTime = DateTime.now();
        let conditionDateTime;

        switch (condition.value) {
          case 'SUNRISE': {
            const sunrise = getSunrise(51.236456, 22.523721);
            conditionDateTime = DateTime.fromJSDate(sunrise);
          }
          case 'SUNSET': {
            const sunset = getSunset(51.236456, 22.523721);
            conditionDateTime = DateTime.fromJSDate(sunset);
          }
          default: {
            conditionDateTime = DateTime.fromFormat(
              condition.value as string,
              'HH:mm',
            );
          }
        }

        const shouldExecute =
          conditionDateTime.hasSame(nowDateTime, 'hours') &&
          conditionDateTime.hasSame(nowDateTime, 'minutes');

        return shouldExecute;
      }
    }
  }

  async executeAction(action: ScenarioEntryAction) {
    switch (action.type) {
      case ScenarioActionType.SET_LIGHT: {
        const message = new SerialMessage(
          SerialMessageSource.SCENARIO,
          SerialMessageType.LIGHT_SET,
          action.id,
          1,
        );
        this.serialCommunicator.send(message);
        break;
      }
    }
  }
}
