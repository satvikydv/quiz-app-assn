"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Check, Circle, X } from "lucide-react";

type QuestionStatus = "unvisited" | "visited" | "attempted" | "current";

interface QuestionOverviewProps {
  questions: any[];
  currentQuestionIndex: number;
  visitedQuestions: Set<number>;
  answers: Record<string, number>;
  onQuestionSelect: (index: number) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export function QuestionOverview({
  questions,
  currentQuestionIndex,
  visitedQuestions,
  answers,
  onQuestionSelect,
  onClose,
  isMobile = false,
}: QuestionOverviewProps) {
  const answeredQuestions = Object.keys(answers).length;

  const getQuestionStatus = (index: number): QuestionStatus => {
    const questionId = questions[index].id;
    const hasAnswer = answers[questionId] !== undefined;
    const isVisited = visitedQuestions.has(index);
    const isCurrent = index === currentQuestionIndex;

    if (isCurrent) return "current";
    if (hasAnswer) return "attempted";
    if (isVisited) return "visited";
    return "unvisited";
  };

  const getStatusIcon = (status: QuestionStatus) => {
    switch (status) {
      case "current":
        return <Circle className="h-4 w-4 text-blue-600 fill-current" />;
      case "attempted":
        return <Check className="h-4 w-4 text-green-600" />;
      case "visited":
        return <Eye className="h-4 w-4 text-yellow-600" />;
      case "unvisited":
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: QuestionStatus) => {
    switch (status) {
      case "current":
        return "ring-2 ring-blue-500 bg-blue-50";
      case "attempted":
        return "bg-green-100 hover:bg-green-200";
      case "visited":
        return "bg-yellow-100 hover:bg-yellow-200";
      case "unvisited":
        return "bg-gray-100 hover:bg-gray-200";
    }
  };

  const content = (
    <Card className={isMobile ? "w-full h-full" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg">Question Overview</CardTitle>
          <div className="text-sm text-muted-foreground">
            Click on any question to navigate
          </div>
        </div>
        {isMobile && onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Legend */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center space-x-2">
              <Circle className="h-3 w-3 text-blue-600 fill-current" />
              <span>Current</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-3 w-3 text-green-600" />
              <span>Attempted</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-3 w-3 text-yellow-600" />
              <span>Visited</span>
            </div>
            <div className="flex items-center space-x-2">
              <Circle className="h-3 w-3 text-gray-400" />
              <span>Unvisited</span>
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="grid grid-cols-3 gap-2">
              {questions.map((_, index) => {
                const status = getQuestionStatus(index);
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onQuestionSelect(index)}
                    className={`h-10 w-10 p-0 flex items-center justify-center ${getStatusColor(status)}`}
                  >
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(status)}
                      <span className="text-xs font-medium">{index + 1}</span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Attempted:</span>
              <span className="font-medium">{answeredQuestions}</span>
            </div>
            <div className="flex justify-between">
              <span>Visited:</span>
              <span className="font-medium">{visitedQuestions.size}</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining:</span>
              <span className="font-medium">{questions.length - visitedQuestions.size}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm max-h-[80vh] overflow-y-auto">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
