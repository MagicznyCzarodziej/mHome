import { Prisma, PrismaClient } from '@prisma/client';
import { EventBus } from 'app/EventBus/EventBus';
import { Events, EventType } from 'app/EventBus/Events';

const database = new PrismaClient();

// Logging middleware
database.$use(async (params, next) => {
  // console.log(params);
  //TODO
  return next(params);
});

// Trigger scenarios reloading when updated
database.$use(async (params, next) => {
  const result = await next(params);

  const triggerActions: Prisma.PrismaAction[] = [
    'create',
    'createMany',
    'update',
    'updateMany',
    'delete',
    'deleteMany',
    'upsert',
  ];
  if (params.model === 'Scenario' && triggerActions.includes(params.action)) {
    EventBus.publish(EventType.SCENARIO_UPDATE, {
      _info: 'This event is emmited from database trigger',
    });
  }

  return result;
});

database.$connect();
export { database };
