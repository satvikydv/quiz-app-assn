"use client";

import { useEffect, useState } from "react";
import { QuizReport } from "@/components/QuizReport";
import { Question } from "@/types/quiz";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function ReportsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [reportData, setReportData] = useState<{
    questions: Question[];
    userAnswers: Record<string, number>;
    timeTaken: number;
    userEmail: string;
  } | null>(null);

  useEffect(() => {
    // Get data from localStorage
    const storedSubmission = localStorage.getItem('quizSubmission');
    
    if (storedSubmission) {
      try {
        const submission = JSON.parse(storedSubmission);
        setReportData({
          questions: submission.questions,
          userAnswers: submission.answers,
          timeTaken: submission.timeTaken,
          userEmail: submission.userEmail,
        });
      } catch (error) {
        console.error("Error parsing report data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const handleRestart = () => {
    // Clear the stored submission
    localStorage.removeItem('quizSubmission');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <CardTitle>Loading Report...</CardTitle>
            <p className="text-muted-foreground">
              Please wait while we load your quiz results.
            </p>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-red-600">Report Not Found</CardTitle>
            <p className="text-muted-foreground">
              The quiz report you&apos;re looking for doesn&apos;t exist or has expired.
            </p>
          </CardHeader>
          <CardContent>
            <Button onClick={handleRestart} className="w-full">
              Start New Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <QuizReport
      questions={reportData.questions}
      userAnswers={reportData.userAnswers}
      timeTaken={reportData.timeTaken}
      userEmail={reportData.userEmail}
      onRestart={handleRestart}
    />
  );
}
