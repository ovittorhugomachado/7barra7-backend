import redisClient, { redisAvailable } from '../redis';

describe('Redis Connection', () => {
  beforeAll(async () => {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    await new Promise((resolve) => {
      if (redisAvailable) {
        resolve(true);
      } else {
        const checkConnection = () => {
          if (redisAvailable) {
            resolve(true);
          } else {
            setTimeout(checkConnection, 100);
          }
        };
        checkConnection();
      }
    });
  });

  afterAll(async () => {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
  });

  afterEach(async () => {
    // Limpar dados de teste
    await redisClient.del('test');
  });

  test('should connect to Redis', () => {
    expect(redisAvailable).toBe(true);
    expect(redisClient.isOpen).toBe(true);
  });

  test('should set and get values', async () => {
    await redisClient.set('test', 'value');
    const result = await redisClient.get('test');
    expect(result).toBe('value');
  });

  test('should handle non-existent keys', async () => {
    const result = await redisClient.get('non-existent-key');
    expect(result).toBeNull();
  });
});