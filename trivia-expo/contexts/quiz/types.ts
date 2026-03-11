import { ClientQuestion, QuizConfig } from '@/types'

export type QuizPhase =
  | 'idle'
  | 'loading'
  | 'playing'
  | 'feedback'
  | 'finished'
  | 'error'

export interface QuizState {
  phase: QuizPhase
  sessionId: string | null
  questions: ClientQuestion[]
  currentIndex: number
  error: string | null
}

export type Action =
  | { type: 'LOADING' }
  | { type: 'QUIZ_STARTED'; sessionId: string; questions: ClientQuestion[] }
  | { type: 'ERROR'; message: string }

export interface QuizContextValue {
  state: QuizState
  startQuiz: (config: QuizConfig) => Promise<void>
  currentQuestion: ClientQuestion | null
}

export const initialState: QuizState = {
  phase: 'idle',
  sessionId: null,
  questions: [],
  currentIndex: 0,
  error: null,
}
