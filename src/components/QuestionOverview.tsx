"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Check, Circle, X, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Question } from "@/types/quiz";

type QuestionStatus = "unvisited" | "visited" | "attempted" | "current";

interface QuestionOverviewProps {
  questions: Question[];
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
        return <Circle className="h-4 w-4 text-blue-600 fill-current animate-pulse" />;
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
        return "ring-2 ring-blue-500 bg-gradient-to-r from-blue-50 to-blue-100 shadow-md";
      case "attempted":
        return "bg-gradient-to-r from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 shadow-sm";
      case "visited":
        return "bg-gradient-to-r from-yellow-50 to-amber-100 hover:from-yellow-100 hover:to-amber-200 shadow-sm";
      case "unvisited":
        return "bg-gradient-to-r from-gray-50 to-slate-100 hover:from-gray-100 hover:to-slate-200";
    }
  };

  const content = (
    <Card className={cn(
      isMobile ? "w-full h-full" : "",
      "shadow-xl border-0 bg-white/90 backdrop-blur-sm"
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Question Overview
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Click on any question to navigate
          </div>
        </div>
        {isMobile && onClose && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="space-y-2 text-xs bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <Circle className="h-3 w-3 text-blue-600 fill-current" />
              <span className="font-medium">Current</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-3 w-3 text-green-600" />
              <span className="font-medium">Attempted</span>
            </div>
            <div className="flex items-center space-x-2">
              <Eye className="h-3 w-3 text-yellow-600" />
              <span className="font-medium">Visited</span>
            </div>
            <div className="flex items-center space-x-2">
              <Circle className="h-3 w-3 text-gray-400" />
              <span className="font-medium">Unvisited</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-3 gap-2">
              {questions.map((_, index) => {
                const status = getQuestionStatus(index);
                const isCurrent = status === "current";
                
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => onQuestionSelect(index)}
                    className={cn(
                      "h-12 w-12 p-0 flex items-center justify-center transition-all duration-200",
                      "hover:scale-105 active:scale-95",
                      getStatusColor(status),
                      isCurrent && "animate-pulse"
                    )}
                  >
                    <div className="flex flex-col items-center space-y-1">
                      {getStatusIcon(status)}
                      <span className={cn(
                        "text-xs font-bold",
                        isCurrent ? "text-blue-700" : "text-gray-700"
                      )}>
                        {index + 1}
                      </span>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t pt-4 space-y-3">
            <div className="text-sm font-semibold text-gray-700 mb-2">Progress Summary</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                <span className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-green-600" />
                  Attempted:
                </span>
                <span className="font-bold text-green-700">{answeredQuestions}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
                <span className="flex items-center gap-2">
                  <Eye className="h-3 w-3 text-yellow-600" />
                  Visited:
                </span>
                <span className="font-bold text-yellow-700">{visitedQuestions.size}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-gray-600" />
                  Remaining:
                </span>
                <span className="font-bold text-gray-700">{questions.length - visitedQuestions.size}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
        <div className="w-full max-w-sm max-h-[80vh] overflow-y-auto animate-in zoom-in duration-300">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
