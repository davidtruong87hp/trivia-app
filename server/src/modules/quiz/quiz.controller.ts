import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { StartQuizDto } from 'src/dto/start-quiz.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('categories')
  getCategories() {
    return this.quizService.getCategories();
  }

  @Post('start')
  startQuiz(@Body() dto: StartQuizDto) {
    return this.quizService.startQuiz(dto);
  }
}
