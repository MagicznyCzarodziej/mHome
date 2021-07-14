import { Logger, StandardLogger } from 'app/utils/Logger';

export interface SystemEvent {
  timestamp: Date;
  type: string;
  payload: any;
}

type NewSystemEvent = Omit<SystemEvent, 'timestamp'>;

interface Observer {
  type: string;
  callback: Function;
}

class Bus {
  private events: SystemEvent[] = [];
  private observers: Observer[] = [];

  constructor(private logger: Logger) {}

  public pushEvent(event: NewSystemEvent) {
    const newEvent = {
      ...event,
      timestamp: new Date(),
    };
    this.events.push(newEvent);

    this.logger.info(`[${newEvent.type}] ${JSON.stringify(newEvent.payload)}`);

    this.observers.forEach((observer) => {
      if (observer.type === newEvent.type) observer.callback(newEvent);
    });
  }
  public subscribe(type: string, callback: Function) {
    this.observers.push({
      type,
      callback,
    });
  }
}

const showLogs = process.argv.includes('--log-event-bus');

export const EventBus = new Bus(new StandardLogger('EventBus', !showLogs));
