import { createContext, useContext, useMemo, useReducer } from 'react'
import { initialState, QuizContextValue } from './types'
import { quizReducer } from './reducer'
import { useStartQuiz, useSubmitAnswer } from './actions'

const QuizContext = createContext<QuizContextValue | null>(null)
QuizContext.displayName = 'QuizContext'

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  const currentQuestion = state.questions[state.currentIndex] ?? null
  const isLastQuestion = state.currentIndex === state.questions.length - 1

  const startQuiz = useStartQuiz(dispatch)
  const submitAnswer = useSubmitAnswer(
    dispatch,
    state.sessionId,
    currentQuestion?.index ?? 0,
  )

  const value = useMemo<QuizContextValue>(
    () => ({
      state,
      startQuiz,
      submitAnswer,
      currentQuestion,
      isLastQuestion,
    }),
    [state, startQuiz, submitAnswer, currentQuestion, isLastQuestion],
  )

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext)

  if (!ctx) throw new Error('useQuiz must be used within a QuizProvider')

  return ctx
}
