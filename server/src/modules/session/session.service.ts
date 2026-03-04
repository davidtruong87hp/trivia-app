import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { ClientQuestion, SessionData } from 'src/common/types';

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
}
