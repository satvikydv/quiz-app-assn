"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, ArrowRight, Clock, Users, Trophy } from "lucide-react";

interface StartPageProps {
  onStart: (email: string) => void;
  isLoading?: boolean;
}

export function StartPage({ onStart, isLoading = false }: StartPageProps) {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);

  const handleEmailChange = (value: string) => {
    setEmail(value);
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValidEmail(value === "" || emailRegex.test(value));
  };

  const handleStart = () => {
    if (email.trim() && isValidEmail) {
      onStart(email.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleStart();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <Trophy className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Quiz App
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Test your knowledge with our interactive quiz! You&apos;ll have 30 minutes to complete 15 questions.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <span>30 minutes time limit</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>15 carefully crafted questions</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Users className="h-4 w-4 text-purple-600" />
                <span>Detailed performance report</span>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Enter your email to start
              </label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onKeyPress={handleKeyPress}
                className={!isValidEmail ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {!isValidEmail && (
                <p className="text-sm text-red-600">Please enter a valid email address</p>
              )}
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStart}
              disabled={!email.trim() || !isValidEmail || isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Loading Quiz...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Start Quiz</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>

            {/* Progress indicator for loading */}
            {isLoading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Loading questions...</span>
                  <span>Please wait</span>
                </div>
                <Progress value={undefined} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
