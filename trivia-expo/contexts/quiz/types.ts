import { AnswerResponse, ClientQuestion, QuizConfig } from '@/types'

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
  lastAnswer: AnswerResponse | null
}

export type Action =
  | { type: 'LOADING' }
  | { type: 'QUIZ_STARTED'; sessionId: string; questions: ClientQuestion[] }
  | { type: 'ERROR'; message: string }
  | { type: 'ANSWER_RECORDED'; answer: AnswerResponse }

export interface QuizContextValue {
  state: QuizState
  startQuiz: (config: QuizConfig) => Promise<void>
  submitAnswer: (answer: string) => Promise<void>
  currentQuestion: ClientQuestion | null
  isLastQuestion: boolean
}

export const initialState: QuizState = {
  phase: 'idle',
  sessionId: null,
  questions: [],
  currentIndex: 0,
  error: null,
  lastAnswer: null,
}
