import { Module } from '@nestjs/common';
import { TriviaModule } from '../trivia/trivia.module';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';

@Module({
  imports: [TriviaModule],
  providers: [QuizService],
  exports: [QuizService],
  controllers: [QuizController],
})
export class QuizModule {}
