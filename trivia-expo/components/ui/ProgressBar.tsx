import { View, Animated, StyleSheet } from 'react-native'
import React, { useEffect, useRef } from 'react'
import { Colors } from '@/constants/theme'

interface Props {
  current: number
  total: number
}

const ProgressBar = ({ current, total }: Props) => {
  const progress = useRef(new Animated.Value(0)).current
  const pct = (current / total) * 100

  useEffect(() => {
    Animated.timing(progress, {
      toValue: pct,
      duration: 400,
      useNativeDriver: false,
    }).start()
  }, [pct])

  const width = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  })

  return (
    <View style={styles.progressTrack}>
      <Animated.View style={[styles.progressFill, { width }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  progressTrack: {
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.cyan,
    borderRadius: 2,
  },
})

export default ProgressBar
