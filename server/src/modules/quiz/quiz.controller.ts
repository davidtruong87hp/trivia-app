import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { StartQuizDto } from 'src/dto/start-quiz.dto';
import { AnswerDto } from 'src/dto/answer.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('categories')
  getCategories() {
    return this.quizService.getCategories();
  }

  @Post('start')
  @HttpCode(HttpStatus.OK)
  startQuiz(@Body() dto: StartQuizDto) {
    return this.quizService.startQuiz(dto);
  }

  @Post('answer')
  @HttpCode(HttpStatus.OK)
  submitAnswer(@Body() dto: AnswerDto) {
    return this.quizService.submitAnswer(dto);
  }

  @Get('result/:sessionId')
  getResult(@Param('sessionId', ParseUUIDPipe) sessionId: string) {
    return this.quizService.getResult(sessionId);
  }

  @Delete('session/:sessionId')
  deleteSession(@Param('sessionId', ParseUUIDPipe) sessionId: string) {
    return this.quizService.deleteSession(sessionId);
  }
}
