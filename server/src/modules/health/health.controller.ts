import { Controller, Get, Inject } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.module';

@Controller('health')
export class HealthController {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {}

  @Get()
  async check() {
    try {
      await this.redis.ping();

      return {
        status: 'ok',
        redis: 'connected',
      };
    } catch {
      return {
        status: 'degraded',
        redis: 'disconnected',
      };
    }
  }
}
