import { Test } from '@nestjs/testing';
import { SessionService } from '../session/session.service';
import { TriviaService } from '../trivia/trivia.service';
import { QuizService } from './quiz.service';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'session-uuid'),
}));

describe('QuizService', () => {
  let quizService: QuizService;
  let triviaService: jest.Mocked<TriviaService>;
  let sessionService: jest.Mocked<SessionService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        QuizService,
        {
          provide: TriviaService,
          useValue: {
            fetchCategories: jest.fn(),
            fetchQuestions: jest.fn(),
          },
        },
        {
          provide: SessionService,
          useValue: {
            create: jest.fn(),
            delete: jest.fn(),
            get: jest.fn(),
            recordAnswer: jest.fn(),
            getResult: jest.fn(),
          },
        },
      ],
    }).compile();

    quizService = module.get(QuizService);
    triviaService = module.get(TriviaService);
    sessionService = module.get(SessionService);
  });

  describe('startQuiz', () => {
    it('should return sessionId and questions', async () => {
      const mockQuestions = [
        {
          index: 0,
          question: 'What is 2+2?',
          answers: ['3', '4', '5', '6'],
          category: 'Math',
          difficulty: 'easy' as const,
          type: 'multiple' as const,
        },
      ];

      triviaService.fetchQuestions.mockResolvedValue({
        clientQuestions: mockQuestions,
        correctAnswers: ['4'],
      });

      sessionService.create.mockResolvedValue('session-uuid');

      const result = await quizService.startQuiz({ amount: 1 });

      expect(result.sessionId).toBe('session-uuid');
      expect(result.questions).toEqual(mockQuestions);
      expect(triviaService.fetchQuestions).toHaveBeenCalledWith({ amount: 1 });
    });
  });

  describe('submitAnswer', () => {
    it('should return correct feedback when answer is right', async () => {
      sessionService.recordAnswer.mockResolvedValue({
        correct: true,
        correctAnswer: '4',
        session: {
          score: 1,
          total: 5,
          correctAnswers: ['4'],
          questions: [],
          userAnswers: ['4'],
          createdAt: Date.now(),
        },
      });

      const result = await quizService.submitAnswer({
        sessionId: 'session-uuid',
        questionIndex: 0,
        answer: '4',
      });

      expect(result.correct).toBeTruthy();
      expect(result.correctAnswer).toBe('4');
      expect(result.score).toBe(1);
    });

    it('should return wrong feedback when answer is wrong', async () => {
      sessionService.recordAnswer.mockResolvedValue({
        correct: false,
        correctAnswer: '4',
        session: {
          score: 0,
          total: 5,
          correctAnswers: ['4'],
          questions: [],
          userAnswers: ['3'],
          createdAt: Date.now(),
        },
      });

      const result = await quizService.submitAnswer({
        sessionId: 'session-uuid',
        questionIndex: 0,
        answer: '3',
      });

      expect(result.correct).toBeFalsy();
      expect(result.correctAnswer).toBe('4');
    });
  });
});
