"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Question } from "@/types/quiz";

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
}: QuestionCardProps) {
  return (
  <Card className="w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>Question {questionNumber} of {totalQuestions}</span>
            {showMobileOverviewButton && onShowMobileOverview && (
              <button
                type="button"
                className="ml-2 px-2 py-1 text-xs rounded bg-blue-100 text-blue-700 sm:hidden"
                onClick={onShowMobileOverview}
              >
                View All
              </button>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {Math.round((questionNumber / totalQuestions) * 100)}% Complete
          </span>
        </CardTitle>
      </CardHeader>
  <CardContent className="space-y-4 sm:space-y-6">
        <div className="text-lg font-medium">{question.question}</div>
        
        <RadioGroup
          value={selectedAnswer?.toString() || ""}
          onValueChange={(value) => onAnswerSelect(parseInt(value))}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label
                htmlFor={`option-${index}`}
                className="text-base cursor-pointer flex-1"
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex flex-col sm:flex-row justify-between gap-2 pt-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={questionNumber === 1}
            className="flex items-center space-x-2 w-full sm:w-auto"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={selectedAnswer === null}
            className="flex items-center space-x-2 w-full sm:w-auto"
          >
            {isLastQuestion ? "Submit Quiz" : "Next"}
            {!isLastQuestion && <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
