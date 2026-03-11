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
