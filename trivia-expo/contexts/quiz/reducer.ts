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
    case 'ANSWER_RECORDED':
      return {
        ...state,
        phase: 'feedback',
        lastAnswer: action.answer,
      }
    case 'NEXT_QUESTION': {
      const nextIndex = state.currentIndex + 1
      const isLast = nextIndex >= state.questions.length

      return {
        ...state,
        phase: isLast ? 'loading' : 'playing',
        currentIndex: isLast ? state.currentIndex : nextIndex,
        lastAnswer: null,
      }
    }
    case 'RESULT_LOADED':
      return {
        ...state,
        phase: 'finished',
        result: action.result,
      }
    case 'ERROR':
      return {
        ...state,
        phase: 'error',
        error: action.message,
      }
    case 'RESET':
      return initialState
    default:
      return state
  }
}
