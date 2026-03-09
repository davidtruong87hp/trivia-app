export type Difficulty = 'easy' | 'medium' | 'hard' | undefined
export type QuestionType = 'multiple' | 'boolean' | undefined

export interface Category {
  id: number
  name: string
}
