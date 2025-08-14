import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
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

    const data = await response.json();

    if (data.response_code !== 0) {
      console.error('[API] OpenTDB returned error response_code:', data.response_code, 'Full data:', data);
      throw new Error(`API error! response_code: ${data.response_code}`);
    }

    if (!data.results || data.results.length === 0) {
      console.error('[API] OpenTDB returned no results. Full data:', data);
      throw new Error('No questions received from API');
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[API] Error fetching questions from OpenTDB:', error?.message || error, error?.stack);
    return NextResponse.json(
      { error: 'Unable to load quiz questions at the moment. Please try again later.' },
      { status: 500 }
    );
  }
}

