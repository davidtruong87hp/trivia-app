import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

interface Props {
  label: string
  color: string
}

const Badge = ({ label, color }: Props) => {
  return (
    <View
      style={[
        styles.badge,
        { borderColor: color, backgroundColor: `${color}18` },
      ]}
    >
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
})

export default Badge
