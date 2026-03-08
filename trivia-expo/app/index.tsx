import FadeInView from '@/components/ui/FadeInView'
import PrimaryButton from '@/components/ui/PrimaryButton'
import { Colors } from '@/constants/theme'
import { useEffect, useRef } from 'react'
import {
  Animated,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context'

export default function Index() {
  const glowAnim = useRef(new Animated.Value(0.4)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start()
  }, [])

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle='light-content' backgroundColor={Colors.bg} />

      <View style={styles.gridOverlay} pointerEvents='none'>
        {[
          new Array(6).map((_, i) => (
            <View key={i} style={[styles.gridLine, { top: `${i * 20}%` }]} />
          )),
        ]}
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FadeInView>
          <Text style={styles.eyebrow}>Knowledge test</Text>
        </FadeInView>

        <FadeInView delay={100}>
          <Text style={styles.title}>Trivia</Text>
          <Animated.Text style={[styles.titleAccent, { opacity: glowAnim }]}>
            Master
          </Animated.Text>
        </FadeInView>

        <FadeInView delay={200}>
          <Text style={styles.subtitle}>
            Test your knowledge across {'\n'}categories and difficulty levels
          </Text>
        </FadeInView>

        <FadeInView delay={300} style={styles.statsRow}>
          {[
            { value: '4,000+', label: 'Questions' },
            { value: '24', label: 'Categories' },
            { value: '3', label: 'Difficulty Levels' },
          ].map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </FadeInView>

        <FadeInView delay={400} style={styles.ctaContainer}>
          <PrimaryButton
            label='Start Quiz'
            onPress={() => {}}
            style={styles.ctaBtn}
          />
          <Text style={styles.ctaHint}>Pick a category to get started</Text>
        </FadeInView>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.border,
    opacity: 0.5,
  },
  container: {
    flex: 1,
    zIndex: 1,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
    color: Colors.cyan,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 72,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -2,
    lineHeight: 72,
    textTransform: 'uppercase',
  },
  titleAccent: {
    fontSize: 72,
    fontWeight: '900',
    color: Colors.cyan,
    letterSpacing: -2,
    lineHeight: 80,
    marginBottom: 24,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 26,
    marginBottom: 48,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 56,
    gap: 0,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    paddingVertical: 12,
  },
  statValue: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  ctaContainer: {
    gap: 12,
    alignItems: 'center',
  },
  ctaBtn: {
    width: '100%',
  },
  ctaHint: {
    fontSize: 13,
    color: Colors.textMuted,
  },
})
