"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
  onTick?: (timeLeft: number) => void;
}

export function Timer({ initialTime, onTimeUp, isActive, onTick }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (prev > 0 && onTick) onTick(next >= 0 ? next : 0);
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, onTimeUp, onTick]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgressColor = () => {
    if (timeLeft > initialTime * 0.6) return "text-green-600";
    if (timeLeft > initialTime * 0.3) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressBgColor = () => {
    if (timeLeft > initialTime * 0.6) return "bg-green-500";
    if (timeLeft > initialTime * 0.3) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getCardBgColor = () => {
    if (timeLeft > initialTime * 0.6) return "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200";
    if (timeLeft > initialTime * 0.3) return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200";
    return "bg-gradient-to-r from-red-50 to-pink-50 border-red-200";
  };

  const getIconColor = () => {
    if (timeLeft > initialTime * 0.6) return "text-green-600";
    if (timeLeft > initialTime * 0.3) return "text-yellow-600";
    return "text-red-600";
  };

  const progressPercentage = (timeLeft / initialTime) * 100;
  const isLowTime = timeLeft <= initialTime * 0.3;

  return (
    <Card className={cn(
      "w-full max-w-md mx-auto mb-6 shadow-lg border-2 transition-all duration-300",
      getCardBgColor()
    )}>
      <CardContent className="p-6">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className={cn(
            "p-2 rounded-full transition-all duration-300",
            timeLeft > initialTime * 0.6 ? "bg-green-100" : 
            timeLeft > initialTime * 0.3 ? "bg-yellow-100" : "bg-red-100"
          )}>
            {isLowTime ? (
              <AlertTriangle className={cn("h-6 w-6 animate-pulse", getIconColor())} />
            ) : (
              <Clock className={cn("h-6 w-6", getIconColor())} />
            )}
          </div>
          <div className="text-center">
            <span className={cn(
              "text-3xl font-bold transition-all duration-300",
              getProgressColor(),
              isLowTime && "animate-pulse"
            )}>
              {formatTime(timeLeft)}
            </span>
            <div className="text-sm text-muted-foreground mt-1">
              Time Remaining
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-1000 ease-out rounded-full",
              getProgressBgColor()
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        {/* Progress Text */}
        <div className="text-center mt-2">
          <span className={cn(
            "text-xs font-medium",
            getProgressColor()
          )}>
            {Math.round(progressPercentage)}% remaining
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
