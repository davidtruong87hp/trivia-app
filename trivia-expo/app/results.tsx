import {
  View,
  Text,
  StatusBar,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useQuizResult } from '@/hooks/useQuizSelectors'
import { Colors, Difficulty as DifficultyColors } from '@/constants/theme'
import { SafeAreaView } from 'react-native-safe-area-context'
import FadeInView from '@/components/ui/FadeInView'
import Badge from '@/components/ui/Badge'

const ResultsScreen = () => {
  const router = useRouter()
  const { result, resetQuiz } = useQuizResult()

  useEffect(() => {
    if (!result) return
  }, [])

  if (!result) {
    router.replace('/')
    return null
  }

  const { score, total, percentage, questions } = result

  const grade =
    percentage >= 90
      ? { label: 'Outstanding', color: Colors.correct }
      : percentage >= 70
        ? { label: 'Great Job', color: Colors.cyan }
        : percentage >= 50
          ? { label: 'Not Bad', color: '#FFB300' }
          : { label: 'Keep Practicing', color: Colors.wrong }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='light-content' backgroundColor={Colors.bg} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FadeInView>
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Quiz Complete</Text>
            <Text style={[styles.gradeLabel, { color: grade.color }]}>
              {grade.label}
            </Text>
            <Text style={styles.gradeSubtitle}>
              You got {score} out of {total} questions correct
            </Text>
          </View>
        </FadeInView>

        <FadeInView delay={200}>
          <View style={styles.actionsRow}>
            <Pressable
              style={styles.homeBtn}
              onPress={() => {
                resetQuiz()
                router.replace('/')
              }}
            >
              <Text style={styles.homeBtnText}>Home</Text>
            </Pressable>
            <Pressable
              style={styles.playAgainBtn}
              onPress={() => {
                resetQuiz()
                router.replace('/category')
              }}
            >
              <Text style={styles.playAgainBtnText}>Play Again</Text>
            </Pressable>
          </View>
        </FadeInView>

        {/* Question breakdown */}
        <FadeInView delay={300}>
          <Text style={styles.breakdownTitle}>Question Breakdown</Text>
          <View style={styles.breakdownList}>
            {questions.map((q, i) => (
              <FadeInView key={i} delay={300 + i * 40}>
                <View
                  style={[
                    styles.breakdownCard,
                    { borderColor: q.correct ? Colors.correct : Colors.wrong },
                  ]}
                >
                  <View style={styles.breakdownHeader}>
                    <Text style={styles.questionNumber}>Q{i + 1}</Text>
                    <Badge
                      label={q.difficulty}
                      color={
                        DifficultyColors[
                          q.difficulty as keyof typeof DifficultyColors
                        ]?.color ?? Colors.textMuted
                      }
                    />
                    <Text numberOfLines={1} style={styles.breakdownCategory}>
                      {q.category}
                    </Text>
                    <Text
                      style={[
                        styles.resultIcon,
                        { color: q.correct ? Colors.correct : Colors.wrong },
                      ]}
                    >
                      {q.correct ? '✓' : '✗'}
                    </Text>
                  </View>

                  <Text style={styles.breakdownQuestion}>{q.question}</Text>

                  <View style={styles.breakdownAnswers}>
                    {q.yourAnswer && q.yourAnswer !== q.correctAnswer && (
                      <View style={styles.answerRow}>
                        <Text style={styles.answerRowLabel}>Your Answer</Text>
                        <Text
                          style={[
                            styles.answerRowValue,
                            { color: Colors.wrong },
                          ]}
                        >
                          {q.yourAnswer || 'No answer'}
                        </Text>
                      </View>
                    )}
                    <View style={styles.answerRow}>
                      <Text style={styles.answerRowLabel}>Correct Answer</Text>
                      <Text
                        style={[
                          styles.answerRowValue,
                          { color: Colors.correct },
                        ]}
                      >
                        {q.correctAnswer}
                      </Text>
                    </View>
                  </View>
                </View>
              </FadeInView>
            ))}
          </View>
        </FadeInView>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 60,
    paddingTop: 32,
  },
  heroSection: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 32,
  },
  heroTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
    color: Colors.cyan,
    textTransform: 'uppercase',
  },
  gradeLabel: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginTop: 4,
  },
  gradeSubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 40,
  },
  homeBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  homeBtnText: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: '700',
  },
  playAgainBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: Colors.cyan,
    alignItems: 'center',
  },
  playAgainBtnText: {
    color: Colors.bg,
    fontSize: 15,
    fontWeight: '700',
  },
  breakdownTitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.textSecondary,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  breakdownList: {
    gap: 12,
  },
  breakdownCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 3,
    padding: 16,
    gap: 10,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  questionNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textMuted,
    minWidth: 24,
  },
  breakdownCategory: {
    fontSize: 11,
    color: Colors.textMuted,
    flex: 1,
  },
  resultIcon: {
    fontSize: 16,
    fontWeight: '800',
  },
  breakdownQuestion: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 22,
    color: Colors.textPrimary,
  },
  breakdownAnswers: {
    gap: 6,
    marginTop: 4,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  answerRowLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  answerRowValue: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
})

export default ResultsScreen
