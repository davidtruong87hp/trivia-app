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
    state: { phase, questions, lastAnswer },
    currentQuestion,
    isLastQuestion,
    submitAnswer,
  } = useQuiz()

  return {
    phase,
    currentQuestion,
    totalQuestions: questions.length,
    lastAnswer,
    isLastQuestion,
    submitAnswer,
  }
}
