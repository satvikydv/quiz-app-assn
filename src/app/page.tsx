"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StartPage } from "@/components/StartPage";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Prevent multiple rapid navigations to /quiz
  let navigationLock = false;
  const handleStartQuiz = async (email: string) => {
    if (navigationLock) return;
    navigationLock = true;
    setIsLoading(true);
    try {
      // Redirect to quiz page with email parameter
      router.push(`/quiz?email=${encodeURIComponent(email)}`);
    } catch (error) {
      console.error("Failed to start quiz:", error);
      setIsLoading(false);
      navigationLock = false;
    }
  };

  return <StartPage onStartQuiz={handleStartQuiz} isLoading={isLoading} />;
}