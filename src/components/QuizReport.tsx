"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Clock, Trophy, Target, BarChart3 } from "lucide-react";
import { Question } from "@/types/quiz";

interface QuizReportProps {
  questions: Question[];
  userAnswers: Record<string, number>;
  timeTaken: number;
  userEmail: string;
  onRestart?: () => void;
}

export function QuizReport({
  questions,
  userAnswers,
  timeTaken,
  userEmail,
  onRestart,
}: QuizReportProps) {
  const router = useRouter();
  
  // Calculate results
  let correctAnswers = 0;
  let totalQuestions = questions.length;
  let answeredQuestions = Object.keys(userAnswers).length;

  const results = questions.map((question, index) => {
    const userAnswer = userAnswers[question.id];
    const isCorrect = userAnswer === question.correctAnswer;
    const isAnswered = userAnswer !== undefined;

    if (isCorrect) correctAnswers++;

    return {
      question,
      questionNumber: index + 1,
      userAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      isAnswered,
      userAnswerText: isAnswered ? question.options[userAnswer] : "Not answered",
      correctAnswerText: question.options[question.correctAnswer],
    };
  });

  const score = (correctAnswers / totalQuestions) * 100;
  const timeInMinutes = Math.floor(timeTaken / 60);
  const timeInSeconds = timeTaken % 60;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  const handleRestart = () => {
    if (onRestart) {
      onRestart();
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
              <Trophy className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Quiz Results</h1>
            <p className="text-muted-foreground">Here's your detailed performance report</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                  {score.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Score</div>
                {getScoreBadge(score)}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {correctAnswers}/{totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {answeredQuestions}/{totalQuestions}
                </div>
                <div className="text-sm text-muted-foreground">Attempted</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {timeInMinutes}:{timeInSeconds.toString().padStart(2, "0")}
                </div>
                <div className="text-sm text-muted-foreground">Time Taken</div>
              </CardContent>
            </Card>
          </div>

          {/* User Info */}
          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{userEmail}</div>
                </div>
                <Button onClick={handleRestart} variant="outline">
                  Take Another Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Question Analysis</h2>
          
          {results.map((result, index) => (
            <Card key={result.question.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Question {result.questionNumber}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {result.isAnswered ? (
                      result.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                    )}
                    {result.isCorrect ? (
                      <Badge className="bg-green-100 text-green-800">Correct</Badge>
                    ) : result.isAnswered ? (
                      <Badge className="bg-red-100 text-red-800">Incorrect</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800">Not Answered</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Question */}
                <div>
                  <div className="font-medium text-gray-900 mb-3">
                    {result.question.question}
                  </div>
                  
                  {/* Options */}
                  <div className="space-y-2">
                    {result.question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg border-2 ${
                          optionIndex === result.correctAnswer
                            ? "border-green-500 bg-green-50"
                            : optionIndex === result.userAnswer
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            {optionIndex === result.correctAnswer && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                            {optionIndex === result.userAnswer && optionIndex !== result.correctAnswer && (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="font-medium">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                          </div>
                          <span className="flex-1">{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Answer Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Your Answer</div>
                    <div className={`p-3 rounded-lg ${
                      result.isCorrect 
                        ? "bg-green-100 text-green-800" 
                        : result.isAnswered 
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {result.isAnswered ? result.userAnswerText : "Not answered"}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Correct Answer</div>
                    <div className="p-3 rounded-lg bg-green-100 text-green-800">
                      {result.correctAnswerText}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Action */}
        <div className="mt-8 text-center">
          <Button onClick={handleRestart} size="lg" className="px-8">
            Take Another Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
