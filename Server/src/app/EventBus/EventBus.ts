import { Logger } from 'app/utils/Logger';
import { Container } from 'typedi';
import { EventType, MHomeEvent, PublishMHomeEvent } from './Events';
import { SecurityRepository } from 'app/repositories/SecurityRepository';

type NewMHomeEvent = Omit<MHomeEvent, 'timestamp'>;

interface Observer {
  type: any;
  callback: (data: any) => void;
}

class Bus {
  @Logger('EventBus')
  private logger: Logger;

  private events: MHomeEvent[] = [];
  private observers: Observer[] = [];
  private securityRepository = Container.get(SecurityRepository);

  public publish<E extends PublishMHomeEvent>(
    type: E['type'],
    payload: E['payload'],
  ) {
    const newEvent: MHomeEvent = {
      type,
      payload,
      timestamp: new Date(),
    };
    this.events.push(newEvent);

    this.logger.info(`[${newEvent.type}] ${JSON.stringify(newEvent.payload)}`);

    this.observers.forEach((observer) => {
      if (observer.type === newEvent.type) observer.callback(newEvent);
    });

    this.securityRepository.saveHistoryEvent(type, '', payload);
  }
  public subscribe<E extends MHomeEvent>(
    type: E['type'],
    callback: (event: E) => void,
  ) {
    this.observers.push({
      type,
      callback,
    });
  }
}

const showLogs = process.argv.includes('--log-event-bus');

export const EventBus = Container.get(Bus);
