import {
  Text,
  ViewStyle,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import React, { useRef } from 'react'
import { Colors } from '@/constants/theme'

interface PrimaryButtonProps {
  label: string
  onPress: () => void
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
}

const PrimaryButton = ({
  label,
  onPress,
  disabled,
  loading,
  style,
}: PrimaryButtonProps) => {
  const scale = useRef(new Animated.Value(1)).current

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start()
  }

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start()
  }
  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled || loading}
        activeOpacity={1}
        style={[styles.btn, (disabled || loading) && styles.btnDisabled]}
      >
        {loading ? (
          <ActivityIndicator color={Colors.bg} size='small' />
        ) : (
          <Text style={styles.btnText}>{label}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: Colors.cyan,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  btnText: {
    color: Colors.bg,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
})

export default PrimaryButton
