import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Pressable,
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Difficulty as DifficultyColors } from '@/constants/theme'
import { useRouter } from 'expo-router'
import { useQuizGameplay } from '@/hooks/useQuizSelectors'
import AnswerButton from '@/components/ui/AnswerButton'
import Badge from '@/components/ui/Badge'
import ProgressBar from '@/components/ui/ProgressBar'
import StreakBadge from '@/components/ui/StreakBadge'

const QuizScreen = () => {
  const router = useRouter()
  const {
    phase,
    streak,
    currentIndex,
    currentQuestion,
    totalQuestions,
    lastAnswer,
    isLastQuestion,
    submitAnswer,
    nextQuestion,
    resetQuiz,
  } = useQuizGameplay()

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const submittingRef = useRef(false)
  const feedbackAnim = useRef(new Animated.Value(0)).current
  const questionAnim = useRef(new Animated.Value(1)).current

  const isPlaying = phase === 'playing'
  const isAnswered = phase === 'feedback'

  useEffect(() => {
    if (isPlaying) {
      submittingRef.current = false
    }
  }, [isPlaying, currentIndex])

  useEffect(() => {
    if (phase === 'idle' || phase === 'error') {
      router.replace('/')
    }

    if (phase === 'finished') {
      router.replace('/results')
    }
  }, [phase, router])

  useEffect(() => {
    if (isAnswered) {
      Animated.spring(feedbackAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start()
    } else {
      feedbackAnim.setValue(0)
    }
  }, [isAnswered, feedbackAnim])

  const handleAnswer = async (answer: string) => {
    if (!isPlaying || submittingRef.current) return

    submittingRef.current = true
    setSelectedAnswer(answer)

    await submitAnswer(answer)
    submittingRef.current = false
  }

  const handleNext = () => {
    Animated.timing(questionAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(async () => {
      setSelectedAnswer(null)
      await nextQuestion()
      Animated.timing(questionAnim, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }).start()
    })
  }

  if (!currentQuestion || phase === 'loading') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  const { question, answers, index, category, difficulty } = currentQuestion
  const diffConfig = DifficultyColors[difficulty]

  const feedbackTranslateY = feedbackAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [60, 0],
  })

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle='light-content' backgroundColor={Colors.bg} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            resetQuiz()
            router.replace('/')
          }}
          style={styles.exitBtn}
        >
          <Text style={styles.exitText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <ProgressBar current={index} total={totalQuestions} />
          <Text style={styles.progressLabel}>
            {index + 1} / {totalQuestions}
          </Text>
        </View>
        <StreakBadge streak={streak} />
        <View style={styles.scoreChip}>
          <Text style={styles.scoreText}>{lastAnswer?.score ?? 0}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: questionAnim }}>
          <View style={styles.metaRow}>
            <View style={styles.metaRight}>
              <Badge label={difficulty} color={diffConfig.color} />
              <Text numberOfLines={1} style={styles.categoryText}>
                {category}
              </Text>
            </View>
          </View>

          <Text style={styles.questionText}>{question}</Text>

          <View style={styles.answersContainer}>
            {answers.map((answer, i) => (
              <AnswerButton
                key={answer}
                label={answer}
                index={i}
                selected={selectedAnswer === answer}
                isAnswered={false}
                isCorrect={false}
                isWrong={false}
                onPress={() => handleAnswer(answer)}
              />
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {isAnswered && lastAnswer && (
        <Animated.View
          style={[
            styles.feedbackBar,
            {
              backgroundColor: lastAnswer.correct
                ? Colors.correctGlow
                : Colors.wrongGlow,
              borderTopColor: lastAnswer.correct
                ? Colors.correct
                : Colors.wrong,
              opacity: feedbackAnim,
              transform: [{ translateY: feedbackTranslateY }],
            },
          ]}
        >
          <View>
            <Text
              style={[
                styles.feedbackTitle,
                { color: lastAnswer.correct ? Colors.correct : Colors.wrong },
              ]}
            >
              {lastAnswer.correct ? '✓ Correct!' : '✗ Wrong'}
            </Text>
            {!lastAnswer.correct && (
              <Text style={styles.feedbackAnswer}>
                Answer: {lastAnswer.correctAnswer}
              </Text>
            )}
            {lastAnswer.correct && streak >= 3 && (
              <Text style={styles.streakMessage}>
                {streak >= 5 ? '🔥 On fire! ' : '⚡ '}
              </Text>
            )}
          </View>
          <Pressable style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>
              {isLastQuestion ? 'Results →' : 'Next →'}
            </Text>
          </Pressable>
        </Animated.View>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 10,
  },
  exitBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  progressContainer: {
    flex: 1,
    gap: 6,
  },
  progressLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    textAlign: 'right',
  },
  scoreChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 40,
    alignItems: 'center',
  },
  scoreText: {
    color: Colors.cyan,
    fontWeight: '800',
    fontSize: 15,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  metaRight: {
    flex: 1,
    gap: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 34,
    letterSpacing: -0.3,
    marginBottom: 32,
  },
  answersContainer: {
    gap: 32,
  },
  feedbackBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 2,
  },
  feedbackTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  feedbackAnswer: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  streakMessage: {
    fontSize: 13,
    color: '#FFB300',
    marginTop: 2,
    fontWeight: '600',
  },
  nextBtn: {
    backgroundColor: Colors.cyan,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  nextBtnText: {
    color: Colors.bg,
    fontWeight: '700',
    fontSize: 14,
  },
})

export default QuizScreen
