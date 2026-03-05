import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { ClientQuestion, QuizResult, SessionData } from 'src/common/types';

@Injectable()
export class SessionService {
  constructor(
    private readonly configService: ConfigService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  private key(sessionId: string): string {
    return `quiz:session:${sessionId}`;
  }

  async create(
    questions: ClientQuestion[],
    correctAnswers: string[],
  ): Promise<string> {
    const sessionId = uuidv4();

    const session: SessionData = {
      correctAnswers,
      questions,
      userAnswers: new Array(questions.length).fill(null),
      score: 0,
      total: questions.length,
      createdAt: Date.now(),
    };

    await this.redis.set(
      this.key(sessionId),
      JSON.stringify(session),
      'EX',
      this.configService.get('SESSION_TTL_TIME', 300),
    );

    return sessionId;
  }

  async get(sessionId: string): Promise<SessionData> {
    const raw = await this.redis.get(this.key(sessionId));

    if (!raw) throw new NotFoundException('Session not found or expired');

    return JSON.parse(raw) as SessionData;
  }

  async delete(sessionId: string): Promise<void> {
    await this.redis.del(this.key(sessionId));
  }

  async recordAnswer(
    sessionId: string,
    questionIndex: number,
    answer: string,
  ): Promise<{
    correct: boolean;
    correctAnswer: string;
    session: SessionData;
  }> {
    const session = await this.get(sessionId);
    const allAnswered = session.userAnswers.every((a) => a !== null);

    if (allAnswered) {
      throw new ForbiddenException('Quiz already completed');
    }

    // Don't allow re-answering - return existing result instead
    if (session.userAnswers[questionIndex] !== null) {
      return {
        correct:
          session.userAnswers[questionIndex] ===
          session.correctAnswers[questionIndex],
        correctAnswer: session.correctAnswers[questionIndex],
        session,
      };
    }

    const correctAnswer = session.correctAnswers[questionIndex];
    const correct = answer === correctAnswer;

    session.userAnswers[questionIndex] = answer;
    session.score += correct ? 1 : 0;

    // KEEPTTL preserves the original expiry
    await this.redis.set(
      this.key(sessionId),
      JSON.stringify(session),
      'KEEPTTL',
    );

    return {
      correct,
      correctAnswer,
      session,
    };
  }

  async getResult(sessionId: string): Promise<QuizResult> {
    const session = await this.get(sessionId);

    const unanswered = session.userAnswers.filter(
      (answer) => answer === null,
    ).length;

    if (unanswered > 0) {
      throw new ForbiddenException(
        `Quiz not completed - ${unanswered} question(s) still unanswered`,
      );
    }

    const result: QuizResult = {
      score: session.score,
      total: session.total,
      percentage: Math.round((session.score / session.total) * 100),
      questions: session.questions.map((q, index) => ({
        question: q.question,
        yourAnswer: session.userAnswers[index],
        correctAnswer: session.correctAnswers[index],
        correct: session.userAnswers[index] === session.correctAnswers[index],
        difficulty: q.difficulty,
        category: q.category,
      })),
    };

    await this.delete(sessionId);

    return result;
  }
}
