import { Global, Inject, Module, OnApplicationShutdown } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Redis => {
        const client = new Redis(config.get('REDIS_URL'), {
          lazyConnect: true,
          retryStrategy: (times) => {
            if (times > 5) return null;

            return Math.min(times * 200, 2000);
          },
        });

        client.on('connect', () => console.log('[Redis] Connected'));
        client.on('error', (error) =>
          console.log('[Redis] Error', error.message),
        );

        client.connect().catch(() => {
          console.warn(
            '[Redis] Could not connect on startup, will retry on demand',
          );
        });

        return client;
      },
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  async onApplicationShutdown() {
    await this.redis.quit();

    console.log('[Redis] Connection closed');
  }
}
