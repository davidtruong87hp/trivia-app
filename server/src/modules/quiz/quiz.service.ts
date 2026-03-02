import { Injectable } from '@nestjs/common';
import { TriviaService } from '../trivia/trivia.service';
import { StartQuizDto } from 'src/dto/start-quiz.dto';

@Injectable()
export class QuizService {
  constructor(private readonly triviaService: TriviaService) {}

  async getCategories() {
    const categories = await this.triviaService.fetchCategories();

    return { categories };
  }

  async startQuiz(dto: StartQuizDto) {
    const { clientQuestions } = await this.triviaService.fetchQuestions(dto);

    return { questions: clientQuestions };
  }
}
