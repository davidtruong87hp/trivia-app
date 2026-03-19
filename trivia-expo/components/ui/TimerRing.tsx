import { Text, Animated, View, StyleSheet } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Svg, { Circle } from 'react-native-svg'
import { Colors } from '@/constants/theme'

interface Props {
  timeLeft: number
  percentage: number
  color: string
  size?: number
}

const TimerRing = ({ timeLeft, percentage, color, size = 56 }: Props) => {
  const radius = (size - 6) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = (1 - percentage / 100) * circumference
  const scaleAnim = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (timeLeft <= 5 && timeLeft > 0) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.12,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [timeLeft])

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={Colors.border}
          strokeWidth={4}
          fill='transparent'
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={4}
          fill='transparent'
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap='round'
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[styles.label, { width: size, height: size }]}>
        <Text style={[styles.labelText, { color }]}>{timeLeft}</Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  label: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
})

export default TimerRing
