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

export interface AnswerResponse {
  correct: boolean
  correctAnswer: string
  score: number
  total: number
}

export interface QuizResultQuestion {
  question: string
  category: string
  difficulty: string
  correct: boolean
  yourAnswer: string | null
  correctAnswer: string
}

export interface QuizResult {
  score: number
  total: number
  percentage: number
  questions: QuizResultQuestion[]
}
