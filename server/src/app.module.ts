import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './modules/redis/redis.module';
import { HealthModule } from './modules/health/health.module';
import { TriviaModule } from './modules/trivia/trivia.module';
import { QuizModule } from './modules/quiz/quiz.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    HealthModule,
    TriviaModule,
    QuizModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
