"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Timer } from "@/components/Timer";
import { QuestionCard } from "@/components/QuestionCard";
import { QuestionOverview } from "@/components/QuestionOverview";
import { Question, QuizState, QuizSubmission } from "@/types/quiz";
import { CheckCircle, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizPageProps {
  userEmail: string;
  questions: Question[];
  onQuizComplete: (submission: QuizSubmission) => void;
}

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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev' | null>(null);

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
      setTransitionDirection('next');
      setIsTransitioning(true);
      
      setTimeout(() => {
        const nextIndex = quizState.currentQuestionIndex + 1;
        setQuizState(prev => ({
          ...prev,
          currentQuestionIndex: nextIndex,
        }));
        setVisitedQuestions(prev => new Set([...prev, nextIndex]));
        setIsTransitioning(false);
        setTransitionDirection(null);
      }, 300);
    } else {
      handleSubmitQuiz();
    }
  };

  const handlePrevious = () => {
    if (quizState.currentQuestionIndex > 0) {
      setTransitionDirection('prev');
      setIsTransitioning(true);
      
      setTimeout(() => {
        const prevIndex = quizState.currentQuestionIndex - 1;
        setQuizState(prev => ({
          ...prev,
          currentQuestionIndex: prevIndex,
        }));
        setVisitedQuestions(prev => new Set([...prev, prevIndex]));
        setIsTransitioning(false);
        setTransitionDirection(null);
      }, 300);
    }
  };

  const handleQuestionNavigation = (questionIndex: number) => {
    const direction = questionIndex > quizState.currentQuestionIndex ? 'next' : 'prev';
    setTransitionDirection(direction);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: questionIndex,
      }));
      setVisitedQuestions(prev => new Set([...prev, questionIndex]));
      setShowMobileOverview(false);
      setIsTransitioning(false);
      setTransitionDirection(null);
    }, 300);
  };

  const handleTimeUp = () => {
    handleSubmitQuiz();
  };

  const handleSubmitQuiz = async () => {
    setIsLoading(true);
    setQuizState(prev => ({ ...prev, isCompleted: true }));

    const submission: QuizSubmission = {
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
        <Card className="w-full max-w-md text-center animate-in fade-in duration-500">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 animate-in zoom-in duration-500">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 animate-in fade-in slide-in-from-top duration-500">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quiz in Progress
            </h1>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-muted-foreground hidden sm:block">
                {userEmail}
              </div>
              {/* Mobile Overview Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileOverview(true)}
                className="sm:hidden hover:shadow-md transition-all duration-200"
              >
                <List className="h-4 w-4 mr-2" />
                Overview
              </Button>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Progress</span>
              <span className="font-medium">{answeredQuestions}/{questions.length} questions answered</span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-3 bg-gray-200" />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-500 ease-out" 
                   style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Quiz Area */}
          <div className="lg:col-span-3">
            {/* Timer */}
            <div className="mb-6 animate-in fade-in slide-in-from-left duration-500 delay-200">
              <Timer
                initialTime={30 * 60}
                onTimeUp={handleTimeUp}
                isActive={!quizState.isCompleted}
                onTick={(timeLeft) => setQuizState(prev => ({ ...prev, timeRemaining: timeLeft }))}
              />
            </div>

            {/* Question Card */}
            <div className={cn(
              "transition-all duration-300 ease-in-out",
              isTransitioning && transitionDirection === 'next' && "opacity-0 translate-x-4",
              isTransitioning && transitionDirection === 'prev' && "opacity-0 -translate-x-4"
            )}>
              {currentQuestion && (
                <QuestionCard
                  question={currentQuestion}
                  questionNumber={quizState.currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                  selectedAnswer={selectedAnswer}
                  onAnswerSelect={handleAnswerSelect}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                  isLastQuestion={quizState.currentQuestionIndex === questions.length - 1}
                  isTransitioning={isTransitioning}
                />
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6 text-center animate-in fade-in slide-in-from-bottom duration-500 delay-300">
              <Button
                onClick={handleSubmitQuiz}
                disabled={isLoading}
                className="px-8 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                {isLoading ? "Submitting..." : "Submit Quiz Early"}
              </Button>
            </div>
          </div>

          {/* Desktop Question Overview Panel */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-4 animate-in fade-in slide-in-from-right duration-500 delay-300">
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
