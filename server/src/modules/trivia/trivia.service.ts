import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, map } from 'rxjs';
import {
  ClientQuestion,
  OpenTDBCategoryResponse,
  OpenTDBQuestion,
  OpenTDBResponse,
} from 'src/common/types';

const RESPONSE_CODES: Record<number, string> = {
  1: 'No results — not enough questions for your query',
  2: 'Invalid parameter',
  3: 'Token not found',
  4: 'Token empty — all questions already retrieved',
  5: 'Rate limit hit — wait 5 seconds and try again',
};

export interface FetchQuestionsParams {
  amount: number;
  category?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  type?: 'multiple' | 'boolean';
}

export interface ProcessedQuestions {
  clientQuestions: ClientQuestion[];
  correctAnswers: string[];
}

@Injectable()
export class TriviaService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async fetchQuestions(
    params: FetchQuestionsParams,
  ): Promise<ProcessedQuestions> {
    const { amount, category, difficulty, type } = params;

    const query: Record<string, string | number> = { amount };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (type) query.type = type;

    try {
      const { data } = await firstValueFrom(
        this.httpService
          .get<OpenTDBResponse>(this.configService.get('OPENTDB_URL'), {
            params: query,
          })
          .pipe(
            catchError((error: AxiosError) => {
              throw new BadGatewayException(
                `Failed to reach OpenTDB: ${error.message}`,
              );
            }),
          ),
      );

      if (data.response_code !== 0) {
        throw new BadGatewayException(
          RESPONSE_CODES[data.response_code] ||
            `OpenTDB error code ${data.response_code}`,
        );
      }

      if (!data.results?.length) {
        throw new BadGatewayException('No questions returned from OpenTDB');
      }

      return this.processQuestions(data.results);
    } catch (error: any) {
      if (error instanceof BadGatewayException) throw error;

      throw new BadGatewayException(
        `Failed to reach OpenTDB: ${error.message}`,
      );
    }
  }

  async fetchCategories(): Promise<Array<{ id: number; name: string }>> {
    try {
      const categories = await firstValueFrom(
        this.httpService
          .get<OpenTDBCategoryResponse>(
            this.configService.get('OPENTDB_CATEGORY_URL'),
            {
              params: { amount: 0 },
            },
          )
          .pipe(
            map((response) => response.data.trivia_categories),
            catchError((error: AxiosError) => {
              throw new BadGatewayException(
                `Failed to reach OpenTDB: ${error.message}`,
              );
            }),
          ),
      );

      return categories || [];
    } catch (error: any) {
      throw new BadGatewayException(
        `Failed to reach OpenTDB: ${error.message}`,
      );
    }
  }

  private processQuestions(raw: OpenTDBQuestion[]): ProcessedQuestions {
    const clientQuestions: ClientQuestion[] = [];
    const correctAnswers: string[] = [];

    raw.forEach((question, index) => {
      const correct = this.decode(question.correct_answer);
      const incorrect = question.incorrect_answers.map(this.decode);
      const answers = this.shuffle([correct, ...incorrect]);

      clientQuestions.push({
        index,
        question: this.decode(question.question),
        category: this.decode(question.category),
        difficulty: question.difficulty,
        type: question.type,
        answers,
      });

      correctAnswers.push(correct);
    });

    return { clientQuestions, correctAnswers };
  }

  // Fisher-Yates shuffle
  private shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Decode HTML entities OpenTDB sends (e.g. &quot; &#039;)
  private decode(str: string): string {
    return str
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&ldquo;/g, '\u201C')
      .replace(/&rdquo;/g, '\u201D')
      .replace(/&lsquo;/g, '\u2018')
      .replace(/&rsquo;/g, '\u2019');
  }
}
