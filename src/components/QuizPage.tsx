"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer } from "@/components/Timer";
import { QuestionCard } from "@/components/QuestionCard";
import { QuestionOverview } from "@/components/QuestionOverview";
import { Question, QuizState } from "@/types/quiz";
import { CheckCircle, Clock, AlertCircle, Eye, Check, Circle, List } from "lucide-react";

interface QuizPageProps {
  userEmail: string;
  questions: Question[];
  onQuizComplete: (submission: any) => void;
}

type QuestionStatus = "unvisited" | "visited" | "attempted" | "current";

export function QuizPage({ userEmail, questions, onQuizComplete }: QuizPageProps) {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    timeRemaining: 30 * 60, // 30 minutes in seconds
    isCompleted: false,
    userEmail,
  });

  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));
  const [isLoading, setIsLoading] = useState(false);
  const [showMobileOverview, setShowMobileOverview] = useState(false);

  const currentQuestion = questions[quizState.currentQuestionIndex];
  const selectedAnswer =
    quizState.answers[currentQuestion?.id] !== undefined
      ? quizState.answers[currentQuestion?.id]
      : null;
  const answeredQuestions = Object.keys(quizState.answers).length;
  const progress = (answeredQuestions / questions.length) * 100;

  const handleAnswerSelect = (answerIndex: number) => {
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion.id]: answerIndex,
      },
    }));
  };

  const handleNext = () => {
    if (quizState.currentQuestionIndex < questions.length - 1) {
      const nextIndex = quizState.currentQuestionIndex + 1;
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: nextIndex,
      }));
      setVisitedQuestions(prev => new Set([...prev, nextIndex]));
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (quizState.currentQuestionIndex > 0) {
      const prevIndex = quizState.currentQuestionIndex - 1;
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prevIndex,
      }));
      setVisitedQuestions(prev => new Set([...prev, prevIndex]));
    }
  };

  const handleQuestionNavigation = (questionIndex: number) => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: questionIndex,
    }));
    setVisitedQuestions(prev => new Set([...prev, questionIndex]));
    setShowMobileOverview(false); // Close mobile overview after selection
  };

  const handleTimeUp = () => {
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    setIsLoading(true);
    setQuizState(prev => ({ ...prev, isCompleted: true }));

    const submission = {
      userEmail: quizState.userEmail,
      answers: quizState.answers,
      timeTaken: 30 * 60 - quizState.timeRemaining,
      totalQuestions: questions.length,
      answeredQuestions: Object.keys(quizState.answers).length,
      questions: questions, // Pass questions data for reports
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Call the completion handler which will handle navigation
    onQuizComplete(submission);
    setIsLoading(false);
  };

  if (quizState.isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Quiz Submitted!</CardTitle>
            <p className="text-muted-foreground">
              Redirecting to your results...
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Quiz in Progress</h1>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground hidden sm:block">
                {userEmail}
              </div>
              {/* Mobile Overview Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileOverview(true)}
                className="sm:hidden"
              >
                <List className="h-4 w-4 mr-2" />
                Overview
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{answeredQuestions}/{questions.length} questions answered</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Main Quiz Area */}
          <div className="md:col-span-2 lg:col-span-3 w-full">
            {/* Timer */}
            <Timer
              initialTime={30 * 60}
              onTimeUp={handleTimeUp}
              isActive={!quizState.isCompleted}
              onTick={(timeLeft) => setQuizState(prev => ({ ...prev, timeRemaining: timeLeft }))}
            />

            {/* Question Card */}

            <div className="relative min-h-[220px] sm:min-h-[320px] pb-24 sm:pb-0">
              <AnimatePresence mode="wait" initial={false}>
                {currentQuestion && (
                  <motion.div
                    key={quizState.currentQuestionIndex}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="absolute w-full"
                  >
                    <QuestionCard
                      question={currentQuestion}
                      questionNumber={quizState.currentQuestionIndex + 1}
                      totalQuestions={questions.length}
                      selectedAnswer={selectedAnswer}
                      onAnswerSelect={handleAnswerSelect}
                      onNext={handleNext}
                      onPrevious={handlePrevious}
                      isLastQuestion={quizState.currentQuestionIndex === questions.length - 1}
                      showMobileOverviewButton={true}
                      onShowMobileOverview={() => setShowMobileOverview(true)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Floating Bar for Navigation & Submit */}
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-gray-200 flex flex-col sm:hidden px-2 py-2 gap-2 shadow-lg">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileOverview(true)}
                  className="flex-1 mr-2"
                >
                  Questions
                </Button>
                <Button
                  onClick={handleSubmitQuiz}
                  disabled={isLoading}
                  className="flex-1 ml-2"
                >
                  {isLoading ? "Submitting..." : "Submit Quiz"}
                </Button>
              </div>
            </div>
          </div>

          {/* Desktop Question Overview Panel */}
          <div className="hidden md:block md:col-span-1 lg:col-span-1">
            <div className="sticky top-4">
              <QuestionOverview
                questions={questions}
                currentQuestionIndex={quizState.currentQuestionIndex}
                visitedQuestions={visitedQuestions}
                answers={quizState.answers}
                onQuestionSelect={handleQuestionNavigation}
              />
            </div>
          </div>
        </div>

        {/* Mobile Question Overview Modal */}
        {showMobileOverview && (
          <QuestionOverview
            questions={questions}
            currentQuestionIndex={quizState.currentQuestionIndex}
            visitedQuestions={visitedQuestions}
            answers={quizState.answers}
            onQuestionSelect={handleQuestionNavigation}
            onClose={() => setShowMobileOverview(false)}
            isMobile={true}
          />
        )}
      </div>
    </div>
  );
}
