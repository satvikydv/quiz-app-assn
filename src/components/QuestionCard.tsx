"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Question } from "@/types/quiz";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onAnswerSelect: (answerIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  isLastQuestion: boolean;
  showMobileOverviewButton?: boolean;
  onShowMobileOverview?: () => void;
  isTransitioning?: boolean;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  isLastQuestion,
  showMobileOverviewButton = false,
  onShowMobileOverview,
  isTransitioning = false,
}: QuestionCardProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Reset visibility when question changes
    setIsVisible(true);
  }, [questionNumber]);

  const handleAnswerSelect = (answerIndex: number) => {
    onAnswerSelect(answerIndex);
  };

  const handleNext = () => {
    setIsVisible(false);
    setTimeout(() => {
      onNext();
      setIsVisible(true);
    }, 300);
  };

  const handlePrevious = () => {
    setIsVisible(false);
    setTimeout(() => {
      onPrevious();
      setIsVisible(true);
    }, 300);
  };

  return (
    <div className={cn(
      "w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto transition-all duration-300 ease-in-out",
      isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100",
      !isVisible ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"
    )}>
      <Card className="w-full shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold">
                {questionNumber}
              </div>
              <span className="text-lg font-semibold text-gray-800">
                Question {questionNumber} of {totalQuestions}
              </span>
              {showMobileOverviewButton && onShowMobileOverview && (
                <button
                  type="button"
                  className="ml-2 px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors sm:hidden"
                  onClick={onShowMobileOverview}
                >
                  View All
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out"
                  style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground font-medium">
                {Math.round((questionNumber / totalQuestions) * 100)}%
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-xl font-medium text-gray-800 leading-relaxed">
            {question.question}
          </div>
          
          <RadioGroup
            value={selectedAnswer?.toString() || ""}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div
                key={index}
                className={cn(
                  "relative group cursor-pointer transition-all duration-200 ease-in-out",
                  "border-2 rounded-lg p-4 hover:shadow-md",
                  selectedAnswer === index
                    ? "border-blue-500 bg-blue-50 shadow-md scale-[1.02]"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                )}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <RadioGroupItem 
                      value={index.toString()} 
                      id={`option-${index}`}
                      className="sr-only"
                    />
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                      selectedAnswer === index
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300 group-hover:border-blue-400"
                    )}>
                      {selectedAnswer === index && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                  <Label
                    htmlFor={`option-${index}`}
                    className="text-base cursor-pointer flex-1 leading-relaxed text-gray-700 group-hover:text-gray-900 transition-colors"
                  >
                    {option}
                  </Label>
                </div>
                
                {/* Hover effect overlay */}
                <div className={cn(
                  "absolute inset-0 rounded-lg transition-opacity duration-200",
                  selectedAnswer === index
                    ? "bg-blue-500/5 opacity-100"
                    : "bg-gray-500/0 group-hover:bg-gray-500/5 group-hover:opacity-100"
                )} />
              </div>
            ))}
          </RadioGroup>

          <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={questionNumber === 1}
              className={cn(
                "flex items-center space-x-2 w-full sm:w-auto transition-all duration-200",
                "hover:shadow-md hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={selectedAnswer === null}
              className={cn(
                "flex items-center space-x-2 w-full sm:w-auto transition-all duration-200",
                "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700",
                "hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            >
              {isLastQuestion ? "Submit Quiz" : "Next"}
              {!isLastQuestion && <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
