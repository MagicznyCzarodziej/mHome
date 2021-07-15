import { Prisma, PrismaClient } from '@prisma/client';
import { EventBus } from 'app/EventBus';

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
    EventBus.pushEvent({
      type: 'SCENARIO',
      payload: null,
    });
  }

  return result;
});

database.$connect();
export { database };
