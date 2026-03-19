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
    state: {
      phase,
      questions,
      lastAnswer,
      currentIndex,
      streak,
      bestStreak,
      timedOut,
      error,
    },
    currentQuestion,
    isLastQuestion,
    submitAnswer,
    nextQuestion,
    resetQuiz,
  } = useQuiz()

  return {
    phase,
    streak,
    bestStreak,
    currentIndex,
    currentQuestion,
    totalQuestions: questions.length,
    lastAnswer,
    isLastQuestion,
    timedOut,
    error,
    submitAnswer,
    nextQuestion,
    resetQuiz,
  }
}

export function useQuizResult() {
  const {
    state: { result, streak, bestStreak },
    resetQuiz,
  } = useQuiz()

  return { result, streak, bestStreak, resetQuiz }
}
