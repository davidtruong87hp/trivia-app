import { Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/theme'

interface ChipProps {
  label: string
  selected?: boolean
  onPress: () => void
  accentColor?: string
}

const Chip = ({ label, selected = false, onPress, accentColor }: ChipProps) => {
  const color = accentColor || Colors.cyan

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        selected && { backgroundColor: `${color}18`, borderColor: color },
      ]}
    >
      <Text style={[styles.chipText, selected && { color }]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.border,
    backgroundColor: Colors.bgCard,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
})

export default Chip
