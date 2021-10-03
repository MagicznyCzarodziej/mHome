import { SerialCommunicator } from 'app/SerialCommunicator/SerialCommunicator';
import {
  SerialMessage,
  SerialMessageSource,
  SerialMessageType,
} from './SerialCommunicator/SerialMessage';
import { EventBus } from './EventBus/EventBus';
import { Container } from 'typedi';
import { decodeTemperature } from './SerialCommunicator/utils';
import { Events, EventType } from './EventBus/Events';
import { LightsRepository } from 'app/repositories/LightsRepository';
import { SwitchState } from './utils/SwitchState';
import { GroupsRepository } from 'app/repositories/GroupsRepository';

export class Connector {
  constructor() {
    const communicator = Container.get(SerialCommunicator);
    communicator.subscribe(this);
    this.handleEvents();
  }

  handleEvents() {
    const communicator = Container.get(SerialCommunicator);

    EventBus.subscribe(EventType.LIGHT_SET, ({ payload }) => {
      communicator.send(
        new SerialMessage(
          SerialMessageSource.SOCKETS,
          SerialMessageType.LIGHT_SET,
          payload.id,
          payload.state === 'ON' ? 1 : 0,
        ),
      );
    });

    EventBus.subscribe(EventType.LIGHTS_SET_GROUP, async ({ payload }) => {
      const communicator = Container.get(SerialCommunicator);
      const lightsRepository = Container.get(LightsRepository);

      const stateInt = SwitchState.parse(payload.state).toInt();
      const lights = await lightsRepository.getGroupLights(payload.groupId);
      lights.forEach((light) => {
        const element = light.id;
        const message = new SerialMessage(
          SerialMessageSource.SOCKETS,
          SerialMessageType.LIGHT_SET,
          element,
          stateInt,
        );
        communicator.send(message);
      });
    });

    EventBus.subscribe(EventType.LIGHTS_SET_INSIDE, async ({ payload }) => {
      const lightsRepository = Container.get(LightsRepository);

      const state = SwitchState.parse(payload.state).toInt();
      const lights = await lightsRepository.getInsideLights();
      lights.forEach((light) => {
        const element = light.id;
        const message = new SerialMessage(
          SerialMessageSource.SOCKETS,
          SerialMessageType.LIGHT_SET,
          element,
          state,
        );
        communicator.send(message);
      });
    });

    EventBus.subscribe(EventType.BLIND_SET, async ({ payload }) => {
      const message = new SerialMessage(
        SerialMessageSource.SOCKETS,
        SerialMessageType.BLIND_SET,
        payload.id,
        payload.position,
      );
      communicator.send(message);
    });
  }

  handleSerialMessage(message: SerialMessage) {
    switch (message.type) {
      case SerialMessageType.LIGHT_RESPONSE:
        EventBus.publish<Events.LightUpdate>(EventType.LIGHT_UPDATE, {
          id: message.element,
          state: message.value ? 'ON' : 'OFF',
        });
        break;

      case SerialMessageType.THERMOMETER_RESPONSE:
        const temperature = decodeTemperature(message.value, message.auxilary);
        EventBus.publish<Events.NewTemperature>(
          EventType.THERMOMETER_NEW_TEMPERATURE,
          {
            thermometerId: message.element,
            temperature,
          },
        );
        break;

      case SerialMessageType.REED_RESPONSE:
        const state = message.value === 1 ? 'CLOSED' : 'OPEN';
        EventBus.publish<Events.ReedUpdate>(EventType.REED_UPDATE, {
          id: message.element,
          state,
        });
        break;

      case SerialMessageType.BLIND_RESPONSE:
        const status =
          {
            0: 'IDLE',
            1: 'MOVING_UP',
            2: 'MOVING_DOWN',
          }[message.auxilary] || 'IDLE';
        EventBus.publish<Events.BlindUpdate>(EventType.BLIND_UPDATE, {
          id: message.element,
          status,
          position: message.value,
        });
        break;
    }
  }
}
