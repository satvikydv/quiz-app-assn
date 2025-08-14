import { Question, QuizSubmission } from "@/types/quiz";

// Open Trivia Database API response types
interface OpenTDBQuestion {
  type: string;
  difficulty: string;
  category: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface OpenTDBResponse {
  response_code: number;
  results: OpenTDBQuestion[];
}

// Transform OpenTDB question to our format
function transformQuestion(openTDBQuestion: OpenTDBQuestion, index: number): Question {
  // Decode HTML entities in question and answers
  const decodeHtml = (html: string) => {
    // Simple HTML entity decoding
    return html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&copy;/g, '©')
      .replace(/&reg;/g, '®')
      .replace(/&trade;/g, '™');
  };

  const question = decodeHtml(openTDBQuestion.question);
  const correctAnswer = decodeHtml(openTDBQuestion.correct_answer);
  const incorrectAnswers = openTDBQuestion.incorrect_answers.map(answer => decodeHtml(answer));

  // Combine correct and incorrect answers, then shuffle them
  const allOptions = [correctAnswer, ...incorrectAnswers];
  const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
  
  // Find the index of the correct answer in the shuffled options
  const correctAnswerIndex = shuffledOptions.indexOf(correctAnswer);

  return {
    id: (index + 1).toString(),
    question,
    options: shuffledOptions,
    correctAnswer: correctAnswerIndex,
  };
}

export async function fetchQuestions(): Promise<Question[] | null> {
  try {
    console.log('Fetching questions from OpenTDB API via local proxy...');
    const response = await fetch('/api/questions', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    if (!response.ok) {
      return null;
    }
    const data: OpenTDBResponse = await response.json();
    if (data.response_code !== 0) {
      return null;
    }
    if (!data.results || data.results.length === 0) {
      return null;
    }
    console.log(`Successfully fetched ${data.results.length} questions from OpenTDB`);
    const transformedQuestions = data.results.map((question, index) => 
      transformQuestion(question, index)
    );
    return transformedQuestions;
  } catch (error) {
    console.error('Error fetching questions from OpenTDB:', error);
    return null;
  }
}

export async function submitQuizResults(submission: QuizSubmission): Promise<{ success: boolean; message: string }> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For now, we'll just log the submission and return a success message
  // In a real application, you would send this to your backend
  console.log("Quiz submission:", {
    userEmail: submission.userEmail,
    timeTaken: submission.timeTaken,
    answers: submission.answers,
  });
  
  return {
    success: true,
    message: "Quiz submitted successfully!",
  };
}
