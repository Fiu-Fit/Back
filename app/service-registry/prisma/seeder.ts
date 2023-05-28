import { LoggerFactory } from '@fiu-fit/common';
import { PrismaClient } from '@prisma/client';
import { generateApiKey } from 'generate-api-key';
import { ServiceName } from '../shared/services';

const prisma = new PrismaClient();

function generateKey(): string {
  return generateApiKey() as string;
}
async function main() {
  await prisma.services.upsert({
    where:  { id: 1 },
    update: {},
    create: {
      apiKey: generateKey(),
      name:   ServiceName.Workout
    }
  });

  await prisma.services.upsert({
    where:  { id: 2 },
    update: {},
    create: {
      apiKey: generateKey(),
      name:   ServiceName.User
    }
  });

  await prisma.services.upsert({
    where:  { id: 3 },
    update: {},
    create: {
      apiKey: generateKey(),
      name:   ServiceName.Progress
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
