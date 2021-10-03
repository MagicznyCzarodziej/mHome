import { DateTime } from 'luxon';
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import {
  ScenarioConditionType,
  ScenarioEntryCondition,
} from 'app/interfaces/Scenario';
import { LightsRepository } from 'app/repositories/LightsRepository';
import { Inject, Service } from 'typedi';
import { ThermometersRepository } from 'app/repositories/ThermometersRepository';
import { ReedsRepository } from 'app/repositories/ReedsRepository';
import { BlindsRepository } from 'app/repositories/BlindsRepository';

// Lublin
const latitude = 51.236456;
const longitude = 22.523721;

@Service()
export class ConditionChecker {
  @Inject(() => LightsRepository)
  private readonly lightsRepository: LightsRepository;
  @Inject(() => ThermometersRepository)
  private readonly thermometersRepository: ThermometersRepository;
  @Inject(() => ReedsRepository)
  private readonly reedsRepository: ReedsRepository;
  @Inject(() => BlindsRepository)
  private readonly blindsRepository: BlindsRepository;

  async checkCondition(condition: ScenarioEntryCondition) {
    switch (condition.type) {
      case ScenarioConditionType.LIGHT_STATE: {
        const light = await this.lightsRepository.getLight(
          condition.elementId!,
        );
        if (!light) return false;

        return light.state === condition.value;
      }
      case ScenarioConditionType.REED: {
        const reed = await this.reedsRepository.getReed(condition.elementId!);
        if (!reed) return false;

        return reed.state === condition.value;
      }
      case ScenarioConditionType.TEMPERATURE_BELOW: {
        const thermometer = await this.thermometersRepository.getThermometer(
          condition.elementId!,
        );
        if (!thermometer) return false;

        return thermometer.latestTemperature < condition.value;
      }
      case ScenarioConditionType.TEMPERATURE_ABOVE: {
        const thermometer = await this.thermometersRepository.getThermometer(
          condition.elementId!,
        );
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
            const sunrise = getSunrise(latitude, longitude);
            conditionDateTime = DateTime.fromJSDate(sunrise);
          }
          case 'SUNSET': {
            const sunset = getSunset(latitude, longitude);
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
}
