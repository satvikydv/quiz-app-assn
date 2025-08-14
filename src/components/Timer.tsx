"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

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

  return (
    <Card className="w-full max-w-md mx-auto mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-center space-x-2">
          <Clock className="h-5 w-5" />
          <span className={`text-2xl font-bold ${getProgressColor()}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <div className="mt-2 text-center text-sm text-muted-foreground">
          Time Remaining
        </div>
      </CardContent>
    </Card>
  );
}
