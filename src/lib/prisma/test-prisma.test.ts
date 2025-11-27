import { prisma } from './prisma';

describe('Database Connection', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('should connect to the database', async () => {
    await expect(prisma.$queryRaw`SELECT 1`).resolves.toBeTruthy();
  });

  test('should fetch users', async () => {
    const users = await prisma.user.findMany({
      take: 5,
      select: { id: true },
    });

    expect(Array.isArray(users)).toBe(true);
  });
});
