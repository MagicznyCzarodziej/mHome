import { PrismaClient } from '@prisma/client';

const database = new PrismaClient();

// Logging middleware
database.$use(async (params, next) => {
  // console.log(params);
  //TODO
  return next(params);
});

database.$connect();
export { database };
