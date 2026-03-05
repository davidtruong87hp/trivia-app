import { Injectable } from '@nestjs/common';
import { TriviaService } from '../trivia/trivia.service';
import { StartQuizDto } from 'src/dto/start-quiz.dto';
import { SessionService } from '../session/session.service';
import { AnswerDto } from 'src/dto/answer.dto';

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

  async submitAnswer(dto: AnswerDto) {
    const { correct, correctAnswer, session } =
      await this.sessionService.recordAnswer(
        dto.sessionId,
        dto.questionIndex,
        dto.answer,
      );

    return {
      correct,
      correctAnswer,
      score: session.score,
      total: session.total,
    };
  }

  async getResult(sessionId: string) {
    return this.sessionService.getResult(sessionId);
  }
}
