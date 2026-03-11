export type Difficulty = 'easy' | 'medium' | 'hard' | undefined
export type QuestionType = 'multiple' | 'boolean' | undefined

export interface Category {
  id: number
  name: string
}

export interface QuizConfig {
  amount: number
  category?: number
  difficulty?: Difficulty
  type?: QuestionType
}

export interface ClientQuestion {
  index: number
  question: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  type: 'multiple' | 'boolean'
  answers: string[]
}

export interface StartQuizResponse {
  sessionId: string
  total: number
  questions: ClientQuestion[]
}
