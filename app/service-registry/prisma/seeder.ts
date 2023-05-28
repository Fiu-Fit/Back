import { LoggerFactory } from '@fiu-fit/common';
import { PrismaClient } from '@prisma/client';
import { ServiceName, generateKey } from '../shared/services';

const prisma = new PrismaClient();

async function main() {
  await prisma.service.upsert({
    where:  { id: 1 },
    update: {},
    create: {
      apiKey:      generateKey(),
      name:        ServiceName.Workout,
      url:         process.env.WORKOUT_SERVICE_URL || 'http://localhost:8083',
      description: 'Workout service'
    }
  });

  await prisma.service.upsert({
    where:  { id: 2 },
    update: {},
    create: {
      apiKey:      generateKey(),
      name:        ServiceName.User,
      url:         process.env.USER_SERVICE_URL || 'http://localhost:8082',
      description: 'User service'
    }
  });

  await prisma.service.upsert({
    where:  { id: 3 },
    update: {},
    create: {
      apiKey:      generateKey(),
      name:        ServiceName.Progress,
      url:         process.env.PROGRESS_SERVICE_URL || 'http://localhost:8084',
      description: 'Progress service'
    }
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    const Logger = LoggerFactory('seeder');
    Logger.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
