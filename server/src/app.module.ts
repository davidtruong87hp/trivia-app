import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './modules/redis/redis.module';
import { HealthModule } from './modules/health/health.module';
import { TriviaModule } from './modules/trivia/trivia.module';
import { QuizModule } from './modules/quiz/quiz.module';
import { SessionModule } from './modules/session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    RedisModule,
    SessionModule,
    HealthModule,
    TriviaModule,
    QuizModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
