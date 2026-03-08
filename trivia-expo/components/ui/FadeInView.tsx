import { ViewStyle, Animated } from 'react-native'
import React, { useEffect, useRef } from 'react'

interface FaceInViewProps {
  children: React.ReactNode
  delay?: number
  style?: ViewStyle
}

const FadeInView = ({ children, delay = 0, style }: FaceInViewProps) => {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(16)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start()
  })

  return (
    <Animated.View style={[{ opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  )
}

export default FadeInView
