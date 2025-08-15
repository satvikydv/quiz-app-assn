import { Question, QuizSubmission } from "@/types/quiz";

export async function fetchQuestions(): Promise<Question[] | null> {
  try {
    console.log('Fetching questions from API...');
    const response = await fetch('/api/questions', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('API response not ok:', response.status);
      return null;
    }
    
    const data = await response.json();
    
    if (data.error) {
      console.error('API returned error:', data.error);
      return null;
    }
    
    if (!data.results || data.results.length === 0) {
      console.error('No results in API response');
      return null;
    }
    
    console.log(`Successfully fetched ${data.results.length} questions`);
    return data.results;
  } catch (error) {
    console.error('Error fetching questions:', error);
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
