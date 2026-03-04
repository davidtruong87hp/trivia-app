import { Injectable } from '@nestjs/common';
import { TriviaService } from '../trivia/trivia.service';
import { StartQuizDto } from 'src/dto/start-quiz.dto';
import { SessionService } from '../session/session.service';

@Injectable()
export class QuizService {
  constructor(
    private readonly triviaService: TriviaService,
    private readonly sessionService: SessionService,
  ) {}

  async getCategories() {
    const categories = await this.triviaService.fetchCategories();

    return { categories };
  }

  async startQuiz(dto: StartQuizDto) {
    const { clientQuestions, correctAnswers } =
      await this.triviaService.fetchQuestions(dto);

    const sessionId = await this.sessionService.create(
      clientQuestions,
      correctAnswers,
    );

    return {
      questions: clientQuestions,
      sessionId,
      total: clientQuestions.length,
    };
  }

  async deleteSession(sessionId: string) {
    await this.sessionService.delete(sessionId);

    return { message: 'Session deleted' };
  }
}
