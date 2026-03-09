import { Category } from '@/types'

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
}
