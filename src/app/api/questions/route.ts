import { NextResponse } from 'next/server';

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
function transformQuestion(openTDBQuestion: OpenTDBQuestion, index: number) {
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

export async function GET() {
  try {
    const response = await fetch('https://opentdb.com/api.php?amount=15', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[API] OpenTDB fetch failed:', {
        status: response.status,
        statusText: response.statusText
      });
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Quiz service is temporarily unavailable due to high demand. Please wait a moment and try again.' },
          { status: 503 }
        );
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OpenTDBResponse = await response.json();

    if (data.response_code !== 0) {
      console.error('[API] OpenTDB returned error response_code:', data.response_code, 'Full data:', data);
      throw new Error(`API error! response_code: ${data.response_code}`);
    }

    if (!data.results || data.results.length === 0) {
      console.error('[API] OpenTDB returned no results. Full data:', data);
      throw new Error('No questions received from API');
    }

    // Transform the questions to our expected format
    const transformedQuestions = data.results.map((question, index) => 
      transformQuestion(question, index)
    );

    return NextResponse.json({ results: transformedQuestions });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[API] Error fetching questions from OpenTDB:', errorMessage);
    return NextResponse.json(
      { error: 'Unable to load quiz questions at the moment. Please try again later.' },
      { status: 500 }
    );
  }
}

