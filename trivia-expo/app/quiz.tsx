import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors } from '@/constants/theme'
import { useRouter } from 'expo-router'
import { useQuizGameplay } from '@/hooks/useQuizSelectors'
import AnswerButton from '@/components/ui/AnswerButton'

const QuizScreen = () => {
  const router = useRouter()
  const { gameStatus, currentQuestion, totalQuestions } = useQuizGameplay()

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer)

    // TODO: Submitting answer
  }

  if (!currentQuestion || gameStatus.loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  const { question, answers, index } = currentQuestion

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle='light-content' backgroundColor={Colors.bg} />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace('/')}
          style={styles.exitBtn}
        >
          <Text style={styles.exitText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <Text style={styles.progressLabel}>
            {index + 1} / {totalQuestions}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View>
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
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
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
})

export default QuizScreen
