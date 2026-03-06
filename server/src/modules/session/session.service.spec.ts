import { Test } from '@nestjs/testing';
import { SessionService } from './session.service';
import { REDIS_CLIENT } from '../redis/redis.module';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'session-uuid'),
}));

const mockRedis = {
  set: jest.fn(),
  get: jest.fn(),
  del: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    if (key === 'SESSION_TTL_TIME') return 300;

    return null;
  }),
};

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        SessionService,
        { provide: REDIS_CLIENT, useValue: mockRedis },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get(SessionService);

    jest.clearAllMocks();
  });

  describe('get', () => {
    it('should throw NotFoundException when session does not exist', async () => {
      mockRedis.get.mockResolvedValue(null);

      await expect(service.get('bad-uuid')).rejects.toThrow(NotFoundException);
    });

    it('should return parsed session when found', async () => {
      const session = {
        correctAnswers: ['Paris'],
        questions: [],
        userAnswers: [null],
        score: 1,
        total: 1,
        createdAt: Date.now(),
      };
      mockRedis.get.mockResolvedValue(JSON.stringify(session));

      const result = await service.get('session-uuid');

      expect(result).toEqual(session);
    });
  });

  describe('recordAnswer', () => {
    it('should throw ForbiddenException when quiz is already completed', async () => {
      const session = {
        correctAnswers: ['Paris'],
        questions: [{ answers: ['Paris', 'London'] }],
        userAnswers: ['Paris'],
        score: 1,
        total: 1,
        createdAt: Date.now(),
      };
      mockRedis.get.mockResolvedValue(JSON.stringify(session));

      await expect(
        service.recordAnswer('session-uuid', 0, 'London'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should not allow re-answering the same question', async () => {
      const session = {
        correctAnswers: ['Paris', 'Germany'],
        questions: [
          { answers: ['Paris', 'London'] },
          { answers: ['America', 'Germany'] },
        ],
        userAnswers: ['Paris', null],
        score: 1,
        total: 2,
        createdAt: Date.now(),
      };
      mockRedis.get.mockResolvedValue(JSON.stringify(session));

      const result = await service.recordAnswer('session-uuid', 0, 'London');

      expect(result.correct).toBe(true);
      expect(mockRedis.set).not.toHaveBeenCalled();
    });

    it('should update session when answer is correct', async () => {
      const session = {
        correctAnswers: ['Paris', 'Germany'],
        questions: [
          { answers: ['Paris', 'London'] },
          { answers: ['America', 'Germany'] },
        ],
        userAnswers: [null, null],
        score: 0,
        total: 2,
        createdAt: Date.now(),
      };
      mockRedis.get.mockResolvedValue(JSON.stringify(session));

      const result = await service.recordAnswer('session-uuid', 0, 'Paris');

      expect(result.correct).toBe(true);
      expect(result.correctAnswer).toBe('Paris');
      expect(result.session.score).toBe(1);
      expect(mockRedis.set).toHaveBeenCalled();
    });
  });

  describe('getResult', () => {
    it('should throw ForbiddenException if quiz is not complete', async () => {
      const session = {
        correctAnswers: ['Paris', 'Newton'],
        questions: [],
        userAnswers: ['Paris', null],
        score: 1,
        total: 2,
        createdAt: Date.now(),
      };
      mockRedis.get.mockResolvedValue(JSON.stringify(session));

      await expect(service.getResult('session-uuid')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
