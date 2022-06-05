import { Inject, Service } from 'typedi';
import * as schedule from 'node-schedule';
import { EventBus } from '../EventBus/EventBus';
import { EventType, MHomeEvent } from '../EventBus/Events';
import {
  Scenario,
  ScenarioConditionType,
  ScenarioEntryCondition,
} from '../interfaces/Scenario';
import { ScenariosRepository } from '../repositories/ScenariosRepository';
import { Logger } from '../utils/Logger';
import { ScenariosProcessor } from './ScenariosProcessor';

const EVERY_MINUTE = '* * * * *';

type ProcessingCondition = (
  event: MHomeEvent,
  condition: ScenarioEntryCondition,
) => Boolean;

type EventSubscription = {
  [key in EventType]?: ProcessingCondition;
};

function findDependentScenarios(
  scenarios: Scenario[],
  condition: (condition: ScenarioEntryCondition) => Boolean,
) {
  return scenarios.filter((scenario) =>
    scenario.entries.some((entry) => entry.conditions.find(condition)),
  );
}

@Service()
export class ScenariosManager {
  @Logger('ScenariosManager')
  private readonly logger: Logger;

  @Inject(() => ScenariosProcessor)
  private readonly scenariosProcessor: ScenariosProcessor;

  @Inject(() => ScenariosRepository)
  private readonly scenariosRepository: ScenariosRepository;

  private activeScenarios: Scenario[] = [];

  constructor() {
    setImmediate(() => {
      this.loadActiveScenarios();
      this.subscribeToEvents();
    });

    // Reload scenarios if they change
    EventBus.subscribe(EventType.SCENARIO_UPDATE, () => {
      this.loadActiveScenarios();
    });

    // Process scenarios dependent on time every minute
    schedule.scheduleJob(EVERY_MINUTE, () => {
      const dependentScenarios = findDependentScenarios(
        this.activeScenarios,
        (condition: ScenarioEntryCondition) =>
          condition.type === ScenarioConditionType.TIME,
      );

      this.scenariosProcessor.processScenarios(dependentScenarios);
    });
  }

  async loadActiveScenarios() {
    const activeScenarios = await this.scenariosRepository.getActiveScenarios();

    this.activeScenarios = activeScenarios.map((scenario) => ({
      ...scenario,
      entries: JSON.parse(scenario.entries),
    }));

    this.logger.info(
      `Active scenarios (${activeScenarios.length}): [${activeScenarios
        .map((s) => '#' + s.id + ' - ' + s.name)
        .join(', ')}]`,
    );

    this.scenariosProcessor.processScenarios(this.activeScenarios);
  }

  subscribeToEvents() {
    const events: EventSubscription = {
      [EventType.REED_UPDATE]: (event, condition) =>
        condition.type === ScenarioConditionType.REED &&
        condition.elementId === event.payload.id,
      [EventType.THERMOMETER_NEW_TEMPERATURE]: (event, condition) =>
        [
          ScenarioConditionType.TEMPERATURE_BELOW,
          ScenarioConditionType.TEMPERATURE_ABOVE,
        ].includes(condition.type) && condition.elementId === event.payload.id,
    };

    Object.entries(events).forEach(
      ([type, processingCondition]: [EventType, ProcessingCondition]) => {
        EventBus.subscribe(type, (event) => {
          const dependentScenarios = findDependentScenarios(
            this.activeScenarios,
            (condition) => processingCondition(event, condition),
          );

          this.scenariosProcessor.processScenarios(dependentScenarios);
        });
      },
    );
  }
}
