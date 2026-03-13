import {
  AnswerResponse,
  Category,
  QuizConfig,
  QuizResult,
  StartQuizResponse,
} from '@/types'

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001'

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}/${endpoint}`
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.error || `Request faield with status ${response.status}`,
    )
  }

  return data as T
}

export const QuizAPI = {
  categories(): Promise<{ categories: Category[] }> {
    return request<{ categories: Category[] }>('quiz/categories')
  },

  start(config: QuizConfig): Promise<StartQuizResponse> {
    return request<StartQuizResponse>('quiz/start', {
      method: 'POST',
      body: JSON.stringify(config),
    })
  },

  answer(
    sessionId: string,
    questionIndex: number,
    answer: string,
  ): Promise<AnswerResponse> {
    return request<AnswerResponse>('quiz/answer', {
      method: 'POST',
      body: JSON.stringify({ sessionId, questionIndex, answer }),
    })
  },

  result(sessionId: string): Promise<QuizResult> {
    return request<QuizResult>(`quiz/result/${sessionId}`)
  },

  deleteSession(sessionId: string): Promise<void> {
    return request<void>(`quiz/delete/${sessionId}`, {
      method: 'DELETE',
    })
  },
}
