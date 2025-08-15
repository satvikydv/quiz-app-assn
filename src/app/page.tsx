"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StartPage } from "@/components/StartPage";
import { QuizPage } from "@/components/QuizPage";
import { Question, QuizSubmission } from "@/types/quiz";

export default function Home() {
  const router = useRouter();
  const [appState, setAppState] = useState<"start" | "quiz" | "loading">("start");
  const [userEmail, setUserEmail] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartQuiz = async (email: string) => {
    setIsLoading(true);
    setAppState("loading");
    setUserEmail(email);

    try {
      const response = await fetch("/api/questions");
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const data = await response.json();
      setQuestions(data.results);
      setAppState("quiz");
    } catch (error) {
      console.error("Error fetching questions:", error);
      setAppState("start");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizComplete = (submission: QuizSubmission) => {
    // Store submission data in localStorage for reports
    localStorage.setItem('quizSubmission', JSON.stringify(submission));
    // Navigate to reports page
    router.push('/reports');
  };

  if (appState === "loading") {
    return <StartPage onStart={handleStartQuiz} isLoading={true} />;
  }

  if (appState === "quiz" && questions.length > 0) {
    return (
      <QuizPage
        userEmail={userEmail}
        questions={questions}
        onQuizComplete={handleQuizComplete}
      />
    );
  }

  return <StartPage onStart={handleStartQuiz} isLoading={isLoading} />;
}