export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, number>;
  timeRemaining: number;
  isCompleted: boolean;
  userEmail: string;
}

export interface User {
  email: string;
}

export interface QuizSubmission {
  userEmail: string;
  answers: Record<string, number>;
  timeTaken: number;
}
