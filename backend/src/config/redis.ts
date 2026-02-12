import Redis from 'ioredis';
import config from './index';

let redis: Redis | null = null;

// Only connect to Redis if REDIS_ENABLED is explicitly set to 'true'
if (process.env.REDIS_ENABLED === 'true') {
  redis = new Redis(config.redis.url, {
    retryStrategy: (times: number) => {
      if (times > 3) {
        console.log('⚠️  Redis connection failed after 3 attempts. Running without Redis.');
        return null; // Stop retrying
      }
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: 3,
  });

  redis.on('connect', () => {
    console.log('✅ Redis connected successfully');
  });

  redis.on('error', (err: Error) => {
    console.error('❌ Redis connection error:', err.message);
  });
} else {
  console.log('ℹ️  Redis disabled. Set REDIS_ENABLED=true in .env to enable caching.');
}

export default redis;
