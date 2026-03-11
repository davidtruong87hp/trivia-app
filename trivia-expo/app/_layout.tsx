import { Colors } from '@/constants/theme'
import { QuizProvider } from '@/contexts/quiz'
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <QuizProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: Colors.bg },
        }}
      />
    </QuizProvider>
  )
}
