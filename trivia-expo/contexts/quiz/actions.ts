import { Dispatch, useCallback } from 'react'
import { Action } from './types'
import { QuizConfig } from '@/types'
import { QuizAPI } from '@/services/api'

export function useStartQuiz(dispatch: Dispatch<Action>) {
  return useCallback(
    async (config: QuizConfig) => {
      dispatch({ type: 'LOADING' })

      try {
        const { sessionId, questions } = await QuizAPI.start(config)
        dispatch({ type: 'QUIZ_STARTED', sessionId, questions })
      } catch (err: any) {
        dispatch({ type: 'ERROR', message: err.message })
      }
    },
    [dispatch],
  )
}

export function useSubmitAnswer(
  dispatch: Dispatch<Action>,
  sessionId: string | null,
  currentQuestionIndex: number,
) {
  return useCallback(
    async (answer: string) => {
      if (!sessionId) return

      try {
        const result = await QuizAPI.answer(
          sessionId,
          currentQuestionIndex,
          answer,
        )
        dispatch({ type: 'ANSWER_RECORDED', answer: result })
      } catch (err: any) {
        dispatch({ type: 'ERROR', message: err.message })
      }
    },
    [dispatch, sessionId, currentQuestionIndex],
  )
}
