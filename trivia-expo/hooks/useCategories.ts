import { QuizAPI } from '@/services/api'
import { Category } from '@/types'
import { useEffect, useState } from 'react'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    QuizAPI.categories()
      .then(({ categories }) => {
        if (!cancelled) {
          setCategories(categories)
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e.message)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  return {
    categories,
    loading,
    error,
  }
}
