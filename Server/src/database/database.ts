import { PrismaClient } from '@prisma/client';

const database = new PrismaClient();
database.$connect();
export { database };
