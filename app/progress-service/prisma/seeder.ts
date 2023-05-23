import { LoggerFactory } from '@fiu-fit/common';
import { PrismaClient, Unit } from '@prisma/client';

const prisma = new PrismaClient();
async function main() {
  await prisma.progressMetric.upsert({
    where:  { id: 1 },
    update: {},
    create: {
      burntCalories: 100,
      value:         10,
      unit:          Unit.KILOGRAMS,
      exerciseId:    '64553744c6e2840fd63b190c',
      userId:        1,
      updatedAt:     new Date('2024-04-01T00:00:00.000Z')
    }
  });

  await prisma.progressMetric.upsert({
    where:  { id: 2 },
    update: {},
    create: {
      burntCalories: 200,
      value:         500,
      unit:          Unit.SECONDS,
      exerciseId:    '645536d6c6e2840fd63b1904',
      userId:        1,
      updatedAt:     new Date('2022-04-01T00:00:00.000Z')
    }
  });

  await prisma.progressMetric.upsert({
    where:  { id: 3 },
    update: {},
    create: {
      burntCalories: 100,
      value:         100,
      unit:          Unit.METERS,
      exerciseId:    '64553721c6e2840fd63b1908',
      userId:        1,
      updatedAt:     new Date('2021-04-01T00:00:00.000Z')
    }
  });

  await prisma.progressMetric.upsert({
    where:  { id: 4 },
    update: {},
    create: {
      burntCalories: 500,
      value:         100,
      unit:          Unit.SECONDS,
      exerciseId:    '64553734c6e2840fd63b190a',
      userId:        1,
      updatedAt:     new Date('2020-04-01T00:00:00.000Z')
    }
  });

  await prisma.goal.upsert({
    where:  { id: 1 },
    update: {},
    create: {
      title:       'Run 10 km',
      description: 'Run 10 km in 1 week',
      userId:      1,
      targetValue: 10,
      deadline:    new Date('2023-05-13T00:00:00.000Z'),
      exerciseId:  '64553734c6e2840fd63b190a'
    }
  });

  await prisma.goal.upsert({
    where:  { id: 2 },
    update: {},
    create: {
      title:       'Complete 100 front squats',
      description: 'Do 100 front squats in 1 week',
      userId:      1,
      targetValue: 100,
      deadline:    new Date('2023-05-13T00:00:00.000Z'),
      exerciseId:  '64553734c6e2840fd63b190a'
    }
  });

  await prisma.goal.upsert({
    where:  { id: 3 },
    update: {},
    create: {
      title:       'Complete 100 arm flexions',
      description: 'Do 100 flexions in 1 week',
      userId:      2,
      targetValue: 100,
      deadline:    new Date('2023-05-13T00:00:00.000Z'),
      exerciseId:  '64553734c6e2840fd63b190a'
    }
  });

  await prisma.goal.upsert({
    where:  { id: 4 },
    update: {},
    create: {
      title:       'Complete 200 abs',
      description: 'Do 200 abs in 1 week',
      userId:      2,
      targetValue: 200,
      deadline:    new Date('2023-05-13T00:00:00.000Z'),
      exerciseId:  '64553734c6e2840fd63b190a'
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
