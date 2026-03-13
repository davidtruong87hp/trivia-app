import { Text, Animated, StyleSheet } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Colors } from '@/constants/theme'

interface Props {
  streak: number
}

const StreakBadge = ({ streak }: Props) => {
  const scaleAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (streak > 0) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.3,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [streak])

  if (streak < 2) return null

  const isOnFire = streak >= 5

  return (
    <Animated.View
      style={[
        styles.container,
        isOnFire && styles.onFire,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <Text style={styles.icon}>{isOnFire ? '🔥' : '⚡'}</Text>
      <Text style={[styles.text, isOnFire && styles.textFire]}>{streak}x</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: '#FFB300',
  },
  onFire: {
    borderColor: '#FF6D00',
    backgroundColor: 'rgba(255, 109, 0, 0.12)',
  },
  icon: {
    fontSize: 13,
  },
  text: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFB300',
  },
  textFire: {
    color: '#FF6D00',
  },
})

export default StreakBadge
