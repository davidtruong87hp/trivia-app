import { HttpService } from '@nestjs/axios';
import { TriviaService } from './trivia.service';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { BadGatewayException } from '@nestjs/common';

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'OPENTDB_URL') return 'https://opentdb.com/api.php';

    if (key === 'OPENTDB_CATEGORY_URL')
      return 'https://opentdb.com/api_category.php';

    return null;
  }),
};

describe('TriviaService', () => {
  let service: TriviaService;
  let httpService: jest.Mocked<HttpService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TriviaService,
        {
          provide: HttpService,
          useValue: { get: jest.fn() },
        },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get(TriviaService);
    httpService = module.get(HttpService);
  });

  describe('fetchQuestions', () => {
    it('should process questions and separate correct answers', async () => {
      httpService.get.mockReturnValue(
        of({
          data: {
            response_code: 0,
            results: [
              {
                type: 'multiple',
                difficulty: 'easy',
                category: 'Science',
                question: 'What is 2+2?',
                correct_answer: '4',
                incorrect_answers: ['1', '3', '5'],
              },
            ],
          },
        } as any),
      );

      const { clientQuestions, correctAnswers } = await service.fetchQuestions({
        amount: 1,
      });

      expect(correctAnswers).toEqual(['4']);
      expect(clientQuestions[0].answers).toHaveLength(4);
      expect(clientQuestions[0].answers).toContain('4');
    });

    it('should throw BadGatewayException on OpenTDB error code', async () => {
      httpService.get.mockReturnValue(
        of({
          data: {
            response_code: 1,
            results: [],
          },
        } as any),
      );

      await expect(service.fetchQuestions({ amount: 1 })).rejects.toThrow(
        BadGatewayException,
      );
    });

    it('should throw BadGatewayException on network failure', async () => {
      httpService.get.mockReturnValue(
        throwError(() => new Error('Network error')),
      );

      await expect(service.fetchQuestions({ amount: 1 })).rejects.toThrow(
        BadGatewayException,
      );
    });
  });

  describe('fetchCategories', () => {
    it('should fetch categories from OpenTDB', async () => {
      httpService.get.mockReturnValue(
        of({
          data: {
            trivia_categories: [
              { id: 1, name: 'Category 1' },
              { id: 2, name: 'Category 2' },
            ],
          },
        } as any),
      );

      const categories = await service.fetchCategories();

      expect(categories).toEqual([
        { id: 1, name: 'Category 1' },
        { id: 2, name: 'Category 2' },
      ]);
    });

    it('should throw BadGatewayException on network failure', async () => {
      httpService.get.mockReturnValue(
        throwError(() => new Error('Network error')),
      );

      await expect(service.fetchCategories()).rejects.toThrow(
        BadGatewayException,
      );
    });
  });
});
