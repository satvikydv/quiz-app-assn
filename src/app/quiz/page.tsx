"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { QuizPage } from "@/components/QuizPage";
import { Question } from "@/types/quiz";
import { fetchQuestions } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft } from "lucide-react";

export default function QuizRoute() {
  // All hooks at the top
  const router = useRouter();
  const searchParams = useSearchParams();
  const [appState, setAppState] = useState<"countdown" | "loading" | "quiz" | "error">("countdown");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string>("");
  const [countdown, setCountdown] = useState(5);
  const userEmail = searchParams.get('email');

  // Countdown effect
  useEffect(() => {
    if (appState !== "countdown") return;
    if (!userEmail) {
      setError("Email is required to start the quiz");
      setAppState("error");
      return;
    }
    if (countdown === 0) {
      setAppState("loading");
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [appState, countdown, userEmail]);

  // Fetch questions after countdown
  useEffect(() => {
    if (appState !== "loading") return;
    const fetchData = async () => {
      const fetchedQuestions = await fetchQuestions();
      if (!fetchedQuestions) {
        setError("Failed to load quiz questions. Please try again.");
        setAppState("error");
        return;
      }
      setQuestions(fetchedQuestions);
      setAppState("quiz");
    };
    fetchData();
  }, [appState]);

  useEffect(() => {
    if (appState === "error") {
      const timeout = setTimeout(() => {
        window.location.reload();
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [appState]);

  const handleQuizComplete = async (submission: any) => {
    const params = new URLSearchParams({
      questions: encodeURIComponent(JSON.stringify(questions)),
      answers: encodeURIComponent(JSON.stringify(submission.answers)),
      time: submission.timeTaken.toString(),
      email: encodeURIComponent(userEmail || ""),
    });
    router.push(`/reports?${params.toString()}`);
  };

  const handleGoBack = () => {
    router.push('/');
  };

  // Conditional rendering after all hooks
  if (appState === "countdown") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Quiz starting in...</CardTitle>
            <div className="text-6xl font-bold text-blue-600 my-4">{countdown}</div>
            <p className="text-muted-foreground">Get ready!</p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (appState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <CardTitle>Loading Quiz...</CardTitle>
            <p className="text-muted-foreground">
              Please wait while we prepare your questions.
            </p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (appState === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">Error</CardTitle>
            <p className="text-muted-foreground">
              {error}
            </p>
            <p className="mt-2 text-sm text-red-500">
              If you see this error, please wait a few seconds and the page will refresh automatically.<br />
              If the problem persists, try again later.
            </p>
          </CardHeader>
          <CardContent>
            <Button onClick={handleGoBack} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back to Start
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (appState === "quiz" && questions.length > 0) {
    return (
      <QuizPage
        userEmail={userEmail || ""}
        questions={questions}
        onQuizComplete={handleQuizComplete}
      />
    );
  }

  return null;
}
