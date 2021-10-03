import { EventBus } from './EventBus/EventBus';
import { LightsRepository } from './repositories/LightsRepository';
import { ThermometersRepository } from './repositories/ThermometersRepository';
import { Inject, Service } from 'typedi';
import { ReedsRepository } from './repositories/ReedsRepository';
import { Events, EventType } from 'app/EventBus/Events';
import { BlindsRepository } from 'app/repositories/BlindsRepository';

@Service()
export class Persistor {
  @Inject(() => LightsRepository)
  private readonly lightsRepository: LightsRepository;
  @Inject(() => ThermometersRepository)
  private readonly thermometersRepository: ThermometersRepository;
  @Inject(() => ReedsRepository)
  private readonly reedsRepository: ReedsRepository;
  @Inject(() => BlindsRepository)
  private readonly blindsRepository: BlindsRepository;

  constructor() {
    this.handleLights();
    this.handleThermometers();
    this.handleReeds();
    this.handleBlinds();
  }

  handleLights() {
    EventBus.subscribe<Events.LightUpdate>(
      EventType.LIGHT_UPDATE,
      ({ payload }) => {
        this.lightsRepository.setLight(payload.id, payload.state);
      },
    );
  }

  handleThermometers() {
    EventBus.subscribe<Events.NewTemperature>(
      EventType.THERMOMETER_NEW_TEMPERATURE,
      ({ payload }) => {
        this.thermometersRepository.addTemperature(
          payload.thermometerId,
          payload.temperature,
        );
      },
    );
  }

  handleReeds() {
    EventBus.subscribe<Events.ReedUpdate>(
      EventType.REED_UPDATE,
      ({ payload }) => {
        this.reedsRepository.setReed(payload.id, payload.state);
      },
    );
  }

  handleBlinds() {
    EventBus.subscribe<Events.BlindUpdate>(
      EventType.BLIND_UPDATE,
      ({ payload }) => {
        this.blindsRepository.setBlind(
          payload.id,
          payload.status,
          payload.position,
        );
      },
    );
  }
}
