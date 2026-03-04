export interface OpenTDBQuestion {
  type: 'multiple' | 'boolean';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface OpenTDBResponse {
  response_code: number;
  results: OpenTDBQuestion[];
}

export interface OpenTDBCategoryResponse {
  trivia_categories?: { id: number; name: string }[];
}

// Safe to send to the client — no correct answer flagged
export interface ClientQuestion {
  index: number;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'multiple' | 'boolean';
  answers: string[]; // shuffled, correct one hidden in here
}

export interface SessionData {
  correctAnswers: string[];
  questions: ClientQuestion[];
  userAnswers: (string | null)[];
  score: number;
  total: number;
  createdAt: number;
}
