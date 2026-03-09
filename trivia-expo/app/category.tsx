import {
  View,
  Text,
  StatusBar,
  ScrollView,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'

import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Difficulty as DifficultyColors } from '@/constants/theme'
import FadeInView from '@/components/ui/FadeInView'
import Chip from '@/components/ui/Chip'
import type { Difficulty, QuestionType } from '@/types'
import PrimaryButton from '@/components/ui/PrimaryButton'
import { categoryEmoji, cleanCategoryName } from '@/utils/helpers'
import { useCategories } from '@/hooks/useCategories'

const NUMBER_OF_QUESTIONS = [5, 10, 15, 20]

const CategoryScreen = () => {
  const router = useRouter()

  const { categories, loading } = useCategories()

  const [amount, setAmount] = useState(10)
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>(undefined)
  const [selectedType, setSelectedType] = useState<QuestionType>(undefined)
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>()

  const handleStart = () => {
    router.push('/quiz')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle='light-content' backgroundColor={Colors.bg} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <FadeInView>
          <View style={styles.header}>
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <Text style={styles.heading}>Set Up Your Quiz</Text>
          </View>
        </FadeInView>

        <FadeInView delay={60}>
          <SectionLabel label='Questions' />
          <View style={styles.chipRow}>
            {NUMBER_OF_QUESTIONS.map((num) => (
              <Chip
                key={num}
                label={String(num)}
                selected={amount === num}
                onPress={() => setAmount(num)}
              />
            ))}
          </View>
        </FadeInView>

        <FadeInView delay={120}>
          <SectionLabel label='Difficulty' />
          <View style={styles.chipRow}>
            <Chip
              label='Any'
              selected={selectedDifficulty === undefined}
              onPress={() => setSelectedDifficulty(undefined)}
            />
            {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
              <Chip
                key={difficulty}
                label={DifficultyColors[difficulty].label}
                selected={selectedDifficulty === difficulty}
                onPress={() => setSelectedDifficulty(difficulty)}
                accentColor={DifficultyColors[difficulty].color}
              />
            ))}
          </View>
        </FadeInView>

        <FadeInView delay={180}>
          <SectionLabel label='Question Type' />
          <View style={styles.chipRow}>
            {[
              { label: 'Any', value: undefined },
              { label: 'Multiple Choice', value: 'multiple' as QuestionType },
              { label: 'True / False', value: 'boolean' as QuestionType },
            ].map(({ label, value }) => (
              <Chip
                key={label}
                label={label}
                selected={selectedType === value}
                onPress={() => setSelectedType(value)}
              />
            ))}
          </View>
        </FadeInView>

        <FadeInView delay={240}>
          <SectionLabel label='Category' />
          {loading ? (
            <Text style={styles.loadingText}>Loading categories...</Text>
          ) : (
            <View style={styles.categoryGrid}>
              <TouchableOpacity
                style={[
                  styles.categoryCard,
                  selectedCategory === undefined && styles.categoryCardSelected,
                ]}
                onPress={() => setSelectedCategory(undefined)}
              >
                <Text style={styles.categoryIcon}>🎲</Text>
                <Text
                  style={[
                    styles.categoryName,
                    selectedCategory === undefined &&
                      styles.categoryNameSelected,
                  ]}
                >
                  Any
                </Text>
              </TouchableOpacity>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    selectedCategory === category.id &&
                      styles.categoryCardSelected,
                  ]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={styles.categoryIcon}>
                    {categoryEmoji(category.name)}
                  </Text>
                  <Text
                    style={[
                      styles.categoryName,
                      selectedCategory === category.id &&
                        styles.categoryNameSelected,
                    ]}
                    numberOfLines={2}
                  >
                    {cleanCategoryName(category.name)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </FadeInView>

        <FadeInView delay={300}>
          <View style={styles.startContainer}>
            <PrimaryButton
              label={loading ? 'Loading...' : `Start ${amount} Questions`}
              disabled={loading}
              onPress={handleStart}
            />
          </View>
        </FadeInView>
      </ScrollView>
    </SafeAreaView>
  )
}

function SectionLabel({ label }: { label: string }) {
  return <Text style={styles.sectionLabel}>{label}</Text>
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 32,
    gap: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backArrow: {
    color: Colors.textPrimary,
    fontSize: 18,
  },
  heading: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 20,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  loadingText: {
    color: Colors.textMuted,
    fontSize: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryCard: {
    width: '30%',
    paddingVertical: 12,
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    gap: 6,
  },
  categoryCardSelected: {
    borderColor: Colors.cyan,
    backgroundColor: Colors.cyanGlow,
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 15,
  },
  categoryNameSelected: {
    color: Colors.cyan,
  },
  startContainer: {
    marginTop: 40,
  },
})

export default CategoryScreen
