import { useQuiz } from '@/contexts/quiz'

export function useQuizSetup() {
  const {
    startQuiz,
    state: { phase },
  } = useQuiz()

  return { startQuiz, isStarting: phase === 'loading' }
}

export function useQuizGameplay() {
  const {
    state: { phase, questions },
    currentQuestion,
  } = useQuiz()

  const gameStatus = {
    loading: phase === 'loading',
    playing: phase === 'playing',
    answered: phase === 'feedback',
    error: phase === 'error',
    idle: phase === 'idle',
    finished: phase === 'finished',
  }

  return {
    phase,
    currentQuestion,
    totalQuestions: questions.length,
    gameStatus,
  }
}
