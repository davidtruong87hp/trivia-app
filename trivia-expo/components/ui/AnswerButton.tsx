import { View, Text, Animated, Pressable, StyleSheet } from 'react-native'
import React, { useRef } from 'react'
import { Colors } from '@/constants/theme'

const LETTERS = ['A', 'B', 'C', 'D']

interface AnswerButtonProps {
  label: string
  index: number
  selected: boolean
  isAnswered: boolean
  isCorrect: boolean
  isWrong: boolean
  onPress: () => void
}

const AnswerButton = ({
  label,
  index,
  selected,
  isAnswered,
  isCorrect,
  isWrong,
  onPress,
}: AnswerButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current
  const onPressIn = () => {
    if (!isAnswered) {
      Animated.spring(scale, {
        toValue: 0.97,
        useNativeDriver: true,
      }).start()
    }
  }
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }

  let borderColor = Colors.border,
    bgColor = Colors.bgCard,
    textColor = Colors.textPrimary
  let letterBg = Colors.bgElevated,
    letterColor = Colors.textSecondary

  if (isCorrect) {
    borderColor = Colors.correct
    bgColor = Colors.correctGlow
    letterBg = Colors.correct
    letterColor = Colors.bg
  } else if (isWrong) {
    borderColor = Colors.wrong
    bgColor = Colors.wrongGlow
    letterBg = Colors.wrong
    letterColor = Colors.bg
  } else if (selected && !isAnswered) {
    borderColor = Colors.cyan
    bgColor = Colors.cyanGlow
    letterBg = Colors.cyan
    letterColor = Colors.bg
  } else if (isAnswered) {
    textColor = Colors.textMuted
    borderColor = Colors.bgElevated
  }

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={isAnswered}
        style={[styles.answerBtn, { borderColor, backgroundColor: bgColor }]}
      >
        <View style={[styles.answerLetter, { backgroundColor: letterBg }]}>
          <Text style={[styles.answerLetterText, { color: letterColor }]}>
            {LETTERS[index] ?? index + 1}
          </Text>
        </View>
        <Text style={[styles.answerText, { color: textColor }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  answerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    gap: 14,
  },
  answerLetter: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerLetterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  answerText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
})

export default AnswerButton
