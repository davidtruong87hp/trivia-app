import { Action, QuizState, initialState } from './types'

export function quizReducer(state: QuizState, action: Action): QuizState {
  switch (action.type) {
    case 'LOADING':
      return {
        ...state,
        phase: 'loading',
      }
    case 'QUIZ_STARTED':
      return {
        ...initialState,
        phase: 'playing',
        sessionId: action.sessionId,
        questions: action.questions,
      }
    case 'ERROR':
      return {
        ...state,
        phase: 'error',
        error: action.message,
      }
    default:
      return state
  }
}
