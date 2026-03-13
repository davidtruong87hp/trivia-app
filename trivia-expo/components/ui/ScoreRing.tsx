import { Text, Animated, StyleSheet } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Colors } from '@/constants/theme'

interface Props {
  percentage: number
  score: number
  total: number
}

const ScoreRing = ({ percentage, score, total }: Props) => {
  const opacity = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0.7)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const color =
    percentage >= 80
      ? Colors.correct
      : percentage >= 50
        ? '#FFB300'
        : Colors.wrong

  return (
    <Animated.View
      style={[
        styles.scoreRing,
        { borderColor: color, opacity, transform: [{ scale }] },
      ]}
    >
      <Text style={[styles.scorePercentage, { color }]}>{percentage}%</Text>
      <Text style={styles.scoreFraction}>
        {score}/{total}
      </Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  scoreRing: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.bgCard,
  },
  scorePercentage: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
  },
  scoreFraction: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
  },
})

export default ScoreRing
