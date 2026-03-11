import { createContext, useContext, useMemo, useReducer } from 'react'
import { initialState, QuizContextValue } from './types'
import { quizReducer } from './reducer'
import { useStartQuiz } from './actions'

const QuizContext = createContext<QuizContextValue | null>(null)

export function QuizProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(quizReducer, initialState)

  const currentQuestion = state.questions[state.currentIndex] ?? null

  const startQuiz = useStartQuiz(dispatch)

  const value = useMemo<QuizContextValue>(
    () => ({
      state,
      startQuiz,
      currentQuestion,
    }),
    [state, startQuiz, currentQuestion],
  )

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext)

  if (!ctx) throw new Error('useQuiz must be used within a QuizProvider')

  return ctx
}
