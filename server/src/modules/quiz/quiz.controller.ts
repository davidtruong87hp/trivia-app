import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
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

  @Delete('session/:sessionId')
  deleteSession(@Param('sessionId', ParseUUIDPipe) sessionId: string) {
    return this.quizService.deleteSession(sessionId);
  }
}
